import { SupportedLanguage } from '@/types/chat';
import { TTSLanguageCode } from '@/types/tts';

export const languageToTTSCode = (language: SupportedLanguage): TTSLanguageCode => {
  const mapping: Record<SupportedLanguage, TTSLanguageCode> = {
    'chinese': 'zh',
    'japanese': 'ja',
    'korean': 'ko',
    'spanish': 'es',
    'english': 'en'
  };

  return mapping[language];
};
