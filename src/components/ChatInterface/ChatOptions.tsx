import { ChatOption } from '@/types/chat';

interface ChatOptionsProps {
  options: ChatOption[];
  onSelectOption: (option: ChatOption) => void;
}

export function ChatOptions({ options, onSelectOption }: ChatOptionsProps) {
  const getPrimaryText = (option: ChatOption) => {
    return option.chinese ||
           option.japanese ||
           option.korean ||
           option.spanish ||
           option.english;
  };

  const getPronunciation = (option: ChatOption) => {
    return option.pinyin ||
           option.romaji ||
           option.romanized ||
           '';
  };

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelectOption(option)}
          className="w-full text-left bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-white">
                {getPrimaryText(option)}
              </p>
              {getPronunciation(option) && (
                <p className="text-sm text-gray-400 mt-1">
                  {getPronunciation(option)}
                </p>
              )}
              <p className="text-sm text-gray-400 mt-1">
                {option.english}
              </p>
            </div>
            <button
              className="ml-2 p-1 text-gray-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                // Add audio playback functionality here
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </button>
      ))}
    </div>
  );
}
// src/components/ChatInterface/ChatOptions.tsx