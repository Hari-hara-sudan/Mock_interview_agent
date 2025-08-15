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
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
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
          passed ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {passed ? (
            <Trophy className="w-10 h-10 text-green-600" />
          ) : (
            <Target className="w-10 h-10 text-red-600" />
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {passed ? 'Congratulations!' : 'Test Completed'}
        </h1>
        
        <p className="text-gray-600 mb-4">
          You've completed the <span className="font-semibold">{testTitle}</span>
        </p>
        
        <div className={`inline-block px-6 py-2 rounded-full font-semibold ${
          passed 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
        </div>
      </div>

      {/* Overall Score */}
      <div className={`rounded-2xl p-6 mb-8 border-2 ${getScoreBg(score.percentage)}`}>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Score</h2>
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(score.percentage)}`}>
            {Math.round(score.percentage)}%
          </div>
          <p className="text-gray-600">
            {score.correct} out of {score.total} questions correct
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Correct Answers</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">{score.correct}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Incorrect Answers</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{score.total - score.correct}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Time Taken</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {formatTime(attempt.startedAt, attempt.finishedAt)}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      {score.categoryBreakdown && score.categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Category-wise Performance
          </h3>
          
          <div className="space-y-4">
            {score.categoryBreakdown.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {formatCategory(category.category)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {category.correct} of {category.total} correct
                  </p>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(category.percentage)}`}>
                    {Math.round(category.percentage)}%
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        category.percentage >= 80 ? 'bg-green-500' :
                        category.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
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
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-center"
        >
          Retake Test
        </a>
        
        <a
          href={testsHref}
          className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors text-center"
        >
          View All Tests
        </a>
      </div>
    </div>
  );
}
