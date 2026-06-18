from pydantic import BaseModel, Field
from typing import List
from datetime import datetime, timezone

class ChatResponse(BaseModel):
    response: str
    sources: List[str]
    chunks_used: int
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    thoughts: List[dict] = Field(default=[])
    latencyMs: int = Field(default=0)
    tokensUsed: int = Field(default=0)
    costUsd: float = Field(default=0.0)
    toolsCalled: List[str] = Field(default=[])

class EmbedResponse(BaseModel):
    embedding: List[float]
    dimension: int
    model: str

class HealthResponse(BaseModel):
    status: str
    environment: str
    claude_model: str
    embedding_model: str
    embedding_dim: int
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


