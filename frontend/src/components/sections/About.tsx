import React from "react"

export const About: React.FC = () => {
  const tags = [
    "Agentic AI",
    "RAG Systems",
    "Multi-Agent",
    "LangGraph",
    "FastAPI",
    "Open to Work"
  ]

  return (
    <section
      id="about"
      data-section="about"
      className="section-container reveal scroll-mt-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-[60px] items-start">
        {/* Left Column: Bio */}
        <div className="space-y-6">
          <span className="section-label">01 / ABOUT</span>
          <h2 className="section-title mb-6 select-none">About Me</h2>
          
          <div className="font-body text-sm text-[var(--text-secondary)] leading-[1.8] space-y-4">
            <p>
              I'm Pavan Kumar Kunukuntla, a final year B.Tech student (4th Year) at Rajiv Gandhi University of Knowledge Technologies (RGUKT) Basar, pursuing Computer Science and Engineering in a 6-Year Integrated program (2021 - 2027). I am based in Basar, Telangana, India.
            </p>
            <p>
              I am passionate about transforming cutting-edge AI research into practical, high-impact products. I continuously explore agentic AI, fine-tuning, and autonomous systems.
            </p>
            <p>
              With hands-on experience building LLM-powered applications, Retrieval-Augmented Generation (RAG) systems, multi-agent workflows, and scalable AI backends, I aim to bridge the gap between static code and dynamic system intelligence.
            </p>
          </div>
        </div>

        {/* Right Column: Stats & Tags */}
        <div className="space-y-8 lg:pt-14">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 border-b border-[var(--border)] pb-8">
            <div className="text-center lg:text-left">
              <span className="font-headings font-extrabold text-[36px] text-[var(--accent-primary)] block leading-none select-none">
                2+
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
                Internships
              </span>
            </div>
            <div className="text-center lg:text-left">
              <span className="font-headings font-extrabold text-[36px] text-[var(--accent-primary)] block leading-none select-none">
                5+
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
                Projects
              </span>
            </div>
            <div className="text-center lg:text-left">
              <span className="font-headings font-extrabold text-[36px] text-[var(--accent-primary)] block leading-none select-none">
                8.93
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
                CGPA
              </span>
            </div>
          </div>

          {/* Personality / Interest Tags */}
          <div className="space-y-4">
            <h3 className="font-headings font-bold text-xs text-[var(--text-primary)] uppercase tracking-wider select-none">
              Core Focus
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-[14px] py-[6px] rounded-[20px] font-mono text-[11px] text-[var(--accent-primary)] select-none"
                  style={{
                    background: "rgba(255, 122, 0, 0.1)",
                    border: "1px solid rgba(255, 122, 0, 0.3)"
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
