from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from logger.setup import setup_logger

logger = setup_logger(__name__)

# Global rate limiter instance
limiter = Limiter(key_func=get_remote_address)

async def custom_rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """
    Custom handler for rate limit exceeded exceptions to return a clean,
    standardized JSON response matching the rest of the application.
    """
    logger.warning(
        f"Rate limit exceeded: client={request.client.host if request.client else 'unknown'} "
        f"path={request.url.path} limit={exc.detail}"
    )
    return JSONResponse(
        status_code=429,
        content={
            "detail": "Too many requests. Please try again later."
        }
    )

def init_rate_limiting(app: FastAPI):
    """
    Register the slowapi limiter, exception handler, and middleware on the FastAPI app.
    """
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, custom_rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)
