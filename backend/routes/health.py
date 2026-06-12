from fastapi import APIRouter
from config.settings import get_settings
from models.responses import HealthResponse

settings = get_settings()
router = APIRouter()

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check"
)
async def health() -> HealthResponse:
    # Identify which LLM model is being served
    llm_model = settings.GEMINI_MODEL
    if not settings.GEMINI_API_KEY and settings.GROQ_API_KEY:
        llm_model = settings.GROQ_MODEL
        
    return HealthResponse(
        status="healthy",
        environment=settings.ENVIRONMENT,
        claude_model=llm_model,  # Preserved for client backward compatibility
        embedding_model=settings.VOYAGE_MODEL,
        embedding_dim=settings.VOYAGE_EMBEDDING_DIM
    )
