// src/app/chat/[language]/[tutorId]/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { characters } from '@/data/characters';
import type { CharacterId } from '@/types/chat';

export default function TutorChatPage({
  params
}: {
  params: { language: string; tutorId: string }
}) {
  const router = useRouter();
  const tutorId = params.tutorId as CharacterId;
  const tutor = characters[tutorId];

  // Validate the tutor exists and matches the language
  useEffect(() => {
    if (!tutor || tutor.language !== params.language) {
      router.push(`/chat/${params.language}`);
    }
  }, [tutor, params.language, router]);

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return <ChatInterface characterId={tutorId} />;
}