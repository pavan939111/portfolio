import React, { useState } from "react"
import { useChat } from "./context/ChatContext"
import { useScrollReveal } from "./hooks/useScrollReveal"

// Core Layout & UI Components
import { NeuralBackground } from "./components/ui/NeuralBackground"
import { CustomCursor } from "./components/ui/CustomCursor"
import { HUDDisplay } from "./components/ui/HUDDisplay"
import { GrainOverlay } from "./components/ui/GrainOverlay"
import { ScrollProgress } from "./components/layout/ScrollProgress"

// Section Components
import { LandingPage } from "./components/sections/LandingPage"
import { About } from "./components/sections/About"
import { Skills } from "./components/sections/Skills"
import { Projects } from "./components/sections/Projects"
import { Experience } from "./components/sections/Experience"
import { Education } from "./components/sections/Education"
import { Achievements } from "./components/sections/Achievements"
import { Contact } from "./components/sections/Contact"

// Top Nav Component
import { TopNav } from "./components/layout/TopNav"

// Avatar & Chat Components
import { ChatButton } from "./components/chatbot/ChatButton"
import { ChatPanel } from "./components/chatbot/ChatPanel"
import { TelemetryDashboard } from "./components/ui/TelemetryDashboard"

export default function App() {
  // Initialize scroll reveal animations
  useScrollReveal()

  const { isChatOpen } = useChat()
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false)
  const [isEntered, setIsEntered] = useState(true)

  return (
    <>
      {/* Background & HUD Layer */}
      <NeuralBackground />
      <CustomCursor />
      <HUDDisplay />
      <GrainOverlay />
      <ScrollProgress />
      <TopNav />

      <div 
        className="min-h-screen bg-transparent text-[var(--text-primary)] relative"
        style={{
          opacity: isEntered ? 1 : 0,
          pointerEvents: isEntered ? "all" : "none",
          transition: "opacity 1s ease 0.3s",
        }}
      >
        
        {/* ── MAIN CONTENT ── */}
        <div
          className={`main-content ${
            isChatOpen ? "chat-open" : "chat-closed"
          }`}
        >
          {/* Landing / Hero Section */}
          <LandingPage />

          {/* Portfolio Sections */}
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <Achievements />
          <Contact />

          {/* Footer with Telemetry Toggle */}
          <footer
            style={{
              padding: "40px 20px 60px 20px",
              borderTop: "1px solid var(--border)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginTop: "40px"
            }}
          >
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
              © {new Date().getFullYear()} Pavan Kumar Kunukuntla. All rights reserved.
            </p>
            <button
              onClick={() => setIsTelemetryOpen(true)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--accent-primary)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px"
              }}
            >
              ⚙️ System Telemetry
            </button>
          </footer>
        </div>

        {/* ── CHAT PANEL ── */}
        <div
          className={`chat-panel-wrapper ${
            isChatOpen ? "chat-panel-open" : ""
          }`}
        >
          <ChatPanel />
        </div>

        {/* ── FLOATING CONTROLS ── */}
        {isEntered && (
          <>
            <ChatButton />
          </>
        )}

        {/* ── TELEMETRY DASHBOARD OVERLAY ── */}
        <TelemetryDashboard isOpen={isTelemetryOpen} onClose={() => setIsTelemetryOpen(false)} />
      </div>
    </>
  )
}

