import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import ChallengeListItem from "@/components/ChallengeListItem";
import { Challenge } from "@/types/index";

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

// Mock data for now - later we'll fetch from Firestore
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
      {
        input: "[2,7,11,15], 9",
        expectedOutput: "[0,1]",
        isHidden: false
      }
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
      {
        input: "'valid@email.com', 'correctpassword'",
        expectedOutput: '{"success":true,"user":{"id":1},"token":"jwt-token"}',
        isHidden: false
      }
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
      {
        input: "[1,2,3,4,5], 3",
        expectedOutput: "2",
        isHidden: false
      }
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
      {
        input: "'increment', 5",
        expectedOutput: '{"count":6,"actionType":"increment"}',
        isHidden: false
      }
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
      {
        input: "'GET', '/api/users/123'",
        expectedOutput: '{"status":200,"body":{"id":"123","name":"John Doe"}}',
        isHidden: false
      }
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

const ChallengesPage = async () => {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen">
      <div className="bg-background border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">Coding Challenges</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Your Progress */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="p-6">
              <div className="font-semibold text-foreground mb-3">Your Progress</div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span className="text-muted-foreground">Solved</span><span className="text-emerald-600 font-semibold">0/150</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Attempted</span><span className="text-amber-600 font-semibold">0/150</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Easy</span><span className="text-emerald-600 font-semibold">0/65</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Medium</span><span className="text-amber-600 font-semibold">0/60</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Hard</span><span className="text-rose-600 font-semibold">0/25</span></li>
              </ul>
            </div>
          </div>

          {/* Categories */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="p-6">
              <div className="font-semibold text-foreground mb-3">Categories</div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center justify-between"><span>Arrays</span><span>--</span></li>
                <li className="flex items-center justify-between"><span>Strings</span><span>--</span></li>
                <li className="flex items-center justify-between"><span>Dynamic Programming</span><span>--</span></li>
                <li className="flex items-center justify-between"><span>Trees</span><span>--</span></li>
                <li className="flex items-center justify-between"><span>Graphs</span><span>--</span></li>
                <li className="flex items-center justify-between"><span>Linked Lists</span><span>--</span></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main List */}
        <section>
          {/* Search + Filters */}
          <div className="rounded-2xl border border-border bg-card p-4 flex flex-wrap items-center gap-3 mb-6">
            <input
              className="flex-1 min-w-[220px] px-4 py-2 rounded-xl border border-border bg-background text-sm"
              placeholder="Search challenges..."
            />
            <button className="px-4 py-2 rounded-xl border border-border text-sm bg-background">Filter</button>
            <button className="px-4 py-2 rounded-xl border border-border text-sm bg-background">Difficulty</button>
            <button className="px-4 py-2 rounded-xl border border-border text-sm bg-background">Company</button>
          </div>

          <div className="space-y-4">
            {mockChallenges.map((c) => (
              <ChallengeListItem key={c.id} challenge={c} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button className="px-5 py-3 rounded-2xl border border-border bg-white text-foreground shadow-sm">Load More Challenges</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChallengesPage;
