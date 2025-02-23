import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { characters } from '@/data/characters';
import { CharacterId, ChatMessage } from '@/types/chat';

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

// Initialize happiness with default values for each character
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
  valentina: 50,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      selectedCharacter: null,
      currentScene: 1,
      messages: [],
      happiness: initialHappiness,
      actions: {
        selectCharacter: (characterId) => {
          const scene = characters[characterId]?.scenes[1];
          if (scene) {
            set({
              selectedCharacter: characterId,
              currentScene: 1,
              messages: [{
                role: 'assistant',
                content: scene.initial,
                timestamp: Date.now()
              }],
              happiness: { ...initialHappiness, [characterId]: 50 }
            });
          }
        },
        addMessage: (message) =>
          set((state) => ({
            messages: [...state.messages, { ...message, timestamp: Date.now() }]
          })),
        updateHappiness: (characterId, points) =>
          set((state) => ({
            happiness: {
              ...state.happiness,
              [characterId]: Math.min(100, Math.max(0, (state.happiness[characterId] || 50) + points))
            }
          })),
        setScene: (scene) =>
          set({ currentScene: scene }),
        reset: () =>
          set({
            selectedCharacter: null,
            currentScene: 1,
            messages: [],
            happiness: initialHappiness
          })
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
