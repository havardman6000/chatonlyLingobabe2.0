// src/components/BackButton.tsx
import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.back()}
      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-gray-800 hover:bg-white/20 transition-colors"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" 
          clipRule="evenodd" 
        />
      </svg>
      Back
    </button>
  );
}