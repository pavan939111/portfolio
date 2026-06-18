import React, { useState } from "react"
import { Bot, Eye, Brain, Server, Database, Layers, Cpu } from "lucide-react"
import { TypewriterLabel } from "../ui/TypewriterLabel"

// CDN Mapping for Skills Icons
const SKILL_ICONS: Record<string, string> = {
  "LangChain": "https://cdn.simpleicons.org/langchain/00f3ff",
  "CrewAI": "https://cdn.simpleicons.org/crewai/00f3ff",
  "Pinecone": "https://cdn.simpleicons.org/pinecone/00f3ff",
  "Qdrant": "https://cdn.simpleicons.org/qdrant/00f3ff",
  "ChromaDB": "https://cdn.simpleicons.org/chroma/00f3ff",
  
  "CLIP": "https://cdn.simpleicons.org/openai/00f3ff",
  "Stability AI SDXL": "https://cdn.simpleicons.org/stability/00f3ff",
  
  "TensorFlow": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  "Scikit-learn": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  "PyTorch": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  "Llama 3": "https://cdn.simpleicons.org/meta/00f3ff",
  "Hugging Face": "https://cdn.simpleicons.org/huggingface/00f3ff",
  "NumPy": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  "Pandas": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  
  "Python": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "FastAPI": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  "Django": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
  "Flask": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "TypeScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "React": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "PostgreSQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  "MongoDB": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  "Redis": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  "Neo4j": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original.svg",
  "Supabase": "https://cdn.simpleicons.org/supabase/00f3ff",
  "Docker": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  "Git": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  "Linux": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  "Vercel": "https://cdn.simpleicons.org/vercel/ffffff"
}

// Sub-component to render the specific skill logo / SVG fallback
const SkillIcon: React.FC<{ name: string; size: number; isError: boolean; onError: () => void }> = ({
  name,
  size,
  isError,
  onError
}) => {
  // SVG Graphic / Lucide Fallbacks
  if (name === "LangGraph") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.5" y1="10.5" x2="15.5" y2="6.5" />
        <line x1="8.5" y1="13.5" x2="15.5" y2="17.5" />
      </svg>
    )
  }

  if (name === "AutoGen") {
    return (
      <div 
        className="rounded-full flex items-center justify-center font-mono font-bold text-center border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shrink-0 select-none"
        style={{ width: `${size}px`, height: `${size}px`, fontSize: size === 16 ? "8px" : "14px" }}
      >
        A
      </div>
    )
  }

  if (name === "MCP") {
    return (
      <div 
        className="rounded flex items-center justify-center font-mono font-bold text-center border border-white/10 bg-white/5 text-[var(--text-secondary)] shrink-0 select-none"
        style={{ width: `${size}px`, height: `${size}px`, fontSize: size === 16 ? "6px" : "10px" }}
      >
        MCP
      </div>
    )
  }

  if (name === "RAG Pipelines") {
    return <Database size={size} className="text-[var(--accent-primary)] shrink-0" />
  }

  if (name === "FAISS") {
    return (
      <div 
        className="rounded-full flex items-center justify-center font-mono font-bold italic border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shrink-0 select-none"
        style={{ width: `${size}px`, height: `${size}px`, fontSize: size === 16 ? "8px" : "14px" }}
      >
        F
      </div>
    )
  }

  if (name === "BLIP") {
    return (
      <div 
        className="rounded flex items-center justify-center font-mono font-bold text-center border border-[rgba(0,164,228,0.3)] bg-[rgba(0,164,228,0.08)] text-[#00a4e4] shrink-0 select-none"
        style={{ width: `${size}px`, height: `${size}px`, fontSize: size === 16 ? "6px" : "10px" }}
      >
        BLIP
      </div>
    )
  }

  if (name === "EasyOCR" || name === "Vision Language Models" || name === "Vision-Language Models") {
    return <Eye size={size} className="text-[var(--accent-primary)] shrink-0" />
  }

  if (name === "BGE Reranker") {
    return <Layers size={size} className="text-[var(--accent-primary)] shrink-0" />
  }

  if (name === "Multimodal Embeddings") {
    return <Cpu size={size} className="text-[var(--accent-primary)] shrink-0" />
  }

  // Load CDN URL if defined
  const url = SKILL_ICONS[name]
  if (!url || isError) {
    const abbrev = name.substring(0, 2).toUpperCase()
    return (
      <div 
        className="rounded flex items-center justify-center font-mono font-bold text-center border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] shrink-0 select-none"
        style={{ width: `${size}px`, height: `${size}px`, fontSize: size === 16 ? "8px" : "13px" }}
      >
        {abbrev}
      </div>
    )
  }

  // Handle dark icon inversions (Django, Flask, Vercel)
  const shouldInvert = name === "Django" || name === "Flask" || name === "Vercel"

  return (
    <img
      src={url}
      alt={name}
      className={`shrink-0 object-contain ${shouldInvert ? "invert brightness-[2]" : ""}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      onError={onError}
    />
  )
}

// Reusable card for each individual skill logo
const SkillCard: React.FC<{ name: string }> = ({ name }) => {
  const [isError, setIsError] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="group relative overflow-visible flex flex-col items-center justify-center gap-2 w-[100px] h-[100px] bg-white/[0.02] border border-[var(--border)] rounded-xl p-3 cursor-default transition-all duration-300 hover:bg-[rgba(0,212,255,0.05)] hover:border-[rgba(0,212,255,0.35)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,212,255,0.12)]"
    >
      {/* Dynamic Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-md px-2 py-1 font-mono text-[10px] text-[var(--text-primary)] whitespace-nowrap z-10 pointer-events-none opacity-100 transition-opacity duration-150 shadow-lg">
          {name}
        </div>
      )}

      {/* Logo */}
      <SkillIcon 
        name={name} 
        size={36} 
        isError={isError} 
        onError={() => setIsError(true)} 
      />

      {/* Label */}
      <span className="font-mono text-[10px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-200">
        {name}
      </span>
    </div>
  )
}

// Reusable marquee item for the infinite scrolls
const MarqueeItem: React.FC<{ name: string }> = ({ name }) => {
  const [isError, setIsError] = useState(false)
  return (
    <span className="marquee-item flex items-center gap-2 hover:border-[var(--accent-primary)]/40 hover:text-[var(--text-primary)] transition-all">
      <SkillIcon 
        name={name} 
        size={16} 
        isError={isError} 
        onError={() => setIsError(true)} 
      />
      <span>{name}</span>
    </span>
  )
}

export const Skills: React.FC = () => {
  const categories = [
    {
      title: "Agentic AI & RAG",
      icon: <Bot className="text-[var(--accent-primary)]" size={20} />,
      skills: [
        "LangChain",
        "LangGraph",
        "CrewAI",
        "AutoGen",
        "MCP",
        "RAG Pipelines",
        "FAISS",
        "ChromaDB",
        "Pinecone",
        "Qdrant"
      ]
    },
    {
      title: "Multimodal AI",
      icon: <Eye className="text-[var(--accent-primary)]" size={20} />,
      skills: [
        "CLIP",
        "BLIP",
        "EasyOCR",
        "Stability AI SDXL",
        "BGE Reranker",
        "Multimodal Embeddings",
        "Vision Language Models"
      ]
    },
    {
      title: "ML & NLP",
      icon: <Brain className="text-[var(--accent-primary)]" size={20} />,
      skills: [
        "TensorFlow",
        "Scikit-learn",
        "PyTorch",
        "Llama 3",
        "Hugging Face",
        "NumPy",
        "Pandas"
      ]
    },
    {
      title: "Backend & DevOps",
      icon: <Server className="text-[var(--accent-primary)]" size={20} />,
      skills: [
        "Python",
        "FastAPI",
        "Django",
        "Flask",
        "Node.js",
        "TypeScript",
        "React",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Neo4j",
        "Supabase",
        "Docker",
        "Git",
        "Linux",
        "Vercel"
      ]
    }
  ]

  // Top scrolling text items
  const highlightSkills = [
    "LangChain", "LangGraph", "CrewAI", "RAG Pipelines", "FastAPI",
    "LangGraph", "Multi-Agent", "Vector Databases", "Supabase", "Python"
  ]

  // Bottom marquee items
  const allSkills = [
    "LangGraph", "LangChain", "CrewAI", "AutoGen", "MCP", "Qdrant", "ChromaDB", "Pinecone",
    "FAISS", "CLIP", "BLIP", "EasyOCR", "Stability AI SDXL", "BGE Reranker", "Llama 3", "TensorFlow",
    "FastAPI", "Django", "Node.js", "PostgreSQL", "Supabase", "Redis", "Docker", "Neo4j"
  ]

  const marqueeList1 = [...allSkills, ...allSkills]
  const marqueeList2 = [...allSkills].reverse().concat([...allSkills].reverse())

  return (
    <section
      id="skills"
      data-section="skills"
      className="section-container reveal scroll-mt-20"
    >
      {/* Redesigned Section Header Template */}
      <div className="space-y-4 mb-[60px] select-none">
        <TypewriterLabel text="02 / SKILLS" />
        <h2 className="font-headings font-extrabold text-[48px] text-[var(--text-primary)] leading-[1.1]">
          Technical Expertise
        </h2>
        <div className="w-full h-[1px] bg-[var(--border)] mt-6" />
      </div>

      {/* Top infinite scrolling text strip */}
      <div className="overflow-hidden border border-[var(--border)] py-3 px-4 mb-16 bg-white/[0.01] rounded-lg select-none">
        <div className="flex w-max gap-8 animate-[marqueeLeft_20s_linear_infinite] font-mono text-[12px] text-[var(--text-secondary)]">
          {/* Loop twice for seamless scrolling */}
          {[...highlightSkills, ...highlightSkills, ...highlightSkills].map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              <span>{item}</span>
              <span className="text-[var(--accent-primary)] font-bold">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Categories Grid (2 Columns Desktop, 1 Column Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="reveal flex flex-col justify-between p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl hover:border-[var(--border-accent)] transition-all duration-300 space-y-4"
          >
            <div className="flex items-center gap-3 select-none">
              {cat.icon}
              <h3 className="font-headings font-bold text-[17px] text-[var(--text-primary)] tracking-wide">
                {cat.title}
              </h3>
            </div>

            {/* Skill Logo Grid */}
            <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[var(--border)]">
              {cat.skills.map((skill, j) => (
                <SkillCard key={j} name={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Marquee Scrolling Banner */}
      <div className="marquee-section border-t border-b border-[var(--border)] pt-8 pb-8 bg-black select-none">
        {/* Row 1: Left scrolling */}
        <div className="marquee-row left select-none">
          {marqueeList1.map((skill, index) => (
            <MarqueeItem key={`left-${index}`} name={skill} />
          ))}
        </div>

        {/* Row 2: Right scrolling */}
        <div className="marquee-row right select-none">
          {marqueeList2.map((skill, index) => (
            <MarqueeItem key={`right-${index}`} name={skill} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
