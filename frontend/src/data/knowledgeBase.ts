export interface KnowledgeChunk {
  section: string;
  title: string;
  content: string;
  metadata: {
    tags: string[];
  };
}

export const knowledgeBase: KnowledgeChunk[] = [

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ABOUT SECTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    section: "about",
    title: "Personal Introduction",
    content: `Pavan Kumar Kunukuntla is an AI Engineer with hands-on experience building LLM-powered applications, Retrieval-Augmented Generation (RAG) systems, multi-agent workflows, and scalable AI backends. He is currently a final year B.Tech student (4th Year) at Rajiv Gandhi University of Knowledge Technologies (RGUKT), Basar, pursuing Computer Science & Engineering in a 6-Year Integrated program. He is based in Basar, Telangana, India.`,
    metadata: {
      tags: ["about", "intro", "pavan", "who", "background"]
    }
  },
  {
    section: "about",
    title: "Professional Summary & Passion",
    content: `Pavan is passionate about transforming cutting-edge AI research into practical, high-impact products. He continuously explores agentic AI, fine-tuning, and autonomous systems. He is proficient in Python, FastAPI, LangChain, LangGraph, vector databases, and modern AI frameworks. He has developed end-to-end solutions for semantic search, conversational AI, knowledge extraction, and multimodal systems integrating language, vision, and speech models. His strong foundation covers machine learning, data processing, model evaluation, and production AI system design. He is eager to contribute to innovative teams building reliable, scalable, and impactful AI solutions.`,
    metadata: {
      tags: ["about", "passion", "summary", "goals", "mission", "interest"]
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SKILLS SECTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    section: "skills",
    title: "Agentic AI & RAG Frameworks",
    content: `Pavan's core expertise is in Agentic AI. He specializes in Multi-Agent Orchestration, RAG Pipelines, LangChain, LangGraph, CrewAI, AutoGen, and MCP (Model Context Protocol). He works extensively with Vector Databases including FAISS, ChromaDB, Pinecone, and Qdrant. He has built retrieval memory systems and complex multi-agent state machines using LangGraph's StateGraph.`,
    metadata: {
      tags: ["skills", "agentic", "rag", "langchain", "langgraph", "crewai", "autogen", "mcp", "vector", "faiss", "chromadb", "pinecone", "qdrant"]
    }
  },
  {
    section: "skills",
    title: "Multimodal AI & Vision",
    content: `Pavan has strong expertise in Multimodal AI systems. He works with Vision-Language Models, CLIP, BLIP, EasyOCR, and Stability AI SDXL for image generation. He implements Multimodal Embeddings and uses BGE Reranker and Cross-Encoder Rerankers to improve retrieval quality in RAG systems. He has built systems that fuse visual and text embeddings for improved accuracy.`,
    metadata: {
      tags: ["skills", "multimodal", "vision", "clip", "blip", "ocr", "sdxl", "reranker", "bge", "image", "visual"]
    }
  },
  {
    section: "skills",
    title: "Machine Learning, NLP & Deep Learning",
    content: `Pavan is skilled in Machine Learning and NLP with experience in TensorFlow, Scikit-learn, BiLSTM, Llama 3, Embeddings, and Semantic Similarity. He has worked on Model Evaluation, SLM Fine-tuning, and Reinforcement Learning concepts. His NLP work includes semantic search, text classification, and knowledge extraction from unstructured data.`,
    metadata: {
      tags: ["skills", "machine learning", "nlp", "deep learning", "tensorflow", "scikit", "llama", "fine-tuning", "embeddings", "ml"]
    }
  },
  {
    section: "skills",
    title: "Backend, Data Engineering & DevOps",
    content: `Pavan builds production-grade backends using Django, Flask, FastAPI, and Node.js. He designs REST APIs with JWT Authentication and uses Celery for async task processing and SSE for streaming. His database expertise spans PostgreSQL, MySQL, MongoDB, Firestore, Supabase, Neo4j, and Redis. He is proficient in ETL Pipelines, SQL optimization, and schema design. For DevOps he uses Git, Docker, Vercel, Firebase, and Linux. He codes in Python, Java, TypeScript, and JavaScript.`,
    metadata: {
      tags: ["skills", "backend", "fastapi", "django", "flask", "nodejs", "postgresql", "mongodb", "supabase", "redis", "neo4j", "docker", "devops", "python", "typescript"]
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PROJECTS SECTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    section: "projects",
    title: "AI-Powered Livestock Health Assistant — Multimodal RAG System",
    content: `Pavan designed a multimodal AI system for livestock disease detection using combined image and symptom inputs across cattle, goats, sheep, and buffalo. He implemented Multimodal RAG by fusing CLIP visual embeddings with text embeddings to improve diagnostic accuracy over unimodal baselines. He built a hybrid retrieval pipeline integrating HNSW vector search (ChromaDB) and BM25 keyword search with metadata filtering. Applied cross-encoder reranking (BGE Reranker) to refine top-k results. Developed a confidence scoring system combining image similarity, text similarity, and symptom matching. Integrated LLM reasoning using Llama 3 locally with Gemini as fallback, with medical guardrails for veterinary safety. Tech Stack: Python, FastAPI, ChromaDB, CLIP, BM25, BGE Reranker, Llama 3, Gemini API, Streamlit.`,
    metadata: {
      tags: ["projects", "livestock", "multimodal", "rag", "clip", "chromadb", "llama", "gemini", "healthcare", "vision"]
    }
  },
  {
    section: "projects",
    title: "TaxSetu — Multi-Agent GST Compliance Platform",
    content: `TaxSetu is a multi-agent GST compliance platform built for India, submitted at KSUM Build For India hackathon in February 2026. Pavan engineered a 5-agent architecture covering OCR ingestion, GST computation, ITC reconciliation, compliance validation, and anomaly detection — cutting manual review effort by 70%. He orchestrated inter-agent communication via structured JSON outputs with decision, reasoning, confidence, and notify flags for audit-ready workflows. Built a multimodal ingestion pipeline handling scanned invoices, CSV/Excel uploads, and voice transcripts with automated GSTIN validation. Delivered LLM-assisted anomaly detection flagging duplicate invoices and ITC mismatches. Launched multilingual voice-first accessibility layer for the 88% of Indian MSMEs underserved by English-only platforms. Tech Stack: React, Vite, Tailwind CSS, Firebase, Gemini API, Node.js, Cloud Functions.`,
    metadata: {
      tags: ["projects", "taxsetu", "gst", "multi-agent", "compliance", "india", "msme", "voice", "ocr", "hackathon", "ksum"]
    }
  },
  {
    section: "projects",
    title: "VisionSync — Agentic Film Pre-Production Platform",
    content: `VisionSync is an agentic film pre-production platform that won 6th place at the CineAI Hackathon at T-Works Hyderabad in January 2026. Pavan architected a 5-stage agent pipeline for screenplay analysis covering story structure, genre classification, character arcs, and visual continuity validation. Used vision-language models to evaluate scene-level continuity, reducing manual storyboard review by 60%. Produced structured production breakdowns with shot lists, scene metadata, and character maps. Introduced production feasibility scoring for budget and scheduling. Embedded Stability AI SDXL to generate storyboard visuals directly from screenplay text. Reduced screenplay-to-production turnaround from days to minutes. Tech Stack: React, TypeScript, Express, Firestore, Gemini Vision, Stability AI SDXL.`,
    metadata: {
      tags: ["projects", "visionsync", "film", "pre-production", "agents", "screenplay", "sdxl", "vision", "hackathon", "cineai"]
    }
  },
  {
    section: "projects",
    title: "Nina — AI Voice Navigation SDK",
    content: `Nina is an AI Voice Navigation SDK built in 2025. Pavan shipped a single script-tag voice SDK enabling natural-language navigation across any web application, reducing user interaction steps by 50%. Devised a hybrid inference pipeline: a deterministic fast-path (~5ms) handles 60% of queries while Llama 3.1 resolves ambiguous multi-step commands. Enabled multi-step command execution with contextual memory, task chaining, and session-aware navigation across 4+ web platforms. Deployed multi-tenant SaaS architecture with SHA-256 API key hashing, Row Level Security, and Supabase Realtime live dashboard. Incorporated DOM-aware navigation for dynamic UI interaction including form filling and page routing. Tech Stack: TypeScript SDK, FastAPI, Groq API (Llama 3.1), Supabase.`,
    metadata: {
      tags: ["projects", "nina", "voice", "sdk", "navigation", "llama", "supabase", "saas", "typescript", "groq"]
    }
  },
  {
    section: "projects",
    title: "FailureRAG — Self-Learning & Self-Healing RAG System",
    content: `FailureRAG is a self-learning and self-healing RAG system. Pavan built a 9-agent LangGraph StateGraph engine with type-safe state tracking and cyclic retry loops for autonomous error recovery. Designed pre-generation quality gates scoring retrieved evidence on Relevance, Completeness, Freshness, Calibration, and Contradiction before token generation. Automated root-cause failure diagnosis with real-time query reformulation and live PubMed fetches. Integrated Qdrant for hybrid dense/sparse search, Neo4j for citation graph traversal, Redis for SimHash cache, and Supabase for telemetry. Built Celery workers for async database repair with staging validation. Parallelized hot-path calls via asyncio.gather, cutting streaming latency 45% from 3.5s to 1.9s. Reduced cold-start RAM 93% from 650MB to 42MB. Tech Stack: Python, FastAPI, LangGraph, Qdrant, Neo4j AuraDB, Redis, Supabase, Gemini 2.0 Flash, Celery.`,
    metadata: {
      tags: ["projects", "failurerag", "rag", "self-healing", "langgraph", "qdrant", "neo4j", "redis", "celery", "agents", "autonomous"]
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // EXPERIENCE SECTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    section: "experience",
    title: "AI & Data Pipeline Intern — Microsoft Elevate",
    content: `Pavan interned as an AI & Data Pipeline Intern at Microsoft Elevate from December 2025 to January 2026. He formulated an end-to-end data ingestion pipeline for healthcare datasets covering structured records and semi-structured sources, supporting 5+ downstream analytics workflows. Conducted preprocessing, feature extraction, and normalization across 10+ dataset variants. Established an embedding-based semantic analytics layer enabling similarity search and pattern discovery, reducing manual data exploration time by 35%. Systematized batch data transformation for scheduled cleaning and indexing across large-scale datasets. Optimized query execution reducing pipeline latency by 40%.`,
    metadata: {
      tags: ["experience", "microsoft", "internship", "data pipeline", "healthcare", "embeddings", "work", "job"]
    }
  },
  {
    section: "experience",
    title: "Python Full Stack Intern — Infosys Springboard",
    content: `Pavan interned as a Python Full Stack Intern at Infosys Springboard from November 2025 to January 2026. He rolled out a Django full-stack application with 20+ REST API endpoints and PostgreSQL backend for enterprise workflow automation. Planned a normalised database schema across 8+ tables optimized for analytics and reporting. Enforced role-based access control across 3 user tiers with structured approval workflow management. Instituted an audit logging system tracking all user activity. Ensured data consistency via multi-layer validation covering input sanitization, business rules, and transaction integrity. Reduced manual processing by 30% through expanded API coverage.`,
    metadata: {
      tags: ["experience", "infosys", "internship", "django", "fullstack", "postgresql", "backend", "work", "job"]
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // EDUCATION SECTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    section: "education",
    title: "B.Tech Computer Science — RGUKT Basar",
    content: `Pavan is pursuing a B.Tech (6-Year Integrated) in Computer Science & Engineering at Rajiv Gandhi University of Knowledge Technologies (RGUKT), Basar from 2021 to 2027. He is currently in his Final Year (4th Year B.Tech). He achieved a PUC CGPA of 9.50 and a B.Tech CGPA of 8.93 up to 3rd Year. RGUKT is a premier institution in Telangana, India focused on engineering and technology education.`,
    metadata: {
      tags: ["education", "btech", "rgukt", "basar", "computer science", "university", "degree", "cgpa", "student"]
    }
  },
  {
    section: "education",
    title: "Certifications",
    content: `Pavan holds the following professional certifications: IBM RAG & Agentic AI Professional Certificate from IBM on Coursera. Machine Learning Specialization from DeepLearning.AI on Coursera. Deep Learning Specialization from DeepLearning.AI on Coursera. These certifications demonstrate his strong theoretical and practical foundation in modern AI, RAG systems, and deep learning.`,
    metadata: {
      tags: ["education", "certifications", "ibm", "deeplearning", "coursera", "rag", "machine learning", "certificates"]
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACHIEVEMENTS SECTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    section: "achievements",
    title: "Hackathon Wins & Competitions",
    content: `Pavan has an impressive hackathon track record. He won the Smart India Hackathon Internal round at RGUKT Basar in 2025. He secured 6th Place at the CineAI Hackathon organized by Lorven AI at T-Works Hyderabad in January 2026, where he built VisionSync. He participated in Build For India organized by KSUM in Kochi, Kerala in February 2026, where he built TaxSetu. He also participated in the TuteDude Hackathon online in 2025.`,
    metadata: {
      tags: ["achievements", "hackathon", "awards", "competitions", "winner", "smart india", "cineai", "ksum", "tworks"]
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CONTACT SECTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    section: "contact",
    title: "Contact Information",
    content: `Pavan Kumar Kunukuntla can be reached at his email: pavankumarkunukuntla@gmail.com. His phone number is +91 9391118474. He is active on LinkedIn and GitHub. He is based in Basar, Telangana, India. He is open to exciting AI engineering opportunities, collaborations, freelance projects, and internships. The best way to reach him is via email or LinkedIn.`,
    metadata: {
      tags: ["contact", "email", "phone", "linkedin", "github", "reach", "connect", "location"]
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FAQ SECTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    section: "faq",
    title: "Availability & Hiring",
    content: `Pavan Kumar Kunukuntla is currently open to AI engineering internships, freelance projects, and full-time opportunities after his graduation in 2027. He is actively looking for roles in Agentic AI, RAG systems, and LLM application development. He is available for remote work and collaborations. You can contact him at pavankumarkunukuntla@gmail.com or via LinkedIn to discuss opportunities.`,
    metadata: {
      tags: ["faq", "available", "hire", "job", "opportunity", "freelance", "internship", "open to work", "remote"]
    }
  },
  {
    section: "faq",
    title: "What kind of projects does Pavan build?",
    content: `Pavan specializes in building Agentic AI systems and LLM-powered applications. He builds multi-agent pipelines using LangChain and LangGraph, RAG systems with vector databases, multimodal AI combining vision and language, voice-enabled AI applications, and production-grade AI backends with FastAPI. His projects span healthcare AI, legal/compliance automation, creative tools, and developer SDKs. He has experience taking projects from idea to production deployment.`,
    metadata: {
      tags: ["faq", "projects", "build", "specialize", "what", "work type", "agentic", "rag"]
    }
  },
  {
    section: "faq",
    title: "What is Pavan's technical expertise level?",
    content: `Pavan is an advanced AI engineer despite being a final year student. He has real-world internship experience at Microsoft and Infosys. He has shipped production systems including a voice navigation SDK (Nina), a GST compliance platform (TaxSetu), and a self-healing RAG system (FailureRAG). He holds IBM RAG & Agentic AI Professional Certificate and specializations from DeepLearning.AI. His B.Tech CGPA is 8.93 and PUC CGPA was 9.50. He actively participates in national hackathons and has won awards.`,
    metadata: {
      tags: ["faq", "expertise", "level", "experience", "how good", "skills level", "senior", "junior", "fresher"]
    }
  },
  {
    section: "faq",
    title: "What makes Pavan different as an AI Engineer?",
    content: `What sets Pavan apart is his focus on Agentic AI — building systems that think, plan, and act autonomously. He doesn't just use AI APIs; he architects multi-agent systems with complex state machines, self-healing pipelines, and production-grade reliability. He combines full-stack engineering skills (React, FastAPI, PostgreSQL) with deep AI expertise (LangGraph, RAG, multimodal systems). He built Nina — a voice SDK that works across any web app — showing his ability to ship developer tools. He is also passionate about solving real Indian market problems like GST compliance for MSMEs.`,
    metadata: {
      tags: ["faq", "different", "unique", "why hire", "strengths", "standout", "special"]
    }
  }
];
