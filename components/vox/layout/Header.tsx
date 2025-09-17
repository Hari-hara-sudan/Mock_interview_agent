"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Mic, Code, Brain, BarChart3 } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Voice Interviews", href: "/interview", icon: Mic },
    { name: "Coding Challenges", href: "/training/challenges", icon: Code },
    { name: "Aptitude Tests", href: "/aptitude", icon: Brain },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-glow transition-all duration-300">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 w-10 h-10 bg-gradient-primary rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gradient">VoxMentor</span>
              <span className="text-xs text-muted-foreground font-medium">AI Interview Coach</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative flex items-center space-x-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-card-hover"
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">{item.name}</span>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-primary group-hover:w-3/4 transition-all duration-300 transform -translate-x-1/2" />
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="hover:bg-card-hover font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="hero" size="sm" className="font-medium">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-card-hover transition-all duration-200"
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
          <div className="md:hidden py-6 animate-fade-in-up border-t border-border/50">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-card-hover transition-all duration-200 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-6 mt-6 border-t border-border/50">
                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-center font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="hero" size="sm" className="w-full justify-center font-medium">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
