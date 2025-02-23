// src/components/TutorSelect.tsx
'use client';

import { useRouter } from 'next/navigation';
import { characters } from '@/data/characters';
import type { SupportedLanguage } from '@/types/chat';

interface TutorSelectProps {
  language: SupportedLanguage;
  disabledTutors: string[];
}

export function TutorSelect({ language, disabledTutors }: TutorSelectProps) {
  const router = useRouter();

  const tutors = Object.values(characters).filter(
    tutor => tutor.language === language
  );

  const getLocalizedName = (name: string, nativeName?: string) => {
    if (!nativeName) return name;
    return `${name} (${nativeName})`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tutors.map((tutor) => {
        const isDisabled = disabledTutors.includes(tutor.name);
        const nativeName = 
          language === 'chinese' ? tutor.chineseName :
          language === 'japanese' ? tutor.japaneseName :
          language === 'korean' ? tutor.koreanName :
          language === 'spanish' ? tutor.spanishName : undefined;

        return (
          <div
            key={tutor.id}
            onClick={() => !isDisabled && router.push(`/chat/${language}/${tutor.id}`)}
            className={`relative rounded-xl overflow-hidden ${
              isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105'
            } shadow-lg`}
          >
            {isDisabled && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <p className="text-white text-xl font-bold">Coming Soon</p>
              </div>
            )}
            <img
              src={tutor.image}
              alt={tutor.name}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-6 text-white">
              <h3 className="text-2xl font-bold">
                {getLocalizedName(tutor.name, nativeName)}
              </h3>
              <p className="text-lg">{tutor.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}