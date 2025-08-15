import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import ChallengeCard from "@/components/ChallengeCard";
import { Challenge } from "@/types/index";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { interviewCovers } from "@/constants";
import { getAllFeedbacksByInterviewId } from "@/lib/actions/getAllFeedbacksByInterviewId";
import { redirect } from "next/navigation";

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
    timeLimit: 300000, // 5 minutes
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    testCases: [
      {
        input: "[2,7,11,15], 9",
        expectedOutput: "[0, 1]", // Updated with spaces
        isHidden: false
      },
      {
        input: "[3,2,4], 6", 
        expectedOutput: "[1, 2]", // Updated with spaces
        isHidden: false
      },
      {
        input: "[3,3], 6",
        expectedOutput: "[0, 1]", // Updated with spaces
        isHidden: false
      },
      {
        input: "[1,2,3,4,5], 9",
        expectedOutput: "[3, 4]", // Updated with spaces
        isHidden: false
      },
      {
        input: "[-1,-2,-3,-4,-5], -8", 
        expectedOutput: "[2, 4]", // Updated with spaces
        isHidden: false
      }
    ],
    starterCode: {
      javascript: "function twoSum(nums,target) {\n    // Your code here\n}",
      python: "def two_sum(nums,target):\n    # Your code here\n    pass"
    },
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
    timeLimit: 900000, // 15 minutes
    examples: [
      {
        input: "token = 'invalid_token'",
        output: "false",
        explanation: "Invalid tokens should be rejected"
      }
    ],
    constraints: ["Must handle edge cases", "Security best practices required"],
    testCases: [
      {
        input: "invalid_token",
        expectedOutput: "false",
        isHidden: false
      }
    ],
    starterCode: {
      javascript: "// Buggy authentication code\nfunction authenticateUser(token) {\n    // Debug this code\n}",
    },
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
    timeLimit: 1200000, // 20 minutes
    examples: [
      {
        input: "arr = [1,2,3,4,5], target = 3",
        output: "2",
        explanation: "Target 3 is at index 2"
      }
    ],
    constraints: ["O(log n) time complexity required", "Array is sorted"],
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
    tags: ["algorithms", "optimization", "binary-search"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function Home() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    redirect("/sign-in");
  }

  let userInterviews: any[] = [];
  let allInterview: any[] = [];
  if (user && user.id) {
    userInterviews = (await getInterviewsByUserId(user.id)) as any[] || [];
    allInterview = (await getLatestInterviews({ limit: 20 })) as any[] || [];
  }

  // Fetch feedbacks for each user interview
  const userInterviewsWithFeedback = userInterviews
    ? await Promise.all(
        userInterviews.map(async (interview) => {
          const feedbacks = await getAllFeedbacksByInterviewId({
            interviewId: interview.id,
            userId: user.id,
          });
          return { ...interview, feedback: feedbacks[0] || null };
        })
      )
    : [];

  const hasPastInterviews = userInterviewsWithFeedback.length > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  // Assign deterministic cover images
  const getCoverImage = (id: string, idx: number) =>
    interviewCovers[
      (parseInt(id.replace(/\D/g, "")) + idx) % interviewCovers.length
    ] || "/default-cover.png";

  return (
    <>
      {/* Minimal Hero Section */}
      <section className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] bg-clip-text text-transparent">
            Get Interview-Ready
          </span>
          <br />
          <span className="text-white">with AI-Powered Practice</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Practice real interview questions and get instant AI-powered feedback
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link href="/interview">Generate Interview</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3 border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
            <Link href="/training/challenges">Practice Challenges</Link>
          </Button>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-gradient-to-br from-blue-900/40 to-blue-800/40 backdrop-blur-sm border border-blue-500/30 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Practice Interviews</h3>
          </div>
          <p className="text-gray-300 mb-4">Get real-time feedback on your interview performance with our AI-powered system.</p>
          <Link href="/interview" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Start Practice →
          </Link>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">View Results</h3>
          </div>
          <p className="text-gray-300 mb-4">Review your past interviews and track your improvement over time.</p>
          <Link href="/profile" className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors">
            View Profile →
          </Link>
        </div>

        <div className="p-6 bg-gradient-to-br from-pink-900/40 to-pink-800/40 backdrop-blur-sm border border-pink-500/30 rounded-2xl shadow-lg hover:shadow-pink-500/20 transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-500/20 rounded-xl group-hover:bg-pink-500/30 transition-colors">
              <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Aptitude Tests</h3>
          </div>
          <p className="text-gray-300 mb-4">Test your quantitative, logical, and verbal reasoning skills with timed assessments.</p>
          <Link href="/aptitude" className="inline-flex items-center text-pink-400 hover:text-pink-300 font-medium transition-colors">
            Take Tests →
          </Link>
        </div>
      </section>

      {/* Practice Challenges Section */}
      <section className="flex flex-col gap-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Practice Challenges</h2>
          <Link href="/training/challenges" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            View All →
          </Link>
        </div>

        <div className="interviews-section">
          {mockChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No challenges available at the moment</p>
          )}
        </div>
      </section>

      {/* Interview Templates Section */}
      <section className="flex flex-col gap-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Interview Templates</h2>
          <Link href="/interview" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Start Interview →
          </Link>
        </div>

        <div className="interviews-section">
          {/* Your Past Interviews */}
          {hasPastInterviews && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Your Previous Interviews</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userInterviewsWithFeedback?.map((interview, idx) => (
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    userId={user.id}
                    cover={getCoverImage(interview.id, idx)}
                    feedbacks={interview.feedback ? [interview.feedback] : []}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Available Interview Templates */}
          <div>
            <h3 className="text-xl font-semibold text-gray-300 mb-4">Available Templates</h3>
            {hasUpcomingInterviews ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allInterview?.map((interview, idx) => (
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    userId={user?.id}
                    cover={getCoverImage(interview.id, idx)}
                    feedbacks={[]}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No interview templates available at the moment</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
