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
      case 'easy': return 'bg-success-100/20 text-success-100 border border-success-100/40';
      case 'medium': return 'bg-primary-200/10 text-primary-200 border border-primary-200/30';
      case 'hard': return 'bg-destructive-100/20 text-destructive-100 border border-destructive-100/40';
      default: return 'bg-dark-200 text-light-100 border border-white/10';
    }
  };

  const formatCategory = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 dark-gradient rounded-2xl border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-light-100">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-200 text-dark-100">
            {formatCategory(question.category)}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onFlag}
            className={`p-2 rounded-lg transition-colors border ${
              isFlagged 
                ? 'bg-warning-100/20 text-warning-100 border-warning-100/40' 
                : 'bg-dark-200 text-light-100 border-white/10 hover:bg-dark-300 hover:text-warning-100'
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
        <h2 className="text-xl font-semibold text-white leading-relaxed mb-6">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedAnswer === index
                  ? 'border-primary-200 bg-primary-200/10 shadow-md text-white'
                  : 'border-white/10 bg-dark-200 text-light-100 hover:border-white/20 hover:bg-dark-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === index
                    ? 'border-primary-200 bg-primary-200'
                    : 'border-light-400'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 rounded-full bg-dark-100"></div>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  selectedAnswer === index ? 'text-white' : 'text-light-100'
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
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
            isFirstQuestion
              ? 'bg-dark-200 text-light-400 cursor-not-allowed'
              : 'bg-dark-200 text-white hover:bg-dark-300'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="text-sm text-light-400">
          {selectedAnswer !== null ? 'Answer selected' : 'Select an answer to continue'}
        </div>

        <button
          onClick={onNext}
          disabled={selectedAnswer === null}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
            selectedAnswer === null
              ? 'bg-dark-200 text-light-400 cursor-not-allowed'
              : 'bg-primary-200 text-dark-100 hover:bg-primary-200/80'
          }`}
        >
          <span>{isLastQuestion ? 'Finish' : 'Next'}</span>
          {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
