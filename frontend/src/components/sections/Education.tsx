import React from "react"
import { Award, GraduationCap, Calendar, BookOpen } from "lucide-react"

export const Education: React.FC = () => {
  const certifications = [
    {
      title: "IBM RAG & Agentic AI Professional",
      issuer: "IBM · Coursera",
      icon: <Award className="text-[var(--accent-primary)]" size={18} />
    },
    {
      title: "Machine Learning Specialization",
      issuer: "DeepLearning.AI · Coursera",
      icon: <Award className="text-[var(--accent-primary)]" size={18} />
    },
    {
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI · Coursera",
      icon: <Award className="text-[var(--accent-primary)]" size={18} />
    }
  ]

  return (
    <section
      id="education"
      data-section="education"
      className="section-container reveal scroll-mt-20"
    >
      <span className="section-label">05 / EDUCATION</span>
      <h2 className="section-title mb-10 select-none">Academic Background</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Main Degree Card */}
        <div className="glass-card flex flex-col justify-between space-y-6 h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headings font-bold text-lg text-[var(--text-primary)] flex items-center gap-2">
                <GraduationCap className="text-[var(--accent-primary)]" size={20} />
                RGUKT Basar
              </h3>
              
              <span
                className="px-2.5 py-1 rounded-[4px] font-mono text-[9px] font-bold tracking-wider uppercase"
                style={{
                  background: "rgba(0,255,136,0.1)",
                  color: "var(--accent-green)",
                  border: "1px solid rgba(0,255,136,0.3)"
                }}
              >
                Final Year (4th Year)
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-headings font-bold text-base text-[var(--accent-primary)]">
                B.Tech CSE — 6 Year Integrated
              </h4>
              <p className="font-mono text-xs text-[var(--text-muted)] flex items-center gap-2">
                <Calendar size={12} /> 2021 – 2027
              </p>
            </div>

            <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed pt-2">
              Pursuing a highly competitive, fast-paced integrated curriculum at Rajiv Gandhi University of Knowledge Technologies Basar. The syllabus covers advanced data structures, systems design, machine learning, and semantic pipelines.
            </p>
          </div>

          {/* CGPA Display (Syne 32px 800) */}
          <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-6">
            <div className="bg-bg-primary/40 p-4 rounded-lg border border-[var(--border)] text-center">
              <span className="font-mono text-[10px] text-[var(--text-muted)] block uppercase tracking-wider mb-1">
                B.Tech CGPA
              </span>
              <span className="font-headings font-extrabold text-[32px] text-[var(--accent-primary)] block leading-none select-none">
                8.93
              </span>
              <span className="font-mono text-[9px] text-[var(--text-muted)] block mt-1">
                (Up to 3rd Year)
              </span>
            </div>

            <div className="bg-bg-primary/40 p-4 rounded-lg border border-[var(--border)] text-center">
              <span className="font-mono text-[10px] text-[var(--text-muted)] block uppercase tracking-wider mb-1">
                PUC CGPA
              </span>
              <span className="font-headings font-extrabold text-[32px] text-[var(--accent-primary)] block leading-none select-none">
                9.50
              </span>
              <span className="font-mono text-[9px] text-[var(--text-muted)] block mt-1">
                (Pre-University)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Certifications Stack */}
        <div className="space-y-4">
          <h3 className="font-headings font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider select-none mb-2">
            Verified Credentials
          </h3>
          
          <div className="space-y-4">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="glass-card reveal flex items-center justify-between hover:border-[var(--accent-primary)]/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded bg-[rgba(255,122,0,0.05)] border border-[rgba(255,122,0,0.1)]">
                    {cert.icon}
                  </div>
                  <div>
                    <h4 className="font-headings font-bold text-sm text-[var(--text-primary)]">
                      {cert.title}
                    </h4>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mt-1">
                      {cert.issuer}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
export default Education
