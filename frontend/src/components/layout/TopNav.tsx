import React, { useState, useEffect } from "react"
import { Github, Linkedin, Mail, Menu, X } from "lucide-react"

export const TopNav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    { name: "Projects", id: "projects" },
    { name: "Experience", id: "experience" },
    { name: "Education", id: "education" },
    { name: "Achievements", id: "achievements" },
    { name: "Contact", id: "contact" }
  ]

  // Track page scroll to toggle background styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Highlight active link based on viewport intersection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: "-30% 0px -40% 0px"
      }
    )

    const sections = ["home", "about", "skills", "projects", "experience", "education", "achievements", "contact"]
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      {/* ── DESKTOP FLOATING NAVBAR (Centered capsule, glassmorphism) ── */}
      <nav 
        className={`hidden md:flex fixed left-1/2 -translate-x-1/2 z-[300] items-center gap-8 font-mono text-[11px] tracking-[2px] uppercase select-none transition-all duration-300 ${
          isScrolled 
            ? "top-3 px-8 py-2.5 bg-black/75 backdrop-blur-md border border-[var(--border)] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.7)]" 
            : "top-4 px-8 py-2.5 bg-black/35 backdrop-blur-sm border border-white/5 rounded-full"
        }`}
      >
        {navLinks.map((link) => {
          const isActive = activeSection === link.id
          return (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`transition-colors duration-200 cursor-pointer ${
                isActive 
                  ? "text-[var(--accent-primary)] font-extrabold drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {link.name}
            </button>
          )
        })}
      </nav>

      {/* ── MOBILE NAVBAR (Full width fixed header) ── */}
      <nav 
        className={`flex md:hidden fixed top-0 left-0 right-0 z-[300] w-full items-center justify-between p-4 px-6 transition-all duration-300 ${
          isScrolled 
            ? "bg-black/90 backdrop-blur-md border-b border-[var(--border)] py-3" 
            : "bg-transparent py-4"
        }`}
      >
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Brand logo label */}
        <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent-primary)] font-bold">
          PK // DEV
        </div>

        {/* Quick Socials */}
        <div className="flex items-center gap-4 text-[var(--text-secondary)]">
          <a
            href="https://github.com/pavankumarkunukuntla"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            <Github size={16} />
          </a>
          <a
            href="https://linkedin.com/in/pavankumarkunukuntla"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            <Linkedin size={16} />
          </a>
        </div>
      </nav>

      {/* ── MOBILE FULLSCREEN OVERLAY MENU ── */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[400] w-full h-screen bg-black/98 flex flex-col justify-between p-6 py-12 font-mono select-none animate-fade-in"
          style={{ animation: "typeChar 0.25s forwards" }}
        >
          {/* Mobile Overlay Header */}
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] text-[var(--text-muted)] tracking-[3px] uppercase">MENU</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 transition-colors border border-[var(--border)] rounded-lg"
              aria-label="Close Navigation Menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links list */}
          <div className="flex flex-col gap-6 text-center text-lg tracking-[3px] uppercase mt-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`py-2 text-base transition-colors duration-200 cursor-pointer ${
                    isActive ? "text-[var(--accent-primary)] font-bold" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {link.name}
                </button>
              )
            })}
          </div>

          {/* Mobile Overlay Footer */}
          <div className="flex justify-center gap-8 text-[var(--text-secondary)] mt-8">
            <a
              href="https://github.com/pavankumarkunukuntla"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              <Github size={22} />
            </a>
            <a
              href="https://linkedin.com/in/pavankumarkunukuntla"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="mailto:pavankumarkunukuntla@gmail.com"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              <Mail size={22} />
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export default TopNav
