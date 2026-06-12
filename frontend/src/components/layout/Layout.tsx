import React, { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [activeSection, setActiveSection] = useState("about")

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // triggers when section occupies center/top viewport
      threshold: 0.15
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)
    
    // Find all child sections with ids in layout
    const sections = document.querySelectorAll("section[id]")
    sections.forEach(sec => observer.observe(sec))

    return () => {
      sections.forEach(sec => observer.unobserve(sec))
      observer.disconnect()
    }
  }, [children])

  const handleSectionClick = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      {/* Fixed left sidebar */}
      <Sidebar activeSection={activeSection} onSectionClick={handleSectionClick} />

      {/* Main scrollable content */}
      <main className="flex-1 min-h-screen lg:ml-[300px] pt-16 lg:pt-0 pb-16 relative">
        {children}
      </main>
    </div>
  )
}
