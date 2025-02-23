// src/components/ChatInterface/index.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatOptions } from './ChatOptions';
import { ChatMessageComponent } from './ChatMessage';
import { useChatStore } from '@/store/chatStore';
import { characters } from '@/data/characters';
import type { ChatMessage, ChatOption } from '@/types/chat';

interface ChatInterfaceProps {
  characterId?: string;
}

export function ChatInterface({ characterId = 'mei' }: ChatInterfaceProps) {
  const router = useRouter();
  const { selectedCharacter, messages, currentScene, happiness, actions } = useChatStore();
  const [showOptions, setShowOptions] = useState(true);
  const [input, setInput] = useState('');

  const character = characters[characterId];
  const currentSceneData = character?.scenes[currentScene];

  useEffect(() => {
    if (!selectedCharacter || selectedCharacter !== characterId) {
      console.log('Initializing chat with tutor:', characterId);
      actions.reset();
      actions.selectCharacter(characterId);
    }
  }, [selectedCharacter, characterId, actions]);

  // Initialize with first message
  useEffect(() => {
    if (currentSceneData?.initial && messages.length === 0) {
      actions.addMessage({
        role: 'assistant',
        content: currentSceneData.initial
      });
    }
  }, [currentSceneData, messages.length, actions]);

  const handleOptionSelect = (option: ChatOption) => {
    // Add user message
    actions.addMessage({
      role: 'user',
      content: option
    });

    // Add response if available
    if (option.response) {
      actions.addMessage({
        role: 'assistant',
        content: option.response
      });
    }

    // Update happiness if points available
    if (typeof option.points === 'number' && characterId) {
      actions.updateHappiness(characterId, option.points);
    }

    // Move to next scene if available
    if (currentScene < 5) {
      actions.setScene(currentScene + 1);
    }

    setShowOptions(false);
    setInput('');
  };

  const handleBack = () => {
    router.push(`/chat/${character?.language}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="text-gray-400 hover:text-white p-2"
          >
            ← Back
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl text-white">{character?.name}</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Happiness: {happiness[characterId] || 50}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessageComponent
            key={index}
            message={message}
            avatarSrc={character?.image}
          />
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 text-gray-400 hover:text-white rounded"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or select a message..."
            className="flex-1 bg-gray-800 text-white rounded px-4 py-2"
          />
        </div>

        {/* Options */}
        {showOptions && currentSceneData?.options && (
          <div className="mt-4">
            <ChatOptions
              options={currentSceneData.options}
              onSelectOption={handleOptionSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}