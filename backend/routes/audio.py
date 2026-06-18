import os
import hashlib
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import JSONResponse
from services.tts import generate_voice_bytes, post_process_audio_bytes, VOICE_SCRIPTS, DEEPGRAM_TTS_LOCKED_CONFIG
from logger.setup import setup_logger

logger = setup_logger(__name__)
router = APIRouter()

# Setup local disk cache path
CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "audio_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

async def pre_cache_predefined_clips() -> None:
    """
    Pre-synthesizes and caches all predefined scripts on server startup.
    This guarantees 0ms playback latency for the guided audio tour from the first run.
    """
    logger.info("⚡ Starting background pre-caching for predefined voice scripts...")
    for clip_name, text in VOICE_SCRIPTS.items():
        cache_filename = f"{clip_name}.wav"
        cache_path = os.path.join(CACHE_DIR, cache_filename)
        
        if os.path.exists(cache_path):
            logger.info(f"✔️ Pre-cache hit: '{cache_filename}' is already cached.")
            continue
            
        try:
            logger.info(f"⏳ Pre-caching script '{clip_name}'...")
            audio_bytes = await generate_voice_bytes(text)
            
            # Apply audio normalization (-16 LUFS dBFS proxy) and silence padding post-processing
            processed_bytes = post_process_audio_bytes(audio_bytes)
            
            with open(cache_path, "wb") as f:
                f.write(processed_bytes)
            logger.info(f"✅ Successfully pre-cached and normalized '{cache_filename}'")
        except Exception as e:
            logger.error(f"❌ Failed to pre-cache '{clip_name}': {e}")
            
    logger.info("⚡ Background pre-caching complete.")
    # Run the audio consistency verification pass
    verify_audio_consistency()

def verify_audio_consistency() -> None:
    """
    Verifies that all fifteen pre-generated wav files match the locked targets:
    - Sample rate: 24000 Hz
    - Channels: 1
    - Bit depth: 16-bit
    - Loudness: -16.0 LUFS/dBFS (+/- 1.0 tolerance)
    Logs a clear ASCII table to the console.
    """
    from pydub import AudioSegment
    
    target_sample_rate = DEEPGRAM_TTS_LOCKED_CONFIG["sample_rate"]
    target_channels = 1
    target_bit_depth = 16
    target_loudness = -16.0
    tolerance = 1.0
    
    has_warnings = False
    
    logger.info("🔍 [AUDIO VERIFICATION] Starting consistency verification pass...")
    logger.info(f"Locked Targets: SR={target_sample_rate}Hz, Ch={target_channels}, BD={target_bit_depth}-bit, Loudness={target_loudness} LUFS/dBFS")
    logger.info("=" * 102)
    logger.info(f" │ {'Clip Name':<25} │ {'Sample Rate':<12} │ {'Channels':<8} │ {'Bit Depth':<9} │ {'Loudness':<13} │ {'Status':<10} │")
    logger.info("=" * 102)
    
    for clip_name in VOICE_SCRIPTS.keys():
        cache_filename = f"{clip_name}.wav"
        cache_path = os.path.join(CACHE_DIR, cache_filename)
        
        if not os.path.exists(cache_path):
            logger.error(f" │ {clip_name:<25} │ {'MISSING':<12} │ {'-':<8} │ {'-':<9} │ {'-':<13} │ {'ERROR':<10} │")
            has_warnings = True
            continue
            
        try:
            seg = AudioSegment.from_file(cache_path, format="wav")
            sample_rate = seg.frame_rate
            channels = seg.channels
            bit_depth = seg.sample_width * 8
            loudness = round(seg.dBFS, 2)
            
            deviates = False
            status = "OK"
            
            if sample_rate != target_sample_rate:
                deviates = True
            if channels != target_channels:
                deviates = True
            if bit_depth != target_bit_depth:
                deviates = True
            if abs(loudness - target_loudness) > tolerance:
                deviates = True
                
            if deviates:
                status = "DEV_WARN"
                has_warnings = True
                logger.warning(f"⚠️ Deviation in '{clip_name}': SR={sample_rate}, Ch={channels}, BD={bit_depth}, Loudness={loudness}")
            
            logger.info(f" │ {clip_name:<25} │ {sample_rate:<12} │ {channels:<8} │ {bit_depth:<9} │ {loudness:<13} │ {status:<10} │")
        except Exception as e:
            logger.error(f" │ {clip_name:<25} │ {'READ ERROR':<12} │ {'-':<8} │ {'-':<9} │ {'-':<13} │ {'FAIL':<10} │")
            logger.error(f"Failed to verify '{clip_name}': {e}")
            has_warnings = True
            
    logger.info("=" * 102)
    if has_warnings:
        logger.warning("⚠️ [AUDIO VERIFICATION] Consistency pass completed with warnings/errors. Check logs above.")
    else:
        logger.info("🎉 [AUDIO VERIFICATION] Success! All 15 audio clips are 100% uniform and locked to targets.")

@router.get(
    "/audio/{clip_name:path}",
    summary="Generate and stream voice clip on-the-fly with local caching",
    description=(
        "Returns WAV audio file for the given clip name or text. "
        "Checks the local audio_cache/ folder first to serve audio instantly (0ms latency). "
        "Otherwise, it synthesizes the text via Deepgram TTS Aura-2, caches it locally, "
        "and returns the audio bytes."
    )
)
async def get_audio(
    clip_name: str
) -> Response:
    # 1. Resolve target text and cache filename
    is_predefined = clip_name in VOICE_SCRIPTS
    if is_predefined:
        text = VOICE_SCRIPTS[clip_name]
        cache_filename = f"{clip_name}.wav"
        logger.info(f"Resolved clip name '{clip_name}' to predefined script.")
    else:
        text = clip_name
        # Create a stable hash filename for dynamic text
        text_hash = hashlib.md5(text.encode("utf-8")).hexdigest()
        cache_filename = f"hash_{text_hash}.wav"
        logger.info(f"Resolved clip name directly to raw text: '{text[:50]}...' (hash: {text_hash})")

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Input text cannot be empty."
        )

    cache_path = os.path.join(CACHE_DIR, cache_filename)

    # 2. Check if cache hit exists on disk
    if os.path.exists(cache_path):
        try:
            logger.info(f"⚡ Audio Cache HIT for '{cache_filename}'. Serving instantly from local disk.")
            with open(cache_path, "rb") as f:
                audio_bytes = f.read()
            return Response(
                content=audio_bytes,
                media_type="audio/wav",
                headers={
                    "Cache-Control": "public, max-age=86400",  # cache for 24 hours in browser
                    "Accept-Ranges": "bytes",
                    "X-Audio-Cache": "HIT"
                }
            )
        except Exception as e:
            logger.warning(f"Failed to read cached audio file {cache_path}: {e}. Falling back to regeneration.")

    # 3. Cache MISS -> Call Deepgram TTS API on-the-fly
    try:
        logger.info(f"❄️ Audio Cache MISS for '{cache_filename}'. Querying Deepgram TTS API...")
        audio_bytes = await generate_voice_bytes(text)
        
        # Apply audio normalization (-16 LUFS dBFS proxy) and silence padding post-processing
        processed_bytes = post_process_audio_bytes(audio_bytes)
        
        # 4. Write bytes to cache directory to accelerate subsequent plays
        try:
            with open(cache_path, "wb") as f:
                f.write(processed_bytes)
            logger.info(f"💾 Successfully cached synthesized audio payload to '{cache_path}'")
        except Exception as cache_err:
            logger.error(f"Failed to write audio payload to cache directory: {cache_err}")

        # 5. Return response
        return Response(
            content=processed_bytes,
            media_type="audio/wav",
            headers={
                "Cache-Control": "public, max-age=86400",
                "Accept-Ranges": "bytes",
                "X-Audio-Cache": "MISS"
            }
        )
    except Exception as e:
        logger.error(f"Failed to generate dynamic TTS audio: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to synthesize speech: {str(e)}"
        )

@router.get(
    "/audio",
    summary="List expected audio scripts"
)
async def list_clips() -> JSONResponse:
    expected_clips = list(VOICE_SCRIPTS.keys())
    return JSONResponse({
        "available": expected_clips,
        "total": len(expected_clips),
        "expected": expected_clips,
        "ready": True,
        "mode": "dynamic_streaming"
    })

@router.post(
    "/audio/regenerate/{clip_name}",
    summary="Regenerate voice clip (No-op in dynamic mode)"
)
async def regenerate_clip(
    clip_name: str
) -> JSONResponse:
    if clip_name not in VOICE_SCRIPTS and not clip_name.strip():
        raise HTTPException(
            status_code=404,
            detail=f"Unknown clip or invalid text: {clip_name}"
        )
    return JSONResponse({
        "status": "dynamic_streaming_no_op",
        "clip": clip_name,
        "message": "Dynamic mode is active. Clips are generated on-the-fly."
    })


