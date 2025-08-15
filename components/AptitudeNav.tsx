'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Home, User } from 'lucide-react';
import React from 'react';

export default function AptitudeNav() {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return `inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'text-primary-200 bg-primary-200/10' : 'text-light-100 hover:text-white hover:bg-white/5'
    }`;
  };

  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/aptitude" className="flex items-center gap-2 text-white font-semibold">
          <Brain className="w-5 h-5 text-primary-200" />
          <span>Aptitude</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/" className={linkClass('/')}> 
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link href="/aptitude" className={linkClass('/aptitude')}>
            <Brain className="w-4 h-4" />
            Tests
          </Link>
          <Link href="/profile" className={linkClass('/profile')}>
            <User className="w-4 h-4" />
            Profile
          </Link>
        </div>
      </nav>
    </header>
  );
}
