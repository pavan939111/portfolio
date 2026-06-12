import React, { useState, useEffect } from "react"
import { useVoice } from "../../context/VoiceContext"
import { SoundWave } from "./SoundWave"
import { SectionNav } from "./SectionNav"
import { Volume2, VolumeX, Mic } from "lucide-react"
import { voiceScripts } from "../../data/voiceScripts"

export const Avatar: React.FC = () => {
  const {
    isSpeaking,
    isListening,
    isMuted,
    toggleMute,
    startListening,
    stopListening,
    transcript,
    speak
  } = useVoice()

  const [introComplete, setIntroComplete] = useState(false)
  const [activeSection, setActiveSection] = useState("intro")

  // Observe active section for display pill
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0.15
    })

    const sections = document.querySelectorAll("section[id]")
    sections.forEach(sec => observer.observe(sec))

    return () => {
      sections.forEach(sec => observer.unobserve(sec))
      observer.disconnect()
    }
  }, [])

  // Play intro narration speech on load
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(voiceScripts.intro, () => {
        setIntroComplete(true)
      })
    }, 1500)
    return () => {
      clearTimeout(timer)
    }
  }, [speak])

  // Helper toggle for the panel
  const handleAvatarClick = () => {
    // If intro hasn't run or is playing, clicking skips/toggles menu
    setIntroComplete(true)
  }

  const sectionIcons: Record<string, string> = {
    intro: "👋 ",
    about: "👤 ",
    skills: "⚡ ",
    projects: "💻 ",
    experience: "💼 ",
    education: "🎓 ",
    achievements: "🏆 ",
    contact: "📞 "
  }

  const sectionLabels: Record<string, string> = {
    intro: "Intro",
    about: "About Me",
    skills: "Skills",
    projects: "Projects",
    experience: "Experience",
    education: "Education",
    achievements: "Wins",
    contact: "Contact"
  }

  // Animation resolver
  const getAvatarAnimation = () => {
    if (isSpeaking) return "pulseRing 1s ease infinite"
    if (isListening) return "none"
    return "breatheGlow 3s ease infinite"
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-2">
      {/* Section Nav — floating panel above avatar */}
      {introComplete && (
        <div className="animate-fade-in mb-1">
          <SectionNav />
        </div>
      )}

      {/* Active Section label pill */}
      {activeSection && (
        <div
          className="flex items-center gap-1.5 font-mono text-[10px] select-none pointer-events-none"
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--accent-primary)",
            color: "var(--accent-primary)",
            padding: "4px 10px",
            borderRadius: "20px"
          }}
        >
          <span>{sectionIcons[activeSection]}</span>
          <span className="uppercase tracking-wider">
            {sectionLabels[activeSection]}
          </span>
        </div>
      )}

      {/* Avatar Photo with Pulsing Ring Wrapper */}
      <div className="relative cursor-pointer" onClick={handleAvatarClick}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            padding: "3px",
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            animation: getAvatarAnimation()
          }}
        >
          <img
            src="/pavan-photo.jpg"
            alt="Pavan Kumar"
            className="w-full h-full rounded-full object-cover"
            style={{
              background: "var(--bg-secondary)"
            }}
          />
        </div>

        {/* Listening Indicator Outer Ring */}
        {isListening && (
          <div
            className="absolute inset-[-4px] rounded-full pointer-events-none"
            style={{
              border: "2px solid #3B82F6",
              animation: "pulseRing 1s ease infinite"
            }}
          />
        )}
      </div>

      {/* SoundWave below photo */}
      <SoundWave isActive={isSpeaking} isListening={isListening} />

      {/* Controls Row */}
      <div className="flex gap-2">
        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="w-7 h-7 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all duration-300 flex items-center justify-center cursor-pointer"
        >
          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </button>

        {/* Mic button — hold or click to talk */}
        <button
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border"
          style={{
            backgroundColor: isListening ? "rgba(59, 130, 246, 0.2)" : "var(--bg-tertiary)",
            borderColor: isListening ? "#3B82F6" : "var(--border)",
            color: isListening ? "#3B82F6" : "var(--text-muted)"
          }}
        >
          <Mic size={12} />
        </button>
      </div>

      {/* Live Transcript bubble */}
      {transcript && (
        <div
          className="max-w-[200px] border text-center shadow-xl animate-fade-in mt-1 select-none pointer-events-none"
          style={{
            background: "var(--bg-tertiary)",
            borderColor: "var(--border)",
            borderRadius: "8px",
            padding: "6px 10px",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-secondary)"
          }}
        >
          "{transcript}"
        </div>
      )}
    </div>
  )
}
export default Avatar
