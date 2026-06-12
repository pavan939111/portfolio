import os
import asyncio
from dotenv import load_dotenv
load_dotenv()

from config.settings import get_settings
from services.llm import get_raw_llm_response

async def test_llm():
    settings = get_settings()
    print("Gemini Key:", settings.GEMINI_API_KEY[:10] if settings.GEMINI_API_KEY else None)
    print("Groq Key:", settings.GROQ_API_KEY[:10] if settings.GROQ_API_KEY else None)
    
    prompt = "Reply with ONLY the word 'SUCCESS' if you read this."
    
    print("\nCalling raw LLM response...")
    try:
        response = await get_raw_llm_response(prompt)
        print("Response:", repr(response))
    except Exception as e:
        print("Caught exception:", e)

if __name__ == "__main__":
    asyncio.run(test_llm())
