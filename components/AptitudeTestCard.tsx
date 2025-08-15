'use client';

import React from 'react';
import { Clock, Users, Trophy, Play } from 'lucide-react';
import { AptitudeTest } from '@/types';
import { useRouter } from 'next/navigation';

interface AptitudeTestCardProps {
  test: AptitudeTest;
  onStartTest: (testId: string) => void;
  userAttempts?: number;
}

export default function AptitudeTestCard({ test, onStartTest, userAttempts = 0 }: AptitudeTestCardProps) {
  const router = useRouter();
  const totalQuestions = test.categories.length * test.questionsPerCategory;
  
  const handleStartTest = () => {
    router.push(`/aptitude/test/${test.id}`);
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-success-100 bg-success-100/20';
      case 'medium': return 'text-primary-200 bg-primary-200/20';
      case 'hard': return 'text-destructive-100 bg-destructive-100/20';
      default: return 'text-light-100 bg-light-400/20';
    }
  };

  const getCategoryDisplay = (categories: string[]) => {
    if (categories.length <= 2) {
      return categories.join(', ');
    }
    return `${categories.slice(0, 2).join(', ')} +${categories.length - 2} more`;
  };

  return (
    <div className="dark-gradient rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/10 group">
      {/* Header with difficulty badge */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-primary-200 transition-colors">
            {test.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
            {test.difficulty.toUpperCase()}
          </span>
        </div>
        
        <p className="text-light-100 text-sm leading-relaxed mb-4">
          {test.description}
        </p>

        {/* Categories */}
        <div className="mb-4">
          <p className="text-xs text-light-400 mb-1">Categories</p>
          <p className="text-sm text-light-100 font-medium">
            {getCategoryDisplay(test.categories)}
          </p>
        </div>

        {/* Test Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary-200/20 rounded-lg">
              <Users className="w-4 h-4 text-primary-200" />
            </div>
            <div>
              <p className="text-xs text-light-400">Questions</p>
              <p className="text-sm font-semibold text-white">{totalQuestions}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary-200/20 rounded-lg">
              <Clock className="w-4 h-4 text-primary-200" />
            </div>
            <div>
              <p className="text-xs text-light-400">Duration</p>
              <p className="text-sm font-semibold text-white">{test.timeLimit}m</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="p-2 bg-success-100/20 rounded-lg">
              <Trophy className="w-4 h-4 text-success-100" />
            </div>
            <div>
              <p className="text-xs text-light-400">Pass Score</p>
              <p className="text-sm font-semibold text-white">{test.passingScore}%</p>
            </div>
          </div>
        </div>

        {/* Attempts */}
        {userAttempts > 0 && (
          <div className="mb-4 p-3 bg-dark-200 rounded-lg">
            <p className="text-sm text-light-100">
              <span className="font-medium">{userAttempts}</span> attempt{userAttempts !== 1 ? 's' : ''} completed
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <button
          onClick={handleStartTest}
          className="w-full blue-gradient-dark hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105"
        >
          <Play className="w-4 h-4" />
          <span>Start Test</span>
        </button>
      </div>
    </div>
  );
}
