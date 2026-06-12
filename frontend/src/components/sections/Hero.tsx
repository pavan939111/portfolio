import React from "react"
import { Cpu, ArrowDown } from "lucide-react"

interface HeroProps {
  onExploreClick: () => void
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section id="intro" className="section-container relative flex flex-col justify-center min-h-screen">
      <div className="space-y-6 max-w-3xl">
        {/* Decorative Badge */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-accent-primary tracking-widest uppercase border border-accent-primary/20 bg-accent-primary/5 rounded-full px-3.5 py-1 w-max select-none">
          <Cpu size={12} className="animate-pulse" />
          <span>Agentic AI & RAG Specialist</span>
        </div>

        {/* Hero Headings */}
        <div className="space-y-3">
          <span className="font-mono text-sm text-text-secondary select-none">Hello World. I'm</span>
          <h1 className="section-title text-6xl md:text-8xl tracking-tight leading-none select-none">
            PAVAN KUMAR
            <span className="block text-accent-primary">KUNUKUNTLA</span>
          </h1>
        </div>

        {/* Role / Description */}
        <p className="font-body text-base md:text-lg text-text-secondary max-w-xl leading-relaxed">
          I build autonomous software systems that think, plan, and orchestrate complex workflows. 
          Currently exploring multi-agent architectures, self-healing RAG engines, and speech-interactive interfaces.
        </p>

        {/* Terminal Quick Details */}
        <div className="bg-bg-secondary border border-border rounded-lg p-4 font-mono text-xs text-text-muted space-y-1 max-w-lg shadow-xl select-none">
          <div className="flex items-center gap-2 text-accent-green">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-ping" />
            <span>sys: status_active_online</span>
          </div>
          <div>loc: basar, telangana, india</div>
          <div>edu: final year cse @ rgukt basar</div>
        </div>

        {/* CTA */}
        <div className="pt-6">
          <button
            onClick={onExploreClick}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-bg-primary bg-accent-primary hover:bg-accent-secondary px-6 py-3.5 rounded-lg font-bold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-accent-primary/20"
          >
            <span>Explore Console</span>
            <ArrowDown size={14} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  )
}
