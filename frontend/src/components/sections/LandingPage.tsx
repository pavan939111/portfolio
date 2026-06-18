import React from "react"
import { Mail, Linkedin, Github, Download } from "lucide-react"

export const LandingPage: React.FC = () => {
  const handleScrollDown = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="home"
      data-section="home"
      className="min-h-screen max-w-[1200px] mx-auto w-full flex flex-col justify-between relative overflow-hidden px-6 md:px-12 lg:px-20 py-8 scroll-mt-20"
    >
      {/* Scroll indicator animation keyframe embedded locally */}
      <style>{`
        @keyframes scrollLineAnim {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .scroll-indicator-line {
          overflow: hidden;
        }
        .scroll-indicator-line::after {
          content: '';
          display: block;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, var(--accent-primary), transparent);
          animation: scrollLineAnim 2s infinite ease-in-out;
        }
      `}</style>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-8 items-center mt-12 lg:mt-0">
        
        {/* Left Column: Heading and Taglines */}
        <div className="space-y-6 flex flex-col justify-center order-1 select-none">
          {/* Tagline context setter */}
          <span className="font-mono text-[12px] text-[var(--text-secondary)] uppercase tracking-[3px]">
            AGENTIC AI ENGINEER / RGUKT BASAR
          </span>

          {/* Large name display */}
          <h1 className="font-headings font-extrabold tracking-tighter leading-[0.95] text-[var(--text-primary)]">
            <span className="block text-[clamp(56px,7vw,96px)]">Pavan</span>
            <span className="block text-[clamp(56px,7vw,96px)]">Kumar</span>
          </h1>

          {/* Simple horizontal rule divider */}
          <div className="w-12 h-[1px] bg-[var(--accent-primary)] mt-6 mb-6" />

          {/* One line role description */}
          <p className="font-mono text-[13px] text-[var(--text-secondary)]">
            Building systems that think, plan, and act autonomously.
          </p>

          {/* Inline statistical metrics */}
          <div className="flex items-center gap-6 mt-8">
            <div className="flex flex-col">
              <span className="font-headings font-bold text-[28px] text-[var(--accent-primary)] leading-none">
                5+
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider uppercase mt-1">
                Projects
              </span>
            </div>
            
            <div className="h-6 w-[1px] bg-[var(--text-muted)] opacity-30" />

            <div className="flex flex-col">
              <span className="font-headings font-bold text-[28px] text-[var(--accent-primary)] leading-none">
                2
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider uppercase mt-1">
                Internships
              </span>
            </div>

            <div className="h-6 w-[1px] bg-[var(--text-muted)] opacity-30" />

            <div className="flex flex-col">
              <span className="font-headings font-bold text-[28px] text-[var(--accent-primary)] leading-none">
                8.93
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider uppercase mt-1">
                CGPA
              </span>
            </div>
          </div>

          {/* Social icons row */}
          <div className="flex gap-2.5 mt-7">
            <a
              href="https://linkedin.com/in/pavankumarkunukuntla"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--border-accent)] hover:text-[var(--accent-primary)] transition-all duration-200"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://github.com/pavankumarkunukuntla"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--border-accent)] hover:text-[var(--accent-primary)] transition-all duration-200"
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="mailto:pavankumarkunukuntla@gmail.com"
              className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--border-accent)] hover:text-[var(--accent-primary)] transition-all duration-200"
              title="Email"
            >
              <Mail size={16} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--border-accent)] hover:text-[var(--accent-primary)] transition-all duration-200"
              title="Download CV"
            >
              <Download size={16} />
            </a>
          </div>
        </div>

        {/* Right Column: Square-ish profile image with corners */}
        <div className="flex flex-col items-center lg:items-end justify-center order-2">
          <div className="relative p-4">
            {/* Top-Right Right-Angle Bracket */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--accent-primary)]" />
            
            {/* Bottom-Left Right-Angle Bracket */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--accent-primary)]" />

            <div className="w-[270px] h-[324px] sm:w-[320px] sm:h-[384px] md:w-[360px] md:h-[430px] lg:w-[400px] lg:h-[480px] overflow-hidden rounded-[4px] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-2xl">
              <img
                src="/pavan-photo.jpg"
                alt="Pavan Kumar Kunukuntla"
                className="w-full h-full object-cover grayscale brightness-95"
                loading="eager"
              />
            </div>
          </div>
          
          {/* Caption */}
          <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider mt-3 select-none">
            RGUKT BASAR / CSE / CGPA 8.93
          </span>
        </div>

      </div>

      {/* Downward scroll indicator block */}
      <div className="flex items-center gap-3 mt-8 self-start select-none">
        <button
          onClick={handleScrollDown}
          className="font-mono text-[9px] tracking-[4px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors uppercase flex items-center gap-3"
        >
          <span>SCROLL</span>
          <div className="scroll-indicator-line w-[1px] h-8 relative bg-[var(--text-muted)]/30" />
        </button>
      </div>

    </section>
  )
}

export default LandingPage
