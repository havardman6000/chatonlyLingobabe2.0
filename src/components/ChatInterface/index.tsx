// src/components/ChatInterface/index.tsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessageComponent } from './ChatMessage';
import { ChatOptions } from './ChatOptions';
import ChatCompletionPopup from '../ChatInterface/ChatCompletionPopup/index';
import { useChatStore } from '@/store/chatStore';
import { characters } from '@/data/characters';
import type { ChatMessage, ChatOption } from '@/types/chat';

interface ChatInterfaceProps {
  characterId: string;
}

export default function ChatInterface({ characterId }: ChatInterfaceProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedCharacter, messages, currentScene, happiness, actions } = useChatStore();
  
  // Local state
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const character = characters[characterId];
  const currentSceneData = character?.scenes[currentScene];

  useEffect(() => {
    if (!selectedCharacter || selectedCharacter !== characterId) {
      actions.reset();
      actions.selectCharacter(characterId);
    }
  }, [selectedCharacter, characterId, actions]);

  useEffect(() => {
    if (currentSceneData?.initial && messages.length === 0) {
      actions.addMessage({
        role: 'assistant',
        content: currentSceneData.initial
      });
    }
  }, [currentSceneData, messages.length, actions]);

  const handleOptionSelect = async (option: ChatOption) => {
    if (isTransitioning) return;
    setError(null);

    try {
      // Add user message
      actions.addMessage({
        role: 'user',
        content: option
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      // Add response if available
      if (option.response) {
        actions.addMessage({
          role: 'assistant',
          content: option.response
        });
      }

      // Update happiness if points available
      if (typeof option.points === 'number') {
        actions.updateHappiness(characterId, option.points);
      }

      // Progress to next scene if available
      if (currentScene < 5) {
        setIsTransitioning(true);
        setTimeout(() => {
          actions.setScene(currentScene + 1);
          setIsTransitioning(false);
          setShowOptions(true);
        }, 1000);
      } else {
        setShowCompletionPopup(true);
      }

      setInput('');
    } catch (error) {
      setError('Failed to process response. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessageComponent
            key={index}
            message={message}
            avatarSrc={character?.image}
            language={character?.language || 'chinese'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-600 text-white text-center">
          {error}
        </div>
      )}

      {/* Chat Options */}
      <div className="mt-4">
        {showOptions && currentSceneData?.options && (
          <ChatOptions
            options={currentSceneData.options}
            onSelectOption={handleOptionSelect}
          />
        )}
      </div>

      {/* Completion Popup */}
      {showCompletionPopup && character && (
        <ChatCompletionPopup
          language={character.language}
          onClose={() => {
            setShowCompletionPopup(false);
            router.push(`/chat/${character.language}`);
          }}
        />
      )}
    </div>
  );
}