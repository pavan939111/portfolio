class PortfolioBaseError(Exception):
    """Base error for all portfolio exceptions"""
    pass

class EmbeddingError(PortfolioBaseError):
    """Voyage AI embedding failed"""
    pass

class RetrievalError(PortfolioBaseError):
    """Supabase/local retrieval search failed"""
    pass

class LLMError(PortfolioBaseError):
    """LLM (Gemini or Groq) call failed"""
    pass

class IngestionError(PortfolioBaseError):
    """Knowledge base ingestion process failed"""
    pass

class ValidationError(PortfolioBaseError):
    """Input validation failed"""
    pass
