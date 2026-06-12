import { useState, useEffect, useRef } from "react"
import type { SectionKey } from "../types"
import { TOUR_SECTIONS } from "./useAutoTour"

interface UseSectionObserverProps {
  // Called when user scrolls to a new section AND is not on auto-tour
  onSectionChange?: (section: SectionKey) => void
  // Whether auto-tour is active. If true, observer won't trigger voice
  isTourActive: boolean
}

interface UseSectionObserverReturn {
  activeSection: SectionKey | null
  sectionProgress: Record<SectionKey, number>
}

export function useSectionObserver({
  onSectionChange,
  isTourActive
}: UseSectionObserverProps): UseSectionObserverReturn {
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null)

  // Track visibility ratio of each section
  const [sectionProgress, setSectionProgress] = useState<Record<SectionKey, number>>(
    {} as Record<SectionKey, number>
  )

  const lastActiveSection = useRef<SectionKey | null>(null)

  // Debounce timer for voice trigger
  const voiceTimer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Map from element id → SectionKey
    const sectionMap = new Map<Element, SectionKey>()

    // Visibility scores for each section
    const visibilityMap = new Map<SectionKey, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const key = sectionMap.get(entry.target)
          if (!key) return

          // Store visibility ratio (0 to 1)
          visibilityMap.set(key, entry.intersectionRatio)

          // Update progress state
          setSectionProgress(prev => ({
            ...prev,
            [key]: entry.intersectionRatio
          }))
        })

        // Find section with highest visibility
        let maxRatio = 0
        let mostVisible: SectionKey | null = null

        visibilityMap.forEach((ratio, key) => {
          if (ratio > maxRatio) {
            maxRatio = ratio
            mostVisible = key
          }
        })

        // Only update if changed
        if (
          mostVisible &&
          mostVisible !== lastActiveSection.current &&
          maxRatio > 0.3 // at least 30% visible
        ) {
          lastActiveSection.current = mostVisible
          setActiveSection(mostVisible)

          // Only trigger voice if NOT on tour
          if (!isTourActive && onSectionChange) {
            // Clear previous timer
            clearTimeout(voiceTimer.current)

            // Debounce: wait 1.5s of stability before speaking
            voiceTimer.current = setTimeout(() => {
              if (mostVisible === lastActiveSection.current) {
                onSectionChange(mostVisible)
              }
            }, 1500)
          }
        }
      },
      {
        // Fire at these visibility thresholds
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        // Section is "seen" when 30% visible
        rootMargin: "-10% 0px -10% 0px"
      }
    )

    // Observe all tour sections
    TOUR_SECTIONS.forEach(key => {
      const el = document.getElementById(key)
      if (el) {
        sectionMap.set(el, key)
        visibilityMap.set(key, 0)
        observer.observe(el)
      }
    })

    return () => {
      observer.disconnect()
      clearTimeout(voiceTimer.current)
    }
  }, [isTourActive, onSectionChange])

  return { activeSection, sectionProgress }
}
export default useSectionObserver
