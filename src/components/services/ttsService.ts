// src/services/ttsService.ts
import { SupportedLanguage } from '@/types/chat';

interface TTSOptions {
  text: string;
  language: SupportedLanguage;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

// Map full language names to TTS codes
const languageToTTSCode = {
  'chinese': 'zh',
  'japanese': 'ja',
  'korean': 'ko',
  'spanish': 'es'
} as const;

class TTSService {
  private static instance: TTSService;
  private currentAudio: HTMLAudioElement | null = null;
  private audioCache = new Map<string, HTMLAudioElement>();

  private constructor() {}

  static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  async speak({
    text,
    language,
    onStart,
    onEnd,
    onError
  }: TTSOptions): Promise<void> {
    try {
      // Stop any currently playing audio
      this.stop();

      const ttsCode = languageToTTSCode[language];
      
      // Check cache first
      const cacheKey = `${ttsCode}:${text}`;
      let audio = this.audioCache.get(cacheKey);

      if (!audio) {
        // Make API request to get audio
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text, 
            language: ttsCode 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate speech');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        // Create and cache new audio element
        audio = new Audio(url);
        this.audioCache.set(cacheKey, audio);
      }

      // Set up event listeners
      audio.onplay = () => onStart?.();
      audio.onended = () => {
        onEnd?.();
        this.currentAudio = null;
      };
      audio.onerror = () => {
        onError?.(new Error('Audio playback failed'));
        this.currentAudio = null;
      };

      // Play the audio
      this.currentAudio = audio;
      await audio.play();

    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('TTS failed'));
      this.currentAudio = null;
    }
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  clearCache(): void {
    this.audioCache.forEach((audio, key) => {
      URL.revokeObjectURL(audio.src);
    });
    this.audioCache.clear();
  }
}

export const ttsService = TTSService.getInstance();