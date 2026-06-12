import React, { useState, useEffect } from "react"
import { useVoice } from "../../context/VoiceContext"
import { SoundWave } from "./SoundWave"
import { Square, ChevronRight, X, Mic, Volume2, VolumeX, Play, Pause } from "lucide-react"
import { voiceScripts } from "../../data/voiceScripts"
import type { SectionKey } from "../../types"
import { TOUR_SECTIONS } from "../../hooks/useAutoTour"

type AvatarState =
  | "idle"        // not speaking, no popup
  | "speaking"    // voice playing
  | "listening"   // mic active
  | "prompt"      // showing "learn more" pop
  | "menu"        // section menu open
  | "waiting"     // selected section, speaking

interface FloatingAvatarProps {
  activeSection: SectionKey | null
  tour: {
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
}

export function FloatingAvatar({ activeSection, tour }: FloatingAvatarProps) {
  const {
    speechState,
    isMuted,
    speak,
    stop,
    toggleMute,
    startListening,
    stopListening,
    isListening,
    transcript
  } = useVoice()

  const {
    isTourActive,
    isTourPaused,
    currentTourSection,
    currentTourIndex,
    startTour,
    stopTour,
    pauseTour,
    resumeTour,
    jumpToSection
  } = tour

  const [avatarState, setAvatarState] = useState<AvatarState>("idle")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLearnMore, setShowLearnMore] = useState(false)
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false)

  const sectionIcons: Record<string, string> = {
    intro: "👋 ",
    about: "👤 ",
    skills: "🛠️ ",
    projects: "🚀 ",
    experience: "💼 ",
    education: "🎓 ",
    achievements: "🏆 ",
    contact: "📬 "
  }

  const sectionLabels: Record<string, string> = {
    intro: "Intro",
    about: "About Me",
    skills: "Skills",
    projects: "Projects",
    experience: "Experience",
    education: "Education",
    achievements: "Achievements",
    contact: "Contact"
  }

  // ── Play intro on mount ──────────────────
  useEffect(() => {
    if (hasPlayedIntro) return
    const timer = setTimeout(() => {
      setHasPlayedIntro(true)
      setAvatarState("speaking")
      speak(voiceScripts.intro, () => {
        // Intro finished → auto start tour after natural delay
        setTimeout(() => {
          startTour()
        }, 500)
      })
    }, 1200)
    return () => clearTimeout(timer)
  }, [hasPlayedIntro, speak, startTour])

  // ── Track speechState → avatarState ─────
  useEffect(() => {
    if (speechState === "speaking") {
      setAvatarState("speaking")
    } else if (isListening) {
      setAvatarState("listening")
    } else if (speechState === "idle") {
      if (!isMenuOpen && !showLearnMore) {
        setAvatarState("idle")
      } else if (showLearnMore && !isMenuOpen) {
        setAvatarState("prompt")
      }
    }
  }, [speechState, isListening, isMenuOpen, showLearnMore])

  // ── Stop handler ─────────────────────────
  const handleStop = () => {
    stopTour()
    setAvatarState("prompt")
    setShowLearnMore(true)
  }

  // ── Learn more click ─────────────────────
  const handleLearnMoreClick = () => {
    setShowLearnMore(false)
    setIsMenuOpen(true)
    setAvatarState("menu")
  }

  // ── Section click ────────────────────────
  const handleSectionClick = (key: SectionKey) => {
    setIsMenuOpen(false)
    setShowLearnMore(false)
    setAvatarState("waiting")
    // Jump to section and continue tour from that section onwards
    jumpToSection(key)
  }

  // ── Close menu ───────────────────────────
  const handleCloseMenu = () => {
    setIsMenuOpen(false)
    setAvatarState("idle")
    setShowLearnMore(false)
  }

  // ── Ring style per state ─────────────────
  const getRingStyle = () => {
    switch (avatarState) {
      case "speaking":
        return {
          background: "var(--accent-primary)",
          animation: "pulseRing 0.8s infinite"
        }
      case "listening":
        return {
          background: "#3B82F6",
          animation: "pulseRing 1s infinite"
        }
      case "menu":
      case "waiting":
        return {
          background: "rgba(255,122,0,0.5)",
          animation: "breatheGlow 2s infinite"
        }
      default: // idle, prompt
        return {
          background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
          animation: "breatheGlow 3s infinite"
        }
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        left: "28px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px"
      }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* LAYER 1: SECTION MENU (topmost)  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {isMenuOpen && (
        <div
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid rgba(255,122,0,0.25)",
            borderRadius: "16px",
            padding: "20px",
            width: "280px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,122,0,0.08)"
          }}
          className="animate-fade-in"
        >
          {/* Menu header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
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
              onClick={handleCloseMenu}
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

          {/* Start Tour Button */}
          {!isTourActive && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                startTour();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "10px 14px",
                background: "rgba(255,122,0,0.1)",
                border: "1px solid var(--accent-primary)",
                borderRadius: "10px",
                color: "var(--accent-primary)",
                fontFamily: "var(--font-headings)",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                marginBottom: "12px",
                transition: "all 0.2s ease"
              }}
              className="hover:bg-[var(--accent-primary)] hover:text-black"
            >
              <span>🧭</span> Start Guided Portfolio Tour
            </button>
          )}

          {/* Section list — vertical, full width */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}
          >
            {[
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
            ].map(section => (
              <button
                key={section.key}
                onClick={() => handleSectionClick(section.key as SectionKey)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.2s ease"
                }}
                className="hover:bg-[rgba(255,122,0,0.08)] hover:border-[rgba(255,122,0,0.35)] hover:translate-x-1"
              >
                {/* Icon */}
                <span
                  style={{
                    fontSize: "20px",
                    flexShrink: 0,
                    width: "28px",
                    textAlign: "center"
                  }}
                >
                  {section.icon}
                </span>

                {/* Text */}
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
                    {section.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "var(--text-muted)"
                    }}
                  >
                    {section.desc}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight size={14} color="var(--text-muted)" />
              </button>
            ))}
          </div>

          {/* Footer hint */}
          <p
            style={{
              marginTop: "14px",
              paddingTop: "12px",
              borderTop: "1px solid var(--border)",
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "var(--text-muted)",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <span>🎙️</span>
            Voice explains each section on click
          </p>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* LAYER 2: LEARN MORE PROMPT BUBBLE  */}
      {/* Shows after voice finishes         */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showLearnMore && !isMenuOpen && (
        <button
          onClick={handleLearnMoreClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 16px",
            background: "var(--bg-tertiary)",
            border: "1px solid rgba(255,122,0,0.35)",
            borderRadius: "12px",
            cursor: "pointer",
            maxWidth: "240px",
            boxShadow: "0 8px 24px rgba(255,122,0,0.15)",
            transition: "all 0.25s ease"
          }}
          className="animate-bounce-slow hover:bg-[rgba(255,122,0,0.1)] hover:border-[var(--accent-primary)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,122,0,0.2)]"
        >
          {/* Pulsing light bulb icon */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255,122,0,0.15)",
              border: "1px solid rgba(255,122,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "16px"
            }}
          >
            💡
          </div>

          {/* Text */}
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
              Want to learn more?
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--accent-primary)"
              }}
            >
              Explore all sections →
            </p>
          </div>
        </button>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* LAYER 3: PLAYBACK / TOUR CONTROLS  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {isTourActive ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
          }}
          className="animate-fade-in"
        >
          {/* Pause / Resume Button */}
          {isTourPaused ? (
            <button
              onClick={resumeTour}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: "rgba(255,122,0,0.12)",
                border: "1px solid rgba(255,122,0,0.3)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              className="hover:bg-[rgba(255,122,0,0.2)] hover:border-[var(--accent-primary)] text-[var(--accent-primary)]"
              title="Resume Tour"
            >
              <Play size={10} fill="var(--accent-primary)" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700 }}>RESUME</span>
            </button>
          ) : (
            <button
              onClick={pauseTour}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              className="hover:bg-[rgba(255,255,255,0.08)] text-[var(--text-primary)]"
              title="Pause Tour"
            >
              <Pause size={10} fill="var(--text-primary)" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700 }}>PAUSE</span>
            </button>
          )}

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
              transition: "all 0.2s ease"
            }}
            className="hover:bg-[rgba(239,68,68,0.2)] hover:border-[rgba(239,68,68,0.6)] text-[#EF4444]"
            title="Stop Tour"
          >
            <Square size={10} fill="#EF4444" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700 }}>STOP</span>
          </button>
        </div>
      ) : (
        speechState === "speaking" && (
          <button
            onClick={handleStop}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            className="hover:bg-[rgba(239,68,68,0.2)] hover:border-[rgba(239,68,68,0.6)] hover:-translate-y-0.5"
          >
            <Square size={12} color="#EF4444" fill="#EF4444" />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#EF4444",
                letterSpacing: "1px"
              }}
            >
              STOP
            </span>
          </button>
        )
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* LAYER 4: SECTION PROGRESS BAR      */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {isTourActive && currentTourSection && (
        <div
          style={{
            padding: "6px 12px",
            background: "var(--bg-tertiary)",
            border: "1px solid rgba(255,122,0,0.2)",
            borderRadius: "8px",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span style={{ color: "var(--accent-primary)" }}>
            {currentTourIndex + 1}/{TOUR_SECTIONS.length}
          </span>
          <span>
            {sectionIcons[currentTourSection as keyof typeof sectionIcons]}
            {sectionLabels[currentTourSection as keyof typeof sectionLabels]}
          </span>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* LAYER 5: AVATAR PHOTO + RING       */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px"
        }}
      >
        {/* Photo with animated ring */}
        <div
          style={{
            position: "relative",
            width: "72px",
            height: "72px"
          }}
        >
          {/* Animated ring wrapper */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              padding: "3px",
              transition: "all 0.3s ease",
              ...getRingStyle()
            }}
          >
            {/* Photo */}
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
              {/* Initials fallback */}
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

          {/* State emoji badge top-right */}
          <div
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              border: "2px solid var(--bg-primary)",
              background:
                avatarState === "speaking"
                  ? "var(--accent-primary)"
                  : avatarState === "listening"
                    ? "#3B82F6"
                    : avatarState === "menu"
                      ? "#f59e0b"
                      : "var(--bg-tertiary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px"
            }}
          >
            {avatarState === "speaking" && "🔊"}
            {avatarState === "listening" && "🎤"}
            {avatarState === "menu" && "📋"}
            {avatarState === "prompt" && "💡"}
            {avatarState === "idle" && "😶"}
            {avatarState === "waiting" && "⏳"}
          </div>
        </div>

        {/* SoundWave below photo */}
        <SoundWave isActive={avatarState === "speaking"} isListening={avatarState === "listening"} />

        {/* Control buttons */}
        <div
          style={{
            display: "flex",
            gap: "6px"
          }}
        >
          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: isMuted ? "rgba(255,122,0,0.1)" : "var(--bg-tertiary)",
              border: `1px solid ${isMuted ? "rgba(255,122,0,0.4)" : "var(--border)"}`,
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

          {/* Mic — hold to speak commands */}
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
      </div>

      {/* Active section label above the avatar, shown when not menu open */}
      {activeSection && !isMenuOpen && (
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
            {sectionIcons[activeSection as keyof typeof sectionIcons]}
          </span>
          <span>
            {sectionLabels[activeSection as keyof typeof sectionLabels]}
          </span>
        </div>
      )}

      {/* Live transcript text balloon */}
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
          className="animate-fade-in"
        >
          "{transcript}"
        </div>
      )}
    </div>
  )
}
export default FloatingAvatar
