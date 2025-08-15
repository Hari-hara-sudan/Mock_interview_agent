'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Clock, Target, Trophy, Zap } from 'lucide-react';
import AptitudeTestCard from '@/components/AptitudeTestCard';
import { getAptitudeTests } from '@/lib/actions/aptitude.action';
import { AptitudeTest } from '@/types';

export default function AptitudePage() {
  const [tests, setTests] = useState<AptitudeTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const fetchedTests = await getAptitudeTests();
        setTests(fetchedTests);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleStartTest = (testId: string) => {
    // This will be handled by the AptitudeTestCard component
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]" style={{ backgroundImage: 'url("/pattern.png")' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden blue-gradient-dark text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Brain className="w-8 h-8" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Aptitude Tests
            </h1>
            
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Test your skills across quantitative, logical reasoning, verbal ability, and technical concepts. 
              Get detailed analysis and improve your problem-solving abilities.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold">{tests.length}</div>
                <div className="text-primary-100 text-sm">Available Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-primary-100 text-sm">Your Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">6</div>
                <div className="text-primary-100 text-sm">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-primary-100 text-sm">Tests Passed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 dark-gradient rounded-xl shadow-lg border border-white/10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-200/20 rounded-lg mb-4">
              <Clock className="w-6 h-6 text-primary-200" />
            </div>
            <h3 className="font-semibold text-white mb-2">Timed Tests</h3>
            <p className="text-sm text-light-100">Real exam-like conditions with time limits</p>
          </div>

          <div className="text-center p-6 dark-gradient rounded-xl shadow-lg border border-white/10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-success-100/20 rounded-lg mb-4">
              <Target className="w-6 h-6 text-success-100" />
            </div>
            <h3 className="font-semibold text-white mb-2">Detailed Analysis</h3>
            <p className="text-sm text-light-100">Category-wise performance breakdown</p>
          </div>

          <div className="text-center p-6 dark-gradient rounded-xl shadow-lg border border-white/10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-200/20 rounded-lg mb-4">
              <Trophy className="w-6 h-6 text-primary-200" />
            </div>
            <h3 className="font-semibold text-white mb-2">Track Progress</h3>
            <p className="text-sm text-light-100">Monitor improvement over time</p>
          </div>

          <div className="text-center p-6 dark-gradient rounded-xl shadow-lg border border-white/10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-200/20 rounded-lg mb-4">
              <Zap className="w-6 h-6 text-primary-200" />
            </div>
            <h3 className="font-semibold text-white mb-2">Instant Results</h3>
            <p className="text-sm text-light-100">Get immediate feedback and explanations</p>
          </div>
        </div>

        {/* Tests Grid */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Choose Your Test
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <AptitudeTestCard
                key={test.id}
                test={test}
                onStartTest={handleStartTest}
                userAttempts={0}
              />
            ))}
          </div>

          {tests.length === 0 && (
            <div className="text-center py-16">
              <Brain className="w-16 h-16 text-light-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Tests Available</h3>
              <p className="text-light-100">Tests are being prepared. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
