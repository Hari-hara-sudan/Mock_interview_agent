import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/admin';

const sampleQuestions = [
  {
    question: "If a man can paint a fence in 6 hours and another man can paint the same fence in 8 hours, how long will it take them to paint it together?",
    options: ["3.42 hours", "3.5 hours", "4 hours", "2.8 hours"],
    correctAnswer: 0,
    explanation: "Combined rate = 1/6 + 1/8 = 7/24 fences per hour. Time = 24/7 ≈ 3.42 hours",
    category: "quantitative",
    difficulty: "medium",
    points: 2
  },
  {
    question: "What is 15% of 240?",
    options: ["36", "30", "42", "38"],
    correctAnswer: 0,
    explanation: "15% of 240 = (15/100) × 240 = 36",
    category: "quantitative",
    difficulty: "easy",
    points: 1
  },
  {
    question: "Find the next number in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1,
    explanation: "Pattern: 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42",
    category: "logical-reasoning",
    difficulty: "medium",
    points: 2
  },
  {
    question: "If BOOK is coded as CPPL, how is PEN coded?",
    options: ["QFO", "QEO", "PEO", "QGP"],
    correctAnswer: 0,
    explanation: "Each letter is shifted by +1 in the alphabet: P→Q, E→F, N→O",
    category: "logical-reasoning",
    difficulty: "easy",
    points: 1
  },
  {
    question: "Choose the word that best completes the sentence: The mountain climber showed great _____ in reaching the summit despite the harsh weather.",
    options: ["tenacity", "fragility", "hostility", "futility"],
    correctAnswer: 0,
    explanation: "Tenacity means persistence and determination, which fits the context",
    category: "verbal-ability",
    difficulty: "medium",
    points: 2
  },
  {
    question: "What is the antonym of 'abundant'?",
    options: ["plentiful", "scarce", "generous", "ample"],
    correctAnswer: 1,
    explanation: "Scarce means lacking or insufficient, opposite of abundant",
    category: "verbal-ability",
    difficulty: "easy",
    points: 1
  },
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
    correctAnswer: 0,
    explanation: "HTML stands for HyperText Markup Language",
    category: "technical-concepts",
    difficulty: "easy",
    points: 1
  },
  {
    question: "Which data structure follows LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    explanation: "Stack follows LIFO principle - the last element added is the first one to be removed",
    category: "technical-concepts",
    difficulty: "easy",
    points: 1
  }
];

const sampleTests = [
  {
    title: "General Aptitude Test",
    description: "Comprehensive assessment covering quantitative, logical reasoning, and verbal abilities",
    categories: ["quantitative", "logical-reasoning", "verbal-ability"],
    questionsPerCategory: 2,
    timeLimit: 30,
    passingScore: 60,
    isActive: true,
    difficulty: "medium"
  },
  {
    title: "Technical Assessment",
    description: "Assessment focused on technical concepts and logical reasoning",
    categories: ["technical-concepts", "logical-reasoning"],
    questionsPerCategory: 2,
    timeLimit: 20,
    passingScore: 70,
    isActive: true,
    difficulty: "medium"
  }
];

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'seed-questions') {
      // Seed questions
      const questionBatch = db.batch();
      
      for (const question of sampleQuestions) {
        const questionRef = db.collection('aptitudeQuestions').doc();
        const questionData = {
          ...question,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        questionBatch.set(questionRef, questionData);
      }
      
      await questionBatch.commit();
      
      return NextResponse.json({
        success: true,
        message: `Successfully seeded ${sampleQuestions.length} questions`
      });
    }

    if (action === 'seed-tests') {
      // Seed tests
      const testBatch = db.batch();
      
      for (const test of sampleTests) {
        const testRef = db.collection('aptitudeTests').doc();
        const testData = {
          ...test,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        testBatch.set(testRef, testData);
      }
      
      await testBatch.commit();
      
      return NextResponse.json({
        success: true,
        message: `Successfully seeded ${sampleTests.length} tests`
      });
    }

    if (action === 'seed-all') {
      // Seed both questions and tests
      const questionBatch = db.batch();
      
      for (const question of sampleQuestions) {
        const questionRef = db.collection('aptitudeQuestions').doc();
        const questionData = {
          ...question,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        questionBatch.set(questionRef, questionData);
      }
      
      await questionBatch.commit();

      const testBatch = db.batch();
      
      for (const test of sampleTests) {
        const testRef = db.collection('aptitudeTests').doc();
        const testData = {
          ...test,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        testBatch.set(testRef, testData);
      }
      
      await testBatch.commit();
      
      return NextResponse.json({
        success: true,
        message: `Successfully seeded ${sampleQuestions.length} questions and ${sampleTests.length} tests`
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action. Use "seed-questions", "seed-tests", or "seed-all"'
    }, { status: 400 });

  } catch (error) {
    console.error('Error seeding aptitude data:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to seed data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
