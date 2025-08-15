'use client';

import React, { useState } from 'react';
import { Brain, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AptitudeTestPage() {
  const [seedStatus, setSeedStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeedData = async () => {
    setSeedStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/aptitude/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'seed-all' }),
      });

      const result = await response.json();

      if (result.success) {
        setSeedStatus('success');
        setMessage(result.message);
      } else {
        setSeedStatus('error');
        setMessage(result.message || 'Failed to seed data');
      }
    } catch (error) {
      setSeedStatus('error');
      setMessage('Error connecting to server');
    }
  };

  const handleTestConnection = async () => {
    try {
      const response = await fetch('/api/test-firebase');
      const result = await response.json();
      alert(JSON.stringify(result, null, 2));
    } catch (error) {
      alert('Error testing connection: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Aptitude System Test
          </h1>
          <p className="text-gray-600">
            Test and setup the aptitude system
          </p>
        </div>

        <div className="space-y-6">
          {/* Firebase Connection Test */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Firebase Connection
            </h3>
            <button
              onClick={handleTestConnection}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Firebase Connection
            </button>
          </div>

          {/* Data Seeding */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Seed Sample Data
            </h3>
            <p className="text-gray-600 mb-4">
              Populate the database with sample aptitude questions and tests.
            </p>
            
            <button
              onClick={handleSeedData}
              disabled={seedStatus === 'loading'}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {seedStatus === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Seeding Data...</span>
                </>
              ) : (
                <span>Seed Sample Data</span>
              )}
            </button>

            {/* Status Message */}
            {message && (
              <div className={`mt-4 p-4 rounded-lg flex items-center space-x-2 ${
                seedStatus === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {seedStatus === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>
            <div className="space-y-3">
              <a
                href="/aptitude"
                className="block w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
              >
                View Aptitude Tests
              </a>
              <a
                href="/"
                className="block w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-center"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
