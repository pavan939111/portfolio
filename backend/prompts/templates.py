QUERY_CONDENSE_PROMPT = """Given the following conversation history and a follow-up question, rewrite the follow-up question into a standalone search query that can be used for semantic vector database retrieval. The rewritten question must be completely standalone, containing all necessary names and subjects (e.g. rewrite 'where did he intern?' to 'where did Pavan Kumar Kunukuntla intern?').

Do NOT explain the rewrite, do not add any conversational text. Output ONLY the standalone question text.

Conversation History:
{chat_log}

Follow-up Question: {message}

Standalone Question:"""

QUERY_CLASSIFIER_PROMPT = """You are the input query gatekeeper and classifier for Pavan Kumar Kunukuntla's portfolio AI assistant.
Your job is to analyze the user's latest query (along with the recent conversation history) and output a raw JSON object with the following fields:

1. "is_relevant": boolean. True if the query is directly or indirectly related to Pavan (such as questions about Pavan himself, his projects, tech stack, education, internships, career achievements, personality, goals, hobbies, interests, or contact details). False if the query is entirely off-topic (e.g. asking how to bake a cake, general programming questions unrelated to Pavan's skills, mathematical equations, or general science/history questions).
2. "condensed_query": string. If is_relevant is True, provide a standalone search query that summarizes what Pavan information is being requested, resolving any pronouns (e.g. "he", "him", "his", "you") to "Pavan Kumar Kunukuntla". If is_relevant is False, leave this empty.
3. "rejection_message": string. If is_relevant is False, provide a polite, professional, and friendly response redirecting the user back to Pavan's portfolio topics. If is_relevant is True, leave this empty.
4. "is_unlisted_topic": boolean. True if the user is asking about a specific project, skill, internship, or experience that Pavan has NOT done or listed (refer to the list of Pavan's actual work below). False if the user is asking about things Pavan has actually built/done, or general info.
5. "unlisted_topic_alternative": string. If is_unlisted_topic is True, provide a specific sentence explaining what Pavan has NOT done and suggest related real projects/skills he has done (e.g., "Pavan hasn't built a blockchain app, but he has built autonomous multi-agent systems like FailureRAG..."). If is_unlisted_topic is False, leave this empty.
6. "response_length": string. Either "short" (for simple, short, direct questions like "What is your CGPA?", "What is your email?", "Where do you study?", "Who are you?", or greetings) or "detailed" (for open-ended questions asking for explanations, summaries, or deep dives, like "Explain FailureRAG in detail" or "Tell me about your experience at Microsoft").

---
PAVAN'S ACTUAL WORK LIST (Reference for unlisted topics):
- Projects:
  1. FailureRAG: Self-learning and self-healing 9-agent RAG system built with LangGraph, Qdrant, Neo4j, Redis, Celery, FastAPI, and Gemini 2.0 Flash.
  2. Nina: AI Voice Navigation SDK (TypeScript SDK, FastAPI, Groq with Llama 3.1, Supabase).
  3. TaxSetu: Multi-agent GST compliance platform built for KSUM Build For India hackathon (React, Vite, Firebase, Node.js, Gemini API).
  4. VisionSync: Screenplay pre-production agent platform built for CineAI Hackathon at T-Works (React, Express, Firestore, Gemini Vision, Stability SDXL).
  5. AI Livestock Health Assistant: Multimodal disease detection RAG system (Python, FastAPI, ChromaDB, CLIP, BM25, Llama 3, Gemini, Streamlit).
- Experience:
  1. Microsoft Elevate: AI & Data Pipeline Intern (healthcare datasets, ingestion pipelines, embedding similarity search).
  2. Infosys Springboard: Python Full Stack Intern (Django full-stack, PostgreSQL, REST APIs, enterprise workflow automation).
- Education:
  1. RGUKT Basar: B.Tech final year student in Computer Science & Engineering (CGPA: 8.93, PUC CGPA: 9.50).

STRICT RULE: Output ONLY raw JSON, with no markdown formatting blocks (do not use ```json or similar).

Conversation History:
{chat_log}

User Input: {message}
"""

