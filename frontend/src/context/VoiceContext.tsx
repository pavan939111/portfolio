import React, { createContext, useContext, ReactNode, useEffect } from "react"
import useSpeech from "../hooks/useSpeech"
import type { SpeechState } from "../hooks/useSpeech"
import useVoiceInput from "../hooks/useVoiceInput"
import type { VoiceCommand } from "../hooks/useVoiceInput"

interface VoiceContextType {
  speechState: SpeechState
  isSpeaking: boolean
  isMuted: boolean
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>
  isPaused: boolean
  speak: (text: string, onEnd?: () => void) => void
  stop: () => void
  pause: () => void
  resume: () => void
  toggleMute: () => void
  unblockAudio: () => void
  selectedVoiceName: string
  isListening: boolean
  transcript: string
  lastCommand: VoiceCommand | null
  startListening: () => void
  stopListening: () => void
  stream: MediaStream | null
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
      // Handled by FloatingAvatar.tsx via useVoice().lastCommand / jumpToManualSection
    } else if (intent === "open-chat") {
      window.dispatchEvent(new CustomEvent("openChat"))
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
        isPaused: speech.isPaused,
        speak: speech.speak,
        stop: speech.stop,
        pause: speech.pause,
        resume: speech.resume,
        toggleMute: speech.toggleMute,
        unblockAudio: speech.unblockAudio,
        selectedVoiceName: speech.selectedVoiceName,
        isListening: voiceInput.isListening,
        transcript: voiceInput.transcript,
        lastCommand: voiceInput.lastCommand,
        startListening: voiceInput.startListening,
        stopListening: voiceInput.stopListening,
        stream: voiceInput.stream
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
