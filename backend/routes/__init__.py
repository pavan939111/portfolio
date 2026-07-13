from fastapi import APIRouter
from routes.chat import router as chat_router
from routes.health import router as health_router
from routes.embed import router as embed_router
from routes.projects import router as projects_router
from routes.telemetry import router as telemetry_router

api_router = APIRouter()

# Include sub-routers directly
api_router.include_router(chat_router)
api_router.include_router(health_router)
api_router.include_router(embed_router)
api_router.include_router(projects_router)
api_router.include_router(telemetry_router)

__all__ = ["api_router"]
