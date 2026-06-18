import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import get_settings
from logger.setup import setup_logger
from middleware import limiter, RequestResponseLoggingMiddleware, register_error_handlers
from middleware.rate_limit import init_rate_limiting
from routes import api_router
from routes.audio import router as audio_router, pre_cache_predefined_clips
from routes.contact import router as contact_router
import asyncio

logger = setup_logger(__name__)
settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # App startup event
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    logger.info("Pavan Portfolio API starting up (Lifespan)")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Gemini model: {settings.GEMINI_MODEL}")
    logger.info(f"Groq model: {settings.GROQ_MODEL}")
    logger.info(f"Voyage model: {settings.VOYAGE_MODEL}")
    logger.info(f"Supabase URL: {settings.SUPABASE_URL[:30]}...")
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    # Run background pre-caching of voice scripts on start
    asyncio.create_task(pre_cache_predefined_clips())

    yield

    # App shutdown event
    logger.info("Pavan Portfolio API shutting down.")

# FastAPI app initialization
app = FastAPI(
    title="Pavan Kumar Portfolio API",
    description=(
        "RAG-powered portfolio chatbot backend following production-grade standard structure."
    ),
    version="1.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# 1. Global error / exception handlers registration
register_error_handlers(app)

# 2. Rate limiting setup
init_rate_limiting(app)

# 3. Request Logging middleware
app.add_middleware(RequestResponseLoggingMiddleware)

# 4. CORS settings
allowed_origins = [
    settings.FRONTEND_URL,
    "https://pavankumarkunukuntla.vercel.app",
    "https://portfolio-beige-one-q1ksxgftsb.vercel.app"
]
if settings.ENVIRONMENT == "development":
    allowed_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        settings.FRONTEND_URL
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Register routes
app.include_router(api_router, prefix="/api")
app.include_router(
    audio_router,
    prefix="/api",
    tags=["Audio"]
)
app.include_router(
    contact_router,
    prefix="/api",
    tags=["Contact"]
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
        log_level="info"
    )

# Reloader touch

