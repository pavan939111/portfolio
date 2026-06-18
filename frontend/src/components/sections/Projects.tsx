import React, { useState } from "react"
import { ChevronDown, ExternalLink } from "lucide-react"
import { TypewriterLabel } from "../ui/TypewriterLabel"

interface ProjectDetail {
  id: string
  name: string
  typeBadge: string
  tags: string[]
  context: string
  approach: string
  techStack: string
  outcome: string
  link?: string
}

export const Projects: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>("failurerag")

  const projectsList: ProjectDetail[] = [
    {
      id: "failurerag",
      name: "FailureRAG",
      typeBadge: "Personal Project",
      tags: ["LangGraph", "9-Agent Loop", "Qdrant Vector", "Neo4j Graph", "Redis", "FastAPI"],
      context: "Standard RAG systems suffer from severe semantic drift, outdated knowledge dependencies, and uncalibrated answers, failing to recover when initial retrievals return irrelevant context blocks.",
      approach: "Designed a cyclic 9-agent orchestrator using LangGraph state-graphs. The engine runs queries through structured feedback loops: evaluating relevance, performing web-search pivots on failure, and dynamically correcting hallucinated claims.",
      techStack: "Python, FastAPI, LangGraph, Qdrant HNSW Index, Neo4j Graph queries, Redis cache, Voyage AI embeddings.",
      outcome: "Optimized retrieval pipelines to reduce RAM consumption by 93% (650MB to 42MB) via lazy-loaded JSON embeddings. Parallelized agent sub-queries using asyncio, cutting latency from 3.5s to 1.9s (45% latency reduction)."
    },
    {
      id: "nina",
      name: "Nina — Voice Navigation SDK",
      typeBadge: "Personal Project",
      tags: ["TypeScript SDK", "FastAPI Backend", "Llama 3.1", "Supabase DB", "Speech SDK"],
      context: "Modern voice search tools suffer from high roundtrip latency and are built as heavy overlays, rather than decoupled SDKs that developers can drop into web applications easily.",
      approach: "Built a headless TypeScript speech-input library that maps voice inputs to natural language queries. Integrated a FastAPI backend running a fast-path classifier to route matching navigation actions.",
      techStack: "TypeScript, Web Audio API, Python, FastAPI, Llama 3.1, Supabase DB logs, SHA-256 API key hashing.",
      outcome: "Lowered user friction, cutting total navigation interaction steps by 50% reduction. Handled 60% of common actions via a local fast-path classifier executing in under 5ms."
    },
    {
      id: "taxsetu",
      name: "TaxSetu — GST Compliance",
      typeBadge: "Hackathon — KSUM",
      tags: ["5-Agent System", "Tesseract OCR", "Firebase Store", "Gemini API", "MSME Hub"],
      context: "Indian MSME business owners face complex, manual GST calculation overheads, purchase-to-sale mismatch audits, and language barriers when filing monthly returns.",
      approach: "Formulated a 5-agent compliance system. Programmed OCR processors to extract invoice metadata, automatic audit engines to match supplier records, and a voice-first Hindi/English conversational search layer.",
      techStack: "Python, FastAPI, Tesseract OCR, Gemini API, Firebase Firestore, Web Speech synthesis.",
      outcome: "Reduced manual audit verification loops by 70% manual review reduction. Detected duplicate invoice anomalies and missing supplier records automatically, preventing incorrect filing penalties."
    },
    {
      id: "visionsync",
      name: "VisionSync — Film Storyboarding",
      typeBadge: "6th Place — CineAI",
      tags: ["Gemini Vision", "SDXL Storyboard", "5-Stage pipeline", "React UI"],
      context: "Film pre-production storyboard verification, continuity checks, and screenplay breakdowns are historically manual processes taking weeks of collaborative review.",
      approach: "Developed a 5-stage screenplay breakdown pipeline. Used Gemini Vision to cross-check camera angles and Stable Diffusion (SDXL) to automatically render storyboard frames matching visual descriptions.",
      techStack: "React, FastAPI, Gemini Vision API, Stable Diffusion SDXL, local vector storage.",
      outcome: "Won 6th Place at CineAI Hackathon (T-Works Hyderabad). Shrank pre-production visual storyboard review cycles by 60% storyboard review reduction, automating screenplay scene breakdowns from days into minutes."
    },
    {
      id: "livestock",
      name: "AI Livestock Health Assistant",
      typeBadge: "Academic Project",
      tags: ["CLIP Multimodal", "ChromaDB", "BGE Reranker", "Llama 3", "BM25 Search"],
      context: "Rural agricultural nodes lack immediate access to specialist veterinary diagnoses, requiring low-latency diagnostic RAG systems capable of parsing complex image symptoms.",
      approach: "Constructed a hybrid retrieval pipeline. Integrated OpenAI CLIP to encode visual symptoms and symptoms text. Fused HNSW vector search with BM25 keyword matching and a BGE Reranker layer.",
      techStack: "Python, CLIP, ChromaDB, BGE Reranker, Llama 3, BM25 Keyword Search.",
      outcome: "Built a highly reliable multimodal diagnostic system. Enforced strict medical guardrails preventing generic LLM hallucinations and returning confidence scores based on reference symptom cases."
    }
  ]

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Get dynamic coloring for project type badges
  const getBadgeStyle = (badgeText: string) => {
    const text = badgeText.toLowerCase()
    if (text.includes("hackathon") || text.includes("place") || text.includes("cineai")) {
      return {
        bg: "rgba(123, 97, 255, 0.08)",
        border: "rgba(123, 97, 255, 0.25)",
        text: "var(--accent-secondary)"
      }
    } else if (text.includes("academic") || text.includes("internship")) {
      return {
        bg: "rgba(0, 255, 136, 0.08)",
        border: "rgba(0, 255, 136, 0.2)",
        text: "var(--accent-tertiary)"
      }
    } else {
      return {
        bg: "rgba(0, 212, 255, 0.08)",
        border: "var(--border-accent)",
        text: "var(--accent-primary)"
      }
    }
  }

  return (
    <section
      id="projects"
      data-section="projects"
      className="max-w-[1200px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 scroll-mt-20"
    >
      {/* Redesigned Section Header Template */}
      <div className="space-y-4 mb-[60px] select-none">
        <TypewriterLabel text="03 / PROJECTS" />
        <h2 className="font-headings font-extrabold text-[48px] text-[var(--text-primary)] leading-[1.1]">
          What I've Built
        </h2>
        <div className="w-full h-[1px] bg-[var(--border)] mt-6" />
      </div>

      {/* Accordion Card List Layout */}
      <div className="flex flex-col gap-4">
        {projectsList.map((proj) => {
          const isExpanded = expandedId === proj.id
          const badge = getBadgeStyle(proj.typeBadge)

          return (
            <div
              key={proj.id}
              id={`project-${proj.id}`}
              className={`border rounded-xl p-6 transition-all duration-300 ${
                isExpanded
                  ? "bg-[var(--bg-secondary)] border-[rgba(0,212,255,0.18)] shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
                  : "bg-white/[0.01] border-white/[0.03] hover:bg-[rgba(0,212,255,0.02)] hover:border-white/[0.08]"
              }`}
            >
              {/* Header Clickable Row */}
              <div
                onClick={() => toggleExpand(proj.id)}
                className="flex items-center justify-between cursor-pointer select-none group"
              >
                {/* Left Side: Title, Badge & Tags summary */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 flex-grow mr-4">
                  <h3 className="font-headings font-bold text-[19px] text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {proj.name}
                  </h3>

                  {/* Dynamic Badge */}
                  <span
                    className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded border self-start md:self-auto transition-colors"
                    style={{
                      backgroundColor: badge.bg,
                      borderColor: badge.border,
                      color: badge.text
                    }}
                  >
                    {proj.typeBadge}
                  </span>

                  {/* Collapsed Tags Summary */}
                  <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)]">
                    {proj.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx}>
                        {tag}{idx < 2 ? "  /" : ""}
                      </span>
                    ))}
                    {proj.tags.length > 3 && <span>+ {proj.tags.length - 3} more</span>}
                  </div>
                </div>

                {/* Right Side: Arrow and Link Indicators */}
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <ChevronDown
                    size={18}
                    className={`transform transition-transform duration-300 ${
                      isExpanded ? "rotate-180 text-[var(--accent-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                    }`}
                  />
                </div>
              </div>

              {/* Collapsible Details Panel */}
              <div
                className="transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isExpanded ? "800px" : "0px",
                  opacity: isExpanded ? 1 : 0,
                  overflow: "hidden",
                  marginTop: isExpanded ? "16px" : "0px",
                  paddingTop: isExpanded ? "16px" : "0px",
                  borderTop: isExpanded ? "1px dashed rgba(255,255,255,0.06)" : "none"
                }}
              >
                {/* Technical Specs 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {/* Context Block */}
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-[3px] block">
                      CONTEXT
                    </span>
                    <p className="font-body text-[13px] text-[var(--text-secondary)] leading-relaxed">
                      {proj.context}
                    </p>
                  </div>

                  {/* Approach Block */}
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-[3px] block">
                      APPROACH
                    </span>
                    <p className="font-body text-[13px] text-[var(--text-secondary)] leading-relaxed">
                      {proj.approach}
                    </p>
                  </div>

                  {/* Tech Stack Block */}
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-[3px] block">
                      TECH STACK
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded font-mono text-[9px] text-[var(--text-primary)] border border-white/[0.05] bg-white/[0.01]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Outcome Block */}
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-[3px] block">
                      OUTCOME
                    </span>
                    <p className="font-body text-[13px] text-[var(--text-secondary)] leading-relaxed">
                      {proj.outcome.split(/(45% latency reduction|93% RAM footprint reduction|3.5s to 1.9s|50% reduction|5ms|60%|70% manual review reduction|60% storyboard review reduction)/g).map((part, i) => {
                        const isMatch = [
                          "45% latency reduction", "93% RAM footprint reduction", "3.5s to 1.9s",
                          "50% reduction", "5ms", "60%", "70% manual review reduction", "60% storyboard review reduction"
                        ].includes(part)
                        return isMatch ? (
                          <span key={i} className="text-[var(--accent-primary)] font-bold">{part}</span>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Projects
