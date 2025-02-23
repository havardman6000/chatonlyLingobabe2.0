// src/app/chat/chinese/layout.tsx
'use client';

import React from 'react';

export default function ChineseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
