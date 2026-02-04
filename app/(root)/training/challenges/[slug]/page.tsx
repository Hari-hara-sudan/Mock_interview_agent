import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Challenge } from "@/types/index";

// Mock function to get challenge by slug - later replace with Firestore query
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
        "-10^9 <= target <= 10^9",
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
      title: "Debug the Authentication Bug",
      slug: "debug-auth-bug",
      description: "Fix the authentication function that has multiple security vulnerabilities. The function should properly validate user credentials and return appropriate responses for success and error cases.",
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
        "Return appropriate error messages",
        "Return user object and token on success"
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
    // 1. Validate email is not empty
    // 2. Validate password is not empty
    // 3. Check if user exists
    // 4. Verify password matches
    // 5. Return success with user info and token, or error
    
    // Return format for success:
    // { success: true, user: { id, email }, token: 'jwt-token' }
    
    // Return format for errors:
    // { success: false, error: 'Error message' }
    
}`,
        python: `# Mock user database
users = {
    'valid@email.com': {'id': 1, 'password': 'correctpassword'},
    'admin@company.com': {'id': 2, 'password': 'admin123'}
}

def authenticate_user(email, password):
    """
    Implement proper authentication.
    1. Validate email is not empty
    2. Validate password is not empty
    3. Check if user exists
    4. Verify password matches
    5. Return success with user info and token, or error
    
    Return format for success:
    {'success': True, 'user': {'id': id, 'email': email}, 'token': 'jwt-token'}
    
    Return format for errors:
    {'success': False, 'error': 'Error message'}
    """
    pass`
      },
      timeLimit: 600000,
      tags: ["security", "debugging", "authentication"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      title: "Binary Search Implementation",
      slug: "binary-search-perf",
      description: "Implement a binary search algorithm that finds a target value in a sorted array. Return the index if found, or -1 if not present. Your solution must have O(log n) time complexity.",
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
        "1 <= arr.length <= 10^5",
        "All elements are unique",
        "Must use O(log n) time complexity"
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
    
}`,
        python: `def binarySearch(arr, target):
    """
    Implement binary search.
    Return the index of target if found, otherwise -1.
    
    Hint: Use two pointers (left, right) and find middle.
    Compare middle element with target.
    Narrow search space by half each iteration.
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
        "Reset sets count to 0",
        "Return both new count and action type"
      ],
      testCases: [
        { input: "'increment', 5", expectedOutput: '{"count":6}', isHidden: false }
      ],
      starterCode: {
        javascript: `function handleCounterAction(actionType, currentCount) {
    // TODO: Implement counter state management
    // Actions: 'increment', 'decrement', 'reset'
    // Count cannot go below 0
    
    // Return format:
    // { count: newCount, actionType: actionType }
    
}`,
        python: `def handle_counter_action(action_type, current_count):
    """
    Implement counter state management.
    Actions: 'increment', 'decrement', 'reset'
    Count cannot go below 0.
    
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
      description: "Implement a function that handles REST API requests for a user resource. Support GET, POST, PUT, and DELETE methods with proper status codes and responses.",
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
        "DELETE /api/users/:id - Delete user (204 status, null body)"
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
    // GET /api/users/:id - Return user or 404
    // POST /api/users - Create new user (requires name, email)
    // PUT /api/users/:id - Update existing user
    // DELETE /api/users/:id - Delete user
    //
    // Return format:
    // { status: httpStatusCode, body: responseData }
    //
    // Status codes:
    // 200 - OK (GET, PUT success)
    // 201 - Created (POST success)
    // 204 - No Content (DELETE success, body should be null)
    // 400 - Bad Request (missing required fields)
    // 404 - Not Found (user doesn't exist)
    
}`,
        python: `# Mock database
users = {
    '123': {'id': '123', 'name': 'John Doe', 'email': 'john@example.com'}
}

def handle_api_request(method, path, body):
    """
    Implement REST API handler.
    
    GET /api/users/:id - Return user or 404
    POST /api/users - Create new user (requires name, email)
    PUT /api/users/:id - Update existing user
    DELETE /api/users/:id - Delete user
    
    Return format:
    {'status': http_status_code, 'body': response_data}
    
    Status codes:
    200 - OK (GET, PUT success)
    201 - Created (POST success)
    204 - No Content (DELETE success, body should be None)
    400 - Bad Request (missing required fields)
    404 - Not Found (user doesn't exist)
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

interface ChallengeDetailProps {
  params: Promise<{ slug: string }>;
}

const ChallengeDetail = async ({ params }: ChallengeDetailProps) => {
  const { slug } = await params;
  const user = await getCurrentUser();
  
  if (!user || !user.id) {
    redirect("/sign-in");
  }

  const challenge = getChallengeBySlug(slug);
  if (!challenge) {
    redirect("/training/challenges");
  }

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", 
    hard: "bg-red-500/20 text-red-400 border-red-500/30"
  };

  const typeLabels = {
    "explain-before-code": "Voice + Code",
    "voice-debugging": "Debug Coach",
    "code-review": "Code Review",
    "black-box-contract": "Contract Test",
    "performance-tuning": "Performance"
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/training/challenges" className="text-blue-400 hover:text-blue-300">
            ← Back to Challenges
          </Link>
        </div>

        {/* Challenge Info */}
        <div className="bg-[#18181b] border border-[#232323] rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">{challenge.title}</h1>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold border",
                  difficultyColors[challenge.difficulty as keyof typeof difficultyColors]
                )}>
                  {challenge.difficulty.toUpperCase()}
                </div>
                <div className="px-4 py-2 rounded-full text-sm font-semibold text-blue-400 bg-blue-500/20 border border-blue-500/30">
                  {typeLabels[challenge.type as keyof typeof typeLabels]}
                </div>
              </div>
            </div>
            
            <div className="text-right text-gray-400">
              <div className="text-sm">Time Limit</div>
              <div className="font-semibold">{Math.floor((challenge.timeLimit || 0) / 60000)} min</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">Problem Description</h3>
            <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">Supported Languages</h3>
            <div className="flex flex-wrap gap-3">
              {challenge.supportedLanguages.map((lang: string) => (
                <span key={lang} className="px-3 py-2 bg-[#232323] text-gray-300 rounded-lg border border-[#333] font-mono">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {challenge.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 text-sm text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Example/Constraints */}
          {challenge.type === "explain-before-code" && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Example</h3>
              <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4 font-mono text-sm">
                <div className="text-gray-400 mb-2">Input:</div>
                <div className="text-white mb-4">nums = [2,7,11,15], target = 9</div>
                <div className="text-gray-400 mb-2">Output:</div>
                <div className="text-white mb-4">[0,1]</div>
                <div className="text-gray-400 mb-2">Explanation:</div>
                <div className="text-gray-300">Because nums[0] + nums[1] == 9, we return [0, 1].</div>
              </div>
            </div>
          )}

          {challenge.type === "voice-debugging" && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Debugging Instructions</h3>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-amber-200">
                  🎯 <strong>Your Task:</strong> The code has a security vulnerability. 
                  Use voice commands to discuss the issue with our AI debugging coach, 
                  then fix the code to prevent unauthorized access.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link href={`/training/challenges/${challenge.slug}/attempt`}>
            <Button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl">
              Start Challenge
            </Button>
          </Link>
          
          <Button variant="outline" className="px-8 py-4 border-[#333] text-gray-300 hover:bg-[#232323] text-lg font-semibold rounded-xl">
            View Leaderboard
          </Button>
        </div>

        {/* Progress Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#18181b] border border-[#232323] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-400 mb-1">--</div>
            <div className="text-gray-500 text-sm">Best Score</div>
          </div>
          <div className="bg-[#18181b] border border-[#232323] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-400 mb-1">0</div>
            <div className="text-gray-500 text-sm">Attempts</div>
          </div>
          <div className="bg-[#18181b] border border-[#232323] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-400 mb-1">--</div>
            <div className="text-gray-500 text-sm">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
