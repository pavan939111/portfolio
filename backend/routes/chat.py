from fastapi import APIRouter, Request
from models.requests import ChatRequest
from models.responses import ChatResponse
from services.pipeline import run_rag_pipeline
from middleware.rate_limit import limiter
from logger.setup import setup_logger

logger = setup_logger(__name__)
router = APIRouter()

@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="RAG Chat Endpoint",
    description="Main chat entry point running query condensation, vector search, and LLM reasoning."
)
@limiter.limit("20/minute")
async def chat(
    request: Request,
    body: ChatRequest
) -> ChatResponse:
    logger.info(f"Chat route triggered: '{body.message[:50]}'")
    # Handled by the global exception middlewares
    return await run_rag_pipeline(body)
