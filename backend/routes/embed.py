from fastapi import APIRouter, Request
from models.requests import EmbedRequest
from models.responses import EmbedResponse
from services.embeddings import embed_query
from config.settings import get_settings
from middleware.rate_limit import limiter

settings = get_settings()
router = APIRouter()

@router.post(
    "/embed",
    response_model=EmbedResponse,
    summary="Utility: Embed any text",
    description="For testing embeddings only"
)
@limiter.limit("10/minute")
async def embed(
    request: Request,
    body: EmbedRequest
) -> EmbedResponse:
    # Handled by global exception middlewares
    embedding = await embed_query(body.text)
    return EmbedResponse(
        embedding=embedding,
        dimension=len(embedding),
        model=settings.VOYAGE_MODEL
    )
