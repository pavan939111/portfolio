import React, { useState, useEffect, useRef } from "react"

export const HUDDisplay: React.FC = () => {
  const [bsrTime, setBsrTime] = useState("")
  const [lclTime, setLclTime] = useState("")
  const [coords, setCoords] = useState({ x: "0.5000", y: "0.5000" })
  const [scrollDepth, setScrollDepth] = useState("00:00")
  const [activeSection, setActiveSection] = useState("HOME")
  const [isVisible, setIsVisible] = useState(false)

  // Fade in HUD after 1 second
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Time ticker
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date()
      
      // Basar Time (India Standard Time)
      try {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }
        const formatter = new Intl.DateTimeFormat("en-US", options)
        setBsrTime(formatter.format(now))
      } catch (e) {
        setBsrTime(now.toTimeString().split(" ")[0])
      }

      // Local Time
      setLclTime(now.toLocaleTimeString("en-US", { hour12: false }))
    }

    updateClocks()
    const interval = setInterval(updateClocks, 1000)
    return () => clearInterval(interval)
  }, [])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth).toFixed(4)
      const normY = (e.clientY / window.innerHeight).toFixed(4)
      setCoords({ x: normX, y: normY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const percent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
      const formatted = percent.toString().padStart(2, "0")
      setScrollDepth(`00:${formatted}`)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const sections = ["home", "about", "skills", "projects", "experience", "education", "achievements", "contact"]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.toUpperCase())
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: "-25% 0px -45% 0px"
      }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[200] pointer-events-none hidden md:flex justify-between items-start p-5 px-8 transition-opacity duration-700 ease-in-out font-mono select-none"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Left side: Clocks */}
      <div className="flex items-center gap-6">
        {/* BSR Clock */}
        <div className="flex flex-col">
          <span className="text-[9px] text-[var(--text-muted)] tracking-[3px] uppercase">BSR</span>
          <span className="text-xs text-[var(--text-secondary)] mt-0.5">{bsrTime}</span>
        </div>
        
        {/* Separator */}
        <span className="text-[var(--text-muted)] text-xs">···</span>
        
        {/* LCL Clock */}
        <div className="flex flex-col">
          <span className="text-[9px] text-[var(--text-muted)] tracking-[3px] uppercase">LCL</span>
          <span className="text-xs text-[var(--text-secondary)] mt-0.5">{lclTime}</span>
        </div>
      </div>

      {/* Right side: Live telemetry metrics */}
      <div className="flex items-center gap-6 text-[11px] text-[var(--text-muted)]">
        {/* Mouse coordinates */}
        <div className="flex items-center gap-2">
          <span>X: <span className="text-[var(--text-secondary)]">{coords.x}</span></span>
          <span>Y: <span className="text-[var(--text-secondary)]">{coords.y}</span></span>
        </div>

        {/* Separator */}
        <span>|</span>

        {/* Scroll percentage */}
        <div className="flex items-center gap-1">
          <span>DEPTH: <span className="text-[var(--text-secondary)]">{scrollDepth}</span></span>
        </div>

        {/* Separator */}
        <span>|</span>

        {/* Section indicator */}
        <div className="flex items-center gap-1">
          <span>INDEX: <span className="text-[var(--accent-primary)] font-bold">{activeSection}</span></span>
        </div>
      </div>
    </div>
  )
}

export default HUDDisplay
