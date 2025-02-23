import { useCallback } from 'react';
import { ChatMessage, SupportedLanguage } from '@/types/chat';
import PlayAudio from '@/components/PlayAudio';
import { languageToTTSCode } from '@/utils/languageUtils';

interface ChatMessageProps {
  message: ChatMessage;
  avatarSrc?: string;
  language: SupportedLanguage;
}

export function ChatMessageComponent({ message, avatarSrc, language }: ChatMessageProps) {
  const isUserMessage = message.role === 'user';

  const getPrimaryText = useCallback(() => {
    const content = message.content;
    return content[language] || content.english;
  }, [message, language]);

  const getPronunciation = useCallback(() => {
    const content = message.content;
    switch (language) {
      case 'chinese':
        return content.pinyin;
      case 'japanese':
        return content.romaji;
      case 'korean':
        return content.romanized;
      default:
        return null;
    }
  }, [message, language]);

  const ttsCode = languageToTTSCode(language);

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
        <div className="flex items-center justify-between gap-2">
          <p className="text-base leading-relaxed flex-1">
            {getPrimaryText()}
          </p>
          {!isUserMessage && (
            <PlayAudio
              text={getPrimaryText()}
              language={ttsCode}
              size="sm"
              className="flex-shrink-0"
            />
          )}
        </div>

        {getPronunciation() && (
          <p className="text-sm text-gray-300 mt-1">
            {getPronunciation()}
          </p>
        )}

        {message.content.english && language !== 'english' && !isUserMessage && (
          <p className="text-sm text-gray-300 mt-1">
            {message.content.english}
          </p>
        )}

        {message.content.context && (
          <p className="text-sm italic text-gray-400 mt-2">
            {message.content.context}
          </p>
        )}
      </div>
    </div>
  );
}
// src/components/ChatInterface/ChatMessage.tsx