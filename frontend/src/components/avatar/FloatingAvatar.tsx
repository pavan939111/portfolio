import {
    useEffect,
    useCallback
} from "react"
import {
    Volume2, VolumeX,
    Mic, Square,
    Pause, Play,
    ChevronRight, X
} from "lucide-react"
import { useVoice } from "../../context/VoiceContext"
import { useAutoTour } from "../../hooks/useAutoTour"
import { useSectionObserver } from "../../hooks/useSectionObserver"
import { SoundWave } from "./SoundWave"
import { AudioVisualizer } from "../ui/AudioVisualizer"

// Section metadata
const SECTIONS = [
    {
        key: "intro",
        icon: "✨",
        label: "Introduction",
        desc: "Welcome & summary"
    },
    {
        key: "about",
        icon: "👤",
        label: "About Me",
        desc: "Background & story"
    },
    {
        key: "skills",
        icon: "🛠️",
        label: "Skills",
        desc: "Technical expertise"
    },
    {
        key: "projects",
        icon: "🚀",
        label: "Projects",
        desc: "What I've built"
    },
    {
        key: "experience",
        icon: "💼",
        label: "Experience",
        desc: "Microsoft & Infosys"
    },
    {
        key: "education",
        icon: "🎓",
        label: "Education",
        desc: "RGUKT · CGPA 8.93"
    },
    {
        key: "achievements",
        icon: "🏆",
        label: "Achievements",
        desc: "Hackathons & wins"
    },
    {
        key: "contact",
        icon: "📬",
        label: "Contact",
        desc: "Let's connect"
    }
]

export function FloatingAvatar() {
    const {
        speechState,
        isSpeaking,
        isMuted, isPaused,
        speak, stop,
        pause, resume,
        toggleMute,
        startListening, stopListening,
        isListening, lastCommand, transcript,
        stream
    } = useVoice()

    const {
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
    } = useAutoTour({ speak, stop })

    const { activeSection, resetLastFired, clearPendingTimer } = useSectionObserver({
        isTourActive,
        currentTourSection: currentSection,
        pauseSeconds: 2,
        onSectionPause: useCallback(
            (sectionId: string) => {
                resumeTourFromSection(sectionId)
            },
            [resumeTourFromSection]
        )
    })

    // Play intro on mount then start sequential tour automatically
    useEffect(() => {
        startTour()
    }, [startTour])

    // Handle voice commands
    useEffect(() => {
        if (!lastCommand) return
        if (
            lastCommand.type === "navigate" &&
            lastCommand.section
        ) {
            setIsMenuOpen(false)
            jumpToManualSection(lastCommand.section)
        }
        if (lastCommand.type === "action") {
            if (lastCommand.action === "stop") {
                stopTour()
            }
            if (lastCommand.action === "openChat") {
                window.dispatchEvent(
                    new CustomEvent("openChat")
                )
            }
        }
    }, [lastCommand, jumpToManualSection, stopTour, setIsMenuOpen])

    const handleStop = useCallback(() => {
        stopTour()
        resetLastFired()
        clearPendingTimer()
        setIsMenuOpen(false)
    }, [stopTour, resetLastFired, clearPendingTimer, setIsMenuOpen])

    const handlePauseResume = useCallback(() => {
        if (isPaused) {
            setIsMenuOpen(false)
            resume()
        } else {
            pause()
        }
    }, [isPaused, pause, resume, setIsMenuOpen])

    const handleLearnMoreClick = useCallback(
        () => {
            setShowExploreMore(false)
            setIsMenuOpen(true)
        },
        [setShowExploreMore, setIsMenuOpen]
    )

    const handleSectionClick = useCallback(
        (key: string) => {
            setIsMenuOpen(false)
            setShowExploreMore(false)
            jumpToManualSection(key)
        },
        [jumpToManualSection, setIsMenuOpen, setShowExploreMore]
    )

    const displaySection =
        currentSection || activeSection

    // Ring animation class based on state
    const getRingClass = () => {
        if (isSpeaking)
            return "ring-speaking"
        if (isListening)
            return "ring-listening"
        if (isMenuOpen)
            return "ring-waiting"
        return "ring-idle"
    }

    const isCurrentlyActiveSpeech = isTourActive || isSpeaking || isPaused

    return (
        <div className="floating-avatar-container">
            {/* ━━ SECTION MENU POPUP ━━ */}
            {isMenuOpen && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "105px",
                        left: "0",
                        background: "var(--bg-tertiary)",
                        border: "1px solid rgba(0, 212, 255, 0.2)",
                        borderRadius: "16px",
                        padding: "20px",
                        width: "280px",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
                        maxHeight: "calc(100vh - 150px)",
                        overflowY: "auto",
                        zIndex: 1100
                    }}
                >
                    {/* Menu header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "14px",
                            paddingBottom: "12px",
                            borderBottom: "1px solid var(--border)"
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "10px",
                                    color: "var(--accent-primary)",
                                    letterSpacing: "2px",
                                    textTransform: "uppercase",
                                    marginBottom: "2px"
                                }}
                            >
                                EXPLORE
                            </p>
                            <p
                                style={{
                                    fontFamily: "var(--font-headings)",
                                    fontSize: "15px",
                                    fontWeight: 700,
                                    color: "var(--text-primary)"
                                }}
                            >
                                Navigate Sections
                            </p>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "8px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid var(--border)",
                                color: "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer"
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Section list */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px"
                        }}
                    >
                        {SECTIONS.map(s => (
                            <button
                                key={s.key}
                                onClick={() => handleSectionClick(s.key)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "10px 14px",
                                    background:
                                        currentSection === s.key
                                            ? "rgba(0, 212, 255, 0.08)"
                                            : "rgba(255,255,255,0.02)",
                                    border:
                                        currentSection === s.key
                                            ? "1px solid rgba(0, 212, 255, 0.35)"
                                            : "1px solid var(--border)",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    textAlign: "left",
                                    width: "100%"
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "18px",
                                        flexShrink: 0,
                                        width: "24px",
                                        textAlign: "center"
                                    }}
                                >
                                    {s.icon}
                                </span>
                                <div style={{ flex: 1 }}>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-headings)",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: "var(--text-primary)",
                                            marginBottom: "1px"
                                        }}
                                    >
                                        {s.label}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "10px",
                                            color: "var(--text-muted)"
                                        }}
                                    >
                                        {s.desc}
                                    </p>
                                </div>
                                <ChevronRight
                                    size={14}
                                    color="var(--text-muted)"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <p
                        style={{
                            marginTop: "12px",
                            paddingTop: "10px",
                            borderTop: "1px solid var(--border)",
                            fontFamily: "var(--font-mono)",
                            fontSize: "9px",
                            color: "var(--text-muted)",
                            textAlign: "center"
                        }}
                    >
                        🎙️ Voice explains on click
                    </p>
                </div>
            )}

            {/* ━━ EXPLORE MORE POPUP ━━ */}
            {(showExploreMore || isPaused) && !isMenuOpen && (
                <button
                    onClick={handleLearnMoreClick}
                    style={{
                        position: "absolute",
                        bottom: "105px",
                        left: "0",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 16px",
                        background: "var(--bg-tertiary)",
                        border: "1px solid rgba(0, 212, 255, 0.35)",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        width: "240px",
                        zIndex: 1100
                    }}
                >
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "rgba(0, 212, 255, 0.12)",
                            border: "1px solid rgba(0, 212, 255, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: "16px"
                        }}
                    >
                        🧭
                    </div>
                    <div style={{ textAlign: "left" }}>
                        <p
                            style={{
                                fontFamily: "var(--font-headings)",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                marginBottom: "2px"
                            }}
                        >
                            Explore More
                        </p>
                        <p
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "10px",
                                color: "var(--accent-primary)"
                            }}
                        >
                            Select a section to begin →
                        </p>
                    </div>
                </button>
            )}

            {/* ━━ AVATAR CONTAINER ━━ */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px"
                }}
            >
                {/* Photo with Animated Ring */}
                <div
                    style={{
                        position: "relative",
                        width: "72px",
                        height: "72px"
                    }}
                >
                    <div
                        className={getRingClass()}
                        style={{
                            width: "72px",
                            height: "72px",
                            borderRadius: "50%",
                            padding: "3px",
                            transition: "all 0.3s ease"
                        }}
                    >
                        {/* Inner photo wrapper */}
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                overflow: "hidden",
                                background: "var(--bg-secondary)"
                            }}
                        >
                            <img
                                src="/pavan-photo.jpg"
                                alt="Pavan Kumar"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    objectPosition: "top center"
                                }}
                                onError={e => {
                                    e.currentTarget.style.display = "none"
                                }}
                            />
                            {/* Initials Fallback */}
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "var(--font-headings)",
                                    fontSize: "22px",
                                    fontWeight: 800,
                                    color: "var(--accent-primary)"
                                }}
                            >
                                PK
                            </div>
                        </div>
                    </div>

                    {/* Emoji status indicator badge */}
                    <div
                        style={{
                            position: "absolute",
                            top: "-2px",
                            right: "-2px",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: "2px solid var(--bg-primary)",
                            background: isSpeaking
                                ? "var(--accent-primary)"
                                : isListening
                                ? "#3B82F6"
                                : isMenuOpen
                                ? "#f59e0b"
                                : "var(--bg-tertiary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "9px"
                        }}
                    >
                        {isSpeaking && "🔊"}
                        {isListening && "🎤"}
                        {isMenuOpen && "📋"}
                        {showExploreMore && !isMenuOpen && "💡"}
                        {!isSpeaking && !isListening && !isMenuOpen && !showExploreMore && "😶"}
                    </div>
                </div>

                {/* SoundWave visualizer below photo */}
                {isListening ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "30px", margin: "4px 0" }}>
                        <AudioVisualizer stream={stream} width={120} height={30} />
                    </div>
                ) : (
                    <SoundWave isActive={isSpeaking} isListening={isListening} />
                )}

                {/* Mute and Speak Controls — ONLY show when NOT actively speaking/paused */}
                {!isCurrentlyActiveSpeech && (
                    <div
                        style={{
                            display: "flex",
                            gap: "6px"
                        }}
                    >
                        {/* Mute button */}
                        <button
                            onClick={toggleMute}
                            title={isMuted ? "Unmute" : "Mute"}
                            style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "8px",
                                background: isMuted ? "rgba(0, 212, 255, 0.08)" : "var(--bg-tertiary)",
                                border: `1px solid ${isMuted ? "rgba(0, 212, 255, 0.4)" : "var(--border)"}`,
                                color: isMuted ? "var(--accent-primary)" : "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        </button>

                        {/* Microphone hold-to-talk button */}
                        <button
                            onMouseDown={startListening}
                            onMouseUp={stopListening}
                            onTouchStart={startListening}
                            onTouchEnd={stopListening}
                            title="Hold to speak a command"
                            style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "8px",
                                background: isListening ? "rgba(59,130,246,0.15)" : "var(--bg-tertiary)",
                                border: `1px solid ${isListening ? "#3B82F6" : "var(--border)"}`,
                                color: isListening ? "#3B82F6" : "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <Mic size={12} />
                        </button>
                    </div>
                )}

                {/* ━━ PLAYBACK CONTROLS (Pause/Resume/Stop) — ONLY show during active speech ━━ */}
                {isCurrentlyActiveSpeech && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px",
                            background: "var(--bg-tertiary)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                            marginTop: "4px"
                        }}
                    >
                        {/* Pause / Resume Button */}
                        <button
                            onClick={handlePauseResume}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                background: isPaused
                                    ? "rgba(0, 212, 255, 0.08)"
                                    : "rgba(255,255,255,0.03)",
                                border: isPaused
                                    ? "1px solid rgba(0, 212, 255, 0.4)"
                                    : "1px solid var(--border)",
                                borderRadius: "8px",
                                cursor: "pointer",
                                color: isPaused
                                    ? "var(--accent-primary)"
                                    : "var(--text-primary)",
                                transition: "all 0.2s ease"
                            }}
                            title={isPaused ? "Resume Audio" : "Pause Audio"}
                        >
                            {isPaused ? (
                                <Play size={10} fill="var(--accent-primary)" />
                            ) : (
                                <Pause size={10} fill="var(--text-primary)" />
                            )}
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700 }}>
                                {isPaused ? "RESUME" : "PAUSE"}
                            </span>
                        </button>

                        {/* Stop Button */}
                        <button
                            onClick={handleStop}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                background: "rgba(239,68,68,0.12)",
                                border: "1px solid rgba(239,68,68,0.3)",
                                borderRadius: "8px",
                                cursor: "pointer",
                                color: "#EF4444",
                                transition: "all 0.2s ease"
                            }}
                            title="Stop"
                        >
                            <Square size={10} fill="#EF4444" />
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700 }}>
                                STOP
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {/* Active section label bubble */}
            {displaySection && !isMenuOpen && (
                <div
                    style={{
                        padding: "4px 10px",
                        background: "var(--bg-tertiary)",
                        border: "1px solid var(--border)",
                        borderRadius: "20px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                    }}
                >
                    <span>
                        {SECTIONS.find(s => s.key === displaySection)?.icon || "🧭"}
                    </span>
                    <span style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
                        {SECTIONS.find(s => s.key === displaySection)?.label || displaySection}
                    </span>
                </div>
            )}

            {/* Live speech recognition transcription bubble */}
            {transcript && (
                <div
                    style={{
                        maxWidth: "180px",
                        background: "var(--bg-tertiary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "9px",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        textAlign: "center"
                    }}
                >
                    "{transcript}"
                </div>
            )}
        </div>
    )
}

export default FloatingAvatar;
