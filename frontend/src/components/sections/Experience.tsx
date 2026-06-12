import React, { useEffect, useRef, useState } from "react"
import { Briefcase, MapPin, Calendar } from "lucide-react"

export const Experience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lineHeight, setLineHeight] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const winH = window.innerHeight
      
      // Calculate how far through the timeline container the scroll has progressed
      const elementHeight = rect.height
      const scrollPos = winH - rect.top
      
      if (scrollPos > 0) {
        const pct = Math.min(100, Math.max(0, (scrollPos / (elementHeight + 50)) * 100))
        setLineHeight(pct)
      } else {
        setLineHeight(0)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Trigger once on mount to set initial height

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const experiences = [
    {
      role: "AI & Data Pipeline Intern",
      company: "Microsoft Elevate",
      duration: "Dec 2025 – Jan 2026",
      location: "Remote / Hybrid",
      side: "right", // Entry 1 (RIGHT side)
      bullets: [
        "End-to-end healthcare data ingestion pipeline supporting 5+ analytics workflows",
        "Embedding-based semantic analytics layer reducing exploration time by 35%",
        "Pipeline latency optimization by 40%"
      ]
    },
    {
      role: "Python Full Stack Intern",
      company: "Infosys Springboard",
      duration: "Nov 2025 – Jan 2026",
      location: "Remote",
      side: "left", // Entry 2 (LEFT side)
      bullets: [
        "Django app with 20+ REST API endpoints and PostgreSQL backend",
        "Normalized schema across 8+ tables optimized for analytics and reporting",
        "Role-based access control system tracking user activity",
        "Manual processing reduced by 30% through expanded API coverage"
      ]
    }
  ]

  return (
    <section
      id="experience"
      data-section="experience"
      className="section-container reveal scroll-mt-20"
    >
      <span className="section-label">04 / EXPERIENCE</span>
      <h2 className="section-title mb-16 select-none">Work History</h2>

      <div ref={containerRef} className="relative w-full">
        {/* Animated Timeline Line */}
        <div
          className="absolute top-0 bottom-0 left-[20px] lg:left-1/2 w-0.5 bg-gradient-to-b from-[var(--accent-primary)] to-[var(--accent-secondary)] transform -translate-x-1/2 origin-top transition-all duration-300"
          style={{ height: `${lineHeight}%` }}
        />
        {/* Background static tracks */}
        <div className="absolute top-0 bottom-0 left-[20px] lg:left-1/2 w-0.5 bg-[var(--border)] transform -translate-x-1/2 -z-10" />

        {/* Timeline Items */}
        <div className="space-y-16">
          {experiences.map((exp, idx) => {
            const isRight = exp.side === "right"
            return (
              <div
                key={idx}
                className="relative grid grid-cols-1 lg:grid-cols-9 gap-4 lg:gap-8 items-center"
              >
                {/* Date / Company Info Column */}
                <div
                  className={`lg:col-span-4 flex ${
                    isRight
                      ? "lg:justify-end lg:text-right"
                      : "lg:order-last lg:justify-start lg:text-left"
                  } items-center pl-12 lg:pl-0`}
                >
                  <div className="space-y-1">
                    <span className="text-[var(--text-muted)] font-mono text-[11px] tracking-wider block">
                      {exp.duration}
                    </span>
                    <h4 className="text-[var(--accent-primary)] font-mono text-xs uppercase tracking-widest font-bold">
                      {exp.company}
                    </h4>
                  </div>
                </div>

                {/* Center dot (12px circle accent-primary) */}
                <div className="absolute left-[20px] lg:left-1/2 top-1/2 w-3.5 h-3.5 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)] transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                </div>

                {/* Content Card Column */}
                <div
                  className={`lg:col-span-4 pl-12 lg:pl-0 ${
                    isRight ? "" : "lg:order-first"
                  }`}
                >
                  <div className="glass-card hover:border-[var(--accent-primary)]/20">
                    <h3 className="font-headings font-bold text-base text-[var(--text-primary)] mb-3 flex items-center gap-2">
                      <Briefcase size={16} className="text-[var(--accent-primary)]" />
                      {exp.role}
                    </h3>
                    <ul className="space-y-2 text-xs text-[var(--text-secondary)] font-body list-disc pl-4 leading-relaxed">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} className="hover:text-[var(--text-primary)] transition-colors">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default Experience
