import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  className?: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
  autoPlay?: boolean;
}

export default function VideoPlayer({
  src,
  className = '',
  onReady,
  onError,
  autoPlay = true
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
      if (onReady) onReady();
    };

    const handleError = (e: Event) => {
      setIsLoading(false);
      setHasError(true);
      if (onError) onError(new Error('Failed to load video'));
      console.error('Video error:', e);
    };

    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('error', handleError);

    // Start loading the video
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
    };
  }, [src, onReady, onError]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-8 h-8 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center text-gray-400">
            <svg 
              className="w-10 h-10 mx-auto mb-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <p>Failed to load video</p>
          </div>
        </div>
      )}

      {/* Video Player */}
      <video
        ref={videoRef}
        className={`w-full h-full object-contain ${className}`}
        autoPlay={autoPlay}
        playsInline
        muted
        loop
      >
        <source src={src} type="video/mp4" />
        <p>Your browser doesn't support HTML5 video playback.</p>
      </video>
    </div>
  );
}
// src/components/ChatInterface/Videoplay.tsx