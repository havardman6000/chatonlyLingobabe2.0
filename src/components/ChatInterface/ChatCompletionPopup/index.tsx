import React from 'react';
import { useRouter } from 'next/navigation';
import { SupportedLanguage } from '@/types/chat';

interface ChatCompletionPopupProps {
  language: SupportedLanguage;
  onClose?: () => void;
}

export default function ChatCompletionPopup({ language, onClose }: ChatCompletionPopupProps) {
  const router = useRouter();

  const handleBackToTutors = () => {
    if (onClose) onClose();
    router.push(`/chat/${language}`);
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scaleIn">
        <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Conversation Complete!</h2>
          <p className="text-gray-300">
            Well done! You've successfully completed this conversation. Would you like to try chatting with another tutor?
          </p>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleBackToTutors}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-8 rounded-lg text-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
          >
            Return to Tutor Selection
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
