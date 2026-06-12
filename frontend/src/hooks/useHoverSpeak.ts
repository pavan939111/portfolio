import { useEffect, useRef } from "react"
import { useVoice } from "../context/VoiceContext"
import { voiceScripts } from "../data/voiceScripts"

/**
 * Custom React hook to attach hover narration handlers to portfolio sections.
 * Automatically waits 1000ms before playing narration on desktop, handles leaving gracefully,
 * and falls back to tap-to-play behavior on mobile devices while disabling hover narration.
 */
export function useHoverSpeak() {
  const { speak, isMuted } = useVoice()
  const lastSpokenSectionRef = useRef<string | null>(null)
  
  // Timers to track hover/scroll delay
  const hoverTimersRef = useRef<Record<string, NodeJS.Timeout>>({})
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null)
  const currentActiveScrollSectionRef = useRef<string | null>(null)

  useEffect(() => {
    if (isMuted) return

    const sections = document.querySelectorAll("section[id]")
    
    // Detect mobile device
    const isMobile = window.matchMedia("(max-width: 768px)").matches || 
                     ("ontouchstart" in window) || 
                     navigator.maxTouchPoints > 0

    // Helper to speak a section script
    const speakSection = (sectionId: string) => {
      // Don't re-speak the same section consecutively to avoid spamming the user
      if (lastSpokenSectionRef.current === sectionId) return

      const script = voiceScripts[sectionId as keyof typeof voiceScripts]
      if (script) {
        lastSpokenSectionRef.current = sectionId
        speak(script)
      }
    }

    // ─── DESKTOP HOVER HANDLERS ───
    const handleMouseEnter = (e: Event) => {
      if (isMobile) return // Disable hover narration on mobile devices

      const target = e.currentTarget as HTMLElement
      const sectionId = target.id
      if (!sectionId || sectionId === "home") return

      // Clear any existing hover timer for this section
      if (hoverTimersRef.current[sectionId]) {
        clearTimeout(hoverTimersRef.current[sectionId])
      }

      // Start 1000ms timer to speak section audio
      hoverTimersRef.current[sectionId] = setTimeout(() => {
        speakSection(sectionId)
      }, 1000)
    }

    const handleMouseLeave = (e: Event) => {
      if (isMobile) return

      const target = e.currentTarget as HTMLElement
      const sectionId = target.id
      
      // Stop pending timer if user leaves section before 1000ms
      if (sectionId && hoverTimersRef.current[sectionId]) {
        clearTimeout(hoverTimersRef.current[sectionId])
        delete hoverTimersRef.current[sectionId]
      }
    }

    // ─── MOBILE TAP HANDLER ───
    const handleSectionClick = (e: Event) => {
      if (!isMobile) return // Only tap-to-play on mobile

      const target = e.currentTarget as HTMLElement
      const sectionId = target.id
      if (!sectionId || sectionId === "home") return

      speakSection(sectionId)
    }

    sections.forEach(sec => {
      sec.addEventListener("mouseenter", handleMouseEnter)
      sec.addEventListener("mouseleave", handleMouseLeave)
      sec.addEventListener("click", handleSectionClick)
    })

    // ─── SCROLL / VIEWPORT EVENT HANDLERS (IntersectionObserver) ───
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // Trigger when section occupies the middle of the viewport
      threshold: 0.1
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (isMobile) return // Disable automatic scroll triggers on mobile

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          if (!sectionId || sectionId === "home") return

          currentActiveScrollSectionRef.current = sectionId

          // Clear previous scroll timer
          if (scrollTimerRef.current) {
            clearTimeout(scrollTimerRef.current)
          }

          // Start 1000ms timer for scroll narration
          scrollTimerRef.current = setTimeout(() => {
            if (currentActiveScrollSectionRef.current === sectionId) {
              speakSection(sectionId)
            }
          }, 1000)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)
    sections.forEach(sec => observer.observe(sec))

    // Cleanup listeners and timers
    return () => {
      sections.forEach(sec => {
        sec.removeEventListener("mouseenter", handleMouseEnter)
        sec.removeEventListener("mouseleave", handleMouseLeave)
        sec.removeEventListener("click", handleSectionClick)
        observer.unobserve(sec)
      })
      observer.disconnect()

      // Clear all timers
      Object.values(hoverTimersRef.current).forEach(t => clearTimeout(t))
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    }
  }, [speak, isMuted])

  // Expose a method to manually reset spoken state if needed
  const resetSpokenHistory = (sectionId?: string) => {
    if (sectionId) {
      if (lastSpokenSectionRef.current === sectionId) {
        lastSpokenSectionRef.current = null
      }
    } else {
      lastSpokenSectionRef.current = null
    }
  }

  return { resetSpokenHistory }
}
export default useHoverSpeak
