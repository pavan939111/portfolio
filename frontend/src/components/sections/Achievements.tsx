import React from "react"
import { Trophy, Medal, Star, Code } from "lucide-react"

export const Achievements: React.FC = () => {
  const achievementsList = [
    {
      title: "Smart India Hackathon",
      result: "🥇 Winner — Internal Round",
      venue: "RGUKT Basar, 2025",
      icon: <Trophy size={24} style={{ color: "#FFD700" }} />
    },
    {
      title: "CineAI Hackathon",
      result: "🏅 6th Place",
      venue: "T-Works, Hyderabad · Jan 2026",
      project: "Built VisionSync",
      icon: <Medal size={24} style={{ color: "var(--accent-primary)" }} />
    },
    {
      title: "Build For India — KSUM",
      result: "✅ Participant",
      venue: "KSUM, Kochi Kerala · Feb 2026",
      project: "Built TaxSetu",
      icon: <Star size={24} style={{ color: "var(--accent-secondary)" }} />
    },
    {
      title: "TuteDude Hackathon",
      result: "✅ Participant",
      venue: "Online, 2025",
      icon: <Code size={24} style={{ color: "var(--accent-primary)" }} />
    }
  ]

  return (
    <section
      id="achievements"
      data-section="achievements"
      className="section-container reveal scroll-mt-20"
    >
      <span className="section-label">06 / ACHIEVEMENTS</span>
      <h2 className="section-title mb-10 select-none">Recognition</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievementsList.map((ach, i) => (
          <div
            key={i}
            className="glass-card reveal flex flex-col justify-between hover:border-[var(--accent-primary)]/40 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded bg-bg-primary/50 border border-[var(--border)]">
                  {ach.icon}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-headings font-bold text-base text-[var(--text-primary)]">
                  {ach.title}
                </h3>
                <div className="font-mono text-xs text-[var(--accent-primary)] font-bold">
                  {ach.result}
                </div>
                <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  {ach.venue}
                </div>
                {ach.project && (
                  <p className="font-body text-xs text-[var(--text-secondary)] italic pt-1">
                    ↳ {ach.project}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
export default Achievements
