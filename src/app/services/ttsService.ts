import { SupportedLanguage } from '@/types/chat';
import { TTSOptions, TTSLanguageCode } from '@/types/tts';
import { languageToTTSCode } from '@/utils/languageUtils';

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
      this.stop();

      const ttsCode: TTSLanguageCode = languageToTTSCode(language as SupportedLanguage);
      const cacheKey = `${ttsCode}:${text}`;
      let audio = this.audioCache.get(cacheKey);

      if (!audio) {
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
        audio = new Audio(url);
        this.audioCache.set(cacheKey, audio);
      }

      audio.onplay = () => onStart?.();
      audio.onended = () => {
        onEnd?.();
        this.currentAudio = null;
      };
      audio.onerror = () => {
        onError?.(new Error('Audio playback failed'));
        this.currentAudio = null;
      };

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
