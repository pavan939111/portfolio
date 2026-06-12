from fastapi import APIRouter
from config.settings import get_settings
from services.retrieval import get_supabase_client
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
    
    # Try fetching from Supabase first
    supabase = get_supabase_client()
    if supabase is not None:
        try:
            # Query portfolio_chunks where section is 'projects'
            result = supabase.table("portfolio_chunks").select("*").eq("section", "projects").execute()
            if result.data:
                projects = []
                for row in result.data:
                    projects.append({
                        "id": str(row["id"]),
                        "category": "project",
                        "title": row["title"],
                        "description": row["content"],
                        "metadata": row.get("metadata") or {}
                     })
                logger.info(f"Loaded {len(projects)} projects from Supabase.")
                return {"projects": projects, "source": "database"}
        except Exception as e:
            logger.error(f"Failed to fetch projects from Supabase: {e}. Falling back to local data.")
 
    # Fallback to local Python knowledge base
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
