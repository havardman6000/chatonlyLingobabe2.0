// src/services/storageService.ts

import { CharacterId } from '@/types/chat';

const STORAGE_KEYS = {
  MESSAGES: 'chat_messages_',
  HAPPINESS: 'chat_happiness_',
  SCENE: 'chat_scene_',
} as const;

export interface ChatStats {
  messages: number;
  happiness: number;
  currentScene: number;
}

class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  getStats(characterId: CharacterId): ChatStats {
    const defaultStats: ChatStats = {
      messages: 0,
      happiness: 50,
      currentScene: 1
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES + characterId);
      if (stored) {
        return JSON.parse(stored);
      }
      return defaultStats;
    } catch {
      return defaultStats;
    }
  }

  updateHappiness(characterId: CharacterId, newHappiness: number): void {
    const stats = this.getStats(characterId);
    const updatedStats = {
      ...stats,
      happiness: Math.min(100, Math.max(0, newHappiness))
    };
    
    localStorage.setItem(
      STORAGE_KEYS.HAPPINESS + characterId,
      JSON.stringify(updatedStats)
    );
  }

  updateScene(characterId: CharacterId, scene: number): void {
    const stats = this.getStats(characterId);
    const updatedStats = {
      ...stats,
      currentScene: scene
    };
    
    localStorage.setItem(
      STORAGE_KEYS.SCENE + characterId,
      JSON.stringify(updatedStats)
    );
  }

  resetCharacterProgress(characterId: CharacterId): void {
    localStorage.removeItem(STORAGE_KEYS.MESSAGES + characterId);
    localStorage.removeItem(STORAGE_KEYS.HAPPINESS + characterId);
    localStorage.removeItem(STORAGE_KEYS.SCENE + characterId);
  }

  clearAllProgress(): void {
    Object.values(STORAGE_KEYS).forEach(prefix => {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
      keys.forEach(key => localStorage.removeItem(key));
    });
  }
}

export const storageService = StorageService.getInstance();