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
        logger.error(
            f"EmbeddingError: {exc.message}" + 
            (f" (Caused by: {exc.original_exception})" if exc.original_exception else ""),
            exc_info=exc.original_exception
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

    @app.exception_handler(RetrievalError)
    async def retrieval_error_handler(request: Request, exc: RetrievalError):
        logger.error(
            f"RetrievalError: {exc.message}" + 
            (f" (Caused by: {exc.original_exception})" if exc.original_exception else ""),
            exc_info=exc.original_exception
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

    @app.exception_handler(LLMError)
    async def llm_error_handler(request: Request, exc: LLMError):
        logger.error(
            f"LLMError: {exc.message}" + 
            (f" (Caused by: {exc.original_exception})" if exc.original_exception else ""),
            exc_info=exc.original_exception
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

    @app.exception_handler(ValidationError)
    async def validation_error_handler(request: Request, exc: ValidationError):
        logger.error(
            f"ValidationError: {exc.message}" + 
            (f" (Caused by: {exc.original_exception})" if exc.original_exception else ""),
            exc_info=exc.original_exception
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

    @app.exception_handler(PortfolioBaseError)
    async def base_error_handler(request: Request, exc: PortfolioBaseError):
        logger.error(
            f"PortfolioBaseError: {exc.message}" + 
            (f" (Caused by: {exc.original_exception})" if exc.original_exception else ""),
            exc_info=exc.original_exception
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )
