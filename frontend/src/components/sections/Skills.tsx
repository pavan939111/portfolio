import React from "react"
import { Bot, Eye, Brain, Server } from "lucide-react"

export const Skills: React.FC = () => {
  const categories = [
    {
      title: "Agentic AI & RAG",
      icon: <Bot className="text-[var(--accent-primary)]" size={24} />,
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
      icon: <Eye className="text-[var(--accent-primary)]" size={24} />,
      skills: [
        "CLIP",
        "BLIP",
        "EasyOCR",
        "SDXL",
        "BGE Reranker",
        "Multimodal Embeddings",
        "Vision-Language Models"
      ]
    },
    {
      title: "ML & NLP",
      icon: <Brain className="text-[var(--accent-primary)]" size={24} />,
      skills: [
        "TensorFlow",
        "Scikit-learn",
        "BiLSTM",
        "Llama 3",
        "Embeddings",
        "Semantic Similarity",
        "Fine-tuning"
      ]
    },
    {
      title: "Backend & DevOps",
      icon: <Server className="text-[var(--accent-primary)]" size={24} />,
      skills: [
        "FastAPI",
        "Django",
        "Flask",
        "Node.js",
        "PostgreSQL",
        "MongoDB",
        "Supabase",
        "Neo4j",
        "Redis",
        "Docker"
      ]
    }
  ]

  // Flat list of all skill names for the scrolling marquee
  const allSkills = [
    "LangGraph", "LangChain", "CrewAI", "AutoGen", "MCP", "Qdrant", "ChromaDB", "Pinecone",
    "FAISS", "CLIP", "BLIP", "EasyOCR", "SDXL", "BGE Reranker", "Llama 3", "TensorFlow",
    "FastAPI", "Django", "Node.js", "PostgreSQL", "Supabase", "Redis", "Docker", "Neo4j"
  ]

  // Double list to make it seamless
  const marqueeList1 = [...allSkills, ...allSkills]
  const marqueeList2 = [...allSkills].reverse().concat([...allSkills].reverse())

  return (
    <section
      id="skills"
      data-section="skills"
      className="section-container reveal scroll-mt-20"
    >
      <span className="section-label">02 / SKILLS</span>
      <h2 className="section-title mb-10 select-none">Technical Expertise</h2>

      {/* Grid structure: 3 cols desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="glass-card reveal flex flex-col justify-between space-y-4 hover:border-[var(--accent-primary)]/30 transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {cat.icon}
                <h3 className="font-headings font-bold text-[18px] text-[var(--text-primary)]">
                  {cat.title}
                </h3>
              </div>
            </div>

            {/* Pills wrap */}
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--border)]">
              {cat.skills.map((skill, j) => (
                <span
                  key={j}
                  className="px-2.5 py-1 rounded font-mono text-[11px] text-[var(--text-secondary)] select-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border)"
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Marquee Skills Banner */}
      <div className="marquee-section border-t border-b border-[var(--border)] pt-8 pb-8">
        {/* Row 1: Left scrolling */}
        <div className="marquee-row left select-none">
          {marqueeList1.map((skill, index) => (
            <span key={`left-${index}`} className="marquee-item">
              {skill}
            </span>
          ))}
        </div>

        {/* Row 2: Right scrolling */}
        <div className="marquee-row right select-none">
          {marqueeList2.map((skill, index) => (
            <span key={`right-${index}`} className="marquee-item">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
export default Skills
