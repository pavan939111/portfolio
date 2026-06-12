import asyncio
import voyageai
from config.settings import get_settings
from logger.setup import setup_logger
from exceptions.errors import EmbeddingError

logger = setup_logger(__name__)
settings = get_settings()

# Initialize Voyage AI client once at module level
_voyage_client: voyageai.Client | None = None

def get_voyage_client() -> voyageai.Client | None:
    global _voyage_client
    if _voyage_client is None:
        if not settings.VOYAGE_API_KEY or not settings.VOYAGE_API_KEY.strip():
            logger.warning("VOYAGE_API_KEY is blank. Fallback dummy embeddings will be used.")
            _voyage_client = None
        else:
            _voyage_client = voyageai.Client(
                api_key=settings.VOYAGE_API_KEY
            )
    return _voyage_client

def get_mock_embedding(dimension: int = 1024) -> list[float]:
    return [0.0] * dimension

async def embed_query(text: str) -> list[float]:
    """
    Embed a user question for similarity search.
    Uses input_type='query' for better retrieval.
    """
    client = get_voyage_client()
    if client is None:
        return get_mock_embedding(settings.VOYAGE_EMBEDDING_DIM)
        
    for attempt in range(5):
        try:
            result = client.embed(
                texts=[text],
                model=settings.VOYAGE_MODEL,
                input_type="query"
            )
            embedding = result.embeddings[0]
            logger.info(
                f"Query embedded successfully. Dim: {len(embedding)}"
            )
            return embedding
        except Exception as e:
            err_msg = str(e).lower()
            is_rate_limit = any(x in err_msg for x in ["rate limit", "payment method", "reduced rate limits"])
            is_transient = any(x in err_msg for x in ["timeout", "timed out", "connection", "pool", "read timeout"])
            if attempt < 4 and (is_rate_limit or is_transient):
                sleep_time = 20 if is_rate_limit else 5
                logger.warning(f"Voyage rate limit/transient hit ({e}). Retrying in {sleep_time} seconds (attempt {attempt+1}/5)...")
                await asyncio.sleep(sleep_time)
            else:
                logger.error(f"Embedding query failed: {e}")
                raise EmbeddingError(f"Voyage AI embedding failed: {e}") from e

async def embed_document(text: str) -> list[float]:
    """
    Embed a document/chunk for storage.
    Uses input_type='document' for better indexing.
    """
    client = get_voyage_client()
    if client is None:
        return get_mock_embedding(settings.VOYAGE_EMBEDDING_DIM)

    for attempt in range(5):
        try:
            result = client.embed(
                texts=[text],
                model=settings.VOYAGE_MODEL,
                input_type="document"
            )
            embedding = result.embeddings[0]
            logger.info(
                f"Document embedded. Dim: {len(embedding)}"
            )
            return embedding
        except Exception as e:
            err_msg = str(e).lower()
            is_rate_limit = any(x in err_msg for x in ["rate limit", "payment method", "reduced rate limits"])
            is_transient = any(x in err_msg for x in ["timeout", "timed out", "connection", "pool", "read timeout"])
            if attempt < 4 and (is_rate_limit or is_transient):
                sleep_time = 20 if is_rate_limit else 5
                logger.warning(f"Voyage rate limit/transient hit ({e}). Retrying in {sleep_time} seconds (attempt {attempt+1}/5)...")
                await asyncio.sleep(sleep_time)
            else:
                logger.error(f"Embedding document failed: {e}")
                raise EmbeddingError(f"Voyage AI embedding failed: {e}") from e

async def embed_batch(
    texts: list[str],
    input_type: str = "document"
) -> list[list[float]]:
    """
    Embed multiple texts in one API call.
    Used by ingestion script for efficiency.
    Max 128 texts per batch for Voyage AI.
    """
    client = get_voyage_client()
    if client is None:
        return [get_mock_embedding(settings.VOYAGE_EMBEDDING_DIM) for _ in texts]

    all_embeddings = []
    batch_size = 64

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        for attempt in range(5):
            try:
                result = client.embed(
                    texts=batch,
                    model=settings.VOYAGE_MODEL,
                    input_type=input_type
                )
                all_embeddings.extend(result.embeddings)
                logger.info(
                    f"Embedded batch {i//batch_size + 1}. Count: {len(batch)}"
                )
                break
            except Exception as e:
                err_msg = str(e).lower()
                is_rate_limit = any(x in err_msg for x in ["rate limit", "payment method", "reduced rate limits"])
                is_transient = any(x in err_msg for x in ["timeout", "timed out", "connection", "pool", "read timeout"])
                if attempt < 4 and (is_rate_limit or is_transient):
                    sleep_time = 20 if is_rate_limit else 5
                    logger.warning(f"Voyage rate limit/transient hit in batch ({e}). Retrying in {sleep_time} seconds (attempt {attempt+1}/5)...")
                    await asyncio.sleep(sleep_time)
                else:
                    logger.error(f"Batch embedding failed: {e}")
                    raise EmbeddingError(f"Voyage AI batch embedding failed: {e}") from e

    return all_embeddings
