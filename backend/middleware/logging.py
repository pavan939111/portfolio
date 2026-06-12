import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from logger.setup import setup_logger

logger = setup_logger(__name__)

class RequestResponseLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()
        method = request.method
        path = request.url.path
        
        logger.info(f"Incoming request: {method} {path}")
        
        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000
            logger.info(
                f"Completed request: {method} {path} | "
                f"Status: {response.status_code} | "
                f"Latency: {process_time:.2f}ms"
            )
            return response
        except Exception as e:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"Failed request: {method} {path} | "
                f"Error: {e} | "
                f"Latency: {process_time:.2f}ms"
            )
            raise e
