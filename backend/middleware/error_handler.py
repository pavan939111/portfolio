from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from exceptions.errors import (
    PortfolioBaseError,
    EmbeddingError,
    RetrievalError,
    LLMError,
    IngestionError,
    ValidationError
)
from logger.setup import setup_logger

logger = setup_logger(__name__)

def register_error_handlers(app: FastAPI):
    @app.exception_handler(EmbeddingError)
    async def embedding_error_handler(request: Request, exc: EmbeddingError):
        logger.error(f"EmbeddingError: {exc}")
        return JSONResponse(
            status_code=502,
            content={"detail": "Embedding service is currently unavailable. Please try again."}
        )

    @app.exception_handler(RetrievalError)
    async def retrieval_error_handler(request: Request, exc: RetrievalError):
        logger.error(f"RetrievalError: {exc}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Failed to retrieve context chunks from database."}
        )

    @app.exception_handler(LLMError)
    async def llm_error_handler(request: Request, exc: LLMError):
        logger.error(f"LLMError: {exc}")
        return JSONResponse(
            status_code=502,
            content={"detail": "AI model service is currently unavailable. Please try again."}
        )

    @app.exception_handler(ValidationError)
    async def validation_error_handler(request: Request, exc: ValidationError):
        logger.error(f"ValidationError: {exc}")
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)}
        )

    @app.exception_handler(PortfolioBaseError)
    async def base_error_handler(request: Request, exc: PortfolioBaseError):
        logger.error(f"PortfolioBaseError: {exc}")
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal error occurred in the portfolio service."}
        )
