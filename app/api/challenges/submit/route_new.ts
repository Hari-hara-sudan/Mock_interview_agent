import { NextRequest, NextResponse } from 'next/server';

// Mock submission handler with simulated code execution
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengeId, language, code, userId = 'mock-user' } = body;

    if (!challengeId || !language || !code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock test execution results
    const mockTestResults = [
      {
        testCaseIndex: 0,
        passed: true,
        actualOutput: "[0,1]",
        expectedOutput: "[0,1]",
        executionTime: 45,
        status: "success"
      },
      {
        testCaseIndex: 1,
        passed: true,
        actualOutput: "[1,2]", 
        expectedOutput: "[1,2]",
        executionTime: 52,
        status: "success"
      },
      {
        testCaseIndex: 2,
        passed: Math.random() > 0.3, // 70% pass rate
        actualOutput: Math.random() > 0.3 ? "[0,1]" : "[1,0]",
        expectedOutput: "[0,1]",
        executionTime: 48,
        status: "success"
      }
    ];

    // Calculate score
    const passedTests = mockTestResults.filter(r => r.passed).length;
    const score = Math.round((passedTests / mockTestResults.length) * 100);
    const avgExecutionTime = mockTestResults.reduce((sum, r) => sum + r.executionTime, 0) / mockTestResults.length;

    const submissionId = `submission_${Date.now()}_${userId}`;

    return NextResponse.json({
      submissionId,
      score,
      passed: score === 100,
      totalTests: mockTestResults.length,
      passedTests,
      failedTests: mockTestResults.length - passedTests,
      executionTime: avgExecutionTime,
      memoryUsage: Math.floor(Math.random() * 30) + 10,
      results: mockTestResults
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('submissionId');

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Missing submissionId' },
        { status: 400 }
      );
    }

    // Mock detailed results
    const mockDetailedResults = {
      submission: {
        id: submissionId,
        status: 'passed',
        score: 85,
        language: 'javascript',
        code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
        submittedAt: new Date().toISOString()
      },
      testResults: [
        {
          testCase: 1,
          input: '[2,7,11,15], 9',
          expectedOutput: '[0,1]',
          actualOutput: '[0,1]',
          passed: true,
          executionTime: 45,
          memoryUsage: 12
        },
        {
          testCase: 2,
          input: '[3,2,4], 6',
          expectedOutput: '[1,2]',
          actualOutput: '[1,2]',
          passed: true,
          executionTime: 52,
          memoryUsage: 14
        },
        {
          testCase: 3,
          input: '[3,3], 6',
          expectedOutput: '[0,1]',
          actualOutput: '[0,1]',
          passed: true,
          executionTime: 48,
          memoryUsage: 13
        }
      ],
      feedback: {
        strengths: [
          "Excellent use of HashMap for O(1) lookups",
          "Clean and readable code structure", 
          "Efficient O(n) time complexity solution",
          "Proper handling of the single-pass requirement"
        ],
        improvements: [
          "Consider adding input validation for empty arrays",
          "Could add comments explaining the algorithm approach",
          "Handle potential integer overflow for very large numbers"
        ],
        overallScore: 85,
        skillAssessment: {
          "Problem Solving": 90,
          "Code Quality": 85,
          "Efficiency": 95,
          "Edge Cases": 70,
          "Communication": 80
        },
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        recommendation: "Great solution! Focus on edge case handling and code documentation for even better results."
      }
    };

    return NextResponse.json(mockDetailedResults);

  } catch (error) {
    console.error('Get submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
