"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CodeEditor from '@/components/CodeEditor';
import Agent from '@/components/Agent';
import { Challenge } from '@/types/index';

// Mock data - will be replaced with Firestore data
const getChallengeBySlug = (slug: string): Challenge | null => {
  const mockChallenges: Challenge[] = [
    {
      id: "1",
      title: "Two Sum Problem",
      slug: "two-sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
      difficulty: "easy",
      type: "explain-before-code",
      supportedLanguages: ["javascript", "python"],
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]"
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]"
        }
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "Only one valid answer exists"
      ],
      testCases: [
        { input: "[2,7,11,15], 9", expectedOutput: "[0,1]", isHidden: false }
      ],
      starterCode: {
        javascript: `function twoSum(nums, target) {
    // TODO: Find two numbers that add up to target
    // Return their indices as an array [i, j]
    
    // Hint: Consider using a hash map for O(n) solution
    
}`,
        python: `def twoSum(nums, target):
    """
    Find two numbers that add up to target.
    Return their indices as a list [i, j].
    
    Hint: Consider using a dictionary for O(n) solution.
    """
    pass`
      },
      timeLimit: 300000,
      tags: ["arrays", "hash-table"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      title: "Debug Authentication Bug",
      slug: "debug-auth-bug",
      description: "Fix the authentication function that has multiple security vulnerabilities. The function should properly validate user credentials and return appropriate responses.",
      difficulty: "medium",
      type: "voice-debugging",
      supportedLanguages: ["javascript", "python"],
      examples: [
        {
          input: "email = 'valid@email.com', password = 'correctpassword'",
          output: '{"success":true,"user":{...},"token":"jwt-token"}',
          explanation: "Valid credentials should return user object and token"
        },
        {
          input: "email = '', password = 'password'",
          output: '{"success":false,"error":"Email is required"}',
          explanation: "Missing email should return validation error"
        }
      ],
      constraints: [
        "Email validation is required",
        "Password cannot be empty",
        "Return appropriate error messages"
      ],
      testCases: [
        { input: "'valid@email.com', 'correctpassword'", expectedOutput: '{"success":true}', isHidden: false }
      ],
      starterCode: {
        javascript: `// Mock user database
const users = {
  'valid@email.com': { id: 1, password: 'correctpassword' },
  'admin@company.com': { id: 2, password: 'admin123' }
};

function authenticateUser(email, password) {
    // TODO: Implement proper authentication
    // 1. Validate email is not empty -> return { success: false, error: "Email is required" }
    // 2. Validate password is not empty -> return { success: false, error: "Password is required" }
    // 3. Check if user exists in the users object
    // 4. Verify password matches
    // 5. Return success: { success: true, user: { id, email }, token: 'jwt-token' }
    // 6. Return error for invalid credentials: { success: false, error: "Invalid credentials" }
    
}`,
        python: `# Mock user database
users = {
    'valid@email.com': {'id': 1, 'password': 'correctpassword'},
    'admin@company.com': {'id': 2, 'password': 'admin123'}
}

def authenticate_user(email, password):
    """
    Implement proper authentication.
    1. Validate email is not empty -> return {'success': False, 'error': 'Email is required'}
    2. Validate password is not empty -> return {'success': False, 'error': 'Password is required'}
    3. Check if user exists
    4. Verify password matches
    5. Return success: {'success': True, 'user': {'id': id, 'email': email}, 'token': 'jwt-token'}
    6. Return error: {'success': False, 'error': 'Invalid credentials'}
    """
    pass`
      },
      timeLimit: 600000,
      tags: ["debugging", "authentication", "security"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      title: "Binary Search Implementation",
      slug: "binary-search-perf",
      description: "Implement a binary search algorithm that finds a target value in a sorted array. Return the index if found, or -1 if not present.",
      difficulty: "easy",
      type: "performance-tuning",
      supportedLanguages: ["javascript", "python"],
      examples: [
        {
          input: "arr = [1,2,3,4,5,6,7,8,9,10], target = 5",
          output: "4",
          explanation: "5 is at index 4"
        },
        {
          input: "arr = [1,2,3,4,5], target = 6",
          output: "-1",
          explanation: "6 is not in the array"
        }
      ],
      constraints: [
        "Array is sorted in ascending order",
        "Must use O(log n) time complexity",
        "All elements are unique"
      ],
      testCases: [
        { input: "[1,2,3,4,5], 3", expectedOutput: "2", isHidden: false }
      ],
      starterCode: {
        javascript: `function binarySearch(arr, target) {
    // TODO: Implement binary search
    // Return the index of target if found, otherwise -1
    
    // Hint: Use two pointers (left, right) and find middle
    // Compare middle element with target
    // Narrow search space by half each iteration
    
    // Handle empty array case
    
}`,
        python: `def binarySearch(arr, target):
    """
    Implement binary search.
    Return the index of target if found, otherwise -1.
    
    Hint: Use two pointers (left, right) and find middle.
    Compare middle element with target.
    Narrow search space by half each iteration.
    
    Handle empty array case.
    """
    pass`
      },
      timeLimit: 300000,
      tags: ["algorithms", "binary-search", "arrays"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "4",
      title: "Counter State Manager",
      slug: "react-code-review",
      description: "Implement a counter state management function that handles increment, decrement, and reset actions. The counter should never go below 0.",
      difficulty: "easy",
      type: "code-review",
      supportedLanguages: ["javascript", "python"],
      examples: [
        {
          input: "actionType = 'increment', currentCount = 0",
          output: '{"count":1,"actionType":"increment"}',
          explanation: "Incrementing 0 results in 1"
        },
        {
          input: "actionType = 'decrement', currentCount = 0",
          output: '{"count":0,"actionType":"decrement"}',
          explanation: "Cannot go below 0"
        }
      ],
      constraints: [
        "Count cannot go below 0",
        "Valid actions: 'increment', 'decrement', 'reset'",
        "Reset sets count to 0"
      ],
      testCases: [
        { input: "'increment', 5", expectedOutput: '{"count":6}', isHidden: false }
      ],
      starterCode: {
        javascript: `function handleCounterAction(actionType, currentCount) {
    // TODO: Implement counter state management
    // 
    // Actions:
    // - 'increment': Add 1 to currentCount
    // - 'decrement': Subtract 1 from currentCount (cannot go below 0)
    // - 'reset': Set count to 0
    // 
    // Return format:
    // { count: newCount, actionType: actionType }
    
}`,
        python: `def handle_counter_action(action_type, current_count):
    """
    Implement counter state management.
    
    Actions:
    - 'increment': Add 1 to current_count
    - 'decrement': Subtract 1 from current_count (cannot go below 0)
    - 'reset': Set count to 0
    
    Return format:
    {'count': new_count, 'actionType': action_type}
    """
    pass`
      },
      timeLimit: 300000,
      tags: ["state-management", "logic"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "5",
      title: "REST API Request Handler",
      slug: "api-contract",
      description: "Implement a function that handles REST API requests for a user resource. Support GET, POST, PUT, and DELETE methods with proper status codes.",
      difficulty: "medium",
      type: "black-box-contract",
      supportedLanguages: ["javascript", "python"],
      examples: [
        {
          input: "method = 'GET', path = '/api/users/123'",
          output: '{"status":200,"body":{"id":"123","name":"John Doe"}}',
          explanation: "GET returns user data with 200 status"
        },
        {
          input: "method = 'GET', path = '/api/users/999'",
          output: '{"status":404,"body":{"error":"User not found"}}',
          explanation: "Unknown user returns 404"
        }
      ],
      constraints: [
        "GET /api/users/:id - Return user or 404",
        "POST /api/users - Create user (requires name and email)",
        "PUT /api/users/:id - Update user",
        "DELETE /api/users/:id - Delete user (204 status)"
      ],
      testCases: [
        { input: "'GET', '/api/users/123'", expectedOutput: '{"status":200}', isHidden: false }
      ],
      starterCode: {
        javascript: `// Mock database
const users = {
  '123': { id: '123', name: 'John Doe', email: 'john@example.com' }
};

function handleAPIRequest(method, path, body) {
    // TODO: Implement REST API handler
    // 
    // Extract user ID from path: path.split('/').pop()
    // 
    // GET /api/users/:id
    //   - If user exists: { status: 200, body: user }
    //   - If not found: { status: 404, body: { error: "User not found" } }
    // 
    // POST /api/users (body has name, email)
    //   - If missing name/email: { status: 400, body: { error: "Name and email are required" } }
    //   - Success: { status: 201, body: { id: "new-id", ...body } }
    // 
    // PUT /api/users/:id (body has updates)
    //   - Update user and return: { status: 200, body: updatedUser }
    // 
    // DELETE /api/users/:id
    //   - Return: { status: 204, body: null }
    
}`,
        python: `# Mock database
users = {
    '123': {'id': '123', 'name': 'John Doe', 'email': 'john@example.com'}
}

def handle_api_request(method, path, body):
    """
    Implement REST API handler.
    
    Extract user ID from path: path.split('/')[-1]
    
    GET /api/users/:id
      - If user exists: {'status': 200, 'body': user}
      - If not found: {'status': 404, 'body': {'error': 'User not found'}}
    
    POST /api/users (body has name, email)
      - If missing name/email: {'status': 400, 'body': {'error': 'Name and email are required'}}
      - Success: {'status': 201, 'body': {'id': 'new-id', **body}}
    
    PUT /api/users/:id (body has updates)
      - Update user and return: {'status': 200, 'body': updated_user}
    
    DELETE /api/users/:id
      - Return: {'status': 204, 'body': None}
    """
    pass`
      },
      timeLimit: 600000,
      tags: ["api", "rest", "backend"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  return mockChallenges.find(c => c.slug === slug) || null;
};

interface AttemptPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function AttemptPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [currentPhase, setCurrentPhase] = useState<"planning" | "coding" | "walkthrough">("planning");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [planningComplete, setPlanningComplete] = useState(false);
  const [codingComplete, setCodingComplete] = useState(false);
  
  // Real-time execution states
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const challengeData = getChallengeBySlug(slug);
    if (challengeData) {
      setChallenge(challengeData);
      setSelectedLanguage(challengeData.supportedLanguages[0]);
      setCode(challengeData.starterCode[challengeData.supportedLanguages[0]] || "");
      setTimeLeft(challengeData.timeLimit);
    }
  }, [slug]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const startTimer = () => {
    setIsTimerActive(true);
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(challenge?.starterCode[language] || "");
  };

  // Real-time code execution
  const executeCodeRealTime = async () => {
    if (!challenge || !code.trim()) return;
    
    setIsExecuting(true);
    setShowResults(true);
    setExecutionResults([]);

    try {
      console.log('🚀 Executing code in real-time...');
      
      const response = await fetch('/api/challenges/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: challenge.slug,
          language: selectedLanguage,
          code,
          userId: 'live-user'
        }),
      });

      const result = await response.json();
      
      if (result.error) {
        console.error('Execution error:', result.error);
        setExecutionResults([{
          testCaseIndex: 0,
          passed: false,
          actualOutput: '',
          expectedOutput: '',
          status: 'error',
          stderr: result.error
        }]);
      } else {
        console.log('✅ Execution complete:', result);
        setExecutionResults(result.results || []);
        setLastScore(result.score);
      }
    } catch (error) {
      console.error('Failed to execute code:', error);
      setExecutionResults([{
        testCaseIndex: 0,
        passed: false,
        actualOutput: '',
        expectedOutput: '',
        status: 'error',
        stderr: 'Network error or server unavailable'
      }]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!challenge) return;

    try {
      const response = await fetch('/api/challenges/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: challenge.slug,
          language: selectedLanguage,
          code,
          userId: 'mock-user-id' // Replace with actual user ID
        }),
      });

      const result = await response.json();
      
      if (result.submissionId) {
        router.push(`/training/challenges/${challenge.slug}/results/${result.submissionId}`);
      }
    } catch (error) {
      console.error('Error submitting code:', error);
    }
  };

  const moveToNextPhase = () => {
    if (currentPhase === "planning") {
      setPlanningComplete(true);
      setCurrentPhase("coding");
      startTimer();
    } else if (currentPhase === "coding") {
      setCodingComplete(true);
      if (challenge?.type === "explain-before-code") {
        setCurrentPhase("walkthrough");
      } else {
        handleSubmitCode();
      }
    } else if (currentPhase === "walkthrough") {
      handleSubmitCode();
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Challenge not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{challenge.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-2 py-1 rounded text-sm ${
                challenge.difficulty === 'easy' ? 'bg-green-600' :
                challenge.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
              }`}>
                {challenge.difficulty.toUpperCase()}
              </span>
              <span className="px-2 py-1 bg-blue-600 rounded text-sm">
                {challenge.type.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-mono font-bold">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-400">
              Phase: {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className={`flex items-center space-x-2 ${planningComplete ? 'text-green-400' : currentPhase === 'planning' ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-3 h-3 rounded-full ${planningComplete ? 'bg-green-400' : currentPhase === 'planning' ? 'bg-blue-400' : 'bg-gray-500'}`}></div>
              <span>Planning</span>
            </div>
            <div className="flex-1 h-px bg-gray-700"></div>
            <div className={`flex items-center space-x-2 ${codingComplete ? 'text-green-400' : currentPhase === 'coding' ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-3 h-3 rounded-full ${codingComplete ? 'bg-green-400' : currentPhase === 'coding' ? 'bg-blue-400' : 'bg-gray-500'}`}></div>
              <span>Coding</span>
            </div>
            {challenge.type === "explain-before-code" && (
              <>
                <div className="flex-1 h-px bg-gray-700"></div>
                <div className={`flex items-center space-x-2 ${currentPhase === 'walkthrough' ? 'text-blue-400' : 'text-gray-500'}`}>
                  <div className={`w-3 h-3 rounded-full ${currentPhase === 'walkthrough' ? 'bg-blue-400' : 'bg-gray-500'}`}></div>
                  <span>Walkthrough</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Problem Description */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Problem Description</h2>
              <p className="text-gray-300 mb-6">{challenge.description}</p>
              
              {challenge.examples.map((example, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold mb-2">Example {index + 1}:</h3>
                  <div className="bg-gray-800 p-3 rounded font-mono text-sm">
                    <div><span className="text-blue-400">Input:</span> {example.input}</div>
                    <div><span className="text-green-400">Output:</span> {example.output}</div>
                    <div className="text-gray-400 mt-2">{example.explanation}</div>
                  </div>
                </div>
              ))}

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Constraints:</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {challenge.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-gray-700 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Interactive Section */}
          <div className="space-y-6">
            {currentPhase === "planning" && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Planning Phase</h2>
                <p className="text-gray-300 mb-4">
                  Explain your approach to solving this problem using voice recording.
                </p>
                <Agent
                  userName="User"
                  userId="mock-user-id"
                  type="interview"
                  role="Software Engineer"
                  level="Mid-level"
                  techstack="Full Stack"
                  amount="45"
                  questions={[
                    "Walk me through your approach to solve this problem",
                    "What data structures would you use and why?",
                    "What's the time and space complexity of your solution?"
                  ]}
                />
                <div className="mt-6">
                  <Button onClick={moveToNextPhase} className="w-full">
                    Complete Planning & Start Coding
                  </Button>
                </div>
              </div>
            )}

            {currentPhase === "coding" && (
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Coding Phase</h2>
                  <div className="flex space-x-2">
                    {challenge.supportedLanguages.map((lang: string) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedLanguage === lang 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <CodeEditor
                  language={selectedLanguage}
                  value={code}
                  onChange={setCode}
                  height="400px"
                  placeholder="Write your solution here..."
                />

                {/* Real-time Execution Panel */}
                <div className="mt-4 space-y-4">
                  <div className="flex space-x-4">
                    <Button 
                      onClick={executeCodeRealTime}
                      disabled={isExecuting || !code.trim()}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
                    >
                      {isExecuting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Running...</span>
                        </div>
                      ) : (
                        '▶️ Run Code'
                      )}
                    </Button>
                    
                    {lastScore !== null && (
                      <div className={`px-4 py-2 rounded font-semibold ${
                        lastScore === 100 ? 'bg-green-600' : 
                        lastScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        Score: {lastScore}/100
                      </div>
                    )}
                  </div>

                  {/* Test Results */}
                  {showResults && executionResults.length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        🧪 Test Results 
                        <span className="ml-2 text-sm text-gray-400">
                          ({executionResults.filter(r => r.passed).length}/{executionResults.length} passed)
                        </span>
                      </h3>
                      
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {executionResults.map((result, index) => (
                          <div key={index} className={`p-3 rounded border-l-4 ${
                            result.passed ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                Test {index + 1} {result.passed ? '✅' : '❌'}
                              </span>
                              {result.executionTime && (
                                <span className="text-xs text-gray-400">
                                  {result.executionTime}ms
                                </span>
                              )}
                            </div>
                            
                            {result.input && (
                              <div className="text-sm mb-1">
                                <span className="text-blue-400">Input:</span> {result.input}
                              </div>
                            )}
                            
                            <div className="text-sm mb-1">
                              <span className="text-green-400">Expected:</span> {result.expectedOutput}
                            </div>
                            
                            <div className="text-sm mb-1">
                              <span className={result.passed ? 'text-green-400' : 'text-red-400'}>
                                Actual:
                              </span> {result.actualOutput || 'No output'}
                            </div>
                            
                            {result.stderr && (
                              <div className="text-sm mt-2 p-2 bg-red-900/30 rounded">
                                <span className="text-red-400">Error:</span> {result.stderr}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Button onClick={moveToNextPhase} className="w-full">
                    {challenge.type === "explain-before-code" ? "Complete Coding & Start Walkthrough" : "Submit Solution"}
                  </Button>
                </div>
              </div>
            )}

            {currentPhase === "walkthrough" && challenge.type === "explain-before-code" && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Walkthrough Phase</h2>
                <p className="text-gray-300 mb-4">
                  Now explain your implemented solution and walk through the code.
                </p>
                <Agent
                  userName="User"
                  userId="mock-user-id"
                  type="interview"
                  role="Software Engineer"
                  level="Mid-level"
                  techstack="Full Stack"
                  amount="30"
                  questions={[
                    "Walk me through your implemented solution",
                    "Explain how your code handles the edge cases",
                    "What would you do differently if you had more time?"
                  ]}
                />
                <div className="mt-6">
                  <Button onClick={moveToNextPhase} className="w-full">
                    Submit Final Solution
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
