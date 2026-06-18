import {
    useState,
    useEffect,
    useRef,
    useCallback
} from "react"
import { TOUR_SEQUENCE } from "./useAutoTour"

interface UseSectionObserverProps {
    // Called when user pauses on section
    // for pauseSeconds duration
    onSectionPause: (sectionId: string) => void
    // When true observer won't trigger voice
    // Tour manages its own voice sequencing
    isTourActive: boolean
    // Current section the tour is explaining
    currentTourSection: string | null
    // Seconds user must stay before voice fires
    // Default: 2 seconds
    pauseSeconds?: number
}

export function useSectionObserver({
    onSectionPause,
    isTourActive,
    currentTourSection,
    pauseSeconds = 2
}: UseSectionObserverProps) {

    const [activeSection, setActiveSection] =
        useState<string | null>(null)

    // Debounce timer ref
    const timerRef =
        useRef<NodeJS.Timeout | null>(null)

    // Track which section last fired voice
    // prevents repeated triggers on same section
    const lastFiredRef =
        useRef<string | null>(null)

    // Track visibility of each section
    const visibilityRef =
        useRef<Map<string, number>>(new Map())

    // Stable callback ref
    const callbackRef =
        useRef(onSectionPause)
    useEffect(() => {
        callbackRef.current = onSectionPause
    }, [onSectionPause])

    const isTourRef = useRef(isTourActive)
    useEffect(() => {
        isTourRef.current = isTourActive
        if (isTourActive) {
            // Clear any pending timers when
            // tour starts — tour takes over
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [isTourActive])

    const currentTourSectionRef = useRef(currentTourSection)
    useEffect(() => {
        currentTourSectionRef.current = currentTourSection
    }, [currentTourSection])

    useEffect(() => {
        // Initialize visibility map
        TOUR_SEQUENCE.forEach(id => {
            visibilityRef.current.set(id, 0)
        })

        const observer = new IntersectionObserver(
            (entries) => {
                // Update visibility for each entry
                entries.forEach(entry => {
                    visibilityRef.current.set(
                        entry.target.id,
                        entry.intersectionRatio
                    )
                })

                // Find most visible section
                let maxRatio = 0
                let mostVisible: string | null =
                    null

                visibilityRef.current.forEach(
                    (ratio, id) => {
                        if (ratio > maxRatio) {
                            maxRatio = ratio
                            mostVisible = id
                        }
                    }
                )

                // Need at least 25% visible
                if (!mostVisible || maxRatio < 0.25)
                    return

                // Clear the block if the active section changes
                if (mostVisible !== lastFiredRef.current) {
                    lastFiredRef.current = null
                }

                // Update active section state
                // (used for avatar label display)
                setActiveSection(mostVisible)

                // Do not trigger voice during tour (tour has full control of speech)
                if ((window as any).isTourActive) {
                    return
                }

                // Do not re-trigger same section
                if (
                    lastFiredRef.current ===
                    mostVisible
                ) return

                // Clear existing timer
                if (timerRef.current) {
                    clearTimeout(timerRef.current)
                }

                const candidateSection = mostVisible

                // Start pauseSeconds timer
                // Voice only fires if user stays
                // on this section for full duration
                timerRef.current = setTimeout(
                    () => {
                        // Verify still on same section
                        let currentMax = 0
                        let currentSection: string | null =
                            null

                        visibilityRef.current.forEach(
                            (ratio, id) => {
                                if (ratio > currentMax) {
                                    currentMax = ratio
                                    currentSection = id
                                }
                            }
                        )

                        if (
                            currentSection ===
                            candidateSection &&
                            !((window as any).isTourActive)
                        ) {
                            lastFiredRef.current =
                                candidateSection
                            callbackRef.current(
                                candidateSection
                            )
                        }
                    },
                    pauseSeconds * 1000
                )
            },
            {
                // Multiple thresholds for accuracy
                threshold: [
                    0, 0.1, 0.2, 0.25,
                    0.3, 0.5, 0.75, 1.0
                ],
                // Focus on the middle 30% of the viewport for stable center section observation
                rootMargin: "-35% 0px -35% 0px"
            }
        )

        // Observe all tour sections
        TOUR_SEQUENCE.forEach(id => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        // Debounce speech trigger on manual scrolling so it only fires after scrolling stops
        const handleScrollDebounce = () => {
            if ((window as any).isTourActive) return
            if ((window as any).isProgrammaticScroll) return

            // Clear the existing timer while the user is actively scrolling
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }

            // Start a new 2-second countdown after this scroll event
            timerRef.current = setTimeout(() => {
                // Find most visible section now that scrolling has stopped
                let currentMax = 0
                let currentSection: string | null = null

                visibilityRef.current.forEach((ratio, id) => {
                    if (ratio > currentMax) {
                        currentMax = ratio
                        currentSection = id
                    }
                })

                if (
                    currentSection &&
                    currentSection !== lastFiredRef.current &&
                    !((window as any).isTourActive)
                ) {
                    const ratio = visibilityRef.current.get(currentSection) || 0
                    if (ratio >= 0.25) {
                        lastFiredRef.current = currentSection
                        callbackRef.current(currentSection)
                    }
                }
            }, pauseSeconds * 1000)
        }

        window.addEventListener("scroll", handleScrollDebounce, { passive: true })

        return () => {
            observer.disconnect()
            window.removeEventListener("scroll", handleScrollDebounce)
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [pauseSeconds])

    // Reset last fired — allows re-trigger
    // when user scrolls away and comes back
    const resetLastFired = useCallback(() => {
        lastFiredRef.current = null
    }, [])

    const clearPendingTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }, [])

    return {
        activeSection,
        resetLastFired,
        clearPendingTimer
    }
}
export default useSectionObserver
