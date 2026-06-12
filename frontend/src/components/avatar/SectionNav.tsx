import React from "react"
import { useVoice } from "../../context/VoiceContext"
import { voiceScripts } from "../../data/voiceScripts"

export const SectionNav: React.FC = () => {
  const { speak } = useVoice()

  const sections = [
    { id: "intro", label: "Intro", emoji: "👋" },
    { id: "about", label: "About", emoji: "👤" },
    { id: "skills", label: "Skills", emoji: "⚡" },
    { id: "projects", label: "Projects", emoji: "💻" },
    { id: "experience", label: "Work", emoji: "💼" },
    { id: "education", label: "Education", emoji: "🎓" },
    { id: "achievements", label: "Wins", emoji: "🏆" },
    { id: "contact", label: "Contact", emoji: "📞" }
  ]

  const handleClick = (id: string) => {
    // 1. Play section narration voice script
    const scriptKey = id === "intro" ? "intro" : id
    const script = voiceScripts[scriptKey as keyof typeof voiceScripts]
    if (script) {
      speak(script)
    }

    // 2. Smooth scroll to the HTML element
    const targetId = id === "intro" ? "home" : id
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div
      className="bg-[var(--bg-tertiary)] border border-[var(--border)] p-3 shadow-2xl z-50 max-w-[280px]"
      style={{ borderRadius: "12px" }}
    >
      <div className="grid grid-cols-2 gap-2">
        {sections.map(sec => (
          <button
            key={sec.id}
            onClick={() => handleClick(sec.id)}
            className="flex items-center gap-1.5 justify-start text-[var(--text-secondary)] font-mono text-[11px] px-3 py-1.5 rounded-md border transition-all duration-300 hover:text-[var(--accent-primary)] cursor-pointer"
            style={{
              backgroundColor: "rgba(255,122,0,0.08)",
              borderColor: "rgba(255,122,0,0.2)"
            }}
          >
            <span>{sec.emoji}</span>
            <span className="truncate">{sec.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
export default SectionNav
