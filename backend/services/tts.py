import io
import httpx
from pydub import AudioSegment
from config.settings import get_settings
from logger.setup import setup_logger
from exceptions.errors import TTSError
from data.voice_scripts import VOICE_SCRIPTS

logger = setup_logger(__name__)
settings = get_settings()

# Locked configuration object containing all voice output parameters
DEEPGRAM_TTS_LOCKED_CONFIG = {
    "model": "aura-2-arcas-en",
    "encoding": "linear16",
    "sample_rate": 24000,
    "container": "wav"
}

def post_process_audio_bytes(audio_bytes: bytes) -> bytes:
    """
    Applies an audio normalization pass to target -16 LUFS (using dBFS proxy)
    and adds a consistent silence padding of exactly 200ms at start and 300ms at end.
    """
    try:
        # Load WAV from bytes using pydub
        segment = AudioSegment.from_file(io.BytesIO(audio_bytes), format="wav")
        
        # 1. Standardize loudness to -16.0 dBFS (proxy for -16.0 LUFS)
        target_dBFS = -16.0
        gain_needed = target_dBFS - segment.dBFS
        normalized = segment.apply_gain(gain_needed)
        
        # 2. Standardize silence padding: 200ms start, 300ms end
        frame_rate = DEEPGRAM_TTS_LOCKED_CONFIG["sample_rate"]
        silence_start = AudioSegment.silent(duration=200, frame_rate=frame_rate)
        silence_end = AudioSegment.silent(duration=300, frame_rate=frame_rate)
        
        padded = silence_start + normalized + silence_end
        
        # Export back to WAV bytes
        out_buf = io.BytesIO()
        padded.export(out_buf, format="wav")
        return out_buf.getvalue()
    except Exception as e:
        logger.error(f"❌ Failed to post-process audio bytes (normalization/padding): {e}")
        raise TTSError(f"Audio normalization post-processing failed: {e}") from e

async def generate_voice_bytes(text: str) -> bytes:
    """
    Call Deepgram TTS API to generate speech bytes using the locked configuration.
    """
    if not settings.DEEPGRAM_API_KEY or not settings.DEEPGRAM_API_KEY.strip():
        logger.error("DEEPGRAM_API_KEY is not set. Cannot generate TTS voice bytes.")
        raise TTSError("Deepgram API Key is not configured on the server.")

    logger.info(f"Generating Deepgram TTS with locked config {DEEPGRAM_TTS_LOCKED_CONFIG} for text: '{text[:50]}...'")

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.deepgram.com/v1/speak",
                headers={
                    "Authorization": f"Token {settings.DEEPGRAM_API_KEY}",
                    "Content-Type": "application/json"
                },
                params=DEEPGRAM_TTS_LOCKED_CONFIG,
                json={
                    "text": text
                }
            )

            response.raise_for_status()
            return response.content

    except httpx.HTTPStatusError as e:
        err_detail = e.response.text or str(e)
        logger.error(f"❌ Deepgram TTS API error: {e.response.status_code} - {err_detail}")
        raise TTSError(f"Deepgram TTS generation failed: {err_detail}") from e

    except Exception as e:
        logger.error(f"❌ Failed to generate voice bytes: {e}")
        raise TTSError(f"Failed to generate TTS voice: {e}") from e

