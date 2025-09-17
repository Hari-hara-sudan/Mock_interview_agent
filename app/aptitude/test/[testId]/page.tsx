'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import AptitudeQuestionComponent from '@/components/AptitudeQuestionComponent';
import { AptitudeQuestion, AptitudeAttempt } from '@/types';
import { 
  startAptitudeTest, 
  submitAnswer, 
  finishAptitudeTest, 
  getAptitudeTestById 
} from '@/lib/actions/aptitude.action';

export default function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  const router = useRouter();
  const [test, setTest] = useState<any>(null);
  const [attempt, setAttempt] = useState<AptitudeAttempt | null>(null);
  const [questions, setQuestions] = useState<Omit<AptitudeQuestion, 'correctAnswer' | 'explanation'>[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  useEffect(() => {
    initializeTest();
  }, [testId]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const initializeTest = async () => {
    try {
      setLoading(true);
      
      // Get test details
  const testData = await getAptitudeTestById(testId);
      if (!testData) {
        router.push('/aptitude');
        return;
      }
      setTest(testData);

      // Start attempt
      const userId = 'temp-user'; // TODO: Get from auth context
      const { attempt: newAttempt, questions: testQuestions } = await startAptitudeTest({
        userId,
        testId
      });

      setAttempt(newAttempt);
      setQuestions(testQuestions);
      setTimeRemaining(newAttempt.timeRemaining || testData.timeLimit * 60);
      
    } catch (error) {
      console.error('Error initializing test:', error);
      router.push('/aptitude');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (optionIndex: number) => {
    if (!attempt || !questions[currentQuestionIndex]) return;

    const question = questions[currentQuestionIndex];
    const questionStartTime = Date.now();
    
    // Update local state
    setAnswers(prev => ({
      ...prev,
      [question.id]: optionIndex
    }));

    // Submit answer to backend
    try {
      await submitAnswer({
        attemptId: attempt.id,
        questionId: question.id,
        selectedOption: optionIndex,
        timeTaken: Math.floor((Date.now() - questionStartTime) / 1000)
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowConfirmSubmit(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFlag = () => {
    const questionId = questions[currentQuestionIndex]?.id;
    if (!questionId) return;

    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleFinishTest = async () => {
    if (!attempt) return;

    try {
      setSubmitting(true);
      const finalAttempt = await finishAptitudeTest(attempt.id);
      router.push(`/aptitude/results/${attempt.id}`);
    } catch (error) {
      console.error('Error finishing test:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (!attempt) return;
    
    try {
      await finishAptitudeTest(attempt.id);
      router.push(`/aptitude/results/${attempt.id}`);
    } catch (error) {
      console.error('Error auto-submitting test:', error);
    }
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" style={{ backgroundImage: 'url("/pattern.png")' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Preparing your test...</p>
        </div>
      </div>
    );
  }

  if (!test || !attempt || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" style={{ backgroundImage: 'url("/pattern.png")' }}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-destructive-100 mx-auto mb-4" />
          <p className="text-muted-foreground">Unable to load test. Please try again.</p>
          <button
            onClick={() => router.push('/aptitude')}
            className="mt-4 px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-accent/50"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ backgroundImage: 'url("/pattern.png")' }}>
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur">{/* subtle translucent header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">{test.title}</h1>
              <p className="text-sm text-muted-foreground">
                {getAnsweredCount()} of {questions.length} questions answered
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Time Remaining</div>
                <div className={`font-mono font-semibold ${
                  timeRemaining < 300 ? 'text-destructive-100' : 'text-foreground'
                }`}>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </div>
              </div>
              
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium"
              >
                Submit Test
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2 border border-border/50">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AptitudeQuestionComponent
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          timeRemaining={timeRemaining}
          selectedAnswer={answers[questions[currentQuestionIndex]?.id] ?? null}
          onAnswerSelect={handleAnswerSelect}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onFlag={handleFlag}
          isFlagged={flaggedQuestions.has(questions[currentQuestionIndex]?.id)}
          isFirstQuestion={currentQuestionIndex === 0}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      </div>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 max-w-md mx-4 border border-border/50 bg-card">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-success-100 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Submit Test?
              </h3>
              <p className="text-muted-foreground mb-6">
                You have answered {getAnsweredCount()} out of {questions.length} questions. 
                Are you sure you want to submit your test?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent/50"
                  disabled={submitting}
                >
                  Continue Test
                </button>
                <button
                  onClick={handleFinishTest}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
