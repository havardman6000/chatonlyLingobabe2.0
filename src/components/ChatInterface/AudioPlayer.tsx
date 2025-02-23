// src/components/AudioPlayer.tsx
'use client';

import React, { useState } from 'react';

interface AudioPlayerProps {
  text: string;
  language: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClose?: () => void;  // Added onClose prop
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  text,
  language,
  className = '',
  size = 'md',
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = async () => {
    if (isPlaying || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onplay = () => {
        setIsLoading(false);
        setIsPlaying(true);
      };

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        if (onClose) onClose();
      };

      audio.onerror = () => {
        setError('Failed to play audio');
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
        if (onClose) onClose();
      };

      await audio.play();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play audio');
      setIsPlaying(false);
      setIsLoading(false);
      if (onClose) onClose();
    }
  };

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
};

export default AudioPlayer;