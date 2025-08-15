import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import ChallengeCard from "@/components/ChallengeCard";
import { Challenge } from "@/types/index";

// Mock data for now - later we'll fetch from Firestore
const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Two Sum Problem",
    slug: "two-sum",
    description: "Find two numbers in an array that add up to a target value. Practice explaining your approach before coding.",
    difficulty: "easy",
    type: "explain-before-code",
    supportedLanguages: ["javascript", "python", "java"],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]"
      }
    ],
    constraints: [
      "Only one valid answer exists",
      "You may not use the same element twice"
    ],
    testCases: [
      {
        input: "[2,7,11,15], 9",
        expectedOutput: "[0,1]",
        isHidden: false
      }
    ],
    starterCode: {
      javascript: "function twoSum(nums, target) {\n    // Your code here\n}",
      python: "def two_sum(nums, target):\n    # Your code here\n    pass"
    },
    timeLimit: 300000, // 5 minutes
    tags: ["arrays", "hash-table"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2", 
    title: "Debug the Authentication Bug",
    slug: "debug-auth-bug",
    description: "A login system has a subtle security vulnerability. Work with our AI debugging coach to identify and fix it.",
    difficulty: "medium",
    type: "voice-debugging",
    supportedLanguages: ["javascript", "typescript"],
    examples: [
      {
        input: "token = '', userRole = 'admin'",
        output: "{ authenticated: false }",
        explanation: "Empty token should not authenticate"
      }
    ],
    constraints: [
      "Must prevent unauthorized access",
      "Token validation must be secure"
    ],
    testCases: [
      {
        input: "'', 'admin'",
        expectedOutput: "{ authenticated: false }",
        isHidden: false
      }
    ],
    starterCode: {
      javascript: "// Buggy authentication code\nfunction authenticateUser(token) {\n    // Debug this code\n}",
    },
    timeLimit: 900000, // 15 minutes
    tags: ["security", "debugging", "authentication"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Binary Search Performance",
    slug: "binary-search-perf",
    description: "Optimize a slow search function to meet strict performance requirements under large datasets.",
    difficulty: "hard",
    type: "performance-tuning",
    supportedLanguages: ["javascript", "python", "java", "cpp"],
    examples: [
      {
        input: "arr = [1,2,3,4,5], target = 3",
        output: "2",
        explanation: "Binary search should find target at index 2"
      }
    ],
    constraints: [
      "Must have O(log n) time complexity",
      "Memory usage must be optimized"
    ],
    testCases: [
      {
        input: "[1,2,3,4,5], 3",
        expectedOutput: "2",
        isHidden: false
      }
    ],
    starterCode: {
      javascript: "function slowSearch(arr, target) {\n    // Optimize this implementation\n}",
    },
    timeLimit: 1200000, // 20 minutes
    tags: ["algorithms", "optimization", "binary-search"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Code Review: React Component",
    slug: "react-code-review",
    description: "Review a React component with performance issues and security vulnerabilities. Leave detailed comments.",
    difficulty: "medium",
    type: "code-review",
    supportedLanguages: ["javascript", "typescript"],
    examples: [
      {
        input: "React component code",
        output: "Review comments",
        explanation: "Identify performance and security issues"
      }
    ],
    constraints: [
      "Must identify all major issues",
      "Provide actionable feedback"
    ],
    testCases: [
      {
        input: "component code",
        expectedOutput: "review feedback",
        isHidden: false
      }
    ],
    starterCode: {
      javascript: "// Review this React component\nfunction UserProfile({ userId }) {\n    // Review this code\n}",
    },
    timeLimit: 600000, // 10 minutes
    tags: ["react", "security", "performance"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "API Contract Implementation",
    slug: "api-contract",
    description: "Implement a function that satisfies a strict API contract with randomized property-based tests.",
    difficulty: "hard",
    type: "black-box-contract",
    supportedLanguages: ["javascript", "python", "java"],
    examples: [
      {
        input: "input = {data: [1,2,3]}",
        output: "{processed: true, count: 3}",
        explanation: "Function should process input according to contract"
      }
    ],
    constraints: [
      "Must satisfy all contract requirements",
      "Handle edge cases properly"
    ],
    testCases: [
      {
        input: "{data: [1,2,3]}",
        expectedOutput: "{processed: true, count: 3}",
        isHidden: false
      }
    ],
    starterCode: {
      javascript: "// Implement according to the contract\nfunction processData(input) {\n    // Your implementation\n}",
    },
    timeLimit: 1800000, // 30 minutes
    tags: ["algorithms", "contracts", "testing"],
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Programming Challenges</h1>
          <p className="text-gray-400 text-lg">
            Practice coding with voice explanations, AI debugging, and performance optimization challenges.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select className="px-4 py-2 bg-[#232323] border border-[#333] rounded-lg text-white">
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          
          <select className="px-4 py-2 bg-[#232323] border border-[#333] rounded-lg text-white">
            <option value="">All Types</option>
            <option value="explain-before-code">Voice + Code</option>
            <option value="voice-debugging">Debug Coach</option>
            <option value="code-review">Code Review</option>
            <option value="black-box-contract">Contract Test</option>
            <option value="performance-tuning">Performance</option>
          </select>

          <select className="px-4 py-2 bg-[#232323] border border-[#333] rounded-lg text-white">
            <option value="">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              // progress={challengeProgress[challenge.id]} // TODO: fetch user progress
            />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#18181b] border border-[#232323] rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">0</div>
            <div className="text-gray-400">Completed</div>
          </div>
          <div className="bg-[#18181b] border border-[#232323] rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">0</div>
            <div className="text-gray-400">In Progress</div>
          </div>
          <div className="bg-[#18181b] border border-[#232323] rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">--</div>
            <div className="text-gray-400">Avg Score</div>
          </div>
          <div className="bg-[#18181b] border border-[#232323] rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
            <div className="text-gray-400">Total Attempts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
