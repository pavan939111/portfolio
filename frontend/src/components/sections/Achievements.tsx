import React from "react"
import { TypewriterLabel } from "../ui/TypewriterLabel"

export const Achievements: React.FC = () => {
  const row1Items = [
    { title: "Smart India Hackathon Winner", venue: "RGUKT Basar 2025" },
    { title: "CineAI Hackathon 6th Place", venue: "T-Works Hyderabad Jan 2026" },
    { title: "Build For India Participant", venue: "KSUM Kochi Feb 2026" },
    { title: "TuteDude Hackathon", venue: "Online 2025" },
    { title: "IBM RAG Agentic AI Certificate", venue: "Coursera" },
    { title: "Microsoft Elevate Intern", venue: "Dec 2025" },
    { title: "Infosys Springboard Intern", venue: "Nov 2025" }
  ]

  const row2Items = [
    { title: "CineAI Hackathon 6th Place", venue: "T-Works Hyderabad Jan 2026" },
    { title: "Smart India Hackathon Winner", venue: "RGUKT Basar 2025" },
    { title: "IBM RAG Agentic AI Certificate", venue: "Coursera" },
    { title: "Build For India Participant", venue: "KSUM Kochi Feb 2026" },
    { title: "Infosys Springboard Intern", venue: "Nov 2025" },
    { title: "TuteDude Hackathon", venue: "Online 2025" },
    { title: "Microsoft Elevate Intern", venue: "Dec 2025" }
  ]

  // Repeat lists to build a seamless infinite marquee scroll
  const marqueeList1 = [...row1Items, ...row1Items, ...row1Items]
  const marqueeList2 = [...row2Items, ...row2Items, ...row2Items]

  return (
    <section
      id="achievements"
      data-section="achievements"
      className="section-container reveal scroll-mt-20"
    >
      {/* Redesigned Section Header Template */}
      <div className="space-y-4 mb-[60px] select-none">
        <TypewriterLabel text="06 / ACHIEVEMENTS" />
        <h2 className="font-headings font-extrabold text-[48px] text-[var(--text-primary)] leading-[1.1]">
          Recognition
        </h2>
        <div className="w-full h-[1px] bg-[var(--border)] mt-6" />
      </div>

      {/* Embedded Marquee custom CSS animations for control speed */}
      <style>{`
        @keyframes scrollMarqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes scrollMarqueeRight {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
        .marquee-container-ach {
          background-color: #050505;
          overflow: hidden;
        }
        .marquee-track-left {
          display: flex;
          width: max-content;
          animation: scrollMarqueeLeft 40s linear infinite;
        }
        .marquee-track-left:hover {
          animation-play-state: paused;
        }
        .marquee-track-right {
          display: flex;
          width: max-content;
          animation: scrollMarqueeRight 50s linear infinite;
        }
        .marquee-track-right:hover {
          animation-play-state: paused;
        }
        .marquee-item-ach {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 24px;
          white-space: nowrap;
          flex-shrink: 0;
        }
      `}</style>

      {/* Infinite scrolling marquee strip wrapper */}
      <div className="marquee-container-ach border-t border-b border-[var(--border)] py-8 flex flex-col gap-6 select-none">
        
        {/* Row 1: Scroll Left */}
        <div className="marquee-track-left font-headings text-sm text-[var(--text-primary)] font-medium">
          {marqueeList1.map((item, idx) => (
            <div key={`row1-${idx}`} className="marquee-item-ach">
              <span>{item.title}</span>
              <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider">/  {item.venue}</span>
              <span className="text-[var(--text-muted)] text-base pl-6 font-bold">•</span>
            </div>
          ))}
        </div>

        {/* Row 2: Scroll Right */}
        <div className="marquee-track-right font-headings text-sm text-[var(--text-primary)] font-medium">
          {marqueeList2.map((item, idx) => (
            <div key={`row2-${idx}`} className="marquee-item-ach">
              <span>{item.title}</span>
              <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider">/  {item.venue}</span>
              <span className="text-[var(--text-muted)] text-base pl-6 font-bold">•</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Achievements
