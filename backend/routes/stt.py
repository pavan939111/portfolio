from fastapi import APIRouter, UploadFile, File, HTTPException
import httpx
from config.settings import get_settings
from logger.setup import setup_logger

logger = setup_logger(__name__)
settings = get_settings()
router = APIRouter()

@router.post(
    "/stt",
    summary="Transcribe audio file fallback",
    description="Transcribes an uploaded audio file using Deepgram Nova-3 (fallback path)."
)
async def transcribe_audio(
    file: UploadFile = File(...)
) -> dict:
    logger.info(f"Received STT request for file: '{file.filename}' (Mime: {file.content_type})")
    
    if not settings.DEEPGRAM_API_KEY or not settings.DEEPGRAM_API_KEY.strip():
        logger.error("DEEPGRAM_API_KEY is not set. Cannot perform fallback STT.")
        raise HTTPException(
            status_code=500,
            detail="STT service is not configured on the server."
        )

    try:
        # Read the raw audio bytes from the uploaded file
        audio_bytes = await file.read()
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://api.deepgram.com/v1/listen",
                headers={
                    "Authorization": f"Token {settings.DEEPGRAM_API_KEY}",
                    "Content-Type": "audio/wav"
                },
                params={
                    "model": "nova-3",
                    "language": "en-IN",
                    "smart_format": "true"
                },
                content=audio_bytes
            )
            
            response.raise_for_status()
            result = response.json()
            
            # Extract transcript from Deepgram standard response structure:
            # results -> channels[0] -> alternatives[0] -> transcript
            channels = result.get("results", {}).get("channels", [])
            transcript = ""
            if channels:
                alternatives = channels[0].get("alternatives", [])
                if alternatives:
                    transcript = alternatives[0].get("transcript", "")
            
            logger.info(f"Fallback STT succeeded. Transcript: '{transcript}'")
            return {"transcript": transcript}
            
    except httpx.HTTPStatusError as e:
        err_detail = e.response.text or str(e)
        logger.error(f"Deepgram STT API returned error: {e.response.status_code} - {err_detail}")
        raise HTTPException(
            status_code=500,
            detail=f"Deepgram STT transcription request failed: {err_detail}"
        )
    except Exception as e:
        logger.error(f"Fallback STT transcription process failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process and transcribe audio: {e}"
        )
