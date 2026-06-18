import React from "react"
import { TypewriterLabel } from "../ui/TypewriterLabel"

export const Education: React.FC = () => {
  const certifications = [
    "IBM RAG and Agentic AI Professional • Coursera",
    "Machine Learning Specialization • DeepLearning.AI",
    "Deep Learning Specialization • DeepLearning.AI"
  ]

  return (
    <section
      id="education"
      data-section="education"
      className="section-container reveal scroll-mt-20"
    >
      {/* Redesigned Section Header Template */}
      <div className="space-y-4 mb-[60px] select-none">
        <TypewriterLabel text="05 / EDUCATION" />
        <h2 className="font-headings font-extrabold text-[48px] text-[var(--text-primary)] leading-[1.1]">
          Academic Background
        </h2>
        <div className="w-full h-[1px] bg-[var(--border)] mt-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-start bg-black text-[var(--text-primary)]">
        
        {/* Left Column: RGUKT Basar Table Entry */}
        <div className="space-y-8 pb-10 border-b border-[var(--border)] lg:border-b-0 lg:pb-0">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="space-y-2">
              {/* Institution */}
              <h3 className="font-headings font-bold text-[24px] text-[var(--text-primary)]">
                RGUKT Basar
              </h3>
              
              {/* Degree */}
              <span className="font-mono text-xs text-[var(--text-secondary)] block">
                B.Tech Computer Science & Engineering (6-Year Integrated)
              </span>
            </div>

            {/* Duration and Status Badge */}
            <div className="flex flex-col items-start md:items-end gap-2 shrink-0 select-none">
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                2021 – 2027
              </span>

              {/* Status Badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.06)] font-mono text-[9px] tracking-[2px] font-bold text-[var(--accent-green)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
                <span>FINAL YEAR</span>
              </div>
            </div>
          </div>

          <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">
            Pursuing a fast-paced integrated curriculum at Rajiv Gandhi University of Knowledge Technologies Basar. The syllabus covers advanced data structures, systems design, machine learning, and semantic pipelines.
          </p>

          {/* CGPA Display Rows */}
          <div className="border-t border-[var(--border)] pt-6 grid grid-cols-2 gap-8 select-none">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
                B.Tech CGPA
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-headings font-extrabold text-[32px] text-[var(--accent-primary)] block leading-none">
                  8.93
                </span>
                <span className="font-mono text-[9px] text-[var(--text-muted)]">/ 10.0</span>
              </div>
              <span className="font-mono text-[9px] text-[var(--text-muted)] block">
                (Up to 3rd Year)
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
                PUC CGPA
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-headings font-extrabold text-[32px] text-[var(--accent-primary)] block leading-none">
                  9.50
                </span>
                <span className="font-mono text-[9px] text-[var(--text-muted)]">/ 10.0</span>
              </div>
              <span className="font-mono text-[9px] text-[var(--text-muted)] block">
                (Pre-University)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Certifications Table Entry */}
        <div className="space-y-6">
          <h3 className="font-headings font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider select-none pb-2 border-b border-[var(--border)]">
            Credentials
          </h3>

          <ul className="space-y-4 font-mono text-[11px] text-[var(--text-secondary)]">
            {certifications.map((cert, idx) => (
              <li key={idx} className="flex items-start gap-3 hover:text-[var(--text-primary)] transition-colors duration-150">
                <span className="text-[var(--text-muted)] shrink-0 select-none">→</span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}

export default Education
