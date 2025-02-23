// src/app/page.tsx
'use client';

import { useRouter } from 'next/navigation';

const languages = [
  { id: 'chinese', name: 'Chinese', native: '中文' },
  { id: 'japanese', name: 'Japanese', native: '日本語' },
  { id: 'korean', name: 'Korean', native: '한국어' },
  { id: 'spanish', name: 'Spanish', native: 'Español' }
];

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-r from-pink-50 to-rose-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-900 mb-4">
          Welcome to Lingobabe AI
        </h1>
        <p className="text-xl text-center text-gray-700 mb-12">
          Choose your language and start chatting with our AI tutors
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => router.push(`/chat/${lang.id}`)}
              className="relative overflow-hidden rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-6 text-left group"
            >
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-gray-900">{lang.name}</h2>
                <p className="text-xl text-gray-700">{lang.native}</p>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}