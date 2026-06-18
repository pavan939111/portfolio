from fastapi import APIRouter
from config.settings import get_settings
import json
import os
from logger.setup import setup_logger

logger = setup_logger(__name__)
settings = get_settings()
router = APIRouter()

from data.knowledge_base import KNOWLEDGE_BASE

@router.get(
    "/projects",
    summary="Get Portfolio Projects"
)
async def get_projects():
    logger.info("Fetching portfolio projects...")
    
    # Fetch from local Python knowledge base directly
    try:
        projects = []
        for idx, chunk in enumerate(KNOWLEDGE_BASE):
            if chunk.get("section") == "projects":
                projects.append({
                    "id": f"local-proj-{idx + 1}",
                    "category": "project",
                    "title": chunk.get("title", ""),
                    "description": chunk.get("content", ""),
                    "metadata": chunk.get("metadata") or {}
                })
        logger.info(f"Loaded {len(projects)} projects from local Python knowledgeBase.")
        return {"projects": projects, "source": "local"}
    except Exception as e:
        logger.error(f"Failed to read local projects: {e}")
        
    return {"projects": [], "source": "none"}

