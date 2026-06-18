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

@router.get(
    "/stt/token",
    summary="Generate a short-lived temporary Deepgram token",
    description="Generates a temporary scoped token (TTL: 120 seconds) for real-time frontend WebSocket usage."
)
async def get_stt_token() -> dict:
    if not settings.DEEPGRAM_API_KEY or not settings.DEEPGRAM_API_KEY.strip():
        logger.error("DEEPGRAM_API_KEY is not set. Cannot generate temporary token.")
        raise HTTPException(
            status_code=500,
            detail="STT service is not configured on the server."
        )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # 1. Fetch projects to get project_id
            projects_res = await client.get(
                "https://api.deepgram.com/v1/projects",
                headers={"Authorization": f"Token {settings.DEEPGRAM_API_KEY}"}
            )
            projects_res.raise_for_status()
            projects_data = projects_res.json()
            
            projects_list = projects_data.get("projects", [])
            if not projects_list:
                raise HTTPException(
                    status_code=500,
                    detail="No Deepgram projects found for the configured API key."
                )
            
            project_id = projects_list[0]["project_id"]
            
            # 2. Generate temporary scoped token (120 seconds TTL, usage:write scope)
            token_res = await client.post(
                f"https://api.deepgram.com/v1/projects/{project_id}/keys",
                headers={
                    "Authorization": f"Token {settings.DEEPGRAM_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "comment": "Temp portfolio browser key",
                    "scopes": ["usage:write"],
                    "time_to_live_in_seconds": 120
                }
            )
            token_res.raise_for_status()
            token_data = token_res.json()
            
            token = token_data.get("key")
            if not token:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to retrieve key from Deepgram token response."
                )
                
            return {"token": token}
            
    except httpx.HTTPStatusError as e:
        err_detail = e.response.text or str(e)
        logger.error(f"Deepgram Management API returned error: {e.response.status_code} - {err_detail}")
        raise HTTPException(
            status_code=500,
            detail=f"Deepgram temporary token generation failed: {err_detail}"
        )
    except Exception as e:
        logger.error(f"Failed to generate temporary Deepgram token: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating temporary token: {e}"
        )

