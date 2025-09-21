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
