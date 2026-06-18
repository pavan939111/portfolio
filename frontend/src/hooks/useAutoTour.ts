import {
    useState,
    useCallback,
    useRef,
    useEffect
} from "react"

// Ordered section tour sequence
export const TOUR_SEQUENCE = [
    "about",
    "skills",
    "projects",
    "experience",
    "education",
    "achievements",
    "contact"
] as const

export type TourSection = typeof TOUR_SEQUENCE[number]

interface UseAutoTourProps {
    speak: (clipName: string, onEnd?: () => void) => void
    stop: () => void
}

export function useAutoTour({
    speak,
    stop
}: UseAutoTourProps) {
    const [isTourActive, setIsTourActive] = useState(false)
    const [currentSection, setCurrentSection] = useState<string | null>(null)
    const [showExploreMore, setShowExploreMore] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Refs to avoid stale closure issues
    const activeRef = useRef(false)
    const currentSectionRef = useRef<string | null>(null)
    const isProgrammaticScrollRef = useRef(false)
    const programmaticScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const mountTimeRef = useRef(Date.now())

    // Helper to scroll to a section smoothly and wait for scroll stop
    const scrollToSection = useCallback((sectionId: string): Promise<void> => {
        return new Promise((resolve) => {
            const targetId = sectionId === "intro" ? "home" : sectionId
            const el = document.getElementById(targetId)
            if (!el) {
                resolve()
                return
            }

            const rect = el.getBoundingClientRect()
            // If already at the top (within 5px tolerance)
            if (Math.abs(rect.top) < 5) {
                resolve()
                return
            }

            isProgrammaticScrollRef.current = true
            ;(window as any).isProgrammaticScroll = true
            if (programmaticScrollTimeoutRef.current) {
                clearTimeout(programmaticScrollTimeoutRef.current)
            }

            let scrollTimeout: NodeJS.Timeout
            const handleScroll = () => {
                isProgrammaticScrollRef.current = true
                ;(window as any).isProgrammaticScroll = true
                clearTimeout(scrollTimeout)
                scrollTimeout = setTimeout(() => {
                    window.removeEventListener("scroll", handleScroll)
                    isProgrammaticScrollRef.current = false
                    ;(window as any).isProgrammaticScroll = false
                    resolve()
                }, 150)
            }

            window.addEventListener("scroll", handleScroll, { passive: true })
            el.scrollIntoView({ behavior: "smooth", block: "start" })

            // Safeguard timeout
            setTimeout(() => {
                window.removeEventListener("scroll", handleScroll)
                isProgrammaticScrollRef.current = false
                ;(window as any).isProgrammaticScroll = false
                resolve()
            }, 1200)
        })
    }, [])

    // Core recursive function for automatic tour
    const playTourStep = useCallback((index: number) => {
        if (!activeRef.current) return

        // End of tour reached
        if (index >= TOUR_SEQUENCE.length) {
            console.log("[useAutoTour] Tour completed naturally.")
            activeRef.current = false
            setIsTourActive(false)
            ;(window as any).isTourActive = false
            setCurrentSection(null)
            currentSectionRef.current = null
            setShowExploreMore(true) // Show explore more popup on natural completion so user can browse manually
            return
        }

        const section = TOUR_SEQUENCE[index]
        setCurrentSection(section)
        currentSectionRef.current = section

        // Scroll first, then speak
        scrollToSection(section).then(() => {
            if (!activeRef.current) return

            // Play the pure section clip
            speak(section, () => {
                if (!activeRef.current) return

                // Small brief pause before advancing
                setTimeout(() => {
                    playTourStep(index + 1)
                }, 300)
            })
        })
    }, [speak, scrollToSection])

    // Start tour from beginning (Intro)
    const startTour = useCallback(() => {
        stop()
        activeRef.current = true
        setIsTourActive(true)
        ;(window as any).isTourActive = true
        setCurrentSection("intro")
        currentSectionRef.current = "intro"
        setShowExploreMore(false)
        setIsMenuOpen(false)

        // Wait 1 second after page load/trigger, then start intro audio
        setTimeout(() => {
            if (!activeRef.current) return
            speak("intro", () => {
                if (!activeRef.current) return
                // Intro ends -> Start auto tour step 0 (About)
                playTourStep(0)
            })
        }, 1000)
    }, [stop, speak, playTourStep])

    // Stop/Cancel tour
    const stopTour = useCallback(() => {
        console.log("[useAutoTour] Stopping active audio and cancelling tour.")
        activeRef.current = false
        setIsTourActive(false)
        ;(window as any).isTourActive = false
        setCurrentSection(null)
        currentSectionRef.current = null
        stop()
        setShowExploreMore(true) // Trigger Explore More popup immediately
    }, [stop])

    // Jump to manual section (Explore More selection)
    const jumpToManualSection = useCallback((sectionId: string) => {
        console.log(`[useAutoTour] Triggering manual single section: ${sectionId}`)
        activeRef.current = false // cancel automatic tour
        setIsTourActive(false)
        ;(window as any).isTourActive = false
        setCurrentSection(sectionId)
        currentSectionRef.current = sectionId
        setShowExploreMore(false)
        setIsMenuOpen(false)
        stop()

        scrollToSection(sectionId).then(() => {
            // Play the explore-more variant clip
            const targetClip = sectionId === "intro" ? "intro" : `${sectionId}_explore`
            speak(targetClip, () => {
                console.log(`[useAutoTour] Manual section '${sectionId}' finished. Inviting to explore more.`)
                setCurrentSection(null)
                currentSectionRef.current = null
                setShowExploreMore(true) // Show Explore More popup again on manual clip end
            })
        })
    }, [speak, stop, scrollToSection])

    // Resume tour from a manual scroll stop section
    const resumeTourFromSection = useCallback((sectionId: string) => {
        const index = TOUR_SEQUENCE.indexOf(sectionId as any)
        if (index === -1) return

        console.log(`[useAutoTour] Resuming tour from index ${index}: ${sectionId}`)
        activeRef.current = true
        setIsTourActive(true)
        ;(window as any).isTourActive = true
        setCurrentSection(sectionId)
        currentSectionRef.current = sectionId
        setShowExploreMore(false)
        setIsMenuOpen(false)
        stop()

        scrollToSection(sectionId).then(() => {
            if (!activeRef.current) return
            // Play the pure section clip
            speak(sectionId, () => {
                if (!activeRef.current) return
                // Small brief pause before advancing to index + 1
                setTimeout(() => {
                    playTourStep(index + 1)
                }, 300)
            })
        })
    }, [speak, stop, scrollToSection, playTourStep])

    // Manual user scroll detection
    useEffect(() => {
        const handleManualInteraction = (e: Event) => {
            if (isProgrammaticScrollRef.current || (window as any).isProgrammaticScroll) {
                return
            }

            // Ignore layout / restoration scroll events during the first 1000ms after hook mount
            if (Date.now() - mountTimeRef.current < 1000) {
                return
            }

            if (e.type === "keydown") {
                const ke = e as KeyboardEvent
                const scrollKeys = [
                    "ArrowUp", "ArrowDown", "PageUp", "PageDown", 
                    "Space", "Home", "End"
                ]
                if (!scrollKeys.includes(ke.key)) {
                    return
                }
                const activeEl = document.activeElement
                if (
                    activeEl && 
                    (activeEl.tagName === "INPUT" || 
                     activeEl.tagName === "TEXTAREA" || 
                     activeEl.getAttribute("contenteditable") === "true")
                ) {
                    return
                }
            }

            // A manual scroll/wheel/touch interaction has occurred
            if (activeRef.current || isTourActive) {
                console.log(`[useAutoTour] Manual scroll detected. Cancelling auto tour.`)
                stopTour()
            } else {
                // If a manual section or dynamic response is playing, stop it and show explore popup
                const activeAudio = document.getElementsByTagName("audio")[0]
                if (activeAudio && !activeAudio.paused && activeAudio.src && !activeAudio.src.includes("data:audio")) {
                    console.log(`[useAutoTour] Manual scroll detected. Silencing manual speech.`)
                    stop()
                    setShowExploreMore(true)
                }
            }
        }

        window.addEventListener("scroll", handleManualInteraction, { passive: true })
        window.addEventListener("wheel", handleManualInteraction, { passive: true })
        window.addEventListener("touchmove", handleManualInteraction, { passive: true })
        window.addEventListener("keydown", handleManualInteraction, { passive: true })

        return () => {
            window.removeEventListener("scroll", handleManualInteraction)
            window.removeEventListener("wheel", handleManualInteraction)
            window.removeEventListener("touchmove", handleManualInteraction)
            window.removeEventListener("keydown", handleManualInteraction)
        }
    }, [isTourActive, stopTour, stop])

    // Cleanup refs on unmount
    useEffect(() => {
        return () => {
            activeRef.current = false
            if (programmaticScrollTimeoutRef.current) {
                clearTimeout(programmaticScrollTimeoutRef.current)
            }
        }
    }, [])

    return {
        isTourActive,
        currentSection,
        showExploreMore,
        setShowExploreMore,
        isMenuOpen,
        setIsMenuOpen,
        startTour,
        stopTour,
        jumpToManualSection,
        resumeTourFromSection
    }
}
export default useAutoTour
