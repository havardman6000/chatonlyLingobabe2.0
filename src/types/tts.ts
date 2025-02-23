// src/types/tts.ts
export type TTSLanguageCode = 'zh' | 'ja' | 'ko' | 'es';

export type TTSOptions = {
  text: string;
  language: TTSLanguageCode;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
};