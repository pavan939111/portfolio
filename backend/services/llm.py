from config.settings import get_settings
from models.entities import Message, RetrievedChunk
from prompts.builder import build_system_prompt
from groq import Groq
from google import genai as google_genai
from google.genai import types as genai_types
from fastapi.concurrency import run_in_threadpool
from logger.setup import setup_logger
from exceptions.errors import LLMError

logger = setup_logger(__name__)
settings = get_settings()

def call_gemini(system_prompt: str, messages: list[dict]) -> str:
    logger.info("Calling Gemini AI...")
    client = google_genai.Client(api_key=settings.GEMINI_API_KEY)

    contents: list[genai_types.Content] = []
    for msg in messages:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(
            genai_types.Content(role=role, parts=[genai_types.Part(text=msg["content"])])
        )

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=contents,
        config=genai_types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=0.2
        )
    )
    return response.text

def call_groq(system_prompt: str, messages: list[dict]) -> str:
    logger.info("Calling Groq AI...")
    client = Groq(api_key=settings.GROQ_API_KEY)
    # Groq needs system prompt inside messages array
    groq_messages = [{"role": "system", "content": system_prompt}] + messages
    response = client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=groq_messages,
        max_tokens=1024,
        temperature=0.2,
    )
    return response.choices[0].message.content

def call_mock_llm(query: str) -> str:
    logger.warning("No working LLM key found. Running Mock LLM.")
    return (
        f"Hello! I am Pavan's AI Assistant (Mock Mode). Currently, my API keys "
        f"are not connected. However, you can contact Pavan directly at "
        f"pavankumarkunukuntla@gmail.com. Your query was: '{query}'"
    )

async def get_llm_response(
    message: str,
    history: list[Message],
    chunks: list[RetrievedChunk],
    is_unlisted_topic: bool = False,
    unlisted_topic_alternative: str = "",
    response_length: str = "detailed"
) -> str:
    """
    Call Gemini / Groq API with retrieved context.
    Builds full conversation history and uses cascading fallback logic.
    """
    try:
        # Build messages array from history
        messages = []
        recent_history = history[-10:]
        for msg in recent_history:
            role = "assistant" if msg.role == "assistant" else "user"
            messages.append({
                "role": role,
                "content": msg.content
            })

        # Add current user message
        messages.append({
            "role": "user",
            "content": message
        })

        system_instruction = build_system_prompt(
            chunks=chunks,
            is_unlisted_topic=is_unlisted_topic,
            unlisted_topic_alternative=unlisted_topic_alternative,
            response_length=response_length
        )

        # Cascade 1: Try Gemini
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip():
            try:
                answer = await run_in_threadpool(call_gemini, system_instruction, messages)
                logger.info("Gemini responded successfully.")
                return answer
            except Exception as e:
                logger.error(f"Gemini API call failed: {e}. Trying Groq fallback...")

        # Cascade 2: Try Groq Llama 3.3
        if settings.GROQ_API_KEY and settings.GROQ_API_KEY.strip():
            try:
                answer = await run_in_threadpool(call_groq, system_instruction, messages)
                logger.info("Groq responded successfully.")
                return answer
            except Exception as e:
                logger.error(f"Groq API call failed: {e}. Falling back to mock LLM...")

        # Fallback: Mock LLM
        return call_mock_llm(message)
    except Exception as e:
        logger.error(f"Error in get_llm_response: {e}")
        return call_mock_llm(message)

async def get_raw_llm_response(system_prompt: str, user_message: str = "") -> str:
    """
    Directly invokes LLM with a raw system prompt and user message (useful for classification).
    """
    messages = [{"role": "user", "content": user_message or "Please classify"}]
    
    if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip():
        try:
            return await run_in_threadpool(call_gemini, system_prompt, messages)
        except Exception as e:
            logger.error(f"Gemini raw call failed: {e}")
            
    if settings.GROQ_API_KEY and settings.GROQ_API_KEY.strip():
        try:
            return await run_in_threadpool(call_groq, system_prompt, messages)
        except Exception as e:
            logger.error(f"Groq raw call failed: {e}")
            
    return "{}"
