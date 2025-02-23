// src/app/chat/chinese/page.tsx
'use client';

import type { NextPage } from 'next';
import { BackButton } from '@/components/BackButton';
import { TutorSelect } from '@/components/TutorSelect';
import React from 'react';

const ChineseTutorPage: NextPage = () => {
  const disabledTutors = ['Ting', 'Xue']; // List of disabled tutors

  return (
    <main className="min-h-screen bg-gradient-to-r from-red-50 to-pink-100 py-12">
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
        <TutorSelect language="chinese" disabledTutors={disabledTutors} />
      </div>
    </main>
  );
};

export default ChineseTutorPage;