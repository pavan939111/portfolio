import { useChat } from "./context/ChatContext"
import { useVoice } from "./context/VoiceContext"
import { useAutoTour } from "./hooks/useAutoTour"
import { useSectionObserver } from "./hooks/useSectionObserver"
import { useScrollReveal } from "./hooks/useScrollReveal"
import { useHoverSpeak } from "./hooks/useHoverSpeak"
import { voiceScripts } from "./data/voiceScripts"

import { DotGrid } from "./components/ui/DotGrid"
import { GrainOverlay } from "./components/ui/GrainOverlay"
import { ScrollProgress } from "./components/layout/ScrollProgress"
import { CustomCursor } from "./components/ui/CustomCursor"

// Section Components
import { LandingPage } from "./components/sections/LandingPage"
import { About } from "./components/sections/About"
import { Skills } from "./components/sections/Skills"
import { Projects } from "./components/sections/Projects"
import { Experience } from "./components/sections/Experience"
import { Education } from "./components/sections/Education"
import { Achievements } from "./components/sections/Achievements"
import { Contact } from "./components/sections/Contact"

// Avatar & Chat Components
import { FloatingAvatar } from "./components/avatar/FloatingAvatar"
import { ChatButton } from "./components/chatbot/ChatButton"
import { ChatPanel } from "./components/chatbot/ChatPanel"

export default function App() {
  // Initialize scroll animations
  useScrollReveal()

  // Initialize hover/tap audio narration system
  useHoverSpeak()

  const { isChatOpen } = useChat()
  const { speak, stop } = useVoice()

  // Initialize auto-tour manager
  const tour = useAutoTour({ speak, stop })
  const { isTourActive } = tour

  // Set up section visibility observer (solely for active section highlight in UI)
  const { activeSection } = useSectionObserver({
    isTourActive
  })

  return (
    <>
      {/* Background layers & custom overlays */}
      <DotGrid />
      <GrainOverlay />
      <ScrollProgress />
      <CustomCursor />

      {/* Main viewport container */}
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
        
        {/* ── MAIN CONTENT ── */}
        {/* This div shrinks dynamically when the panel opens on desktop */}
        <div
          className={`main-content ${
            isChatOpen ? "chat-open" : "chat-closed"
          }`}
        >
          {/* Landing / Hero Section */}
          <LandingPage />

          {/* Portfolio Sections */}
          <section id="about">
            <About />
          </section>
          
          <section id="skills">
            <Skills />
          </section>

          <section id="projects">
            <Projects />
          </section>

          <section id="experience">
            <Experience />
          </section>

          <section id="education">
            <Education />
          </section>

          <section id="achievements">
            <Achievements />
          </section>

          <section id="contact">
            <Contact />
          </section>
        </div>

        {/* ── CHAT PANEL ── */}
        {/* Slides in from the right, taking up 420px of space on desktop */}
        <div
          className={`chat-panel-wrapper ${
            isChatOpen ? "chat-panel-open" : ""
          }`}
        >
          <ChatPanel />
        </div>

        {/* ── FLOATING CONTROLS ── */}
        {/* Fixed Voice Assistant Control (Bottom-Left) */}
        <FloatingAvatar activeSection={activeSection} tour={tour} />

        {/* Floating Conversational AI Panel Toggle (Bottom-Right) */}
        <ChatButton />
      </div>
    </>
  )
}
