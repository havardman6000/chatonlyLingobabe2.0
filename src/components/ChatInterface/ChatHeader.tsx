import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ChatHeaderProps {
  characterName: string;
  characterId: string;
  happiness: number;
  language: string;
  onBack?: () => void;
}

export default function ChatHeader({
  characterName,
  characterId,
  happiness,
  language,
  onBack
}: ChatHeaderProps) {
  const router = useRouter();
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push(`/chat/${language}`);
    }
  };

  const getHappinessColor = () => {
    if (happiness >= 80) return 'bg-green-500';
    if (happiness >= 60) return 'bg-blue-500';
    if (happiness >= 40) return 'bg-yellow-500';
    if (happiness >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowConfirmExit(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="px-4 py-3 flex items-center">
        <button
          onClick={handleBack}
          className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-white">
            {characterName}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${getHappinessColor()}`} />
            <span className="text-sm text-gray-400">
              Happiness: {happiness}%
            </span>
          </div>
        </div>

        <div className="w-10" />
      </div>

      {showConfirmExit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold text-white mb-4">
              Exit Chat?
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to exit? Your chat progress will be lost.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmExit(false)}
                className="px-4 py-2 text-white bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleBack}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
