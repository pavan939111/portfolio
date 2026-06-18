import { useState, useEffect, useCallback, useRef } from 'react';

export interface VoiceCommand {
  type: string;
  section?: string;
  action?: string;
}

export const useVoiceInput = (onCommand?: (intent: string, payload?: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const parseCommand = useCallback((text: string) => {
    const cleanText = text.toLowerCase().trim();

    if (cleanText.includes('stop') || cleanText.includes('cancel')) {
      if (onCommand) onCommand('stop');
      setLastCommand({ type: 'action', action: 'stop' });
      return;
    }

    if (cleanText.includes('open chat') || cleanText.includes('show chat') || cleanText.includes('ask')) {
      if (onCommand) onCommand('open-chat');
      setLastCommand({ type: 'action', action: 'openChat' });
      return;
    }

    // Match sections
    const sections = ['about', 'skills', 'projects', 'experience', 'education', 'achievements', 'contact'];
    for (const sec of sections) {
      if (
        cleanText.includes(`go to ${sec}`) ||
        cleanText.includes(`show me ${sec}`) ||
        cleanText.includes(`tell me about ${sec}`) ||
        cleanText.includes(`show ${sec}`) ||
        cleanText.includes(sec)
      ) {
        if (onCommand) onCommand('navigate', sec);
        setLastCommand({ type: 'navigate', section: sec });
        return;
      }
    }
  }, [onCommand]);

  const startListening = useCallback(async () => {
    if (streamRef.current || socketRef.current || mediaRecorderRef.current) {
      console.warn("Speech recording session is already active.");
      return;
    }
    const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
    if (!apiKey) {
      console.error("VITE_DEEPGRAM_API_KEY is not defined in the environment.");
      return;
    }

    try {
      // 1. Get microphone audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setStream(stream);

      // 2. Establish connection to Deepgram live transcription WebSocket
      const url = "wss://api.deepgram.com/v1/listen?model=nova-3&language=en-IN&interim_results=false&smart_format=true&endpointing=500";
      const socket = new WebSocket(url, ["token", apiKey]);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("Deepgram live transcription WebSocket opened.");
        setIsListening(true);
        setTranscript('');
        setLastCommand(null);

        // Start recording audio and send to socket
        const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        // Slice audio and send chunks every 250ms
        mediaRecorder.start(250);
      };

      socket.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data);
          const alternatives = data.channel?.alternatives || [];
          const text = alternatives[0]?.transcript || "";
          
          if (text.trim()) {
            setTranscript((prev) => {
              const updated = prev ? `${prev} ${text}`.trim() : text;
              parseCommand(updated);
              return updated;
            });
          }
        } catch (e) {
          console.error("Error parsing Deepgram message:", e);
        }
      };

      socket.onerror = (err) => {
        console.error("Deepgram WebSocket error:", err);
      };

      socket.onclose = () => {
        console.log("Deepgram live transcription WebSocket closed.");
        setIsListening(false);
        setStream(null);
      };

    } catch (err) {
      console.error("Failed to start speech input:", err);
      setIsListening(false);
      setStream(null);
    }
  }, [parseCommand]);

  const stopListening = useCallback(() => {
    // Stop recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn("Failed to stop media recorder:", err);
      }
    }

    // Stop mic stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (err) {
          console.warn("Failed to stop track:", err);
        }
      });
      streamRef.current = null;
    }

    // Close WebSocket
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING) {
        try {
          socketRef.current.close();
        } catch (err) {
          console.warn("Failed to close socket:", err);
        }
      }
      socketRef.current = null;
    }

    setStream(null);
    setIsListening(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    lastCommand,
    stream,
    startListening,
    stopListening,
    isSupported: !!(typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  };
};

export default useVoiceInput;
