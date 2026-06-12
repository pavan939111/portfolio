import { useState, useEffect, useCallback } from "react"
import { AudioManager } from "../utils/AudioManager"
import { voiceScripts } from "../data/voiceScripts"

export type SpeechState = "idle" | "speaking" | "listening" | "hover"

/**
 * Custom React hook wrapping the AudioManager.
 * Restores the exact signature of the old useSpeech hook to avoid breaking existing components,
 * but redirects all calls to the pre-generated MeloTTS audio manager.
 */
export function useSpeech() {
  const audioManager = AudioManager.getInstance()
  
  const [isSpeaking, setIsSpeaking] = useState(audioManager.isSpeaking())
  const [isMuted, setIsMuted] = useState(audioManager.getMuted())
  const [volume, setVolume] = useState(audioManager.getVolume())
  const [currentSection, setCurrentSection] = useState<string | null>(audioManager.getCurrentSection())

  // Preload all section audios after page load
  useEffect(() => {
    const sections = Object.keys(voiceScripts)
    audioManager.preloadAudios(sections)
  }, [])

  // Subscribe to changes in the Audio Manager (e.g. state, mute, volume)
  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      setIsSpeaking(state.isSpeaking)
      setIsMuted(state.isMuted)
      setVolume(state.volume)
      setCurrentSection(state.currentSection)
    });
    return unsubscribe
  }, [])

  const stop = useCallback(() => {
    audioManager.stopAudio()
  }, [])

  /**
   * Translates the requested narration script into the corresponding section key,
   * then requests playback from the centralized Audio Manager.
   */
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!text || !text.trim()) {
      onEnd?.()
      return
    }

    let sectionName: string | null = null

    // Check if the parameter itself is a section key
    if (text in voiceScripts) {
      sectionName = text
    } else {
      // Find matching section key by text content comparison
      const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "")
      const targetNorm = normalize(text)
      
      const match = Object.entries(voiceScripts).find(([_, scriptText]) => {
        return normalize(scriptText) === targetNorm
      })
      if (match) {
        sectionName = match[0]
      }
    }

    if (sectionName) {
      audioManager.playSectionAudio(sectionName, onEnd)
    } else {
      console.warn(`No pre-generated audio matches narration text: "${text.substring(0, 45)}..."`)
      onEnd?.()
    }
  }, [])

  const toggleMute = useCallback(() => {
    audioManager.setMuted(!audioManager.getMuted())
  }, [])

  const changeVolume = useCallback((vol: number) => {
    audioManager.setVolume(vol)
  }, [])

  const speechState: SpeechState = isSpeaking ? "speaking" : "idle"

  return {
    speechState,
    isSpeaking,
    isMuted,
    setIsMuted: (muted: boolean) => audioManager.setMuted(muted),
    volume,
    setVolume: changeVolume,
    speak,
    stop,
    toggleMute,
    isSupported: true,
    selectedVoiceName: "MeloTTS (en-IN)",
    currentSection
  }
}
export default useSpeech
