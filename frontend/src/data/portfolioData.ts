import type { PortfolioItem } from '../types';

export const portfolioItems: PortfolioItem[] = [
  // PROJECTS
  {
    id: 'proj-1',
    category: 'project',
    title: 'AutoDoc-Agent',
    description: 'An autonomous code documentation agent that analyzes workspace structures and builds complete developer readmes and structural maps.',
    metadata: {
      tags: ['Agent', 'LangGraph', 'TypeScript', 'AST'],
      tools: ['TypeScript', 'AST Parser', 'Framer Motion', 'Claude-3.5-Sonnet'],
      metrics: 'Reduced onboarding time by 45% across dev teams',
      link: 'https://github.com/example/autodoc-agent'
    }
  },
  {
    id: 'proj-2',
    category: 'project',
    title: 'Finance-Research-Swarm',
    description: 'A collaborative multi-agent researcher system designed to execute deep financial analytics, scrape market sentiments, and output visual valuation reports.',
    metadata: {
      tags: ['Multi-Agent', 'LangGraph', 'Python', 'Financials'],
      tools: ['Python', 'LangGraph', 'Tavily Search', 'Recharts'],
      metrics: 'Achieved 89% accuracy in sentiment forecasting',
      link: 'https://github.com/example/finance-swarm'
    }
  },
  {
    id: 'proj-3',
    category: 'project',
    title: 'Semantic-Memory-Kernel',
    description: 'A modular agent memory framework utilizing vector search and summary nodes for long-term recall and contextual agent behavior retention.',
    metadata: {
      tags: ['Memory', 'RAG', 'Vector Search', 'Supabase'],
      tools: ['Node.js', 'Supabase', 'pgvector', 'Voyage AI'],
      metrics: 'Average query response latency under 95ms',
      link: 'https://github.com/example/semantic-memory'
    }
  },
  // EXPERIENCES
  {
    id: 'exp-1',
    category: 'experience',
    title: 'Senior Agentic AI Engineer',
    description: 'Designing and deploying autonomous developer agents, agent state machines using LangGraph, and implementing corporate-wide RAG platforms with vector databases.',
    metadata: {
      company: 'Cognitive Automations Corp',
      period: '2024 - Present',
      tools: ['LangGraph', 'Python', 'TypeScript', 'Supabase', 'Voyage AI']
    }
  },
  {
    id: 'exp-2',
    category: 'experience',
    title: 'AI Solutions Developer',
    description: 'Developed production-grade LLM integrations, text vectorization pipelines, semantic routers, and structured JSON agent output handlers.',
    metadata: {
      company: 'Synthetica AI',
      period: '2022 - 2024',
      tools: ['Node.js', 'Express', 'Python', 'FastAPI', 'Pinecone', 'OpenAI']
    }
  },
  // SKILLS
  {
    id: 'skill-1',
    category: 'skill',
    title: 'AI Orchestration',
    description: 'Expertise in designing single & multi-agent systems, human-in-the-loop triggers, state retention, tool definitions, and LLM evaluation criteria.',
    metadata: {
      tags: ['LangGraph', 'CrewAI', 'AutoGen', 'Prompt Engineering']
    }
  },
  {
    id: 'skill-2',
    category: 'skill',
    title: 'Vector Search & Database',
    description: 'Advanced knowledge of text embedding models, pgvector similarity formulas (cosine, inner product, L2), indexing structures (HNSW, IVFFlat), and hybrid keyword-semantic queries.',
    metadata: {
      tags: ['Supabase', 'PostgreSQL', 'pgvector', 'Voyage AI', 'Pinecone']
    }
  },
  {
    id: 'skill-3',
    category: 'skill',
    title: 'Full-Stack Development',
    description: 'Building high-performance, asynchronous REST/GraphQL backend systems, real-time streaming sockets, and immersive dashboard user interfaces.',
    metadata: {
      tags: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS']
    }
  },
  // ABOUT
  {
    id: 'about-1',
    category: 'about',
    title: 'About the Engineer',
    description: 'An Agentic AI Engineer focused on developing software that can think, plan, and execute. Bridging the gap between static LLM reasoning and real-world system integrations.',
    metadata: {
      tags: ['Autonomy', 'RAG', 'Agentic Systems', 'Cognitive Swarms']
    }
  }
];
