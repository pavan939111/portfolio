import React from "react"
import { ChevronDown, Mail, Linkedin, Github, MapPin, Briefcase } from "lucide-react"

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
      className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden px-6 md:px-12 lg:px-24 py-8"
    >
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center mt-12 lg:mt-0">
        
        {/* Left Half: Content */}
        <div className="space-y-8 flex flex-col justify-center order-2 lg:order-1">
          {/* Animated State Dot & Greeting */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-green)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-green)]"></span>
            </span>
            <span className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-[3px] select-none">
              Available for Internships & Projects
            </span>
          </div>

          {/* Name & Title */}
          <div className="space-y-3">
            <h1 className="font-headings font-extrabold text-4xl md:text-5xl lg:text-7xl text-[var(--text-primary)] leading-tight select-none">
              Pavan Kumar
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]">
                Kunukuntla
              </span>
            </h1>
            <p className="font-mono text-sm md:text-base text-[var(--accent-primary)] tracking-[2px] uppercase">
              Agentic AI Engineer
            </p>
          </div>

          {/* Custom Divider */}
          <div className="w-full h-[1px] bg-gradient-to-r from-[var(--accent-primary)] via-[var(--border)] to-transparent" />

          {/* Bio Description */}
          <p className="font-body text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
            I build autonomous multi-agent systems, Retrieval-Augmented Generation (RAG) pipelines, and intelligent backends. 
            Final year CSE undergrad at RGUKT Basar, crafting systems that think, plan, and act autonomously.
          </p>

          {/* Quick Statistics Blocks */}
          <div className="grid grid-cols-3 gap-4 border border-[var(--border)] p-5 rounded-xl bg-[rgba(255,255,255,0.01)] backdrop-blur-sm max-w-xl">
            <div className="space-y-1">
              <span className="font-headings font-extrabold text-2xl md:text-3xl text-[var(--accent-primary)] block">
                2+
              </span>
              <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-wider uppercase block">
                Internships
              </span>
            </div>
            <div className="space-y-1 border-x border-[var(--border)] px-4">
              <span className="font-headings font-extrabold text-2xl md:text-3xl text-[var(--accent-primary)] block">
                5+
              </span>
              <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-wider uppercase block">
                AI Systems
              </span>
            </div>
            <div className="space-y-1 pl-4">
              <span className="font-headings font-extrabold text-2xl md:text-3xl text-[var(--accent-primary)] block">
                8.93
              </span>
              <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-wider uppercase block">
                CGPA
              </span>
            </div>
          </div>

          {/* Circular Social Anchors */}
          <div className="flex gap-4">
            <a
              href="mailto:pavankumarkunukuntla@gmail.com"
              className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-black hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all duration-300"
              title="Email Pavan"
            >
              <Mail size={16} />
            </a>
            <a
              href="https://linkedin.com/in/pavankumarkunukuntla"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-black hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all duration-300"
              title="LinkedIn Profile"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://github.com/pavankumarkunukuntla"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-black hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all duration-300"
              title="GitHub Profile"
            >
              <Github size={16} />
            </a>
          </div>
        </div>

        {/* Right Half: Avatar Frame/Image */}
        <div className="flex justify-center items-center order-1 lg:order-2 w-full max-w-md lg:max-w-none mx-auto relative group">
          {/* Cyberpunk framing corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--accent-primary)]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--accent-primary)]" />
          
          {/* Main profile picture container */}
          <div className="relative w-[280px] h-[340px] md:w-[320px] md:h-[400px] bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden rounded-lg shadow-2xl">
            {/* Ambient background glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent z-10" />
            <img
              src="/pavan-photo.jpg"
              alt="Pavan Kumar"
              className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-750 ease-out transform group-hover:scale-[1.03]"
            />
            {/* Top-right subtle grid overlay */}
            <div className="absolute top-3 right-3 font-mono text-[9px] text-[var(--accent-primary)] uppercase tracking-wider bg-black/70 px-2 py-1 border border-[rgba(255,122,0,0.2)] rounded select-none z-20">
              P.K.K
            </div>
          </div>

          {/* Location & Status glass card overlay */}
          <div className="absolute bottom-4 -left-4 md:-left-8 z-20 max-w-[200px] md:max-w-[240px] glass-card px-4 py-3 rounded-lg shadow-lg border border-[var(--border)] select-none animate-bounce-slow">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-[var(--accent-primary)] shrink-0" />
                <span className="font-mono text-[10px] text-[var(--text-primary)]">Basar, Telangana</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={12} className="text-[var(--accent-primary)] shrink-0" />
                <span className="font-mono text-[10px] text-[var(--text-secondary)]">RGUKT CSE '27</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bouncing Scroll Chevron */}
      <div className="flex justify-center items-center pt-8 pb-4">
        <button
          onClick={handleScrollDown}
          className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-300 animate-bounce flex flex-col items-center gap-1 font-mono text-[10px] tracking-widest uppercase cursor-pointer"
        >
          <span>Discover More</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </section>
  )
}
