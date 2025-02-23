import React, { useEffect, useState } from 'react';

interface SceneTransitionProps {
  isActive: boolean;
  children: React.ReactNode;
  video?: string;
  onTransitionComplete?: () => void;
}

export default function SceneTransition({
  isActive,
  children,
  video,
  onTransitionComplete
}: SceneTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(!video);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (video && !videoElement) {
      const element = document.createElement('video');
      element.src = video;
      element.muted = true;
      element.playsInline = true;
      
      element.onloadeddata = () => {
        setIsVideoLoaded(true);
        element.play().catch(console.error);
      };
      
      element.onerror = () => {
        console.error('Failed to load transition video');
        setIsVideoLoaded(true); // Continue anyway
      };

      setVideoElement(element);
    }
  }, [video, videoElement]);

  useEffect(() => {
    if (isActive) {
      // Start fade in
      setIsVisible(true);
      
      // Play video if available
      if (videoElement) {
        videoElement.currentTime = 0;
        videoElement.play().catch(console.error);
      }
      
      // Notify when transition is complete
      const timer = setTimeout(() => {
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }, 1000); // Adjust timing based on animation duration
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      
      // Stop video if playing
      if (videoElement) {
        videoElement.pause();
      }
    }
  }, [isActive, videoElement, onTransitionComplete]);

  // Cleanup video element
  useEffect(() => {
    return () => {
      if (videoElement) {
        videoElement.remove();
      }
    };
  }, [videoElement]);

  return (
    <div className="relative w-full min-h-[200px]">
      {/* Loading State */}
      {video && !isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-8 h-8 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Video Background */}
      {video && videoElement && (
        <div 
          className={`absolute inset-0 transition-opacity duration-500
            ${isVisible && isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <video
            src={video}
            className="w-full h-full object-cover"
            muted
            playsInline
            loop
          />
        </div>
      )}

      {/* Scene Content */}
      <div
        className={`relative z-10 transform transition-all duration-1000 ease-in-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          ${isVideoLoaded ? '' : 'invisible'}`}
      >
        {children}
      </div>

      {/* Transition Overlay */}
      <div
        className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-500
          ${isVisible ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      />
    </div>
  );
}