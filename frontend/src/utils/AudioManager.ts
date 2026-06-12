/**
 * Centralized Audio Manager for pre-generated MeloTTS audio files.
 * Provides singleton control, caching, prevention of overlapping playback,
 * volume/mute settings, and state management.
 */
export class AudioManager {
  private static instance: AudioManager;
  
  private currentAudio: HTMLAudioElement | null = null;
  private currentSectionName: string | null = null;
  private audioCache: Record<string, HTMLAudioElement> = {};
  
  private volume: number = 1.0;
  private isMuted: boolean = false;
  
  // Custom listeners for state updates (e.g. to sync UI when playback completes)
  private stateListeners: Set<(state: { isSpeaking: boolean; currentSection: string | null }) => void> = new Set();

  private constructor() {
    // Load persisted preferences
    const savedMuted = localStorage.getItem("portfolio_audio_muted");
    if (savedMuted !== null) {
      this.isMuted = savedMuted === "true";
    }
    
    const savedVolume = localStorage.getItem("portfolio_audio_volume");
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
      if (isNaN(this.volume)) this.volume = 1.0;
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Preloads a set of section audios into memory.
   */
  public preloadAudios(sections: string[]): void {
    sections.forEach((section) => {
      const url = `/audio/${section}.mp3`;
      if (!this.audioCache[url]) {
        const audio = new Audio(url);
        audio.preload = "auto";
        this.audioCache[url] = audio;
      }
    });
  }

  /**
   * Play the audio file for the specified section.
   * Stops any currently playing audio immediately.
   */
  public playSectionAudio(sectionName: string, onEnd?: () => void): HTMLAudioElement | null {
    this.stopAudio();

    if (this.isMuted) {
      onEnd?.();
      return null;
    }

    const audioUrl = `/audio/${sectionName}.mp3`;
    let audio = this.audioCache[audioUrl];

    if (!audio) {
      audio = new Audio(audioUrl);
      this.audioCache[audioUrl] = audio;
    }

    // Configure audio parameters
    audio.volume = this.isMuted ? 0 : this.volume;
    
    // Clear any previous listeners
    audio.onended = null;
    audio.onerror = null;
    audio.onpause = null;
    audio.onplay = null;

    this.currentAudio = audio;
    this.currentSectionName = sectionName;

    audio.onplay = () => {
      this.notifyListeners();
    };

    audio.onended = () => {
      if (this.currentAudio === audio) {
        this.currentAudio = null;
        this.currentSectionName = null;
      }
      this.notifyListeners();
      onEnd?.();
    };

    audio.onerror = (e) => {
      console.error(`Audio playback error for section '${sectionName}':`, e);
      if (this.currentAudio === audio) {
        this.currentAudio = null;
        this.currentSectionName = null;
      }
      this.notifyListeners();
      onEnd?.();
    };

    audio.onpause = () => {
      this.notifyListeners();
    };

    // Play with safety catch for autoplay policies
    audio.play().catch((err) => {
      console.warn(`Autoplay or play request prevented for '${sectionName}':`, err);
      if (this.currentAudio === audio) {
        this.currentAudio = null;
        this.currentSectionName = null;
      }
      this.notifyListeners();
      onEnd?.();
    });

    return audio;
  }

  /**
   * Stops the current playing audio and resets status.
   */
  public stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      this.currentSectionName = null;
      this.notifyListeners();
    }
  }

  /**
   * Pauses the current audio.
   */
  public pauseAudio(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.notifyListeners();
    }
  }

  /**
   * Resumes the current audio if paused.
   */
  public resumeAudio(): void {
    if (this.currentAudio && this.currentAudio.paused && !this.isMuted) {
      this.currentAudio.play().catch((err) => {
        console.warn("Could not resume audio:", err);
      });
      this.notifyListeners();
    }
  }

  /**
   * Sets volume level (0.0 to 1.0)
   */
  public setVolume(volume: number): void {
    // Bound the volume between 0 and 1
    const boundedVolume = Math.max(0.0, Math.min(1.0, volume));
    this.volume = boundedVolume;
    
    if (this.currentAudio) {
      this.currentAudio.volume = this.isMuted ? 0 : boundedVolume;
    }
    
    localStorage.setItem("portfolio_audio_volume", boundedVolume.toString());
    this.notifyListeners();
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Toggle mute state.
   */
  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.currentAudio) {
      this.currentAudio.volume = muted ? 0 : this.volume;
    }
    
    localStorage.setItem("portfolio_audio_muted", muted.toString());
    this.notifyListeners();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Checks if audio is currently playing.
   */
  public isSpeaking(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  /**
   * Gets the active section name being read.
   */
  public getCurrentSection(): string | null {
    return this.currentSectionName;
  }

  // ── Listener Subscription ──────────────────
  public subscribe(listener: (state: { isSpeaking: boolean; currentSection: string | null; volume: number; isMuted: boolean }) => void): () => void {
    this.stateListeners.add(listener);
    // Initial call
    listener({
      isSpeaking: this.isSpeaking(),
      currentSection: this.currentSectionName,
      volume: this.volume,
      isMuted: this.isMuted
    });
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const state = {
      isSpeaking: this.isSpeaking(),
      currentSection: this.currentSectionName,
      volume: this.volume,
      isMuted: this.isMuted
    };
    this.stateListeners.forEach((listener) => listener(state));
  }
}
