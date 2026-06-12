from config.settings import get_settings
from models.requests import ChatRequest
from models.responses import ChatResponse
from models.entities import Message
from prompts.builder import build_condense_prompt
from prompts.templates import QUERY_CLASSIFIER_PROMPT
from services.embeddings import embed_query
from services.retrieval import retrieve_chunks, get_supabase_client
from services.llm import get_llm_response, get_raw_llm_response
from logger.setup import setup_logger
from exceptions.errors import EmbeddingError, RetrievalError, LLMError
import time
import json
from datetime import datetime, timezone

logger = setup_logger(__name__)
settings = get_settings()

async def condense_query(message: str, history: list[Message]) -> str:
    """
    Rewrites a follow-up user query based on conversational history into a
    standalone query for high-accuracy semantic vector search.
    """
    if not history:
        return message
        
    try:
        prompt = build_condense_prompt(message, history)
        # Invoke LLM to rewrite the query (passing empty chunks to get plain response)
        rewritten = await get_llm_response(prompt, [], [])
        cleaned_rewritten = rewritten.strip(' "\'\n\r')
        logger.info(f"Query condensation: '{message}' -> '{cleaned_rewritten}'")
        return cleaned_rewritten
    except Exception as e:
        logger.warning(f"Failed to condense query: {e}. Fallback to raw message.")
        return message

async def run_rag_pipeline(request: ChatRequest) -> ChatResponse:
    """
    Full RAG pipeline orchestrator with telemetry logging:
    Condense Query → Embed → Retrieve → LLM Response → Structure, Log Telemetry & Return
    """
    logger.info(f"Starting RAG pipeline for user message: '{request.message[:50]}'")
    
    start_time = time.time()
    thoughts = []
    tools_called = []

    # Build chat history representation for classifier
    chat_log = ""
    for msg in request.history[-5:]:
        role_label = "User" if msg.role == "user" else "Assistant"
        chat_log += f"{role_label}: {msg.content}\n"

    # Step 1: Query Classification & Condensation
    thoughts.append({
        "step": "Query Classification",
        "message": "Classifying query relevance and resolving pronouns...",
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    tools_called.append("LLM Classifier & Condenser")

    classifier_prompt = QUERY_CLASSIFIER_PROMPT.format(
        chat_log=chat_log,
        message=request.message
    )

    is_relevant = True
    is_unlisted_topic = False
    unlisted_topic_alternative = ""
    response_length = "detailed"
    search_query = request.message
    rejection_message = "I am Pavan's portfolio assistant. I can only answer questions related to Pavan's projects, tech stack, and background. Feel free to ask about his AI work!"

    try:
        raw_classification = await get_raw_llm_response(classifier_prompt)
        clean_json_str = raw_classification.strip(' `\n\r')
        if clean_json_str.startswith("```json"):
            clean_json_str = clean_json_str[7:]
        if clean_json_str.endswith("```"):
            clean_json_str = clean_json_str[:-3]
        clean_json_str = clean_json_str.strip()
        
        classification_data = json.loads(clean_json_str)
        is_relevant = classification_data.get("is_relevant", True)
        is_unlisted_topic = classification_data.get("is_unlisted_topic", False)
        unlisted_topic_alternative = classification_data.get("unlisted_topic_alternative", "")
        response_length = classification_data.get("response_length", "detailed")
        
        if is_relevant:
            search_query = classification_data.get("condensed_query", request.message) or request.message
            thoughts.append({
                "step": "Query Analysis",
                "message": f"Query classified as RELEVANT. Standalone query: '{search_query}' (Length: {response_length}, Unlisted: {is_unlisted_topic})",
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
        else:
            rejection_message = classification_data.get("rejection_message", rejection_message)
            thoughts.append({
                "step": "Query Analysis",
                "message": "Query classified as NOT RELEVANT. Rejection response prepared.",
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
    except Exception as e:
        logger.warning(f"Failed to classify query: {e}. Defaulting to relevant.")
        is_relevant = True
        is_unlisted_topic = False
        unlisted_topic_alternative = ""
        response_length = "detailed"
        search_query = await condense_query(request.message, request.history)

    # Rejection Bypass
    if not is_relevant:
        latency_ms = int((time.time() - start_time) * 1000)
        supabase = get_supabase_client()
        if supabase is not None:
            try:
                session_id = request.sessionId or "anonymous-session"
                supabase.table("agent_runs").insert({
                    "session_id": session_id,
                    "user_query": request.message,
                    "agent_thoughts": thoughts,
                    "final_response": rejection_message,
                    "tokens_used": 50,
                    "latency_ms": latency_ms,
                    "cost_usd": 0.000001,
                    "tools_called": tools_called
                }).execute()
            except Exception as db_err:
                logger.warning(f"Could not record telemetry to Supabase table: {db_err}")

        return ChatResponse(
            response=rejection_message,
            sources=[],
            chunks_used=0,
            timestamp=datetime.now(timezone.utc),
            thoughts=thoughts,
            latencyMs=latency_ms,
            tokensUsed=50,
            costUsd=0.000001,
            toolsCalled=tools_called
        )

    # Step 2: Generate query embedding
    logger.info("Step 2: Generating query embedding...")
    thoughts.append({
        "step": "Embedding Vectorization",
        "message": f"Generating embedding coordinates using model '{settings.VOYAGE_MODEL}'...",
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    tools_called.append("Voyage Embeddings API")
    try:
        query_embedding = await embed_query(search_query)
    except EmbeddingError as emb_err:
        logger.error(f"Embedding failed in pipeline: {emb_err}")
        raise
    except Exception as e:
        logger.error(f"Unexpected embedding error: {e}")
        raise EmbeddingError(f"Embedding failed: {e}") from e

    # Step 3: Local Hybrid Search Retrieval
    logger.info("Step 3: Retrieving documents...")
    thoughts.append({
        "step": "Vector Store Search",
        "message": "Executing local hybrid search fusing vector similarity and keyword matching...",
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    tools_called.append("Local Hybrid Search")
    try:
        chunks = await retrieve_chunks(
            query_embedding=query_embedding,
            match_threshold=settings.MATCH_THRESHOLD,
            match_count=settings.MATCH_COUNT,
            query_text=search_query
        )
        logger.info(f"Retrieved {len(chunks)} relevant chunks.")
        
        # Determine source of search results
        source_label = chunks[0].source if chunks else "Local fallback JSON"
        thoughts.append({
            "step": "Context Filtering",
            "message": f"Retrieved {len(chunks)} relevant chunks from {source_label}.",
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
    except RetrievalError as ret_err:
        logger.error(f"Retrieval failed in pipeline: {ret_err}")
        raise
    except Exception as e:
        logger.error(f"Unexpected retrieval error: {e}")
        raise RetrievalError(f"Retrieval failed: {e}") from e

    # Step 4: Call cascading LLM logic
    logger.info("Step 4: Generating response from LLM...")
    llm_name = settings.GEMINI_MODEL if settings.GEMINI_API_KEY else settings.GROQ_MODEL
    if not settings.GEMINI_API_KEY and not settings.GROQ_API_KEY:
        llm_name = "Mock LLM Fallback"
    
    thoughts.append({
        "step": "LLM Synthesis Response",
        "message": f"Synthesizing response with model '{llm_name}' using custom RAG instructions...",
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    tools_called.append(f"{llm_name} Inference")
    try:
        answer = await get_llm_response(
            message=request.message,
            history=request.history,
            chunks=chunks,
            is_unlisted_topic=is_unlisted_topic,
            unlisted_topic_alternative=unlisted_topic_alternative,
            response_length=response_length
        )
    except LLMError as llm_err:
        logger.error(f"LLM call failed in pipeline: {llm_err}")
        raise
    except Exception as e:
        logger.error(f"Unexpected LLM error: {e}")
        raise LLMError(f"LLM failed: {e}") from e

    # Step 5: Extract unique source section tags
    sources = list(dict.fromkeys(chunk.section for chunk in chunks))
    
    latency_ms = int((time.time() - start_time) * 1000)
    
    # Calculate mock token usage & costs (assuming ~4 chars per token)
    prompt_chars = len(search_query) + sum(len(c.content) for c in chunks)
    prompt_tokens = int(prompt_chars / 4)
    completion_tokens = int(len(answer) / 4)
    tokens_used = prompt_tokens + completion_tokens
    cost_usd = round(tokens_used * 0.0000002, 6) # Estimate price for flash models

    # Record telemetry row to Supabase agent_runs table
    supabase = get_supabase_client()
    if supabase is not None:
        try:
            session_id = request.sessionId or "anonymous-session"
            supabase.table("agent_runs").insert({
                "session_id": session_id,
                "user_query": request.message,
                "agent_thoughts": thoughts,
                "final_response": answer,
                "tokens_used": tokens_used,
                "latency_ms": latency_ms,
                "cost_usd": cost_usd,
                "tools_called": tools_called
            }).execute()
            logger.info("Successfully recorded telemetry event to Supabase.")
        except Exception as db_err:
            logger.warning(f"Could not record telemetry to Supabase table: {db_err}")

    # Return structured Response with Telemetry details
    return ChatResponse(
        response=answer,
        sources=sources,
        chunks_used=len(chunks),
        timestamp=datetime.now(timezone.utc),
        thoughts=thoughts,
        latencyMs=latency_ms,
        tokensUsed=tokens_used,
        costUsd=cost_usd,
        toolsCalled=tools_called
    )
