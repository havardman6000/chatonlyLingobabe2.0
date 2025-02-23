'use client';

import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import ChatInterface from '@/components/ChatInterface';
import { useEffect } from 'react';

const ChinesePage = () => {
  const router = useRouter();
  const { selectedCharacter, actions } = useChatStore();

  // Ensure a character is selected
  useEffect(() => {
    if (!selectedCharacter) {
      actions.selectCharacter('mei'); // Default to 'mei'
    }
  }, [selectedCharacter, actions]);

  if (!selectedCharacter) {
    return <div>Loading...</div>;
  }

  return <ChatInterface characterId={selectedCharacter} />;
};

export default ChinesePage;
// src/app/chat/chinese/page.tsx