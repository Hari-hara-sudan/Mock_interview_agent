import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/admin';
import { getCurrentUser } from '@/lib/actions/auth.action';

export async function GET(_req: NextRequest) {
  try {
    console.log('Starting overview API call');
    const user = await getCurrentUser();
    console.log('User retrieved:', user ? `ID: ${user.id}` : 'No user');
    
    if (!user?.id) {
      console.log('Unauthorized - no user ID');
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    console.log('Fetching attempts for user:', user.id);
    const attemptsSnap = await db
      .collection('aptitudeAttempts')
      .where('userId', '==', user.id)
      .orderBy('startedAt', 'desc')
      .limit(50)
      .get();

    console.log('Attempts fetched:', attemptsSnap.docs.length);
    const attempts = attemptsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

    const totalAttempts = attempts.length;
    const percentages = attempts
      .map((a) => a?.score?.percentage)
      .filter((p) => typeof p === 'number') as number[];
    const avgScore = percentages.length ? Math.round((percentages.reduce((a, b) => a + b, 0) / percentages.length) * 10) / 10 : 0;
    const passed = attempts.filter((a) => (a?.score?.percentage ?? 0) >= 60).length;

    console.log('Basic stats calculated:', { totalAttempts, avgScore, passed });

    // Recommended focus and category progress: aggregate category breakdowns
    const catAgg = new Map<string, { sum: number; count: number }>();
    attempts.forEach((a) => {
      const cbs = a?.score?.categoryBreakdown || [];
      cbs.forEach((cb: any) => {
        const entry = catAgg.get(cb.category) || { sum: 0, count: 0 };
        entry.sum += cb.percentage || 0;
        entry.count += 1;
        catAgg.set(cb.category, entry);
      });
    });
    const focus = Array.from(catAgg.entries())
      .map(([category, v]) => ({ category, avg: Math.round((v.sum / Math.max(1, v.count)) * 10) / 10 }))
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 3);

    // Map of category -> avg percentage for quick lookup on UI cards
    const categoryProgress: Record<string, number> = {};
    Array.from(catAgg.entries()).forEach(([category, v]) => {
      categoryProgress[category] = Math.round((v.sum / Math.max(1, v.count)) * 10) / 10;
    });

    console.log('Category analysis complete');

    // Recent attempts with test titles
    const recent = attempts.slice(0, 3);
    const testIds = Array.from(new Set(recent.map((a) => a.testId))).filter(Boolean);
    const testsById: Record<string, any> = {};
    if (testIds.length) {
      console.log('Fetching test details for IDs:', testIds);
      // Fetch each test (batched get with in operator has 10 limit; keep simple per-doc here)
      await Promise.all(
        testIds.map(async (id) => {
          const doc = await db.collection('aptitudeTests').doc(id).get();
          if (doc.exists) testsById[id] = { id: doc.id, ...doc.data() };
        })
      );
    }
    const recentTests = recent.map((a) => ({
      attemptId: a.id,
      testId: a.testId,
      testTitle: testsById[a.testId]?.title || 'Aptitude Test',
      percentage: a?.score?.percentage ?? null,
      status: a?.status || 'unknown',
      startedAt: a?.startedAt || null,
    }));

    console.log('API call successful');
    return NextResponse.json({
      ok: true,
      overview: {
        totalAttempts,
        avgScore,
        passed,
        recentTests,
        focus,
        categoryProgress,
      },
    });
  } catch (e: any) {
    console.error('Overview API error:', e);
    console.error('Error stack:', e.stack);
    return NextResponse.json({ ok: false, error: e?.message || 'server error' }, { status: 500 });
  }
}
