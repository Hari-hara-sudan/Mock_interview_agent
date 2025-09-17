'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { AptitudeQuestion } from '@/types';

interface AptitudeQuestionComponentProps {
  question: Omit<AptitudeQuestion, 'correctAnswer' | 'explanation'>;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number; // in seconds
  selectedAnswer: number | null;
  onAnswerSelect: (optionIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFlag: () => void;
  isFlagged: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export default function AptitudeQuestionComponent({
  question,
  questionNumber,
  totalQuestions,
  timeRemaining,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  onFlag,
  isFlagged,
  isFirstQuestion,
  isLastQuestion
}: AptitudeQuestionComponentProps) {
  const [questionStartTime] = useState(Date.now());

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining < 300) return 'text-destructive-100'; // < 5 minutes
    if (timeRemaining < 600) return 'text-warning-100'; // < 10 minutes (fallback to warning style if available)
    return 'text-success-100';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-gradient-to-r from-green-100/20 to-emerald-100/20 text-green-700 border border-green-200/40';
      case 'medium': return 'bg-gradient-to-r from-[hsl(262,83%,58%)]/10 to-[hsl(316,70%,68%)]/10 border border-[hsl(262,83%,58%)]/30';
      case 'hard': return 'bg-gradient-to-r from-red-100/20 to-rose-100/20 text-red-700 border border-red-200/40';
      default: return 'bg-gradient-to-r from-muted/20 to-muted/20 text-muted-foreground border border-border/30';
    }
  };

  const formatCategory = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-2xl border border-border/50 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty === 'medium' ? (
              <span className="text-transparent bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] bg-clip-text font-semibold">
                {question.difficulty}
              </span>
            ) : (
              question.difficulty
            )}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[hsl(262,83%,58%)]/10 to-[hsl(316,70%,68%)]/10 border border-[hsl(262,83%,58%)]/30">
            <span className="text-transparent bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] bg-clip-text font-semibold">
              {formatCategory(question.category)}
            </span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onFlag}
            className={`p-2 rounded-lg transition-colors border ${
              isFlagged 
                ? 'bg-warning-100/20 text-warning-100 border-warning-100/40' 
                : 'bg-muted text-foreground border-border/50 hover:bg-accent/50 hover:text-warning-100'
            }`}
            title={isFlagged ? 'Remove flag' : 'Flag question'}
          >
            <Flag className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${getTimeColor()}`} />
            <span className={`font-mono text-sm font-medium ${getTimeColor()}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground leading-relaxed mb-6">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedAnswer === index
                  ? 'border-[hsl(262,83%,58%)] bg-gradient-to-r from-[hsl(262,83%,58%)]/10 to-[hsl(316,70%,68%)]/10 shadow-md text-foreground'
                  : 'border-border/50 bg-muted text-foreground hover:border-[hsl(262,83%,58%)]/30 hover:bg-accent/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === index
                    ? 'border-[hsl(262,83%,58%)] bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)]'
                    : 'border-border'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 rounded-full bg-background"></div>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  selectedAnswer === index ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </div>
              <input
                type="radio"
                name="answer"
                value={index}
                checked={selectedAnswer === index}
                onChange={() => onAnswerSelect(index)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border/50">
        <button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
            isFirstQuestion
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-muted text-foreground hover:bg-accent/50'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="text-sm text-muted-foreground">
          {selectedAnswer !== null ? 'Answer selected' : 'Select an answer to continue'}
        </div>

        <button
          onClick={onNext}
          disabled={selectedAnswer === null}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
            selectedAnswer === null
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] text-white hover:shadow-lg hover:scale-105'
          }`}
        >
          <span>{isLastQuestion ? 'Finish' : 'Next'}</span>
          {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
