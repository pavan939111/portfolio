import asyncio
import time
import json
import sys
import os

# Add parent directory to path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

from dotenv import load_dotenv
load_dotenv()

from services.embeddings import embed_batch
from services.retrieval import upsert_chunk
from config.settings import get_settings
from logger.setup import setup_logger
from data.knowledge_base import KNOWLEDGE_BASE

# Use centralized logger configuration
logger = setup_logger("ingest")
settings = get_settings()

# Configure stdout encoding for Windows
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

async def ingest_all():
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    logger.info("  Pavan Portfolio — Knowledge Ingestion")
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    logger.info(f"Total chunks to ingest: {len(KNOWLEDGE_BASE)}")
    logger.info(f"Embedding model: {settings.VOYAGE_MODEL}")
    logger.info(f"Supabase URL: {settings.SUPABASE_URL[:30]}...")

    success_count = 0
    fail_count = 0
    failed_chunks = []

    try:
        # STEP 1: Generate embeddings for all chunks in a single batch call to bypass rate limits
        logger.info("Generating embeddings for all chunks in a single Voyage batch request...")
        contents = [chunk["content"] for chunk in KNOWLEDGE_BASE]
        embeddings = await embed_batch(contents, input_type="document")
        logger.info(f"Generated {len(embeddings)} embeddings successfully.")

        # STEP 2: Upsert each chunk to Supabase
        for i, chunk in enumerate(KNOWLEDGE_BASE):
            title = chunk["title"]
            section = chunk["section"]
            embedding = embeddings[i]

            logger.info(
                f"[{i+1}/{len(KNOWLEDGE_BASE)}] Ingesting: {title[:50]}..."
            )

            try:
                # Verify embedding dimension
                if len(embedding) != settings.VOYAGE_EMBEDDING_DIM:
                    raise ValueError(
                        f"Wrong embedding dim: {len(embedding)}"
                        f" expected {settings.VOYAGE_EMBEDDING_DIM}"
                    )

                # Upsert to Supabase
                await upsert_chunk(
                    section=section,
                    title=title,
                    content=chunk["content"],
                    metadata=chunk["metadata"],
                    embedding=embedding
                )

                logger.info(f"  Done: [{section}] {title[:40]}")
                success_count += 1
                
            except Exception as e:
                logger.error(f"  Failed: {title[:40]} -> {e}")
                fail_count += 1
                failed_chunks.append(title)

    except Exception as e:
        logger.error(f"Batch embedding request failed: {e}")
        fail_count = len(KNOWLEDGE_BASE)
        failed_chunks = [chunk["title"] for chunk in KNOWLEDGE_BASE]

    # Summary
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    logger.info(f"Successfully ingested: {success_count}")
    logger.info(f"Failed: {fail_count}")

    if failed_chunks:
        logger.warning("Failed chunks:")
        for t in failed_chunks:
            logger.warning(f"  - {t}")

    if success_count == len(KNOWLEDGE_BASE):
        logger.info("All chunks ingested successfully! Your RAG chatbot is ready!")
    else:
        logger.warning(f"{fail_count} chunks failed. Re-run script to retry failed chunks.")
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


if __name__ == "__main__":
    asyncio.run(ingest_all())
