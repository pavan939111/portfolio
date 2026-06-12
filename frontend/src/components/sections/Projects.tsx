import React, { useState } from "react"
import { Award, Cpu, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react"

export const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All")

  const tabs = ["All", "RAG", "Agents", "Multimodal", "Voice", "Hackathon"]

  const projectsList = [
    {
      id: "failurerag",
      name: "FailureRAG",
      subtitle: "Self-Learning & Self-Healing RAG",
      featured: true,
      tags: ["LangGraph", "9-Agent", "Qdrant", "Neo4j", "Redis", "FastAPI"],
      categories: ["RAG", "Agents"],
      highlights: [
        "45% latency reduction (3.5s → 1.9s) via asyncio parallelization",
        "93% RAM reduction (650MB → 42MB) using lazy-loaded embeddings",
        "9-agent StateGraph engine with type-safe state tracking and cyclic retry loops"
      ],
      badge: "Most Complex",
      icon: <ShieldAlert className="text-[var(--accent-primary)] animate-pulse" size={20} />
    },
    {
      id: "nina",
      name: "Nina — Voice Navigation SDK",
      subtitle: "AI Voice Navigation SDK",
      featured: false,
      tags: ["TypeScript SDK", "FastAPI", "Llama 3.1", "Supabase"],
      categories: ["Voice"],
      highlights: [
        "50% reduction in user interaction steps using voice commands",
        "~5ms fast-path inference handling 60% of common actions",
        "Multi-tenant SaaS architecture with SHA-256 API key hashing"
      ],
      icon: <Cpu className="text-[var(--accent-primary)]" size={20} />
    },
    {
      id: "taxsetu",
      name: "TaxSetu",
      subtitle: "Multi-Agent GST Compliance",
      featured: false,
      tags: ["5-Agent", "OCR", "Firebase", "Gemini API"],
      categories: ["Agents", "Voice", "Hackathon", "Multimodal"],
      highlights: [
        "70% manual review reduction via structured reconciliations",
        "Multilingual voice-first accessibility layer for Indian MSMEs",
        "LLM-assisted anomaly detection flagging duplicate invoices"
      ],
      badge: "Hackathon — KSUM",
      icon: <Award className="text-[var(--accent-primary)]" size={20} />
    },
    {
      id: "visionsync",
      name: "VisionSync",
      subtitle: "Agentic Film Pre-Production",
      featured: false,
      tags: ["Gemini Vision", "SDXL", "5-Stage Pipeline", "React"],
      categories: ["Agents", "Multimodal", "Hackathon"],
      highlights: [
        "60% storyboard review reduction using visual continuity validation",
        "Days → Minutes screenplay-to-production breakdown turnaround",
        "Generates storyboard visuals directly from screenplay script text"
      ],
      badge: "6th Place — CineAI",
      icon: <Sparkles className="text-[var(--accent-primary)]" size={20} />
    },
    {
      id: "livestock",
      name: "AI Livestock Health Assistant",
      subtitle: "Multimodal RAG System",
      featured: false,
      tags: ["CLIP", "ChromaDB", "BGE Reranker", "Llama 3", "BM25"],
      categories: ["RAG", "Multimodal"],
      highlights: [
        "Hybrid HNSW + BM25 retrieval pipeline with metadata filtering",
        "Confidence scoring combining image similarity and symptoms",
        "Medical guardrails enforcing veterinarian safety parameters"
      ],
      icon: <CheckCircle2 className="text-[var(--accent-primary)]" size={20} />
    }
  ]

  // Filter project entries dynamically
  const filteredProjects = projectsList.filter(proj => {
    if (activeTab === "All") return true
    return proj.categories.includes(activeTab)
  })

  return (
    <section
      id="projects"
      data-section="projects"
      className="section-container reveal scroll-mt-20"
    >
      <span className="section-label">03 / PROJECTS</span>
      <h2 className="section-title mb-10 select-none">What I've Built</h2>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-10 select-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-[var(--accent-primary)] text-black font-semibold shadow-md shadow-[var(--accent-primary)]/10"
                  : "bg-[rgba(255,255,255,0.03)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          )
        })}
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map(proj => (
          <div
            key={proj.id}
            className={`glass-card reveal flex flex-col justify-between hover:border-[var(--accent-primary)]/30 transition-all duration-300 group ${
              proj.featured ? "md:col-span-2" : ""
            }`}
          >
            <div className="space-y-4">
              {/* Header and badge row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[rgba(255,122,0,0.05)] border border-[rgba(255,122,0,0.1)] group-hover:bg-[rgba(255,122,0,0.1)] transition-colors">
                    {proj.icon}
                  </div>
                  <div>
                    <h3 className="font-headings font-bold text-[17px] text-[var(--text-primary)] group-hover:text-[var(--accent-secondary)] transition-colors leading-tight">
                      {proj.name}
                    </h3>
                    {proj.subtitle && (
                      <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-wider block mt-0.5">
                        {proj.subtitle.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {proj.badge && (
                  <span
                    className="px-2.5 py-1 rounded font-mono text-[9px] font-bold uppercase tracking-wider text-black"
                    style={{ backgroundColor: "var(--accent-primary)" }}
                  >
                    {proj.badge}
                  </span>
                )}
              </div>

              {/* Bullet Highlights */}
              <ul className="space-y-2.5 font-body text-xs text-[var(--text-secondary)] pl-1.5 leading-relaxed pt-2">
                {proj.highlights.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] mt-1.5 shrink-0 animate-pulse" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Tags Row */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border)] mt-5">
              {proj.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded font-mono text-[10px] text-[var(--text-muted)]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)"
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
export default Projects
