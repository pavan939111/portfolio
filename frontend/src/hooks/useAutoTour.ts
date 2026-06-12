import { useState, useCallback, useRef, useEffect } from "react"
import { voiceScripts } from "../data/voiceScripts"
import type { SectionKey } from "../types"
import { AudioManager } from "../utils/AudioManager"

// Ordered list of sections for guided portfolio auto-tour
export const TOUR_SECTIONS: SectionKey[] = [
  "intro",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "achievements",
  "contact"
]

interface UseAutoTourProps {
  speak: (text: string, onEnd?: () => void) => void
  stop: () => void
}

interface UseAutoTourReturn {
  isTourActive: boolean
  isTourPaused: boolean
  currentTourSection: SectionKey | null
  currentTourIndex: number
  startTour: () => void
  stopTour: () => void
  pauseTour: () => void
  resumeTour: () => void
  jumpToSection: (key: SectionKey) => void
}

/**
 * Custom React hook managing the guided tour of the portfolio sections.
 * Automatically scrolls each section into view, plays its corresponding MeloTTS audio,
 * highlights the active section, and advances sequentially upon audio completion.
 * Supports start, pause, resume, and stop controls.
 */
export function useAutoTour({ speak, stop }: UseAutoTourProps): UseAutoTourReturn {
  const audioManager = AudioManager.getInstance()

  const [isTourActive, setIsTourActive] = useState(false)
  const [isTourPaused, setIsTourPaused] = useState(false)
  const [currentTourSection, setCurrentTourSection] = useState<SectionKey | null>(null)
  const [currentTourIndex, setCurrentTourIndex] = useState(-1)

  const isTourActiveRef = useRef(false)
  const isTourPausedRef = useRef(false)
  const currentIndexRef = useRef(-1)
  
  const nextSectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sync refs with state to prevent stale closures
  useEffect(() => {
    isTourActiveRef.current = isTourActive
    isTourPausedRef.current = isTourPaused
    currentIndexRef.current = currentTourIndex
  }, [isTourActive, isTourPaused, currentTourIndex])

  // Scroll to section smoothly. Maps 'intro' to the 'home' DOM element.
  const scrollToSection = useCallback((key: SectionKey) => {
    const targetId = key === "intro" ? "home" : key
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }
  }, [])

  // Speak one section then advance
  const speakSectionAtIndex = useCallback(
    (index: number) => {
      // Guard: stop if tour was stopped or paused
      if (!isTourActiveRef.current || isTourPausedRef.current) return

      // Guard: stop if past last section (Tour completed)
      if (index >= TOUR_SECTIONS.length) {
        setIsTourActive(false)
        setIsTourPaused(false)
        setCurrentTourSection(null)
        setCurrentTourIndex(-1)
        return
      }

      const sectionKey = TOUR_SECTIONS[index]

      setCurrentTourSection(sectionKey)
      setCurrentTourIndex(index)

      scrollToSection(sectionKey)

      // Wait for smooth scrolling to complete before playing audio
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        if (!isTourActiveRef.current || isTourPausedRef.current) return

        speak(sectionKey, () => {
          if (!isTourActiveRef.current) return
          if (isTourPausedRef.current) return

          // Wait 800ms between sections for a natural transition feel
          if (nextSectionTimeoutRef.current) clearTimeout(nextSectionTimeoutRef.current)
          nextSectionTimeoutRef.current = setTimeout(() => {
            if (!isTourActiveRef.current || isTourPausedRef.current) return
            speakSectionAtIndex(index + 1)
          }, 800)
        })
      }, 600)
    },
    [speak, scrollToSection]
  )

  const startTour = useCallback(() => {
    setIsTourActive(true)
    setIsTourPaused(false)
    isTourActiveRef.current = true
    isTourPausedRef.current = false

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    if (nextSectionTimeoutRef.current) clearTimeout(nextSectionTimeoutRef.current)

    speakSectionAtIndex(0)
  }, [speakSectionAtIndex])

  const stopTour = useCallback(() => {
    isTourActiveRef.current = false
    isTourPausedRef.current = false
    setIsTourActive(false)
    setIsTourPaused(false)
    setCurrentTourSection(null)
    setCurrentTourIndex(-1)

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    if (nextSectionTimeoutRef.current) clearTimeout(nextSectionTimeoutRef.current)

    stop()
  }, [stop])

  const pauseTour = useCallback(() => {
    if (!isTourActiveRef.current || isTourPausedRef.current) return

    setIsTourPaused(true)
    isTourPausedRef.current = true

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    if (nextSectionTimeoutRef.current) clearTimeout(nextSectionTimeoutRef.current)

    audioManager.pauseAudio()
  }, [audioManager])

  const resumeTour = useCallback(() => {
    if (!isTourActiveRef.current || !isTourPausedRef.current) return

    setIsTourPaused(false)
    isTourPausedRef.current = false

    // Resume HTML5 Audio if paused on current section
    const currentSectionInManager = audioManager.getCurrentSection()
    const expectedSection = TOUR_SECTIONS[currentIndexRef.current]

    if (currentSectionInManager === expectedSection && !audioManager.isSpeaking() && currentSectionInManager) {
      audioManager.resumeAudio()
    } else {
      // Re-trigger playback from current index if audio got reset
      speakSectionAtIndex(currentIndexRef.current)
    }
  }, [audioManager, speakSectionAtIndex])

  const jumpToSection = useCallback(
    (key: SectionKey) => {
      const index = TOUR_SECTIONS.indexOf(key)
      if (index === -1) return

      setIsTourActive(true)
      setIsTourPaused(false)
      isTourActiveRef.current = true
      isTourPausedRef.current = false

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      if (nextSectionTimeoutRef.current) clearTimeout(nextSectionTimeoutRef.current)

      stop()

      setTimeout(() => {
        speakSectionAtIndex(index)
      }, 200)
    },
    [stop, speakSectionAtIndex]
  )

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      isTourActiveRef.current = false
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      if (nextSectionTimeoutRef.current) clearTimeout(nextSectionTimeoutRef.current)
    }
  }, [])

  return {
    isTourActive,
    isTourPaused,
    currentTourSection,
    currentTourIndex,
    startTour,
    stopTour,
    pauseTour,
    resumeTour,
    jumpToSection
  }
}
export default useAutoTour
