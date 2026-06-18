import React from "react"
import { TypewriterLabel } from "../ui/TypewriterLabel"

export const Experience: React.FC = () => {
  const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027]
  const currentYear = 2026

  const experiences = [
    {
      role: "AI & Data Pipeline Intern",
      company: "Microsoft Elevate",
      duration: "Dec 2025 – Jan 2026",
      bullets: [
        "Architected an end-to-end healthcare data ingestion pipeline, supporting 5+ analytical query streams.",
        "Integrated an embedding-based semantic search utility, reducing diagnostic context analysis times by 35%.",
        "Optimized pipeline thread scheduling and concurrent requests, improving pipeline latency outputs by 40%."
      ]
    },
    {
      role: "Python Full Stack Intern",
      company: "Infosys Springboard",
      duration: "Nov 2025 – Jan 2026",
      bullets: [
        "Developed a Django web application running over 20 REST API endpoints, supported by a PostgreSQL backend database.",
        "Engineered normalized schema layouts spanning 8+ tables, optimized with composite indices for reporting operations.",
        "Implemented secure role-based access control (RBAC) layers and token-based validation interfaces.",
        "Expanded overall REST API test coverage, cutting manual pipeline monitoring errors by 30%."
      ]
    }
  ]

  return (
    <section
      id="experience"
      data-section="experience"
      className="section-container reveal scroll-mt-20"
    >
      {/* Redesigned Section Header Template */}
      <div className="space-y-4 mb-[60px] select-none">
        <TypewriterLabel text="04 / EXPERIENCE" />
        <h2 className="font-headings font-extrabold text-[48px] text-[var(--text-primary)] leading-[1.1]">
          Work History
        </h2>
        <div className="w-full h-[1px] bg-[var(--border)] mt-6" />
      </div>

      {/* Horizontal Year Timeline */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-thin select-none">
        <div className="relative min-w-[500px] py-8 mb-4">
          {/* Timeline Horizontal Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[var(--border)] -translate-y-1/2 z-0" />
          
          {/* Year Markers */}
          <div className="flex justify-between items-center relative z-10">
            {years.map((year) => {
              const isActive = year === currentYear
              return (
                <div key={year} className="flex flex-col items-center">
                  {/* Year Label */}
                  <span 
                    className={`font-mono text-[10px] mb-2.5 transition-colors ${
                      isActive ? "text-[var(--accent-primary)] font-bold" : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {year}
                  </span>

                  {/* Dot Marker */}
                  <div 
                    className={`rounded-full relative flex items-center justify-center ${
                      isActive 
                        ? "w-4 h-4 bg-black border-2 border-[var(--accent-primary)]" 
                        : "w-2 h-2 bg-[var(--text-muted)] border border-transparent"
                    }`}
                  >
                    {isActive && (
                      <>
                        <span className="absolute w-full h-full rounded-full bg-[var(--accent-primary)] opacity-40 animate-ping" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Experience Entry List */}
      <div className="flex flex-col gap-10">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12 pb-10 border-b border-[var(--border)] last:border-b-0"
          >
            {/* Left Column: Duration */}
            <span className="font-mono text-xs text-[var(--text-secondary)] pt-1">
              {exp.duration}
            </span>

            {/* Right Column: Content */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-headings font-bold text-lg text-[var(--text-primary)]">
                  {exp.role}
                </h3>
                <span className="font-mono text-xs text-[var(--accent-primary)] block">
                  {exp.company}
                </span>
              </div>

              {/* Bullet list */}
              <ul className="space-y-3 font-body text-sm text-[var(--text-secondary)]">
                {exp.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 hover:text-[var(--text-primary)] transition-colors duration-150">
                    <span className="text-[var(--text-muted)] font-mono shrink-0 select-none">→</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Experience
