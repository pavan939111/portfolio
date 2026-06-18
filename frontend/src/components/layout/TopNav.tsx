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

  // Track page scroll to toggle backdrop-blur background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
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
      <nav 
        className={`fixed top-0 left-0 right-0 z-[300] w-full flex items-center justify-between p-4 px-6 md:px-12 transition-all duration-300 ${
          isScrolled 
            ? "bg-black/90 backdrop-blur-md border-b border-[var(--border)] py-3" 
            : "bg-transparent py-5"
        }`}
      >
        {/* Left Side: Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-mono text-[12px] tracking-[2px] uppercase select-none">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`transition-colors duration-200 cursor-pointer ${
                  isActive ? "text-[var(--accent-primary)] font-bold" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {link.name}
              </button>
            )
          })}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden select-none">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Right Side: Social Media Icons */}
        <div className="flex items-center gap-5 text-[var(--text-secondary)]">
          <a
            href="https://github.com/pavankumarkunukuntla"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-primary)] transition-colors p-1"
            title="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/pavankumarkunukuntla"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-primary)] transition-colors p-1"
            title="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:pavankumarkunukuntla@gmail.com"
            className="hover:text-[var(--text-primary)] transition-colors p-1"
            title="Email"
          >
            <Mail size={18} />
          </a>
        </div>
      </nav>

      {/* Full Screen Overlay Navigation for Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[400] w-full h-screen bg-black/98 flex flex-col justify-between p-6 py-12 font-mono select-none animate-fade-in" style={{ animation: "typeChar 0.25s forwards" }}>
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
              )}
            )}
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
