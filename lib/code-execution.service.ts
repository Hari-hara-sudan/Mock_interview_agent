// Environment variables needed in .env.local:
// JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
// JUDGE0_API_KEY=your_rapidapi_key

interface Judge0SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

interface Judge0SubmissionResponse {
  token: string;
}

interface Judge0ResultResponse {
  status: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  time?: string;
  memory?: number;
}

// Language ID mapping for Judge0
const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  java: 62,       // Java
  cpp: 54,        // C++ (GCC 9.2.0)
  c: 50,          // C (GCC 9.2.0)
  csharp: 51,     // C# (Mono 6.6.0.161)
  go: 60,         // Go (1.13.5)
  rust: 73,       // Rust (1.40.0)
  ruby: 72,       // Ruby (2.7.0)
  php: 68,        // PHP (7.4.1)
  typescript: 74, // TypeScript (3.7.4)
};

export class CodeExecutionService {
  private static readonly BASE_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
  private static readonly API_KEY = process.env.JUDGE0_API_KEY || '';

  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': this.API_KEY,
    };
  }

  // Submit code for execution
  static async submitCode(
    code: string,
    language: string,
    testCases: Array<{ input: string; expectedOutput: string }>
  ): Promise<{ token: string; results: any[] }> {
    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const results = [];
    
    // Submit each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      const submissionData: Judge0SubmissionRequest = {
        source_code: code,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.expectedOutput,
        cpu_time_limit: 2, // 2 seconds
        memory_limit: 128000, // 128 MB in KB
      };

      try {
        const response = await fetch(`${this.BASE_URL}/submissions?base64_encoded=false&wait=true`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
          throw new Error(`Judge0 API error: ${response.statusText}`);
        }

        const result = await response.json();
        results.push({
          testCaseIndex: i,
          ...result
        });
      } catch (error) {
        console.error(`Error executing test case ${i}:`, error);
        results.push({
          testCaseIndex: i,
          status: { id: 6, description: 'Compilation Error' },
          stderr: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      token: `batch_${Date.now()}`,
      results
    };
  }

  // Alternative: Use Piston API (simpler, free)
  static async submitCodeToPiston(
    code: string,
    language: string,
    testCases: Array<{ input: string; expectedOutput: string }>
  ): Promise<{ results: any[] }> {
    const PISTON_URL = 'https://emkc.org/api/v2/piston';
    
    // Piston language mapping
    const pistonLanguages: Record<string, string> = {
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'csharp',
      go: 'go',
      rust: 'rust',
      ruby: 'ruby',
      php: 'php',
      typescript: 'typescript'
    };

    const pistonLanguage = pistonLanguages[language];
    if (!pistonLanguage) {
      throw new Error(`Unsupported language for Piston: ${language}`);
    }

    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        const response = await fetch(`${PISTON_URL}/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: pistonLanguage,
            version: '*', // Use latest version
            files: [
              {
                name: `main.${this.getFileExtension(language)}`,
                content: code
              }
            ],
            stdin: testCase.input,
            args: [],
            compile_timeout: 10000,
            run_timeout: 3000,
            compile_memory_limit: -1,
            run_memory_limit: -1
          }),
        });

        if (!response.ok) {
          throw new Error(`Piston API error: ${response.statusText}`);
        }

        const result = await response.json();
        
        // Check if output matches expected
        const actualOutput = result.run?.stdout?.trim() || '';
        const expectedOutput = testCase.expectedOutput.trim();
        // Try JSON-parse compare to be tolerant to whitespace/formatting
        let passed = actualOutput === expectedOutput;
        if (!passed) {
          try {
            const normActual = JSON.stringify(JSON.parse(actualOutput));
            const normExpected = JSON.stringify(JSON.parse(expectedOutput));
            passed = normActual === normExpected;
          } catch (_) {
            // Fallback to string compare when not valid JSON
          }
        }
        
        results.push({
          testCaseIndex: i,
          passed,
          actualOutput,
          expectedOutput,
          stderr: result.run?.stderr || result.compile?.stderr || '',
          executionTime: result.run?.signal || 0,
          status: result.run?.code === 0 ? 'success' : 'error'
        });
      } catch (error) {
        console.error(`Error executing test case ${i} with Piston:`, error);
        results.push({
          testCaseIndex: i,
          passed: false,
          actualOutput: '',
          expectedOutput: testCase.expectedOutput,
          stderr: error instanceof Error ? error.message : 'Unknown error',
          status: 'error'
        });
      }
    }

    return { results };
  }

  private static getFileExtension(language: string): string {
    const extensions: Record<string, string> = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'cs',
      go: 'go',
      rust: 'rs',
      ruby: 'rb',
      php: 'php',
      typescript: 'ts'
    };
    return extensions[language] || 'txt';
  }

  // Calculate score based on test results
  static calculateScore(results: any[]): number {
    if (results.length === 0) return 0;
    
    const passedTests = results.filter(r => r.passed || r.status?.id === 3).length;
    return Math.round((passedTests / results.length) * 100);
  }

  // Get execution statistics
  static getExecutionStats(results: any[]): {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    avgExecutionTime: number;
    avgMemoryUsage: number;
  } {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed || r.status?.id === 3).length;
    const failedTests = totalTests - passedTests;
    
    const executionTimes = results
      .filter(r => r.time || r.executionTime)
      .map(r => parseFloat(r.time || r.executionTime || '0'));
    
    const memoryUsages = results
      .filter(r => r.memory)
      .map(r => r.memory);

    return {
      totalTests,
      passedTests,
      failedTests,
      avgExecutionTime: executionTimes.length > 0 
        ? executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length 
        : 0,
      avgMemoryUsage: memoryUsages.length > 0 
        ? memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length 
        : 0
    };
  }
}
