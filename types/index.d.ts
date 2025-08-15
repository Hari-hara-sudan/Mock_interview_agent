export interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  userId: string;
  type: string; // kept broad (Behavioral | Technical | Mixed | custom)
  finalized: boolean;
  template: boolean; // true means reusable template
  cover?: string; // optional cover/logo image
  createdAt: string | FirebaseFirestore.Timestamp;
  updatedAt?: string | FirebaseFirestore.Timestamp;
}

export interface NormalizedInterview extends Omit<Interview, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt?: string;
}

// Helper to normalize Firestore timestamps to ISO strings
export function normalizeInterview(raw: Interview): NormalizedInterview {
  const toIso = (v: any) => {
    if (!v) return undefined;
    if (typeof v === 'string') return v;
    if (typeof v?.toDate === 'function') return v.toDate().toISOString();
    return String(v);
  };
  return {
    ...raw,
    createdAt: toIso(raw.createdAt)!,
    updatedAt: toIso(raw.updatedAt),
    cover: raw.cover || undefined,
  };
}

export interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface InterviewCardProps {
  interview: Interview;
}

export interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

export interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

export interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

export interface GetLatestInterviewsParams {
  limit?: number;
}

export interface SignInParams {
  email: string;
  idToken: string;
}

export interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

export type FormType = "sign-in" | "sign-up";

export interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

export interface TechIconProps {
  techStack: string[];
}

// Programming Challenge Types
export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  type: "explain-before-code" | "voice-debugging" | "code-review" | "black-box-contract" | "performance-tuning";
  supportedLanguages: string[];
  timeLimit: number;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  constraints: string[];
  testCases: TestCase[];
  starterCode: Record<string, string>;
  tags: string[];
  createdAt: any;
  updatedAt: any;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  language: string;
  code: string;
  status: "queued" | "running" | "passed" | "failed" | "error" | "timeout";
  score?: number;
  caseResults: CaseResult[];
  stderr?: string;
  runtimeMs?: number;
  memoryMB?: number;
  transcriptId?: string;
  planTranscriptId?: string;
  walkthroughTranscriptId?: string;
  submittedAt: any;
}

export interface CaseResult {
  testCaseId: string;
  passed: boolean;
  actualOutput?: string;
  runtimeMs?: number;
  memoryMB?: number;
  error?: string;
}

export interface ChallengeProgress {
  userId: string;
  challengeId: string;
  bestScore?: number;
  totalAttempts?: number;
  lastAttempt?: any;
  completed: boolean;
  createdAt?: any;
}

export interface PlanTranscript {
  id: string;
  userId: string;
  challengeId: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  score: number;
  approved: boolean;
  feedback: string;
  createdAt: string;
}

// Aptitude Test Types
export type AptitudeCategory = 
  | 'quantitative'
  | 'logical-reasoning' 
  | 'verbal-ability'
  | 'technical-concepts'
  | 'data-interpretation'
  | 'general-awareness';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface AptitudeQuestion {
  id: string;
  category: AptitudeCategory;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];           // 4 options typically
  correctAnswer: number;       // index of correct option (0-3)
  explanation?: string;
  timeLimit?: number;          // seconds per question
  points: number;             // points awarded for correct answer
  tags?: string[];
  createdAt: any;
  updatedAt: any;
}

export interface AptitudeTest {
  id: string;
  title: string;
  description: string;
  categories: AptitudeCategory[];
  questionsPerCategory: number;
  timeLimit: number;           // total test time in minutes
  difficulty: DifficultyLevel;
  passingScore: number;        // percentage required to pass
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface AptitudeAttempt {
  id: string;
  userId: string;
  testId: string;
  startedAt: string;
  finishedAt?: string;
  answers: {
    questionId: string;
    selectedOption: number;
    timeTaken: number;        // seconds for this question
    isCorrect: boolean;
  }[];
  score: {
    total: number;
    correct: number;
    percentage: number;
    categoryBreakdown: {
      category: AptitudeCategory;
      correct: number;
      total: number;
      percentage: number;
    }[];
  };
  timeRemaining?: number;
  status: 'in-progress' | 'completed' | 'abandoned';
}
