import React, { useState } from "react"
import { MapPin, Mail, Linkedin, Github, Menu, X, FileText } from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionClick: (section: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionClick }) => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { key: "about", label: "ABOUT ME" },
    { key: "skills", label: "TECH STACK" },
    { key: "projects", label: "AI SYSTEMS" },
    { key: "experience", label: "INTERNSHIPS" },
    { key: "education", label: "EDUCATION" },
    { key: "achievements", label: "HACKATHONS" },
    { key: "contact", label: "CONTACT" }
  ]

  const handleNavClick = (key: string) => {
    onSectionClick(key)
    setIsOpen(false)
  }

  const handleDownloadCV = () => {
    // Generate a mock download alert for demo purposes
    alert("CV Download initiated! (pavankumarkunukuntla_resume.pdf)")
  }

  return (
    <>
      {/* MOBILE TOP BAR (Sticky) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-between px-6 z-[100] lg:hidden">
        <div className="flex items-center gap-3">
          <img
            src="/pavan-photo.jpg"
            alt="Pavan Kumar"
            className="w-8 h-8 rounded-full border border-[var(--accent-primary)] object-cover"
          />
          <div>
            <h2 className="font-headings font-bold text-sm text-[var(--text-primary)]">
              PAVAN KUMAR K.
            </h2>
            <span className="text-[9px] font-mono text-[var(--accent-primary)] uppercase tracking-wider">
              Agentic AI Engineer
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* MOBILE DRAWER NAV */}
      {isOpen && (
        <div className="fixed inset-0 top-16 bg-[var(--bg-primary)] z-[99] lg:hidden flex flex-col p-8 overflow-y-auto space-y-8 animate-fade-in">
          {/* Nav Links */}
          <nav className="flex flex-col gap-4">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`text-left font-mono text-xs tracking-widest py-2 transition-all duration-300 ${
                  activeSection === item.key
                    ? "text-[var(--accent-primary)] font-bold pl-2 border-l-2 border-[var(--accent-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Details & Button */}
          <div className="space-y-4 pt-6 border-t border-[var(--border)]">
            <button
              onClick={handleDownloadCV}
              className="w-full flex items-center justify-center gap-2 border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black py-3 rounded-lg font-mono text-xs uppercase tracking-[2px] transition-all duration-300"
            >
              <FileText size={14} /> Download CV
            </button>

            <div className="space-y-2 text-[var(--text-secondary)] font-body text-xs">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[var(--text-muted)]" />
                <span>Basar, Telangana, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[var(--text-muted)]" />
                <a href="mailto:pavankumarkunukuntla@gmail.com" className="hover:text-[var(--accent-primary)] transition-colors">
                  pavankumarkunukuntla@gmail.com
                </a>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <a
                href="https://linkedin.com/in/pavankumarkunukuntla"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://github.com/pavankumarkunukuntla"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP FIXED SIDEBAR */}
      <aside className="fixed bottom-0 top-0 left-0 w-[300px] bg-[var(--bg-secondary)] border-r border-[var(--border)] p-10 flex flex-col justify-between hidden lg:flex z-50 overflow-y-auto">
        <div className="space-y-8 flex flex-col items-center text-center">
          {/* Avatar Image with Breathing Glow Ring */}
          <div className="relative w-32 h-32 select-none">
            <div
              className="absolute inset-0 rounded-full border border-[var(--accent-primary)]"
              style={{ animation: "breatheGlow 3s ease-in-out infinite" }}
            />
            <img
              src="/pavan-photo.jpg"
              alt="Pavan Kumar"
              className="w-full h-full rounded-full object-cover p-1.5"
            />
          </div>

          {/* Name & Titles */}
          <div className="space-y-2">
            <h2 className="font-headings font-extrabold text-[22px] text-[var(--text-primary)] leading-tight">
              Pavan Kumar Kunukuntla
            </h2>
            <span className="font-mono text-[13px] text-[var(--accent-primary)] tracking-[2px] uppercase block">
              Agentic AI Engineer
            </span>
            <p className="font-body text-[11px] text-[var(--text-secondary)] mt-2 max-w-[200px] leading-relaxed">
              Building systems that think, plan, and act autonomously.
            </p>
          </div>

          {/* Location & Email */}
          <div className="space-y-2 text-xs font-body text-center">
            <div className="flex items-center justify-center gap-2 text-[var(--text-muted)]">
              <MapPin size={14} className="shrink-0 text-[var(--accent-primary)]" />
              <span>Basar, Telangana, India</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
              <Mail size={14} className="shrink-0 text-[var(--accent-primary)]" />
              <a href="mailto:pavankumarkunukuntla@gmail.com" className="font-mono truncate max-w-[200px]">
                pavankumarkunukuntla@gmail.com
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 w-full pt-4 border-t border-[var(--border)]">
            {navItems.map(item => {
              const isActive = activeSection === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => onSectionClick(item.key)}
                  className={`font-mono text-[11px] tracking-widest text-center py-1.5 transition-all duration-300 select-none ${
                    isActive
                      ? "text-[var(--accent-primary)] font-bold border-b border-[var(--accent-primary)] max-w-max mx-auto px-2"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Action Button & Social Handles */}
        <div className="space-y-6 pt-6 border-t border-[var(--border)] flex flex-col items-center">
          <button
            onClick={handleDownloadCV}
            className="w-full border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black py-3 rounded-lg font-mono text-[11px] uppercase tracking-[2px] transition-all duration-300 font-bold"
          >
            Download CV
          </button>

          <div className="flex gap-6 text-[var(--text-muted)]">
            <a
              href="https://linkedin.com/in/pavankumarkunukuntla"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent-primary)] transition-colors duration-300"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://github.com/pavankumarkunukuntla"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent-primary)] transition-colors duration-300"
            >
              <Github size={16} />
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
