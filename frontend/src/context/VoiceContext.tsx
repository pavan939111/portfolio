import React, { createContext, useContext, ReactNode, useEffect } from "react"
import { useSpeech } from "../hooks/useSpeech"
import { useVoiceInput } from "../hooks/useVoiceInput"
import type { SpeechState } from "../types"
import { voiceScripts } from "../data/voiceScripts"

interface VoiceContextType {
  speechState: SpeechState
  isSpeaking: boolean
  isMuted: boolean
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>
  speak: (text: string, onEnd?: () => void) => void
  stop: () => void
  toggleMute: () => void
  selectedVoiceName: string
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

interface VoiceProviderProps {
  children: ReactNode
  onNavigate?: (section: string) => void
  onCommand?: (intent: string, payload?: string) => void
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({
  children,
  onNavigate,
  onCommand
}) => {
  const speech = useSpeech()

  // Handle local command mapping (navigation, chat, stop)
  const handleVoiceCommand = (intent: string, payload?: string) => {
    if (intent === "navigate" && payload) {
      if (onNavigate) {
        onNavigate(payload)
      }
      const script = voiceScripts[payload as keyof typeof voiceScripts]
      if (script) {
        speech.speak(script)
      }
    } else if (intent === "open-chat") {
      speech.speak("Opening the RAG Chatbot. Ask me any question!")
    } else if (intent === "stop") {
      speech.stop()
    }

    if (onCommand) {
      onCommand(intent, payload)
    }
  }

  const voiceInput = useVoiceInput(handleVoiceCommand)

  // Aggregate speech state
  let speechState: SpeechState = "idle"
  if (voiceInput.isListening) {
    speechState = "listening"
  } else if (speech.isSpeaking) {
    speechState = "speaking"
  }

  // Push-to-Talk: Spacebar hold event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault()
        voiceInput.startListening()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault()
        voiceInput.stopListening()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [voiceInput])

  return (
    <VoiceContext.Provider
      value={{
        speechState,
        isSpeaking: speech.isSpeaking,
        isMuted: speech.isMuted,
        setIsMuted: speech.setIsMuted,
        speak: speech.speak,
        stop: speech.stop,
        toggleMute: speech.toggleMute,
        selectedVoiceName: speech.selectedVoiceName,
        isListening: voiceInput.isListening,
        transcript: voiceInput.transcript,
        startListening: voiceInput.startListening,
        stopListening: voiceInput.stopListening
      }}
    >
      {children}
    </VoiceContext.Provider>
  )
}

export const useVoice = () => {
  const context = useContext(VoiceContext)
  if (!context) {
    throw new Error("useVoice must be used within a VoiceProvider")
  }
  return context
}
