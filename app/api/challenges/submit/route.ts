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
          expectedOutput: '{"success":true,"user":{"id":1,"email":"valid@email.com"},"token":"jwt-token"}'
        },
        {
          input: 'admin@company.com\nadmin123',
          expectedOutput: '{"success":true,"user":{"id":2,"email":"admin@company.com"},"token":"jwt-token"}'
        },
        {
          input: 'invalid@test.com\nwrongpassword',
          expectedOutput: '{"success":false,"error":"Invalid credentials"}'
        },
        {
          input: '\npassword',
          expectedOutput: '{"success":false,"error":"Email is required"}'
        },
        {
          input: 'test@example.com\n',
          expectedOutput: '{"success":false,"error":"Password is required"}'
        }
      ];
      
    case 'binary-search-perf':
      return [
        {
          input: '[1,2,3,4,5,6,7,8,9,10]\n5',
          expectedOutput: '4'
        },
        {
          input: '[1,2,3,4,5,6,7,8,9,10]\n1',
          expectedOutput: '0'
        },
        {
          input: '[1,2,3,4,5,6,7,8,9,10]\n10',
          expectedOutput: '9'
        },
        {
          input: '[1,2,3,4,5,6,7,8,9,10]\n11',
          expectedOutput: '-1'
        },
        {
          input: '[2,5,8,12,16,23,38,56,72,91]\n23',
          expectedOutput: '5'
        },
        {
          input: '[]\n5',
          expectedOutput: '-1'
        },
        {
          input: '[42]\n42',
          expectedOutput: '0'
        }
      ];
      
    case 'react-code-review':
      return [
        {
          input: 'increment\n0',
          expectedOutput: '{"count":1,"actionType":"increment"}'
        },
        {
          input: 'decrement\n5',
          expectedOutput: '{"count":4,"actionType":"decrement"}'
        },
        {
          input: 'reset\n100',
          expectedOutput: '{"count":0,"actionType":"reset"}'
        },
        {
          input: 'increment\n-1',
          expectedOutput: '{"count":0,"actionType":"increment"}'
        },
        {
          input: 'decrement\n0',
          expectedOutput: '{"count":0,"actionType":"decrement"}'
        }
      ];
      
    case 'api-contract':
      return [
        {
          input: 'GET\n/api/users/123',
          expectedOutput: '{"status":200,"body":{"id":"123","name":"John Doe","email":"john@example.com"}}'
        },
        {
          input: 'POST\n/api/users\n{"name":"Jane","email":"jane@example.com"}',
          expectedOutput: '{"status":201,"body":{"id":"new-id","name":"Jane","email":"jane@example.com"}}'
        },
        {
          input: 'GET\n/api/users/999',
          expectedOutput: '{"status":404,"body":{"error":"User not found"}}'
        },
        {
          input: 'PUT\n/api/users/123\n{"name":"Updated Name"}',
          expectedOutput: '{"status":200,"body":{"id":"123","name":"Updated Name","email":"john@example.com"}}'
        },
        {
          input: 'DELETE\n/api/users/123',
          expectedOutput: '{"status":204,"body":null}'
        },
        {
          input: 'POST\n/api/users\n{}',
          expectedOutput: '{"status":400,"body":{"error":"Name and email are required"}}'
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
  input.push(line);
});

rl.on('close', () => {
  const email = input[0] || '';
  const password = input[1] || '';
  
  ${userCode}
  
  const result = authenticateUser(email, password);
  console.log(JSON.stringify(result));
});`;
      } else if (language === 'python') {
        return `import sys
import json

# Read input
lines = sys.stdin.read().strip().split('\\n')
email = lines[0] if len(lines) > 0 else ''
password = lines[1] if len(lines) > 1 else ''

${userCode}

# Execute and output result
result = authenticate_user(email, password)
print(json.dumps(result))`;
      }
      break;
      
    case 'binary-search-perf':
      if (language === 'python') {
        return `import sys
import json

# Read input
lines = [line.strip() for line in sys.stdin.readlines()]
arr = json.loads(lines[0]) if lines[0] else []
target = int(lines[1])

${userCode}

# Execute and output result
result = binarySearch(arr, target)
print(result)`;
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
  const arr = input[0] ? JSON.parse(input[0]) : [];
  const target = parseInt(input[1]);
  
  ${userCode}
  
  const result = binarySearch(arr, target);
  console.log(result);
});`;
      }
      break;
      
    case 'react-code-review':
      // This simulates React state management logic without actual React
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
  const actionType = input[0];
  const currentCount = parseInt(input[1]);
  
  ${userCode}
  
  const result = handleCounterAction(actionType, currentCount);
  console.log(JSON.stringify(result));
});`;
      } else if (language === 'python') {
        return `import sys
import json

# Read input
lines = [line.strip() for line in sys.stdin.readlines()]
action_type = lines[0]
current_count = int(lines[1])

${userCode}

# Execute and output result
result = handle_counter_action(action_type, current_count)
print(json.dumps(result))`;
      }
      break;
      
    case 'api-contract':
      if (language === 'javascript') {
        return `const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = [];
rl.on('line', (line) => {
  input.push(line);
});

rl.on('close', () => {
  const method = input[0].trim();
  const path = input[1].trim();
  const body = input[2] ? JSON.parse(input[2]) : null;
  
  ${userCode}
  
  const result = handleAPIRequest(method, path, body);
  console.log(JSON.stringify(result));
});`;
      } else if (language === 'python') {
        return `import sys
import json

# Read input
lines = sys.stdin.read().strip().split('\\n')
method = lines[0].strip()
path = lines[1].strip()
body = json.loads(lines[2]) if len(lines) > 2 and lines[2] else None

${userCode}

# Execute and output result
result = handle_api_request(method, path, body)
print(json.dumps(result))`;
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
    const challengeId = searchParams.get('challengeId') || 'two-sum';

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
    const mockResults: Record<string, any> = {
      'two-sum': {
        submission: {
          id: submissionId,
          status: 'passed',
          score: 100,
          language: 'python',
          code: 'def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []',
          submittedAt: new Date().toISOString()
        },
        testResults: [
          { testCase: 1, input: '[2,7,11,15], 9', expectedOutput: '[0,1]', actualOutput: '[0,1]', passed: true, executionTime: 45 },
          { testCase: 2, input: '[3,2,4], 6', expectedOutput: '[1,2]', actualOutput: '[1,2]', passed: true, executionTime: 52 },
          { testCase: 3, input: '[3,3], 6', expectedOutput: '[0,1]', actualOutput: '[0,1]', passed: true, executionTime: 48 }
        ],
        feedback: {
          strengths: ["Excellent use of HashMap for O(1) lookups", "Clean and readable code structure", "Efficient O(n) time complexity"],
          improvements: ["Consider adding input validation for empty arrays"],
          overallScore: 100,
          skillAssessment: { "Problem Solving": 95, "Code Quality": 90, "Efficiency": 100 },
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          recommendation: "Perfect solution! Great job on the optimal approach."
        }
      },
      'debug-auth-bug': {
        submission: {
          id: submissionId,
          status: 'passed',
          score: 100,
          language: 'javascript',
          code: 'function authenticateUser(email, password) {\n  if (!email) return { success: false, error: "Email is required" };\n  if (!password) return { success: false, error: "Password is required" };\n  const user = users[email];\n  if (!user || user.password !== password) return { success: false, error: "Invalid credentials" };\n  return { success: true, user: { id: user.id, email }, token: "jwt-token" };\n}',
          submittedAt: new Date().toISOString()
        },
        testResults: [
          { testCase: 1, input: "valid@email.com, correctpassword", expectedOutput: '{"success":true}', actualOutput: '{"success":true}', passed: true, executionTime: 32 },
          { testCase: 2, input: "admin@company.com, admin123", expectedOutput: '{"success":true}', actualOutput: '{"success":true}', passed: true, executionTime: 28 },
          { testCase: 3, input: "invalid@test.com, wrongpassword", expectedOutput: '{"success":false}', actualOutput: '{"success":false}', passed: true, executionTime: 35 }
        ],
        feedback: {
          strengths: ["Proper input validation", "Clear error messages", "Secure password comparison"],
          improvements: ["Consider adding rate limiting", "Add password hashing in production"],
          overallScore: 100,
          skillAssessment: { "Debugging": 95, "Security": 90, "Code Quality": 88 },
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          recommendation: "Excellent debugging! All security issues fixed."
        }
      },
      'binary-search-perf': {
        submission: {
          id: submissionId,
          status: 'passed',
          score: 100,
          language: 'javascript',
          code: 'function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
          submittedAt: new Date().toISOString()
        },
        testResults: [
          { testCase: 1, input: '[1,2,3,4,5], 3', expectedOutput: '2', actualOutput: '2', passed: true, executionTime: 15 },
          { testCase: 2, input: '[1,2,3,4,5], 6', expectedOutput: '-1', actualOutput: '-1', passed: true, executionTime: 12 },
          { testCase: 3, input: '[], 5', expectedOutput: '-1', actualOutput: '-1', passed: true, executionTime: 8 }
        ],
        feedback: {
          strengths: ["Correct O(log n) implementation", "Handles edge cases well", "Clean iterative approach"],
          improvements: ["Consider overflow-safe mid calculation: left + (right - left) / 2"],
          overallScore: 100,
          skillAssessment: { "Algorithms": 95, "Efficiency": 100, "Edge Cases": 90 },
          timeComplexity: "O(log n)",
          spaceComplexity: "O(1)",
          recommendation: "Perfect binary search implementation!"
        }
      },
      'react-code-review': {
        submission: {
          id: submissionId,
          status: 'passed',
          score: 100,
          language: 'javascript',
          code: 'function handleCounterAction(actionType, currentCount) {\n  let newCount = currentCount;\n  if (actionType === "increment") newCount = currentCount + 1;\n  else if (actionType === "decrement") newCount = Math.max(0, currentCount - 1);\n  else if (actionType === "reset") newCount = 0;\n  return { count: newCount, actionType };\n}',
          submittedAt: new Date().toISOString()
        },
        testResults: [
          { testCase: 1, input: 'increment, 0', expectedOutput: '{"count":1}', actualOutput: '{"count":1}', passed: true, executionTime: 10 },
          { testCase: 2, input: 'decrement, 0', expectedOutput: '{"count":0}', actualOutput: '{"count":0}', passed: true, executionTime: 8 },
          { testCase: 3, input: 'reset, 100', expectedOutput: '{"count":0}', actualOutput: '{"count":0}', passed: true, executionTime: 9 }
        ],
        feedback: {
          strengths: ["Proper boundary handling", "Clean switch logic", "Immutable state pattern"],
          improvements: ["Consider using a switch statement for clarity"],
          overallScore: 100,
          skillAssessment: { "State Management": 95, "Logic": 90, "Code Quality": 88 },
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          recommendation: "Great state management implementation!"
        }
      },
      'api-contract': {
        submission: {
          id: submissionId,
          status: 'passed',
          score: 100,
          language: 'javascript',
          code: 'function handleAPIRequest(method, path, body) {\n  const id = path.split("/").pop();\n  if (method === "GET") {\n    const user = users[id];\n    return user ? { status: 200, body: user } : { status: 404, body: { error: "User not found" } };\n  }\n  // ... other methods\n}',
          submittedAt: new Date().toISOString()
        },
        testResults: [
          { testCase: 1, input: 'GET, /api/users/123', expectedOutput: '{"status":200}', actualOutput: '{"status":200}', passed: true, executionTime: 20 },
          { testCase: 2, input: 'GET, /api/users/999', expectedOutput: '{"status":404}', actualOutput: '{"status":404}', passed: true, executionTime: 18 },
          { testCase: 3, input: 'DELETE, /api/users/123', expectedOutput: '{"status":204}', actualOutput: '{"status":204}', passed: true, executionTime: 15 }
        ],
        feedback: {
          strengths: ["Correct HTTP status codes", "Proper error handling", "RESTful design principles"],
          improvements: ["Add request validation middleware", "Consider adding pagination for list endpoints"],
          overallScore: 100,
          skillAssessment: { "API Design": 95, "REST Principles": 92, "Error Handling": 90 },
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          recommendation: "Excellent REST API implementation!"
        }
      }
    };

    const result = mockResults[challengeId] || {
      submission: {
        id: submissionId,
        status: 'pending',
        score: 0,
        language: 'javascript',
        code: '// Your submitted code here',
        submittedAt: new Date().toISOString()
      },
      testResults: [],
      feedback: {
        strengths: ["Good attempt"],
        improvements: ["Keep practicing"],
        overallScore: 0,
        skillAssessment: {},
        timeComplexity: "N/A",
        spaceComplexity: "N/A",
        recommendation: "Continue learning!"
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Get submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
