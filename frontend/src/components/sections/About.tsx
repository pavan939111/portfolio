import React, { useState } from "react"
import { TypewriterLabel } from "../ui/TypewriterLabel"

interface CircularGaugeProps {
  value: string | number
  label: string
  percent: number // 0 to 1
  color: string
}

const CircularGauge: React.FC<CircularGaugeProps> = ({ value, label, percent, color }) => {
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - percent)

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-5 bg-[rgba(8,8,12,0.85)] backdrop-blur-md border border-white/[0.06] rounded-xl relative group hover:border-[rgba(0,212,255,0.25)] hover:bg-[rgba(0,212,255,0.02)] hover:shadow-[0_12px_30px_rgba(0,212,255,0.05)] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Tech Corner Brackets */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/10 group-hover:border-[var(--accent-primary)] transition-colors" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/10 group-hover:border-[var(--accent-primary)] transition-colors" />

      {/* Radial Meter */}
      <div className="relative w-24 h-24">
        {/* Guide Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-white/[0.03] fill-none"
            strokeWidth="3.5"
          />
          {/* Progress Arc */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="fill-none transition-all duration-1000 ease-out"
            stroke={color}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 5px ${color})`
            }}
          />
        </svg>

        {/* Value Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headings font-extrabold text-xl text-[var(--text-primary)] leading-none">
            {value}
          </span>
        </div>
      </div>

      <span className="font-mono text-[9px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] tracking-wider uppercase text-center transition-colors">
        {label}
      </span>
    </div>
  )
}

export const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"bio" | "experience" | "methodology">("bio")

  const principles = [
    {
      title: "Autonomous First",
      desc: "Architecting agentic loops that execute planning, tool-use, and self-correction without constant human intervention."
    },
    {
      title: "Production Ready",
      desc: "Optimizing memory footprints, latency paths, and cache layers for robust, low-overhead deployments."
    },
    {
      title: "Systems Thinker",
      desc: "Viewing RAG and AI components as holistic network architectures rather than disconnected API endpoints."
    }
  ]

  const tabContent = {
    bio: [
      "I am Pavan Kumar Kunukuntla, a final-year Computer Science and Engineering student in the 6-Year Integrated B.Tech program (2021 – 2027) at Rajiv Gandhi University of Knowledge Technologies (RGUKT) Basar, India.",
      "My passion lies at the intersection of system architecture and intelligence. I design software that bridges the gap between static databases and adaptive, planning-first agentic reasoning loops."
    ],
    experience: [
      "During my work at Microsoft Elevate, I gained hands-on experience with enterprise-grade cloud workflows, schema scaling, and data normalization loops.",
      "At Infosys Springboard, I designed high-throughput LLM ingestion pipelines, reducing vector retrieval latency and implementing automated calibration structures."
    ],
    methodology: [
      "I approach AI engineering from a systems perspective. I do not simply chain API endpoints. I benchmark similarity search thresholds, optimize cache hits, restrict RAM footprints, and build self-healing loops to establish predictable agent flows."
    ]
  }

  return (
    <section
      id="about"
      data-section="about"
      className="max-w-[1200px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 scroll-mt-20"
    >
      {/* Section Header */}
      <div className="space-y-4 mb-[60px] select-none">
        <TypewriterLabel text="01 / ABOUT" />
        <h2 className="font-headings font-extrabold text-[48px] text-[var(--text-primary)] leading-[1.1]">
          About Me
        </h2>
        <div className="w-full h-[1px] bg-[var(--border)] mt-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Columns (Tabbed Narrative Panel & JSON Specs) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Dashboard Tab Bar */}
          <div className="flex flex-col sm:flex-row border-b border-white/[0.04] p-1 gap-2 bg-white/[0.01] rounded-lg">
            {(["bio", "experience", "methodology"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 px-4 rounded-md font-mono text-[11px] tracking-wider uppercase transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.25)] text-[var(--accent-primary)] shadow-[0_0_10px_rgba(0,212,255,0.05)]"
                    : "border border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.02]"
                }`}
              >
                {tab === "bio" ? "01_BIO" : tab === "experience" ? "02_EXPERIENCE" : "03_METHODOLOGY"}
              </button>
            ))}
          </div>

          {/* Active Tab Narrative Content */}
          <div className="font-body text-base text-[var(--text-secondary)] leading-[1.85] space-y-5 min-h-[160px] p-6 bg-[rgba(8,8,12,0.85)] backdrop-blur-md border border-white/[0.06] rounded-xl relative shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/15" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/15" />
            {tabContent[activeTab].map((p, index) => (
              <p key={index}>{p}</p>
            ))}
          </div>

          {/* IDE Style Technical Readout Terminal */}
          <div className="bg-[rgba(8,8,12,0.85)] backdrop-blur-md border border-white/[0.06] rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.7)] relative">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0a14]/90 border-b border-white/[0.06]">
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-widest uppercase">
                diagnostic_spec.json
              </span>
              <div className="w-12" />
            </div>
            {/* Code Body */}
            <pre className="p-6 font-mono text-[11px] text-[var(--text-secondary)] overflow-x-auto leading-relaxed select-text bg-[#030307]/50">
              <code>
                <span className="text-white/30">{`{`}</span>{`\n`}
                <span className="text-[var(--accent-secondary)] pl-4">"agent_profile"</span><span className="text-white/30">:</span> <span className="text-white/30">{`{`}</span>{`\n`}
                <span className="text-[var(--accent-primary)] pl-8">"name"</span><span className="text-white/30">:</span> <span className="text-[var(--text-primary)]">"Pavan Kumar"</span><span className="text-white/30">,</span>{`\n`}
                <span className="text-[var(--accent-primary)] pl-8">"academic"</span><span className="text-white/30">:</span> <span className="text-[var(--text-primary)]">"RGUKT Basar (B.Tech CSE)"</span><span className="text-white/30">,</span>{`\n`}
                <span className="text-[var(--accent-primary)] pl-8">"specialization"</span><span className="text-white/30">:</span> <span className="text-[var(--text-primary)]">"Agentic AI / Hybrid RAG"</span>{`\n`}
                <span className="text-white/30 pl-4">{`},`}</span>{`\n`}
                <span className="text-[var(--accent-secondary)] pl-4">"core_benchmarks"</span><span className="text-white/30">:</span> <span className="text-white/30">{`{`}</span>{`\n`}
                <span className="text-[var(--accent-primary)] pl-8">"vector_search"</span><span className="text-white/30">:</span> <span className="text-[var(--text-primary)]">"Local Cosine Matcher"</span><span className="text-white/30">,</span>{`\n`}
                <span className="text-[var(--accent-primary)] pl-8">"synthesis"</span><span className="text-white/30">:</span> <span className="text-[var(--text-primary)]">"Deepgram + WebSpeech Fallback"</span><span className="text-white/30">,</span>{`\n`}
                <span className="text-[var(--accent-primary)] pl-8">"concurrency"</span><span className="text-white/30">:</span> <span className="text-[var(--text-primary)]">"Double-Handshake Prevention"</span>{`\n`}
                <span className="text-white/30 pl-4">{`}`}</span>{`\n`}
                <span className="text-white/30">{`}`}</span>
              </code>
            </pre>
          </div>
        </div>

        {/* Right Columns (Circular Progress Dials Grid) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4 select-none lg:pt-2">
          <CircularGauge
            value="8.93"
            label="CGPA Maintained"
            percent={0.893}
            color="var(--accent-primary)"
          />
          <CircularGauge
            value="5+"
            label="Projects Built"
            percent={0.714} // 5 out of 7 scale
            color="var(--accent-secondary)"
          />
          <CircularGauge
            value="2"
            label="Internships Completed"
            percent={0.667} // 2 out of 3 scale
            color="var(--accent-green)"
          />
          <CircularGauge
            value="4"
            label="Hackathons Entered"
            percent={0.8} // 4 out of 5 scale
            color="var(--accent-secondary)"
          />
        </div>
      </div>

      {/* Horizontal Directives Grid below */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 select-none">
        {principles.map((pr, idx) => (
          <div 
            key={idx}
            className="p-6 bg-[rgba(8,8,12,0.85)] backdrop-blur-md border border-white/[0.06] rounded-xl relative group hover:border-[rgba(0,212,255,0.25)] hover:bg-[rgba(0,212,255,0.02)] hover:shadow-[0_12px_30px_rgba(0,212,255,0.05)] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            {/* Top-Right and Bottom-Left Bracket Overlays */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 group-hover:border-[var(--accent-primary)] transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 group-hover:border-[var(--accent-primary)] transition-colors" />
            
            <h4 className="font-headings font-bold text-sm text-[var(--text-primary)] mb-2 tracking-wide flex items-center gap-2">
              <span className="text-[var(--accent-primary)] text-[10px]">■</span> {pr.title}
            </h4>
            <p className="font-mono text-[10px] text-[var(--text-secondary)] leading-relaxed">
              {pr.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default About
