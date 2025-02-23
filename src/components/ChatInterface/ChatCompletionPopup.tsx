// src/components/ChatInterface/ChatCompletionPopup.tsx
'use client';

import { SupportedLanguage } from '@/types/chat';

interface ChatCompletionPopupProps {
  language: SupportedLanguage;
  onClose: () => void;
}

export default function ChatCompletionPopup({ language, onClose }: ChatCompletionPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
        {/* Success Icon */}
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

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Great Job!</h2>
          <p className="text-gray-300">
            You've completed this conversation successfully. Ready to try another tutor?
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-8 rounded-lg text-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
          >
            Choose Another Tutor
          </button>
        </div>
      </div>
    </div>
  );
}