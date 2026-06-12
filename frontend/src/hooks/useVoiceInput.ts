import { useState, useEffect, useCallback, useRef } from 'react';

export const useVoiceInput = (onCommand?: (intent: string, payload?: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript || '';
          setTranscript(resultText);
          parseCommand(resultText);
        };

        rec.onerror = (e: any) => {
          console.warn('Speech recognition error:', e);
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [onCommand]);

  const parseCommand = (text: string) => {
    const cleanText = text.toLowerCase().trim();

    if (cleanText.includes('stop') || cleanText.includes('cancel')) {
      if (onCommand) onCommand('stop');
      return;
    }

    if (cleanText.includes('open chat') || cleanText.includes('show chat') || cleanText.includes('ask')) {
      if (onCommand) onCommand('open-chat');
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
        return;
      }
    }
  };

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Failed to stop speech recognition:', err);
      }
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasSupport: !!(typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition))
  };
};
export default useVoiceInput;
