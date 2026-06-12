from pydantic import BaseModel, Field, model_validator
from typing import List, Optional
from models.entities import Message

class ChatRequest(BaseModel):
    message: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="User question"
    )
    query: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="User question (alias)"
    )
    sessionId: Optional[str] = Field(
        default=None,
        description="Optional session tracker"
    )
    history: List[Message] = Field(
        default=[],
        max_length=20,
        description="Conversation history"
    )

    @model_validator(mode="before")
    @classmethod
    def resolve_message_field(cls, values):
        if isinstance(values, dict):
            if "query" in values and values["query"] is not None:
                if "message" not in values or values["message"] is None:
                    values["message"] = values["query"]
            elif "message" in values and values["message"] is not None:
                if "query" not in values or values["query"] is None:
                    values["query"] = values["message"]
            
            # Raise error if both are missing
            if not values.get("message"):
                raise ValueError("Either 'message' or 'query' must be provided.")
        return values

class EmbedRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=5000
    )
    input_type: str = Field(
        default="query",
        description="Either 'query' or 'document'"
    )
