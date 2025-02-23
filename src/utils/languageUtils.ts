// src/utils/languageUtils.ts
import { SupportedLanguage } from '@/types/chat';

export const languageToTTSCode = (language: SupportedLanguage): 'zh' | 'ja' | 'ko' | 'es' => {
  const mapping = {
    'chinese': 'zh',
    'japanese': 'ja',
    'korean': 'ko',
    'spanish': 'es'
  } as const;

  return mapping[language];
};