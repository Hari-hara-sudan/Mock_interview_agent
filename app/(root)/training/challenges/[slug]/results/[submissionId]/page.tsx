import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";

interface ResultsPageProps {
  params: Promise<{ slug: string; submissionId: string }>;
}

const ResultsPage = async ({ params }: ResultsPageProps) => {
  const { slug, submissionId } = await params;
  const user = await getCurrentUser();
  
  if (!user?.id) {
    redirect("/sign-in");
  }

  // Build server base URL from incoming request
  const hdrs = await headers();
  const host = hdrs.get('host') || 'localhost:3000';
  const proto = hdrs.get('x-forwarded-proto') || 'http';
  const baseUrl = `${proto}://${host}`;

  // Fetch stored submission from API
  const res = await fetch(`${baseUrl}/api/challenges/submit?submissionId=${encodeURIComponent(submissionId)}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    redirect(`/training/challenges/${slug}`);
  }

  const data = await res.json();

  // Map API data to UI model
  const results = {
    id: data.submissionId as string,
    challengeId: data.challengeId as string,
    challengeTitle: slug.includes('two-sum') ? 'Two Sum Problem' : 'Challenge Results',
    language: data.language as string,
    status: (data.passed ? 'passed' : 'failed') as 'passed' | 'failed',
    score: Number(data.score ?? 0),
    caseResults: (data.results || []).map((r: any, i: number) => ({
      testCaseId: `test-${i}`,
      passed: !!r.passed,
      input: r.input ?? '',
      actualOutput: r.actualOutput ?? '',
      expectedOutput: r.expectedOutput ?? '',
      runtimeMs: Number(r.executionTime ?? 0),
      memoryMB: 0,
    })),
    totalTests: Number(data.totalTests ?? (data.results?.length || 0)),
    passedTests: Number(data.passedTests ?? (data.results?.filter((x: any) => x.passed).length || 0)),
    runtimeMs: Number(data.executionTime ?? 0),
    memoryMB: Number(data.memoryUsage ?? 0),
    feedback: {
      strengths: [
        'Solid problem understanding and correct approach',
        'Time complexity is optimal for this task',
        'Clean structure and readable naming',
      ],
      improvements: [
        'Add more comments explaining tricky parts',
        'Include edge-case tests in your code',
        'Consider input validation where applicable',
      ],
      codeQuality: 8.5,
      algorithmCorrectness: data.passed ? 9.0 : 7.0,
      communicationScore: 8.0,
    },
    createdAt: new Date().toISOString(),
  } as const;

  const passRate = (results.passedTests / results.totalTests) * 100;
  const overallGrade = results.score >= 80 ? "A" : results.score >= 70 ? "B" : results.score >= 60 ? "C" : "D";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/training/challenges/${slug}`} className="text-blue-400 hover:text-blue-300">
            ← Back to Challenge
          </Link>
        </div>

        {/* Results Overview */}
        <div className="bg-[#18181b] border border-[#232323] rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{results.challengeTitle}</h1>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "px-4 py-2 rounded-full text-lg font-bold",
                  results.status === "passed" 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                )}>
                  {results.status === "passed" ? "✅ PASSED" : "❌ FAILED"}
                </div>
                <div className="text-gray-400">
                  Language: <span className="text-white font-mono">{results.language}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold text-white mb-2">{results.score}/100</div>
              <div className="text-lg text-gray-400">Grade: <span className="text-white font-bold">{overallGrade}</span></div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{results.passedTests}/{results.totalTests}</div>
              <div className="text-gray-400 text-sm">Test Cases</div>
              <div className="text-xs text-gray-500 mt-1">{passRate.toFixed(1)}% pass rate</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{results.runtimeMs}ms</div>
              <div className="text-gray-400 text-sm">Runtime</div>
              <div className="text-xs text-gray-500 mt-1">Average execution</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{results.memoryMB}MB</div>
              <div className="text-gray-400 text-sm">Memory</div>
              <div className="text-xs text-gray-500 mt-1">Peak usage</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{results.feedback.codeQuality}/10</div>
              <div className="text-gray-400 text-sm">Code Quality</div>
              <div className="text-xs text-gray-500 mt-1">AI Assessment</div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="border-t border-[#333] pt-6">
            <h3 className="text-xl font-bold text-white mb-4">Skill Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Algorithm Correctness</span>
                  <span className="text-white font-semibold">{results.feedback.algorithmCorrectness}/10</span>
                </div>
                <div className="w-full bg-[#333] rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${results.feedback.algorithmCorrectness * 10}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Code Quality</span>
                  <span className="text-white font-semibold">{results.feedback.codeQuality}/10</span>
                </div>
                <div className="w-full bg-[#333] rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${results.feedback.codeQuality * 10}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Communication</span>
                  <span className="text-white font-semibold">{results.feedback.communicationScore}/10</span>
                </div>
                <div className="w-full bg-[#333] rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${results.feedback.communicationScore * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases Details */}
        <div className="bg-[#18181b] border border-[#232323] rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Test Cases</h3>
          <div className="space-y-4">
            {results.caseResults.map((testCase: any, index: number) => (
              <div 
                key={testCase.testCaseId} 
                className={cn(
                  "border rounded-lg p-4",
                  testCase.passed 
                    ? "border-green-500/30 bg-green-500/5" 
                    : "border-red-500/30 bg-red-500/5"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-2 py-1 rounded text-sm font-semibold",
                      testCase.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    )}>
                      Test {index + 1} {testCase.passed ? "✓" : "✗"}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {testCase.runtimeMs}ms • {testCase.memoryMB}MB
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 font-mono text-sm">
                  <div>
                    <span className="text-gray-400">Input: </span>
                    <span className="text-white">{testCase.input}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Your Output: </span>
                    <span className={testCase.passed ? "text-green-400" : "text-red-400"}>
                      {testCase.actualOutput}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Expected: </span>
                    <span className="text-blue-400">{testCase.expectedOutput}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Feedback */}
        <div className="bg-[#18181b] border border-[#232323] rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">AI Feedback</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-green-400 mb-4">✅ Strengths</h4>
              <ul className="space-y-2">
                {results.feedback.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-300 flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-yellow-400 mb-4">🔧 Areas for Improvement</h4>
              <ul className="space-y-2">
                {results.feedback.improvements.map((improvement, index) => (
                  <li key={index} className="text-gray-300 flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link href="/training/challenges">
            <Button variant="outline" className="border-[#333] text-gray-300 hover:bg-[#232323]">
              More Challenges
            </Button>
          </Link>
          
          <Link href={`/training/challenges/${slug}/attempt`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </Link>
          
          <Button variant="outline" className="border-[#333] text-gray-300 hover:bg-[#232323]">
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
