import React from 'react';
import { Trophy, Clock, Target, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { AptitudeAttempt } from '@/types';

interface AptitudeResultsProps {
  attempt: AptitudeAttempt;
  testTitle: string;
  retakeHref: string;
  testsHref: string;
}

export default function AptitudeResults({ 
  attempt, 
  testTitle, 
  retakeHref,
  testsHref,
}: AptitudeResultsProps) {
  const { score } = attempt;
  const passed = score.percentage >= 60; // Assuming 60% is passing
  
  const formatTime = (start: string, end?: string) => {
    if (!end) return 'In Progress';
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-transparent bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text';
    if (percentage >= 60) return 'text-transparent bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text';
    return 'text-transparent bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text';
  };

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
    if (percentage >= 60) return 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200';
    return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200';
  };

  const formatCategory = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
          passed ? 'bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200' : 'bg-gradient-to-br from-red-100 to-rose-100 border border-red-200'
        }`}>
          {passed ? (
            <Trophy className="w-10 h-10 text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text" />
          ) : (
            <Target className="w-10 h-10 text-transparent bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text" />
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] bg-clip-text mb-2">
          {passed ? 'Congratulations!' : 'Test Completed'}
        </h1>
        
        <p className="text-muted-foreground mb-4">
          You've completed the <span className="font-semibold text-foreground">{testTitle}</span>
        </p>
        
        <div className={`inline-block px-6 py-2 rounded-full font-semibold ${
          passed 
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
            : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
        }`}>
          {passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
        </div>
      </div>

      {/* Overall Score */}
      <div className={`rounded-2xl p-6 mb-8 border-2 ${getScoreBg(score.percentage)}`}>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-4">Overall Score</h2>
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(score.percentage)}`}>
            {Math.round(score.percentage)}%
          </div>
          <p className="text-muted-foreground">
            {score.correct} out of {score.total} questions correct
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text" />
            </div>
            <h3 className="font-semibold text-foreground">Correct Answers</h3>
          </div>
          <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">{score.correct}</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-red-100 to-rose-100 rounded-lg border border-red-200">
              <XCircle className="w-5 h-5 text-transparent bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text" />
            </div>
            <h3 className="font-semibold text-foreground">Incorrect Answers</h3>
          </div>
          <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text">{score.total - score.correct}</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-[hsl(262,83%,58%)]/20 to-[hsl(316,70%,68%)]/20 rounded-lg border border-[hsl(262,83%,58%)]/30">
              <Clock className="w-5 h-5 text-transparent bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] bg-clip-text" />
            </div>
            <h3 className="font-semibold text-foreground">Time Taken</h3>
          </div>
          <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] bg-clip-text">
            {formatTime(attempt.startedAt, attempt.finishedAt)}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      {score.categoryBreakdown && score.categoryBreakdown.length > 0 && (
        <div className="bg-card rounded-xl p-6 shadow-lg border border-border mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <div className="p-1.5 bg-gradient-to-br from-[hsl(262,83%,58%)]/20 to-[hsl(316,70%,68%)]/20 rounded-lg mr-2 border border-[hsl(262,83%,58%)]/30">
              <TrendingUp className="w-5 h-5 text-transparent bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] bg-clip-text" />
            </div>
            Category-wise Performance
          </h3>
          
          <div className="space-y-4">
            {score.categoryBreakdown.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-4 bg-gradient-to-r from-[hsl(262,83%,58%)]/5 to-[hsl(316,70%,68%)]/5 rounded-lg border border-[hsl(262,83%,58%)]/10">
                <div>
                  <h4 className="font-medium text-foreground">
                    {formatCategory(category.category)}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {category.correct} of {category.total} correct
                  </p>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(category.percentage)}`}>
                    {Math.round(category.percentage)}%
                  </div>
                  <div className="w-24 bg-muted rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        category.percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        category.percentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-red-500 to-rose-500'
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={retakeHref}
          className="px-8 py-3 bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] hover:shadow-lg hover:scale-105 text-white font-semibold rounded-xl transition-all text-center"
        >
          Retake Test
        </a>
        
        <a
          href={testsHref}
          className="px-8 py-3 bg-card hover:bg-muted border border-border text-foreground font-semibold rounded-xl transition-colors text-center"
        >
          View All Tests
        </a>
      </div>
    </div>
  );
}
