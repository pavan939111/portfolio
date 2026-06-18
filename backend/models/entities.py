from pydantic import BaseModel, Field

class Message(BaseModel):
    role: str = Field(
        ...,
        description="Either 'user' or 'assistant'"
    )
    content: str = Field(
        ...,
        description="Message content"
    )

class RetrievedChunk(BaseModel):
    id: int
    section: str
    title: str
    content: str
    similarity: float
    source: str = "Local Knowledge"
