import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/client';
import { Challenge, Submission, ChallengeProgress } from '../types/index';

// Collections
const COLLECTIONS = {
  CHALLENGES: 'challenges',
  SUBMISSIONS: 'submissions',
  PROGRESS: 'userChallengeProgress'
} as const;

export class ChallengeService {
  // Get all challenges with optional filters
  static async getChallenges(filters?: {
    difficulty?: string;
    type?: string;
    language?: string;
    limit?: number;
  }): Promise<Challenge[]> {
    try {
      let q = query(collection(db, COLLECTIONS.CHALLENGES));
      
      if (filters?.difficulty) {
        q = query(q, where('difficulty', '==', filters.difficulty));
      }
      
      if (filters?.type) {
        q = query(q, where('type', '==', filters.type));
      }
      
      if (filters?.language && filters.language !== 'all') {
        q = query(q, where('supportedLanguages', 'array-contains', filters.language));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Challenge[];
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw new Error('Failed to fetch challenges');
    }
  }

  // Get challenge by slug
  static async getChallengeBySlug(slug: string): Promise<Challenge | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.CHALLENGES),
        where('slug', '==', slug),
        limit(1)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Challenge;
    } catch (error) {
      console.error('Error fetching challenge by slug:', error);
      throw new Error('Failed to fetch challenge');
    }
  }

  // Submit code for testing
  static async submitCode(submission: Omit<Submission, 'id' | 'submittedAt'>): Promise<string> {
    try {
      const submissionData = {
        ...submission,
        submittedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, COLLECTIONS.SUBMISSIONS), submissionData);
      
      // Update user progress
      await this.updateUserProgress(submission.userId, submission.challengeId, {
        lastAttempt: Timestamp.now(),
        totalAttempts: 1, // This should increment existing attempts
        bestScore: submission.score || 0
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error submitting code:', error);
      throw new Error('Failed to submit code');
    }
  }

  // Get submission by ID
  static async getSubmission(submissionId: string): Promise<Submission | null> {
    try {
      const docRef = doc(db, COLLECTIONS.SUBMISSIONS, submissionId);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      return {
        id: snapshot.id,
        ...snapshot.data()
      } as Submission;
    } catch (error) {
      console.error('Error fetching submission:', error);
      throw new Error('Failed to fetch submission');
    }
  }

  // Get user's submissions for a challenge
  static async getUserSubmissions(userId: string, challengeId: string): Promise<Submission[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.SUBMISSIONS),
        where('userId', '==', userId),
        where('challengeId', '==', challengeId),
        orderBy('submittedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Submission[];
    } catch (error) {
      console.error('Error fetching user submissions:', error);
      throw new Error('Failed to fetch submissions');
    }
  }

  // Update user progress
  static async updateUserProgress(
    userId: string, 
    challengeId: string, 
    updates: Partial<ChallengeProgress>
  ): Promise<void> {
    try {
      const progressId = `${userId}_${challengeId}`;
      const docRef = doc(db, COLLECTIONS.PROGRESS, progressId);
      
      const progressDoc = await getDoc(docRef);
      
      if (progressDoc.exists()) {
        // Update existing progress
        const existingData = progressDoc.data() as ChallengeProgress;
        await updateDoc(docRef, {
          ...updates,
          totalAttempts: (existingData.totalAttempts || 0) + (updates.totalAttempts || 0),
          bestScore: Math.max(existingData.bestScore || 0, updates.bestScore || 0)
        });
      } else {
        // Create new progress record
        await addDoc(collection(db, COLLECTIONS.PROGRESS), {
          userId,
          challengeId,
          completed: false,
          bestScore: 0,
          totalAttempts: 0,
          ...updates,
          createdAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw new Error('Failed to update progress');
    }
  }

  // Get user's challenge statistics
  static async getUserStats(userId: string): Promise<{
    totalChallenges: number;
    completed: number;
    inProgress: number;
    averageScore: number;
  }> {
    try {
      const q = query(
        collection(db, COLLECTIONS.PROGRESS),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      const progressData = snapshot.docs.map(doc => doc.data()) as ChallengeProgress[];
      
      const completed = progressData.filter(p => p.completed).length;
      const inProgress = progressData.filter(p => !p.completed && (p.totalAttempts || 0) > 0).length;
      const totalScore = progressData.reduce((sum, p) => sum + (p.bestScore || 0), 0);
      const averageScore = progressData.length > 0 ? totalScore / progressData.length : 0;
      
      return {
        totalChallenges: progressData.length,
        completed,
        inProgress,
        averageScore: Math.round(averageScore)
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        totalChallenges: 0,
        completed: 0,
        inProgress: 0,
        averageScore: 0
      };
    }
  }
}

// Seed data function to populate initial challenges
export async function seedChallenges(): Promise<void> {
  const challenges: Omit<Challenge, 'id'>[] = [
    {
      title: "Debug Authentication Bug",
      slug: "debug-auth-bug",
      description: "A user login system has a critical bug causing authentication failures. Use voice debugging to identify and fix the issue.",
      difficulty: "medium",
      type: "voice-debugging",
      supportedLanguages: ["javascript", "typescript", "python"],
      timeLimit: 45,
      examples: [
        {
          input: "loginUser('john@example.com', 'password123')",
          output: "Should return user object, but returns null",
          explanation: "Valid credentials should authenticate successfully"
        }
      ],
      constraints: [
        "Password validation must remain secure",
        "Existing user sessions should not be affected",
        "Fix should handle edge cases"
      ],
      testCases: [
        {
          input: "loginUser('valid@email.com', 'correctpassword')",
          expectedOutput: "{ user: { id: 1, email: 'valid@email.com' }, token: 'jwt-token' }",
          isHidden: false
        }
      ],
      starterCode: {
        javascript: `function loginUser(email, password) {\n  // Bug is hidden in this authentication logic\n  if (email && password) {\n    return null; // This is wrong!\n  }\n  return null;\n}`,
        python: `def login_user(email, password):\n    # Bug is hidden in this authentication logic\n    if email and password:\n        return None  # This is wrong!\n    return None`
      },
      tags: ["debugging", "authentication", "security"],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      title: "Two Sum Problem",
      slug: "two-sum-explain",
      description: "Explain your approach to solving the classic Two Sum problem before implementing it. Practice communicating your thought process clearly.",
      difficulty: "easy",
      type: "explain-before-code",
      supportedLanguages: ["javascript", "python", "java", "cpp"],
      timeLimit: 30,
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]"
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]"
        }
      ],
      constraints: [
        "Only one valid answer exists",
        "You may not use the same element twice",
        "You can return the answer in any order"
      ],
      testCases: [
        {
          input: "[2,7,11,15], 9",
          expectedOutput: "[0,1]",
          isHidden: false
        },
        {
          input: "[3,2,4], 6",
          expectedOutput: "[1,2]",
          isHidden: false
        },
        {
          input: "[3,3], 6",
          expectedOutput: "[0,1]",
          isHidden: true
        }
      ],
      starterCode: {
        javascript: `function twoSum(nums, target) {\n    // Your code here\n}`,
        python: `def two_sum(nums, target):\n    # Your code here\n    pass`
      },
      tags: ["arrays", "hash-table", "classic"],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  ];

  try {
    for (const challenge of challenges) {
      await addDoc(collection(db, COLLECTIONS.CHALLENGES), challenge);
    }
    console.log('Challenges seeded successfully!');
  } catch (error) {
    console.error('Error seeding challenges:', error);
  }
}
