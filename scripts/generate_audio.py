import os
import sys

# Audio texts for each section
SECTIONS_TEXT = {
    "intro": "Hi. I am Pavan Kumar. Welcome to my AI engineering portfolio. Explore my projects, skills, and professional journey.",
    "about": "This section introduces my background, interests, and journey in artificial intelligence and software engineering.",
    "skills": "This section highlights my technical expertise including Python, FastAPI, machine learning, large language models, retrieval augmented generation, and agentic AI systems.",
    "projects": "This section showcases the AI projects and applications I have built, including intelligent assistants, automation systems, and research prototypes.",
    "experience": "This section summarizes my internships, industry exposure, and hands-on engineering experience.",
    "education": "This section presents my academic background and learning journey.",
    "achievements": "This section highlights notable accomplishments, certifications, and milestones.",
    "contact": "This section contains information for professional collaboration and communication."
}

def generate_with_melo(output_dir):
    print("Attempting to generate audio using MeloTTS...")
    try:
        from melo.api import TTS
        
        # Initialize TTS
        model = TTS(language="EN", device="cpu")
        speaker_ids = model.hps.data.spk2id
        
        # Get Indian English speaker ID (usually 'EN-IN')
        speaker_id = speaker_ids.get("EN-IN")
        if speaker_id is None:
            # Fallback search for a key containing 'IN'
            indian_keys = [k for k in speaker_ids.keys() if "IN" in k]
            if indian_keys:
                speaker_id = speaker_ids[indian_keys[0]]
            else:
                speaker_id = 0
                
        print(f"Using MeloTTS speaker ID: {speaker_id}")
        
        for section, text in SECTIONS_TEXT.items():
            output_path = os.path.join(output_dir, f"{section}.mp3")
            if os.path.exists(output_path):
                print(f"Skipping {section}.mp3 (already exists)")
                continue
                
            print(f"Generating {section}.mp3 via MeloTTS...")
            # Note: MeloTTS outputs WAV. We will generate the wav file.
            wav_path = os.path.join(output_dir, f"{section}.wav")
            model.tts_to_file(text, speaker_id, wav_path, speed=1.0)
            
            # Rename or convert wav to mp3. Since modern audio elements can play WAV as well,
            # we can convert it or name it .mp3 if MeloTTS supports it directly, or keep wav and rename
            # for maximum compatibility. If ffmpeg is present, we can convert.
            try:
                import subprocess
                subprocess.run(["ffmpeg", "-y", "-i", wav_path, output_path], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                os.remove(wav_path)
                print(f"Successfully created and converted to {output_path}")
            except Exception:
                # If ffmpeg is not available, just rename wav to mp3 for the web client,
                # or keep it as WAV but named .mp3 (browsers can still play it).
                if os.path.exists(wav_path):
                    if os.path.exists(output_path):
                        os.remove(output_path)
                    os.rename(wav_path, output_path)
                    print(f"Warning: ffmpeg not found. Renamed WAV format output to {output_path}")
        return True
    except Exception as e:
        print(f"MeloTTS generation failed/not available: {e}")
        return False

def generate_with_fallback_edge(output_dir):
    print("Attempting to generate high-quality audio using edge-tts fallback...")
    try:
        # Check if edge-tts is installed; if not, try to install it
        try:
            import edge_tts
        except ImportError:
            print("Installing edge-tts for fallback generation...")
            import subprocess
            subprocess.run([sys.executable, "-m", "pip", "install", "edge-tts"], check=True)
            import edge_tts

        import asyncio

        async def make_tts():
            # Indian English neural voice (Neerja is a very natural female voice, Prabhat is male)
            voice = "en-IN-NeerjaNeural"
            
            for section, text in SECTIONS_TEXT.items():
                output_path = os.path.join(output_dir, f"{section}.mp3")
                if os.path.exists(output_path):
                    print(f"Skipping {section}.mp3 (already exists)")
                    continue
                    
                print(f"Generating {section}.mp3 via edge-tts ({voice})...")
                communicate = edge_tts.Communicate(text, voice, rate="-10%") # slightly slower for clarity
                await communicate.save(output_path)
                print(f"Created {output_path}")

        # Run async loop
        asyncio.run(make_tts())
        return True
    except Exception as e:
        print(f"edge-tts fallback generation failed: {e}")
        return False

def main():
    # Target directory in React public assets folder
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.abspath(os.path.join(script_dir, "..", "frontend", "public", "audio"))
    
    os.makedirs(output_dir, exist_ok=True)
    print(f"Target audio directory: {output_dir}")
    
    # Try MeloTTS first
    success = generate_with_melo(output_dir)
    
    # Try edge-tts fallback if MeloTTS fails or is missing
    if not success:
        success = generate_with_fallback_edge(output_dir)
        
    if success:
        print("\nAll audio files generated successfully!")
    else:
        print("\nError: Failed to generate audio files. Please ensure you have network access or edge-tts/melo installed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
