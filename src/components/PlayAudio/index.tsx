// src/components/PlayAudio/index.tsx
import { useState, useCallback } from 'react';
import { ttsService } from '@/app/services/ttsService';
import { TTSLanguageCode } from '@/types/tts';

interface PlayAudioProps {
  text: string;
  language: TTSLanguageCode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PlayAudio({ 
  text, 
  language,
  className = '',
  size = 'md'
}: PlayAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = useCallback(async () => {
    if (isPlaying || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await ttsService.speak({
        text,
        language,
        onStart: () => {
          setIsLoading(false);
          setIsPlaying(true);
        },
        onEnd: () => {
          setIsPlaying(false);
        },
        onError: (error: Error) => {
          setError(error.message);
          setIsPlaying(false);
          setIsLoading(false);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play audio');
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [text, language, isPlaying, isLoading]);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying || isLoading}
      className={`relative rounded-full flex items-center justify-center 
        ${isPlaying ? 'bg-green-600' : 'bg-blue-600'} 
        hover:opacity-90 transition-all
        ${sizeClasses[size]}
        ${className}`}
      aria-label={isPlaying ? 'Playing audio' : 'Play audio'}
      title={error || 'Play audio'}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : isPlaying ? (
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}

      {error && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {error}
        </div>
      )}
    </button>
  );
}