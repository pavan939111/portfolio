import {
    useState,
    useCallback,
    useRef
} from "react"

export type SpeechState =
    "idle" | "speaking" | "listening"

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000"

// Global tracking of user gesture interaction
let hasUserInteracted = false

if (typeof window !== "undefined") {
    const handleGesture = () => {
        hasUserInteracted = true
        console.log("[useSpeech] User gesture detected. Audio system unblocked.")
        // Clean up immediately
        window.removeEventListener("click", handleGesture, true)
        window.removeEventListener("keydown", handleGesture, true)
        window.removeEventListener("touchstart", handleGesture, true)
        window.removeEventListener("wheel", handleGesture, true)
        window.removeEventListener("scroll", handleGesture, true)
    }
    window.addEventListener("click", handleGesture, { capture: true, passive: true })
    window.addEventListener("keydown", handleGesture, { capture: true, passive: true })
    window.addEventListener("touchstart", handleGesture, { capture: true, passive: true })
    window.addEventListener("wheel", handleGesture, { capture: true, passive: true })
    window.addEventListener("scroll", handleGesture, { capture: true, passive: true })
}

export function useSpeech() {
    const [speechState, setSpeechState] =
        useState<SpeechState>("idle")
    const [isMuted, setIsMuted] =
        useState(false)
    const [isPaused, setIsPaused] =
        useState(false)

    // HTML Audio element ref
    const audioRef =
        useRef<HTMLAudioElement | null>(null)
    const onEndRef =
        useRef<(() => void) | null>(null)
    const pendingPlayRef =
        useRef<{ clipName: string; onEnd?: () => void } | null>(null)
    const currentClipRef =
        useRef<string | null>(null)

    const getAudioElement = useCallback(() => {
        if (!audioRef.current) {
            const audio = new Audio()
            audioRef.current = audio

            const forcePlaybackRate = () => {
                audio.playbackRate = 1.1
            }

            audio.onplay = () => {
                setSpeechState("speaking")
                setIsPaused(false)
                audio.playbackRate = 1.1
            }

            audio.onplaying = forcePlaybackRate
            audio.onloadedmetadata = forcePlaybackRate
            audio.oncanplay = forcePlaybackRate

            audio.onended = () => {
                setSpeechState("idle")
                setIsPaused(false)
                if (onEndRef.current) {
                    const callback = onEndRef.current
                    onEndRef.current = null
                    callback()
                }
            }

            audio.onerror = (e) => {
                const mediaError = audio.error
                console.error("Audio playback error (onerror) info:", mediaError, e)

                // Ignore if aborted intentionally
                if (mediaError && mediaError.code === 1) {
                    console.log("Audio playback aborted intentionally.")
                    return
                }

                setSpeechState("idle")
                setIsPaused(false)
                if (onEndRef.current) {
                    const callback = onEndRef.current
                    onEndRef.current = null
                    callback()
                }
            }
        }
        return audioRef.current
    }, [])

    // Completely stop and clear audio
    const stop = useCallback(() => {
        pendingPlayRef.current = null
        currentClipRef.current = null // Set to null FIRST to prevent error handler races
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.src = ""
        }
        setSpeechState("idle")
        setIsPaused(false)
        onEndRef.current = null
    }, [])

    // Pause current audio
    const pause = useCallback(() => {
        if (
            audioRef.current &&
            !audioRef.current.paused
        ) {
            audioRef.current.pause()
            setIsPaused(true)
            setSpeechState("idle")
        }
    }, [])

    // Resume paused audio
    const resume = useCallback(() => {
        if (
            audioRef.current &&
            audioRef.current.paused &&
            isPaused
        ) {
            audioRef.current.playbackRate = 1.1
            audioRef.current
                .play()
                .catch(console.error)
            setIsPaused(false)
            setSpeechState("speaking")
        }
    }, [isPaused])

    // Synchronously unblock HTML5 Audio via user gesture
    const unblockAudio = useCallback(() => {
        hasUserInteracted = true
        const audio = getAudioElement()
        const oldSrc = audio.src
        audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA"
        audio.play().then(() => {
            console.log("Silent audio played to unblock HTML5 audio.")
            audio.src = oldSrc
        }).catch(err => {
            console.warn("Silent audio unblock failed:", err)
            audio.src = oldSrc
        })
    }, [getAudioElement])

    // Speak a named clip
    const speak = useCallback(async (
        clipName: string,
        onEnd?: () => void
    ) => {
        // Respect mute
        if (isMuted) {
            onEnd?.()
            return
        }

        // Queue speech if user hasn't interacted yet
        if (!hasUserInteracted) {
            console.log(`[useSpeech] Queueing clip '${clipName}' until first interaction.`)
            pendingPlayRef.current = { clipName, onEnd }

            const handleFirstGesture = () => {
                if (pendingPlayRef.current) {
                    const queued = pendingPlayRef.current
                    pendingPlayRef.current = null
                    console.log(`[useSpeech] Gesture detected. Playing queued clip: ${queued.clipName}`)
                    
                    unblockAudio()
                    speak(queued.clipName, queued.onEnd)
                }

                // Cleanup gesture listener
                window.removeEventListener("click", handleFirstGesture, true)
                window.removeEventListener("keydown", handleFirstGesture, true)
                window.removeEventListener("touchstart", handleFirstGesture, true)
                window.removeEventListener("wheel", handleFirstGesture, true)
                window.removeEventListener("scroll", handleFirstGesture, true)
            }

            window.addEventListener("click", handleFirstGesture, { capture: true, once: true })
            window.addEventListener("keydown", handleFirstGesture, { capture: true, once: true })
            window.addEventListener("touchstart", handleFirstGesture, { capture: true, once: true })
            window.addEventListener("wheel", handleFirstGesture, { capture: true, once: true })
            window.addEventListener("scroll", handleFirstGesture, { capture: true, once: true })
            return
        }

        const audio = getAudioElement()
        onEndRef.current = onEnd || null
        pendingPlayRef.current = null
        currentClipRef.current = clipName // Store current clip in ref

        try {
            const url = `${API_URL}/api/audio/${clipName}`
            
            // Set speed parameters before play to lock playback rate
            audio.src = url
            audio.preload = "auto"
            audio.defaultPlaybackRate = 1.1
            audio.playbackRate = 1.1

            await audio.play()

        } catch (err) {
            const isAbort = err instanceof Error && err.name === "AbortError"
            const isNotAllowed = err instanceof Error && err.name === "NotAllowedError"

            if (isAbort) {
                console.log(`Playback aborted/interrupted for clip: ${clipName}`)
            } else if (isNotAllowed) {
                console.warn(`Autoplay blocked for clip: ${clipName}. Re-queueing.`)
                hasUserInteracted = false // Reset since it failed
                pendingPlayRef.current = { clipName, onEnd }
                
                const handleReGesture = () => {
                    hasUserInteracted = true
                    unblockAudio()
                    speak(clipName, onEnd)
                    window.removeEventListener("click", handleReGesture, true)
                    window.removeEventListener("keydown", handleReGesture, true)
                    window.removeEventListener("touchstart", handleReGesture, true)
                }
                window.addEventListener("click", handleReGesture, { capture: true, once: true })
                window.addEventListener("keydown", handleReGesture, { capture: true, once: true })
                window.addEventListener("touchstart", handleReGesture, { capture: true, once: true })
                
                setSpeechState("idle")
                setIsPaused(false)
            } else {
                console.error(`Failed to play ${clipName} via backend API:`, err)
                setSpeechState("idle")
                setIsPaused(false)
                if (onEnd) {
                    onEnd()
                }
            }
        }
    }, [isMuted, getAudioElement, unblockAudio])

    const toggleMute = useCallback(() => {
        if (!isMuted) stop()
        setIsMuted(prev => !prev)
    }, [isMuted, stop])

    return {
        speechState,
        isSpeaking: speechState === "speaking",
        isMuted,
        setIsMuted,
        isPaused,
        speak,
        stop,
        pause,
        resume,
        toggleMute,
        unblockAudio,
        isSupported: true,
        selectedVoiceName: "Deepgram Aura-2 (en-US)"
    }
}
export default useSpeech
