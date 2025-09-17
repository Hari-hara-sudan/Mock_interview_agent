  "use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, Mic, Code, Brain, User } from "lucide-react";

interface NavBarProps { path: string; }

const navigation = [
  { name: "Voice Interviews", href: "/interview", icon: Mic },
  { name: "Coding Challenges", href: "/coding", icon: Code },
  { name: "Aptitude Tests", href: "/aptitude", icon: Brain },
  { name: "Profile", href: "/profile", icon: User },
];

export default function NavBar({ path }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleKey = useCallback((e: KeyboardEvent) => { 
    if (e.key === "Escape") setIsMenuOpen(false); 
  }, []);
  
  useEffect(() => { 
    if (isMenuOpen) { 
      document.addEventListener("keydown", handleKey); 
      document.body.style.overflow = "hidden"; 
    } else { 
      document.body.style.overflow = ""; 
      document.removeEventListener("keydown", handleKey); 
    } 
    return () => { 
      document.body.style.overflow = ""; 
      document.removeEventListener("keydown", handleKey); 
    }; 
  }, [isMenuOpen, handleKey]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.08)] group-hover:shadow-[0_0_32px_rgba(147,51,234,0.3)] transition-all duration-300">
                <Image src="/logo.svg" alt="BlueBoard Logo" width={24} height={24} className="text-white" />
              </div>
              <div className="absolute inset-0 w-10 h-10 bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] bg-clip-text text-transparent">BlueBoard</span>
              <span className="text-xs text-muted-foreground font-medium">AI Interview Coach</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const active = item.href === "/" ? path === item.href : path.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative flex items-center space-x-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-muted/50"
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] transition-all duration-300 transform -translate-x-1/2 ${active ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`}></div>
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/sign-in">
              <button className="hover:bg-muted/50 font-medium h-9 rounded-lg px-3 text-sm transition-all duration-300">
                Sign In
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] text-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(147,51,234,0.12)] hover:scale-105 font-semibold h-9 rounded-lg px-3 text-sm transition-all duration-300">
                Start Free Trial
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-muted/50 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 animate-[fade-in_0.3s_ease-out] border-t border-border/50">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 text-[hsl(262,83%,58%)] group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-6 mt-6 border-t border-border/50">
                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full justify-center font-medium h-9 rounded-lg px-3 text-sm hover:bg-muted/50 transition-all duration-300">
                    Sign In
                  </button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full justify-center font-medium bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] text-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(147,51,234,0.12)] h-9 rounded-lg px-3 text-sm transition-all duration-300">
                    Start Free Trial
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
