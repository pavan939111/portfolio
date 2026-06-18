from supabase import create_client, Client
from config.settings import get_settings
from models.entities import RetrievedChunk
from logger.setup import setup_logger
from exceptions.errors import RetrievalError, IngestionError
import os
import json

logger = setup_logger(__name__)
settings = get_settings()

# Initialize Supabase client once at module level
_supabase_client: Client | None = None

def get_supabase_client() -> Client | None:
    global _supabase_client
    if _supabase_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
            logger.warning("Supabase credentials are blank. Supabase Client will not be initialized.")
            _supabase_client = None
        else:
            _supabase_client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_KEY
            )
    return _supabase_client

from data.knowledge_base import KNOWLEDGE_BASE

_cached_embeddings = None

def load_local_embeddings() -> list[dict]:
    global _cached_embeddings
    if _cached_embeddings is None:
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(current_dir, "..", "data", "knowledgeBaseEmbeddings.json")
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                
                # Parse vector strings (e.g., "[0.12,-0.05,...]") to float lists
                for chunk in data:
                    embedding = chunk.get("embedding")
                    if isinstance(embedding, str):
                        try:
                            chunk["embedding"] = [float(x) for x in embedding.strip("[]").split(",")]
                        except ValueError as val_err:
                            logger.error(f"Failed to parse embedding string for '{chunk.get('title')}': {val_err}")
                            chunk["embedding"] = None
                            
                _cached_embeddings = data
                logger.info(f"Loaded {len(_cached_embeddings)} local pre-computed embeddings and parsed vector strings.")
            else:
                logger.warning(f"Local embeddings file not found at {file_path}. Using fallback.")
                _cached_embeddings = []
        except Exception as e:
            logger.error(f"Error loading local embeddings: {e}")
            _cached_embeddings = []
    return _cached_embeddings

def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    dot_product = sum(x * y for x, y in zip(v1, v2))
    norm_v1 = sum(x * x for x in v1) ** 0.5
    norm_v2 = sum(x * x for x in v2) ** 0.5
    if not norm_v1 or not norm_v2:
        return 0.0
    return dot_product / (norm_v1 * norm_v2)

def local_hybrid_search(
    query_embedding: list[float],
    query_text: str,
    match_count: int = 4
) -> list[RetrievedChunk]:
    """
    Combines Local Vector Similarity (Option B) and Local Keyword Overlap (Option C)
    without remote database roundtrips.
    """
    local_data = load_local_embeddings()
    if not local_data:
        logger.warning("No local embeddings loaded. Falling back to keyword search.")
        return local_fallback_search(query_text, match_count)
        
    try:
        query_words = [w.lower() for w in query_text.split() if len(w) > 2]
        
        ranked_chunks = []
        for idx, chunk in enumerate(local_data):
            # 1. Cosine similarity score
            chunk_embedding = chunk.get("embedding")
            vector_sim = 0.0
            if chunk_embedding and query_embedding:
                vector_sim = cosine_similarity(query_embedding, chunk_embedding)
            
            # 2. Keyword matching score
            content_lower = chunk.get("content", "").lower()
            title_lower = chunk.get("title", "").lower()
            tags = [t.lower() for t in chunk.get("metadata", {}).get("tags", [])]
            
            keyword_score = 0.0
            if query_words:
                matched_words = 0
                for word in query_words:
                    word_matched = False
                    if word in content_lower:
                        keyword_score += 0.1
                        word_matched = True
                    if word in title_lower:
                        keyword_score += 0.2
                        word_matched = True
                    for tag in tags:
                        if word in tag:
                            keyword_score += 0.3
                            word_matched = True
                    if word_matched:
                        matched_words += 1
                
                # Normalize keyword score and add fractional bonus
                fraction_matched = matched_words / len(query_words)
                keyword_score = min(keyword_score + 0.3 * fraction_matched, 1.0)
            else:
                keyword_score = 0.1
                
            # 3. Hybrid fusion: 70% vector score + 30% keyword score
            hybrid_score = 0.7 * vector_sim + 0.3 * keyword_score
            
            ret_chunk = RetrievedChunk(
                id=chunk.get("id") or (idx + 1),
                section=chunk.get("section", "general"),
                title=chunk.get("title", ""),
                content=chunk.get("content", ""),
                similarity=round(hybrid_score, 4),
                source="Local Hybrid Search"
            )
            ranked_chunks.append((hybrid_score, ret_chunk))
            
        # Sort by hybrid score descending
        ranked_chunks.sort(key=lambda x: x[0], reverse=True)
        results = [item[1] for item in ranked_chunks[:match_count]]
        return results
    except Exception as e:
        logger.error(f"Error in local hybrid search: {e}")
        return local_fallback_search(query_text, match_count)

def local_fallback_search(query: str, match_count: int = 4) -> list[RetrievedChunk]:
    """
    Local keyword matching fallback search.
    """
    logger.info("Executing local keyword search fallback...")
    
    try:
        query_words = [w.lower() for w in query.split() if len(w) > 2]
        
        ranked_chunks = []
        for idx, chunk in enumerate(KNOWLEDGE_BASE):
            content_lower = chunk.get("content", "").lower()
            title_lower = chunk.get("title", "").lower()
            tags = [t.lower() for t in chunk.get("metadata", {}).get("tags", [])]
            
            score = 0.0
            if not query_words:
                score = 0.1
            else:
                for word in query_words:
                    if word in content_lower:
                        score += 0.1
                    if word in title_lower:
                        score += 0.2
                    for tag in tags:
                        if word in tag:
                            score += 0.3
            
            if score > 0:
                similarity = min(0.4 + score, 0.95)
                ret_chunk = RetrievedChunk(
                    id=idx + 1,
                    section=chunk.get("section", "general"),
                    title=chunk.get("title", ""),
                    content=chunk.get("content", ""),
                    similarity=round(similarity, 4),
                    source="Local Keyword Fallback"
                )
                ranked_chunks.append((similarity, ret_chunk))
        
        ranked_chunks.sort(key=lambda x: x[0], reverse=True)
        results = [item[1] for item in ranked_chunks[:match_count]]
        
        if not results:
            results = [
                RetrievedChunk(
                    id=i + 1,
                    section=c.get("section", "general"),
                    title=c.get("title", ""),
                    content=c.get("content", ""),
                    similarity=0.45,
                    source="Local Keyword Fallback"
                )
                for i, c in enumerate(KNOWLEDGE_BASE[:match_count])
            ]
        return results
    except Exception as e:
        logger.error(f"Error in local fallback search: {e}")
        return []

async def retrieve_chunks(
    query_embedding: list[float],
    match_threshold: float | None = None,
    match_count: int | None = None,
    query_text: str = ""
) -> list[RetrievedChunk]:
    """
    Search local hybrid retrieval database (pre-computed embeddings & keyword matching),
    falling back to local keyword fallback search on failure.
    """
    threshold = match_threshold or settings.MATCH_THRESHOLD
    count = match_count or settings.MATCH_COUNT

    # Primary: Local Hybrid Search (Extremely fast, bypasses DB network latency)
    logger.info("Executing local hybrid search...")
    local_results = local_hybrid_search(query_embedding, query_text, count)
    if local_results:
        # Filter by threshold if needed
        results = [c for c in local_results if c.similarity >= threshold]
        if results:
            return results

    # Fallback directly to local keyword search
    return local_fallback_search(query_text, count)



async def upsert_chunk(
    section: str,
    title: str,
    content: str,
    metadata: dict,
    embedding: list[float]
) -> dict:
    """
    Insert or update a single chunk in Supabase.
    Used by the ingestion script.
    """
    client = get_supabase_client()
    if client is None:
        logger.error("Supabase client is not initialized. Cannot upsert chunk.")
        raise IngestionError("Supabase client not initialized.")
        
    try:
        # Delete any existing chunk with the same title first to avoid duplicates
        # and prevent errors when the table lacks a UNIQUE constraint.
        try:
            client.table("portfolio_chunks").delete().eq("title", title).execute()
        except Exception as delete_ex:
            logger.warning(f"Pre-delete failed for '{title}': {delete_ex}")

        result = client.table("portfolio_chunks").insert(
            {
                "section": section,
                "title": title,
                "content": content,
                "metadata": metadata,
                "embedding": embedding
            }
        ).execute()

        logger.info(f"Successfully ingested chunk: {title}")
        return result.data[0] if result.data else {}

    except Exception as e:
        logger.error(
            f"Ingestion failed for '{title}': {e}"
        )
        raise IngestionError(f"Upsert chunk failed for '{title}': {e}") from e
