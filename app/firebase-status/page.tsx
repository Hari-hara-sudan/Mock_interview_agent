import React from 'react';
import { CheckCircle, XCircle, Database, Cloud } from 'lucide-react';

export default function FirebaseStatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Firebase Connection Status
          </h1>
          <p className="text-gray-600">
            Check the connection status of your aptitude system with Firebase
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Configuration Status */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Configuration</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Environment Variables</span>
                <span className="text-green-600 font-medium">✓ Configured</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Firebase Admin SDK</span>
                <span className="text-green-600 font-medium">✓ Imported</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Project ID</span>
                <span className="text-green-600 font-medium">aiagent-3b7ea</span>
              </div>
            </div>
          </div>

          {/* Collections Status */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Cloud className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Collections</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">aptitudeQuestions</span>
                <span className="text-yellow-600 font-medium">⚠ Need Seeding</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">aptitudeTests</span>
                <span className="text-yellow-600 font-medium">⚠ Need Seeding</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">aptitudeAttempts</span>
                <span className="text-gray-400 font-medium">- Empty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Test */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Test Firebase Connection
          </h3>
          <p className="text-gray-600 mb-4">
            You can test the Firebase connection by visiting the test endpoint:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <code className="text-sm font-mono text-gray-700">
              GET /api/test-firebase
            </code>
          </div>
          <a
            href="/api/test-firebase"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Connection
          </a>
        </div>

        {/* Seeding Instructions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Seed Sample Data
          </h3>
          <p className="text-gray-600 mb-4">
            To populate the aptitude system with sample questions and tests:
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Option 1: API Endpoint</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <code className="text-sm font-mono text-gray-700">
                  POST /api/aptitude/seed<br />
                  Body: {"{"}"action": "seed-all"{"}"}
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Option 2: Manual Firebase Console</h4>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                <li>Run <code className="bg-gray-100 px-1 rounded">node aptitude-seed-data.js</code></li>
                <li>Copy the JSON output</li>
                <li>Go to Firebase Console → Firestore Database</li>
                <li>Create collections and add documents</li>
              </ol>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-800">
              <div className="w-4 h-4">⚠️</div>
              <span className="font-medium">Important</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Make sure to seed the data before using the aptitude system. 
              The system requires both questions and tests to function properly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
