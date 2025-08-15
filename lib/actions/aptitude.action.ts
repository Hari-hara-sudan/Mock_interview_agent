"use server";

import { db } from '@/firebase/admin';
import { AptitudeTest, AptitudeQuestion, AptitudeAttempt, AptitudeCategory } from '@/types';

export async function getAptitudeTests(): Promise<AptitudeTest[]> {
  const snap = await db.collection('aptitudeTests')
    .where('isActive', '==', true)
    .orderBy('createdAt', 'desc')
    .get();
  
  return snap.docs.map(doc => ({
    ...(doc.data() as AptitudeTest),
    id: doc.id
  }));
}

export async function getAptitudeTestById(testId: string): Promise<AptitudeTest | null> {
  const doc = await db.collection('aptitudeTests').doc(testId).get();
  
  if (!doc.exists) {
    return null;
  }
  
  return {
    ...(doc.data() as AptitudeTest),
    id: doc.id
  };
}

export async function getTestQuestions(
  testId: string, 
  categories: AptitudeCategory[],
  questionsPerCategory: number
): Promise<AptitudeQuestion[]> {
  const allQuestions: AptitudeQuestion[] = [];
  
  for (const category of categories) {
    const snap = await db.collection('aptitudeQuestions')
      .where('category', '==', category)
      .limit(questionsPerCategory)
      .get();
    
    const questions = snap.docs.map(doc => ({
      ...(doc.data() as AptitudeQuestion),
      id: doc.id
    }));
    
    allQuestions.push(...questions);
  }
  
  // Shuffle questions
  return allQuestions.sort(() => Math.random() - 0.5);
}

export async function startAptitudeTest(params: {
  userId: string;
  testId: string;
}): Promise<{ attempt: AptitudeAttempt; questions: Omit<AptitudeQuestion, 'correctAnswer' | 'explanation'>[] }> {
  const testRef = db.collection('aptitudeTests').doc(params.testId);
  const testDoc = await testRef.get();
  
  if (!testDoc.exists) {
    throw new Error('Test not found');
  }
  
  const test = { ...(testDoc.data() as AptitudeTest), id: testDoc.id };
  const questions = await getTestQuestions(
    test.id, 
    test.categories, 
    test.questionsPerCategory
  );
  
  const attempt: Omit<AptitudeAttempt, 'id'> = {
    userId: params.userId,
    testId: params.testId,
    startedAt: new Date().toISOString(),
    answers: [],
    score: {
      total: 0,
      correct: 0,
      percentage: 0,
      categoryBreakdown: []
    },
    timeRemaining: test.timeLimit * 60, // convert to seconds
    status: 'in-progress'
  };
  
  const attemptRef = await db.collection('aptitudeAttempts').add(attempt);
  
  // Hide answers from questions sent to client
  const clientQuestions = questions.map(q => {
    const { correctAnswer, explanation, ...clientQuestion } = q;
    return clientQuestion;
  });
  
  return {
    attempt: { id: attemptRef.id, ...attempt },
    questions: clientQuestions
  };
}

export async function submitAnswer(params: {
  attemptId: string;
  questionId: string;
  selectedOption: number;
  timeTaken: number;
}) {
  const attemptRef = db.collection('aptitudeAttempts').doc(params.attemptId);
  const questionRef = db.collection('aptitudeQuestions').doc(params.questionId);
  
  const [attemptDoc, questionDoc] = await Promise.all([
    attemptRef.get(),
    questionRef.get()
  ]);
  
  if (!attemptDoc.exists || !questionDoc.exists) {
    throw new Error('Attempt or question not found');
  }
  
  const attempt = attemptDoc.data() as AptitudeAttempt;
  const question = questionDoc.data() as AptitudeQuestion;
  
  const isCorrect = params.selectedOption === question.correctAnswer;
  
  const answerRecord = {
    questionId: params.questionId,
    selectedOption: params.selectedOption,
    timeTaken: params.timeTaken,
    isCorrect
  };
  
  attempt.answers.push(answerRecord);
  
  await attemptRef.update({ answers: attempt.answers });
  
  return { isCorrect, explanation: question.explanation };
}

export async function finishAptitudeTest(attemptId: string): Promise<AptitudeAttempt> {
  const attemptRef = db.collection('aptitudeAttempts').doc(attemptId);
  const attemptDoc = await attemptRef.get();
  
  if (!attemptDoc.exists) {
    throw new Error('Attempt not found');
  }
  
  const attempt = { ...(attemptDoc.data() as AptitudeAttempt), id: attemptDoc.id };
  
  // Calculate final score
  const totalQuestions = attempt.answers.length;
  const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  // Get questions to calculate category breakdown
  const questionIds = attempt.answers.map(a => a.questionId);
  const questionsSnap = await db.collection('aptitudeQuestions')
    .where('__name__', 'in', questionIds)
    .get();
  
  const questions = questionsSnap.docs.map(doc => ({
    ...(doc.data() as AptitudeQuestion),
    id: doc.id
  }));
  
  // Calculate category-wise breakdown
  const categoryMap = new Map<AptitudeCategory, { correct: number; total: number }>();
  
  attempt.answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;
    
    const current = categoryMap.get(question.category) || { correct: 0, total: 0 };
    categoryMap.set(question.category, {
      correct: current.correct + (answer.isCorrect ? 1 : 0),
      total: current.total + 1
    });
  });
  
  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, stats]) => ({
    category,
    correct: stats.correct,
    total: stats.total,
    percentage: Math.round((stats.correct / stats.total) * 100 * 100) / 100
  }));
  
  const finalScore = {
    total: totalQuestions,
    correct: correctAnswers,
    percentage: Math.round(percentage * 100) / 100,
    categoryBreakdown
  };
  
  const updates = {
    finishedAt: new Date().toISOString(),
    score: finalScore,
    status: 'completed' as const
  };
  
  await attemptRef.update(updates);
  
  return { ...attempt, ...updates };
}

export async function getAptitudeAttempt(attemptId: string): Promise<AptitudeAttempt | null> {
  const doc = await db.collection('aptitudeAttempts').doc(attemptId).get();
  
  if (!doc.exists) {
    return null;
  }
  
  return {
    ...(doc.data() as AptitudeAttempt),
    id: doc.id
  };
}

export async function getAptitudeAttemptWithTest(attemptId: string): Promise<{ attempt: AptitudeAttempt; test: AptitudeTest } | null> {
  const attemptDoc = await db.collection('aptitudeAttempts').doc(attemptId).get();
  
  if (!attemptDoc.exists) {
    return null;
  }
  
  const attempt = { ...(attemptDoc.data() as AptitudeAttempt), id: attemptDoc.id };
  const testDoc = await db.collection('aptitudeTests').doc(attempt.testId).get();
  
  if (!testDoc.exists) {
    return null;
  }
  
  const test = { ...(testDoc.data() as AptitudeTest), id: testDoc.id };
  
  return { attempt, test };
}

export async function getUserAptitudeAttempts(userId: string): Promise<AptitudeAttempt[]> {
  const snap = await db.collection('aptitudeAttempts')
    .where('userId', '==', userId)
    .orderBy('startedAt', 'desc')
    .get();
  
  return snap.docs.map(doc => ({
    ...(doc.data() as AptitudeAttempt),
    id: doc.id
  }));
}
