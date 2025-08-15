import React from 'react';
import AptitudeNav from '@/components/AptitudeNav';

export default function AptitudeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AptitudeNav />
      {children}
    </div>
  );
}
