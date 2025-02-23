// src/store/chatStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { characters } from '@/data/characters';
import { CharacterId, ChatMessage } from '@/types/chat';
import { storageService } from '@/services/storageService';

interface ChatState {
  selectedCharacter: CharacterId | null;
  messages: ChatMessage[];
  currentScene: number;
  happiness: Record<CharacterId, number>;
  actions: {
    selectCharacter: (characterId: CharacterId) => void;
    addMessage: (message: Omit<ChatMessage, 'timestamp'>) => void;
    updateHappiness: (characterId: CharacterId, points: number) => void;
    setScene: (scene: number) => void;
    reset: () => void;
  };
}

// Initialize happiness for all characters
const initialHappiness: Record<CharacterId, number> = {
  mei: 50,
  ting: 50,
  xue: 50,
  aoi: 50,
  aya: 50,
  misa: 50,
  ji: 50,
  min: 50,
  sua: 50,
  isabella: 50,
  sofia: 50,
  valentina: 50
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      selectedCharacter: null,
      messages: [],
      currentScene: 1,
      happiness: initialHappiness,
      actions: {
        selectCharacter: (characterId) => {
          const stats = storageService.getStats(characterId);
          const scene = characters[characterId]?.scenes[stats.currentScene];
          
          if (scene) {
            set({
              selectedCharacter: characterId,
              currentScene: stats.currentScene,
              messages: [{
                role: 'assistant',
                content: scene.initial,
                timestamp: Date.now()
              }],
              happiness: { 
                ...initialHappiness,
                [characterId]: stats.happiness 
              }
            });
          }
        },
        addMessage: (message) =>
          set((state) => ({
            messages: [...state.messages, { ...message, timestamp: Date.now() }]
          })),
        updateHappiness: (characterId, points) => {
          set((state) => {
            const currentHappiness = state.happiness[characterId] || 50;
            const newHappiness = Math.min(100, Math.max(0, currentHappiness + points));
            
            storageService.updateHappiness(characterId, newHappiness);
            
            return {
              happiness: {
                ...state.happiness,
                [characterId]: newHappiness
              }
            };
          });
        },
        setScene: (scene) => {
          const { selectedCharacter } = get();
          if (selectedCharacter) {
            storageService.updateScene(selectedCharacter, scene);
            set({ currentScene: scene });
          }
        },
        reset: () => {
          const { selectedCharacter } = get();
          if (selectedCharacter) {
            storageService.resetCharacterProgress(selectedCharacter);
          }
          set({
            selectedCharacter: null,
            currentScene: 1,
            messages: [],
            happiness: initialHappiness  // Reset to initial happiness values
          });
        }
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        selectedCharacter: state.selectedCharacter,
        currentScene: state.currentScene,
        messages: state.messages,
        happiness: state.happiness
      })
    }
  )
);