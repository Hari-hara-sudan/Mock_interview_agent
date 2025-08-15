import { NextRequest, NextResponse } from 'next/server';
import { CodeExecutionService } from '@/lib/code-execution.service';

// Simple in-memory store for submissions (dev/demo only). Consider persisting in Firestore.
const submissionStore: Map<string, any> = new Map();

// Real-time code execution handler
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

    // Get challenge-specific test cases
    const testCases = getChallengeTestCases(challengeId);
    
    if (!testCases || testCases.length === 0) {
      return NextResponse.json(
        { error: 'No test cases found for this challenge' },
        { status: 400 }
      );
    }

    console.log(`🚀 Executing ${language} code for challenge: ${challengeId}`);
    console.log(`📝 User code:`, code);
    console.log(`🧪 Test cases:`, testCases);

    // Create executable code with proper input/output handling
    const executableCode = createExecutableCode(code, language, challengeId);
    console.log(`🔧 Executable code:`, executableCode);

    try {
      // Execute code using Piston API (free and reliable)
      const executionResult = await CodeExecutionService.submitCodeToPiston(
        executableCode, // Use the wrapped executable code
        language,
        testCases
      );

      // Calculate stats
      const stats = CodeExecutionService.getExecutionStats(executionResult.results);
      const score = CodeExecutionService.calculateScore(executionResult.results);

      const submissionId = `submission_${Date.now()}_${userId}`;

      // Format results for frontend
      const formattedResults = executionResult.results.map((result, index) => ({
        testCaseIndex: index,
        input: testCases[index].input,
        passed: result.passed,
        actualOutput: result.actualOutput,
        expectedOutput: result.expectedOutput,
        executionTime: result.executionTime || 0,
        status: result.status,
        stderr: result.stderr
      }));

      console.log(`✅ Execution complete. Score: ${score}/${stats.totalTests}`);

      // Persist submission for retrieval on results page
      const stored = {
        submissionId,
        challengeId,
        language,
        score,
        passed: score === 100,
        totalTests: stats.totalTests,
        passedTests: stats.passedTests,
        failedTests: stats.failedTests,
        executionTime: stats.avgExecutionTime,
        memoryUsage: stats.avgMemoryUsage,
        results: formattedResults,
        code,
        submittedAt: new Date().toISOString(),
      };
      submissionStore.set(submissionId, stored);

      return NextResponse.json({
        ...stored,
        realTimeExecution: true // Flag to indicate this is real execution
      });

    } catch (executionError) {
      console.error('Code execution failed:', executionError);
      
      // Return execution error details
      return NextResponse.json({
        submissionId: `error_${Date.now()}_${userId}`,
        score: 0,
        passed: false,
        totalTests: testCases.length,
        passedTests: 0,
        failedTests: testCases.length,
        executionTime: 0,
        memoryUsage: 0,
        results: testCases.map((testCase, index) => ({
          testCaseIndex: index,
          input: testCase.input,
          passed: false,
          actualOutput: '',
          expectedOutput: testCase.expectedOutput,
          executionTime: 0,
          status: 'error',
          stderr: executionError instanceof Error ? executionError.message : 'Execution failed'
        })),
        error: 'Code execution failed',
        realTimeExecution: true
      });
    }

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get test cases for each challenge  
function getChallengeTestCases(challengeId: string): Array<{ input: string; expectedOutput: string }> {
  switch (challengeId) {
    case 'two-sum':
      return [
        {
          input: '[2,7,11,15]\n9',
          expectedOutput: '[0, 1]'
        },
        {
          input: '[3,2,4]\n6',  
          expectedOutput: '[1, 2]'
        },
        {
          input: '[3,3]\n6',
          expectedOutput: '[0, 1]'
        },
        {
          input: '[1,2,3,4,5]\n9',
          expectedOutput: '[3, 4]'
        },
        {
          input: '[-1,-2,-3,-4,-5]\n-8',
          expectedOutput: '[2, 4]'
        }
      ];
      
    case 'debug-auth-bug':
      return [
        {
          input: 'valid@email.com\ncorrectpassword',
          expectedOutput: '{"user":{"id":1,"email":"valid@email.com"},"token":"jwt-token"}'
        },
        {
          input: 'admin@company.com\nadmin123',
          expectedOutput: '{"user":{"id":2,"email":"admin@company.com"},"token":"jwt-token"}'
        },
        {
          input: 'test@example.org\ntestpass',
          expectedOutput: '{"user":{"id":3,"email":"test@example.org"},"token":"jwt-token"}'
        }
      ];
      
    default:
      console.warn(`No test cases defined for challenge: ${challengeId}`);
      return [];
  }
}

// Create challenge-specific executable code
function createExecutableCode(userCode: string, language: string, challengeId: string): string {
  switch (challengeId) {
    case 'two-sum':
      if (language === 'python') {
        return `import sys
import json

# Read input
lines = [line.strip() for line in sys.stdin.readlines()]
nums = json.loads(lines[0])
target = int(lines[1])

${userCode}

# Execute and output result
result = twoSum(nums, target)
print(json.dumps(result))`;
      } else if (language === 'javascript') {
        return `const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = [];
rl.on('line', (line) => {
  input.push(line.trim());
});

rl.on('close', () => {
  const nums = JSON.parse(input[0]);
  const target = parseInt(input[1]);
  
  ${userCode}
  
  const result = twoSum(nums, target);
  console.log(JSON.stringify(result));
});`;
      }
      break;
      
    case 'debug-auth-bug':
      if (language === 'javascript') {
        return `const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = [];
rl.on('line', (line) => {
  input.push(line.trim());
});

rl.on('close', () => {
  const email = input[0];
  const password = input[1];
  
  ${userCode}
  
  const result = loginUser(email, password);
  console.log(JSON.stringify(result));
});`;
      }
      break;
  }
  
  // Fallback: return user code as-is
  return userCode;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('submissionId');
    const challengeId = searchParams.get('challengeId') || 'two-sum'; // Extract challenge from submissionId or param

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Missing submissionId' },
        { status: 400 }
      );
    }

    // If we have a stored submission, return it
    const stored = submissionStore.get(submissionId);
    if (stored) {
      return NextResponse.json(stored);
    }

    // Generate challenge-specific detailed results
    let mockDetailedResults;
    
    if (challengeId === 'two-sum') {
      mockDetailedResults = {
        submission: {
          id: submissionId,
          status: 'passed',
          score: 100,
          language: 'python',
          code: 'def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []',
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
            "Could add comments explaining the algorithm approach"
          ],
          overallScore: 100,
          skillAssessment: {
            "Problem Solving": 95,
            "Code Quality": 90,
            "Efficiency": 100,
            "Edge Cases": 85,
            "Communication": 90
          },
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          recommendation: "Perfect solution! Great job on the optimal approach."
        }
      };
    } else if (challengeId === 'debug-auth-bug') {
      mockDetailedResults = {
        submission: {
          id: submissionId,
          status: 'failed',
          score: 0,
          language: 'javascript',
          code: 'function loginUser(email, password) {\n  if (email && password) {\n    return null; // Bug: Should return user object\n  }\n  return null;\n}',
          submittedAt: new Date().toISOString()
        },
        testResults: [
          {
            testCase: 1,
            input: "loginUser('valid@email.com', 'correctpassword')",
            expectedOutput: "{ user: { id: 1, email: 'valid@email.com' }, token: 'jwt-token' }",
            actualOutput: "null",
            passed: false,
            executionTime: 32,
            memoryUsage: 8
          },
          {
            testCase: 2,
            input: "loginUser('admin@company.com', 'admin123')",
            expectedOutput: "{ user: { id: 2, email: 'admin@company.com' }, token: 'jwt-token' }",
            actualOutput: "null",
            passed: false,
            executionTime: 28,
            memoryUsage: 8
          },
          {
            testCase: 3,
            input: "loginUser('test@example.org', 'testpass')",
            expectedOutput: "{ user: { id: 3, email: 'test@example.org' }, token: 'jwt-token' }",
            actualOutput: "null",
            passed: false,
            executionTime: 35,
            memoryUsage: 8
          }
        ],
        feedback: {
          strengths: [
            "Good input validation structure",
            "Clean function signature"
          ],
          improvements: [
            "🐛 Critical Bug: Function always returns null instead of user object",
            "Missing actual authentication logic",
            "No password verification implemented",
            "Missing user database lookup"
          ],
          overallScore: 0,
          skillAssessment: {
            "Problem Solving": 20,
            "Code Quality": 40,
            "Debugging": 10,
            "Logic": 15,
            "Security": 30
          },
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          recommendation: "The function has a critical bug - it always returns null. You need to implement proper user authentication logic."
        }
      };
    } else {
      // Default for unknown challenges
      mockDetailedResults = {
        submission: {
          id: submissionId,
          status: 'passed',
          score: 85,
          language: 'javascript',
          code: '// Your submitted code here',
          submittedAt: new Date().toISOString()
        },
        testResults: [],
        feedback: {
          strengths: ["Good attempt"],
          improvements: ["Keep practicing"],
          overallScore: 85,
          skillAssessment: {},
          timeComplexity: "N/A",
          spaceComplexity: "N/A",
          recommendation: "Continue learning!"
        }
      };
    }

    return NextResponse.json(mockDetailedResults);

  } catch (error) {
    console.error('Get submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
