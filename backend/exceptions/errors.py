from typing import Optional

class PortfolioBaseError(Exception):
    """Base error for all portfolio exceptions"""
    
    def __init__(
        self, 
        message: str, 
        status_code: int = 500, 
        detail: Optional[str] = None,
        original_exception: Optional[Exception] = None
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.detail = detail or message
        self.original_exception = original_exception

class EmbeddingError(PortfolioBaseError):
    """Voyage AI embedding failed"""
    def __init__(
        self, 
        message: str, 
        status_code: int = 502, 
        detail: str = "Embedding service is currently unavailable. Please try again.",
        original_exception: Optional[Exception] = None
    ):
        super().__init__(message, status_code, detail, original_exception)

class RetrievalError(PortfolioBaseError):
    """Supabase/local retrieval search failed"""
    def __init__(
        self, 
        message: str, 
        status_code: int = 500, 
        detail: str = "Failed to retrieve context chunks from database.",
        original_exception: Optional[Exception] = None
    ):
        super().__init__(message, status_code, detail, original_exception)

class LLMError(PortfolioBaseError):
    """LLM (Gemini or Groq) call failed"""
    def __init__(
        self, 
        message: str, 
        status_code: int = 502, 
        detail: str = "AI model service is currently unavailable. Please try again.",
        original_exception: Optional[Exception] = None
    ):
        super().__init__(message, status_code, detail, original_exception)

class IngestionError(PortfolioBaseError):
    """Knowledge base ingestion process failed"""
    def __init__(
        self, 
        message: str, 
        status_code: int = 500, 
        detail: str = "Knowledge base ingestion process failed.",
        original_exception: Optional[Exception] = None
    ):
        super().__init__(message, status_code, detail, original_exception)

class ValidationError(PortfolioBaseError):
    """Input validation failed"""
    def __init__(
        self, 
        message: str, 
        status_code: int = 400, 
        detail: Optional[str] = None,
        original_exception: Optional[Exception] = None
    ):
        super().__init__(message, status_code, detail or message, original_exception)

class TTSError(PortfolioBaseError):
    """Deepgram AI TTS generation failed"""
    def __init__(
        self, 
        message: str, 
        status_code: int = 500, 
        detail: str = "Text-to-speech generation failed.",
        original_exception: Optional[Exception] = None
    ):
        super().__init__(message, status_code, detail, original_exception)

class ContactError(PortfolioBaseError):
    """Resend email notification delivery failed"""
    def __init__(
        self, 
        message: str, 
        status_code: int = 500, 
        detail: str = "Failed to send notification email via Resend.",
        original_exception: Optional[Exception] = None
    ):
        super().__init__(message, status_code, detail, original_exception)


