// src/types/chat.ts

export type SupportedLanguage = 'chinese' | 'japanese' | 'korean' | 'spanish';

export interface Character {
  id: string;
  name: string;
  language: SupportedLanguage;
  description: string;
  image: string;
  chineseName?: string;
  japaneseName?: string;
  koreanName?: string;
  spanishName?: string;
  scenes: Record<number, Scene>;
}

export interface Scene {
  initial?: MessageContent;
  options: ChatOption[];
  video?: string;
  transition?: string;
}

export interface MessageContent {
  english: string;
  chinese?: string;
  pinyin?: string;
  japanese?: string;
  romaji?: string;
  korean?: string;
  romanized?: string;
  spanish?: string;
  video?: string;
  context?: string;
}

export interface ChatOption {
  id: string;  // Added this
  english: string;
  chinese?: string;
  pinyin?: string;
  japanese?: string;
  romaji?: string;
  korean?: string;
  romanized?: string;
  spanish?: string;
  response?: MessageContent;
  points?: number;
  video?: string;
  context?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: MessageContent;
  timestamp?: number;
}