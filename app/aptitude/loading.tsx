import React from 'react';
import { Brain } from 'lucide-react';

export default function AptitudeLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-4 animate-pulse">
          <Brain className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading Aptitude Tests...</h2>
        <p className="text-gray-400">Please wait while we prepare your tests</p>
      </div>
    </div>
  );
}
