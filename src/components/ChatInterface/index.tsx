'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessageComponent } from './ChatMessage';
import { ChatOptions } from './ChatOptions';
import ChatHeader from './ChatHeader';
import ChatCompletionPopup from './ChatCompletionPopup';
import VideoPlayer from './Videoplayer';
import { useChatStore } from '@/store/chatStore';
import { characters } from '@/data/characters';
import type { CharacterId, ChatOption } from '@/types/chat';

interface ChatInterfaceProps {
  characterId: CharacterId;
}

export default function ChatInterface({ characterId }: ChatInterfaceProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedCharacter, messages, currentScene, happiness, actions } = useChatStore();

  const [showOptions, setShowOptions] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  const character = characters[characterId];
  const currentSceneData = character?.scenes[currentScene];

  // Initialize chat
  useEffect(() => {
    if (!selectedCharacter || selectedCharacter !== characterId) {
      actions.reset();
      actions.selectCharacter(characterId);
    }
  }, [selectedCharacter, characterId, actions]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOptionSelect = async (option: ChatOption) => {
    if (isTransitioning) return;
    setError(null);

    try {
      // Add user message
      actions.addMessage({
        role: 'user',
        content: option
      });

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Add assistant response if available
      if (option.response) {
        actions.addMessage({
          role: 'assistant',
          content: option.response
        });

        if (option.response.video) {
          setCurrentVideo(option.response.video);
        }
      }

      // Update happiness if points provided
      if (typeof option.points === 'number') {
        actions.updateHappiness(characterId, option.points);
      }

      // Handle scene transition
      if (currentScene >= 5) {
        setShowCompletionPopup(true);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          actions.setScene(currentScene + 1);
          setIsTransitioning(false);
          setShowOptions(true);
        }, 1000);
      }
    } catch (error) {
      setError('Failed to process response. Please try again.');
    }
  };

  const handleCompletionClose = () => {
    setShowCompletionPopup(false);
    router.push(`/chat/${character?.language}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <ChatHeader
        characterName={character?.name || ''}
        characterId={characterId}
        happiness={happiness[characterId] || 50}
        language={character?.language || 'chinese'}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentVideo && (
          <div className="sticky top-0 z-10 pb-4">
            <VideoPlayer src={currentVideo} />
          </div>
        )}

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

      {error && (
        <div className="px-4 py-2 bg-red-600 text-white text-center">
          {error}
        </div>
      )}

      <div className="p-4">
        {showOptions && currentSceneData?.options && (
          <ChatOptions
            options={currentSceneData.options}
            onSelectOption={handleOptionSelect}
          />
        )}
      </div>

      {showCompletionPopup && character && (
        <ChatCompletionPopup
          language={character.language}
          onClose={handleCompletionClose}
        />
      )}
    </div>
  );
}