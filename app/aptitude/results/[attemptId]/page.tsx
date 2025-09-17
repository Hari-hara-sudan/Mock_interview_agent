import React from 'react';
import { redirect } from 'next/navigation';
import { getAptitudeAttempt, getAptitudeTestById } from '@/lib/actions/aptitude.action';
import AptitudeResults from '@/components/AptitudeResults';

interface ResultsPageProps {
  params: Promise<{
    attemptId: string;
  }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { attemptId } = await params;
  const attempt = await getAptitudeAttempt(attemptId);
  
  if (!attempt) {
    redirect('/aptitude');
  }

  const test = await getAptitudeTestById(attempt.testId);
  
  if (!test) {
    redirect('/aptitude');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8" style={{ backgroundImage: 'url("/pattern.png")' }}>
      <AptitudeResults
        attempt={attempt}
        testTitle={test.title}
  retakeHref={`/aptitude/test/${attempt.testId}`}
  testsHref={`/aptitude`}
      />
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
