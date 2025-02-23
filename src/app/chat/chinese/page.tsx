// src/app/chat/chinese/page.tsx
'use client';

import { BackButton } from '@/components/BackButton';
import { useRouter } from 'next/navigation';
import { characters } from '@/data/characters';

export default function ChinesePage() {
  const router = useRouter();
  
  const chineseTutors = Object.values(characters).filter(
    tutor => tutor.language === 'chinese'
  );

  const activeTutor = chineseTutors[0]; // Mei
  const disabledTutors = chineseTutors.slice(1); // Ting and Xue

  return (
    <main className="min-h-screen bg-gradient-to-r from-pink-50 to-rose-100 py-12">
      <div className="fixed top-4 left-4 z-50">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Chinese Tutor
          </h1>
          <p className="text-2xl text-gray-600">
            Select a tutor to begin your Chinese learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active Tutor */}
          <div
            onClick={() => router.push(`/chat/chinese/${activeTutor.id}`)}
            className="relative rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <img
              src={activeTutor.image}
              alt={activeTutor.name}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-6 text-white">
              <h3 className="text-2xl font-bold">
                {activeTutor.name}
                {activeTutor.chineseName && ` (${activeTutor.chineseName})`}
              </h3>
              <p className="text-lg">{activeTutor.description}</p>
            </div>
          </div>

          {/* Disabled Tutors */}
          {disabledTutors.map((tutor) => (
            <div key={tutor.id} className="relative rounded-xl overflow-hidden shadow-lg opacity-50">
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <p className="text-white text-xl font-bold">Coming Soon</p>
              </div>
              <img
                src={tutor.image}
                alt={tutor.name}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-6 text-white">
                <h3 className="text-xl font-bold">
                  {tutor.name}
                  {tutor.chineseName && ` (${tutor.chineseName})`}
                </h3>
                <p>{tutor.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}