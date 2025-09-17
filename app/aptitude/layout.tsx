import React from 'react';
import Header from '@/components/vox/layout/HeaderWrapper';

export default function AptitudeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
