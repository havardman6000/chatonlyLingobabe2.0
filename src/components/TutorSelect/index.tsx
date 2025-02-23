import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { characters } from '@/data/characters';
import { Character, CharacterId, SupportedLanguage } from '@/types/chat';

interface TutorSelectProps {
  language: SupportedLanguage;
  disabledTutors: string[];
}

const getLocalizedName = (tutor: Character) => {
  switch (tutor.language) {
    case 'japanese':
      return tutor.japaneseName;
    case 'korean':
      return tutor.koreanName;
    case 'spanish':
      return tutor.spanishName;
    default:
      return tutor.chineseName;
  }
};

export function TutorSelect({ language, disabledTutors }: TutorSelectProps) {
  const router = useRouter();
  const { actions } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);

  const filteredTutors = Object.values(characters).filter(
    tutor => tutor.language === language
  );

  const handleTutorSelect = async (tutorId: string) => {
    actions.selectCharacter(tutorId as CharacterId);
    router.push(`/chat/${language}/${tutorId}`);
  };

  return (
    <div>
      {isLoading && (
        <div className="text-center mb-8 py-2 bg-white/30 backdrop-blur-sm rounded-lg">
          <p className="animate-pulse text-gray-700">Loading access information...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.map((tutor) => (
          <div
            key={tutor.id}
            onClick={() => {
              if (disabledTutors.includes(tutor.name)) return;
              handleTutorSelect(tutor.id);
            }}
            className={`relative rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 ${
              disabledTutors.includes(tutor.name) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ height: '400px' }}
          >
            {disabledTutors.includes(tutor.name) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-lg font-semibold">
                Still in the works
              </div>
            )}
            <img
              src={tutor.image}
              alt={tutor.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-30 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">
                {tutor.name} <span className="opacity-90">({getLocalizedName(tutor)})</span>
              </h3>
              <p className="text-white text-opacity-90">
                {tutor.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// src/components/TutorSelect/index.tsx