// src/store/chatStore.ts

import { create } from 'zustand';
import type { ChatMessage } from '@/types/chat';
import { characters } from '@/data/characters';

interface ChatState {
  selectedCharacter: string | null;
  messages: ChatMessage[];
  currentScene: number;
  happiness: Record<string, number>;
  actions: {
    selectCharacter: (characterId: string) => void;
    addMessage: (message: ChatMessage) => void;
    setScene: (sceneNumber: number) => void;
    updateHappiness: (characterId: string, points: number) => void;
    reset: () => void;
  };
}

export const useChatStore = create<ChatState>((set) => ({
  selectedCharacter: null,
  messages: [],
  currentScene: 1,
  happiness: {},
  actions: {
    selectCharacter: (characterId: string) => {
      if (characters[characterId]) {
        set({ 
          selectedCharacter: characterId,
          messages: [],
          currentScene: 1,
          happiness: { [characterId]: 50 } // Initial happiness
        });
      }
    },
    addMessage: (message: ChatMessage) => 
      set((state) => ({ messages: [...state.messages, message] })),
    setScene: (sceneNumber: number) => set({ currentScene: sceneNumber }),
    updateHappiness: (characterId: string, points: number) =>
      set((state) => ({
        happiness: {
          ...state.happiness,
          [characterId]: Math.min(100, Math.max(0, (state.happiness[characterId] || 50) + points))
        }
      })),
    reset: () => set({ messages: [], currentScene: 1 })
  }
}));