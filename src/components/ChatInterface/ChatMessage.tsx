// src/components/ChatInterface/ChatMessage.tsx

import { ChatMessage } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessage;
  avatarSrc?: string;
}

export function ChatMessageComponent({ message, avatarSrc }: ChatMessageProps) {
  const isUserMessage = message.role === 'user';

  // Get the primary text based on message content
  const getPrimaryText = () => {
    const content = message.content;
    return content.chinese || 
           content.japanese || 
           content.korean || 
           content.spanish || 
           content.english;
  };

  // Get pronunciation text if available
  const getPronunciation = () => {
    const content = message.content;
    return content.pinyin || 
           content.romaji || 
           content.romanized;
  };

  return (
    <div className={`flex items-start gap-3 ${isUserMessage ? 'flex-row-reverse' : ''}`}>
      {!isUserMessage && avatarSrc && (
        <img 
          src={avatarSrc} 
          alt="Tutor" 
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
      )}
      
      <div className={`relative rounded-lg p-4 max-w-[80%] ${
        isUserMessage ? 'bg-green-600 text-white' : 'bg-gray-800 text-white'
      }`}>
        {/* Main text in native language */}
        <p className="text-base leading-relaxed">
          {getPrimaryText()}
        </p>

        {/* Pronunciation */}
        {getPronunciation() && (
          <p className="text-sm text-gray-300 mt-1">
            {getPronunciation()}
          </p>
        )}

        {/* English translation */}
        {message.content.english && !isUserMessage && (
          <p className="text-sm text-gray-300 mt-1">
            {message.content.english}
          </p>
        )}

        {/* Context (in italics) */}
        {message.content.context && (
          <p className="text-sm italic text-gray-400 mt-2">
            {message.content.context}
          </p>
        )}

        {/* Play button for audio */}
        <button 
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"
          aria-label="Play audio"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}