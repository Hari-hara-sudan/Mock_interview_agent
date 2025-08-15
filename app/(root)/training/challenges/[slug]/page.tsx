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
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
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
        javascript: "function twoSum(nums, target) {\n    // Your code here\n    // Return array of two indices\n}",
        python: "def two_sum(nums, target):\n    # Your code here\n    # Return list of two indices\n    pass",
        java: "public int[] twoSum(int[] nums, int target) {\n    // Your code here\n    // Return array of two indices\n}"
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
      description: "A login system has a subtle security vulnerability that allows unauthorized access. The bug is in the token validation logic. Work with our AI debugging coach to identify and fix the issue.",
      difficulty: "medium",
      type: "voice-debugging",
      supportedLanguages: ["javascript", "typescript"],
      examples: [
        {
          input: "token = 'abc123', userRole = 'admin'",
          output: "{ authenticated: true, role: 'admin' }",
          explanation: "This should work for valid admin tokens"
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
        javascript: "function authenticateUser(token, userRole) {\n    // This code has a security bug\n    if (token && userRole === 'admin') {\n        return { authenticated: true, role: userRole };\n    }\n    return { authenticated: false };\n}",
        typescript: "interface AuthResult {\n    authenticated: boolean;\n    role?: string;\n}\n\nfunction authenticateUser(token: string, userRole: string): AuthResult {\n    // This code has a security bug\n    if (token && userRole === 'admin') {\n        return { authenticated: true, role: userRole };\n    }\n    return { authenticated: false };\n}"
      },
      timeLimit: 900000, // 15 minutes
      tags: ["security", "debugging", "authentication"],
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
