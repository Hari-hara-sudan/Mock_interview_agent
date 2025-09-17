'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getAptitudeTests } from '@/lib/actions/aptitude.action';
import { AptitudeCategory, AptitudeTest } from '@/types';
import AptitudeListItem from '@/components/AptitudeListItem';
import { BarChart3, Calculator, Puzzle, BookOpenText, Cpu, PieChart, Globe, Play, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AptitudePage() {
  const [tests, setTests] = useState<AptitudeTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Ensure seed once for all users if empty
        await fetch('/api/aptitude/seed?ensure=1').catch(() => {});
        const [list, ov] = await Promise.all([
          getAptitudeTests(),
          fetch('/api/aptitude/overview', { cache: 'no-store' })
            .then((r) => r.json())
            .then((j) => (j?.ok ? j.overview : null))
            .catch(() => null),
        ]);
        setTests(list);
        setOverview(ov);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const categories = useMemo(() => ([
    {
      key: 'quantitative',
      title: 'Quantitative Reasoning',
      icon: Calculator,
      desc: 'Mathematical problems, data analysis, numerical reasoning',
      time: 30,
      questions: 25,
    },
    {
      key: 'logical-reasoning',
      title: 'Logical Reasoning',
      icon: Puzzle,
      desc: 'Pattern recognition, logical sequences, problem-solving',
      time: 25,
      questions: 20,
    },
    {
      key: 'verbal-ability',
      title: 'Verbal Ability',
      icon: BookOpenText,
      desc: 'Reading comprehension, vocabulary, grammar',
      time: 35,
      questions: 30,
    },
    {
      key: 'technical-concepts',
      title: 'Technical Concepts',
      icon: Cpu,
      desc: 'Programming concepts, algorithms, system design',
      time: 25,
      questions: 20,
    },
    // Optional extras if you seed later
    { key: 'data-interpretation', title: 'Data Interpretation', icon: PieChart, desc: 'Graph analysis, table interpretation, trend analysis', time: 20, questions: 15 },
    { key: 'general-awareness', title: 'General Awareness', icon: Globe, desc: 'Current affairs, general knowledge, industry trends', time: 20, questions: 25 },
  ]), []);

  const quickTestId = useMemo(() => {
    const quick = tests.find(t => /quick/i.test(t.title));
    if (quick) return quick.id;
    const general = tests.find(t => /general aptitude/i.test(t.title));
    return general ? general.id : tests[0]?.id;
  }, [tests]);

  const categoryCards = useMemo(() => {
    // show only categories that are present in any active test to avoid dead links
    const activeKeys = new Set<string>();
    tests.forEach((t) => (t.categories || []).forEach((c) => activeKeys.add(c)));
    return categories.filter((c) => activeKeys.has(c.key));
  }, [categories, tests]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold">Aptitude Assessment</h1>
          <p className="text-muted-foreground mt-2">Test your quantitative, logical reasoning, and verbal abilities</p>
        </div>
      </div>

  <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Main column */}
        <section className="space-y-8">
          {/* Quick Practice Test banner */}
          <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/5 to-accent/5 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">Quick Practice Test</div>
              <div className="text-sm text-muted-foreground">Mixed questions from all categories - 15 minutes</div>
            </div>
            <div>
              {quickTestId ? (
                <Link href={`/aptitude/test/${quickTestId}`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] text-white hover:shadow-lg transition-all px-5 py-3 shadow-sm">
                  <Play size={16} />
                  Start Quick Test
                </Link>
              ) : (
                <button disabled className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted text-muted-foreground px-5 py-3">
                  <Play size={16} />
                  Start Quick Test
                </button>
              )}
            </div>
          </div>

          {/* Categories grid */}
          <div>
            <div className="text-xl font-semibold mb-4">Test Categories</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryCards.map((cat, index) => {
                const categoryColors = [
                  'bg-blue-500/10 text-blue-600',
                  'bg-purple-500/10 text-purple-600', 
                  'bg-green-500/10 text-green-600',
                  'bg-orange-500/10 text-orange-600',
                  'bg-red-500/10 text-red-600',
                  'bg-indigo-500/10 text-indigo-600'
                ];
                
                return (
                  <div key={cat.key} className="rounded-2xl border border-border bg-card p-6 relative hover:shadow-md transition-all duration-200 group">
                    {/* progress pill */}
                    <div className="absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      {overview?.categoryProgress?.[cat.key] != null ? `${overview.categoryProgress[cat.key]}%` : '--%'}
                    </div>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${categoryColors[index] || categoryColors[0]}`}>
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg">{cat.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">{cat.desc}</div>
                        <div className="flex items-center gap-6 text-xs text-muted-foreground mt-3">
                          <div className="flex items-center gap-1"><span className="inline-block size-1.5 rounded-full bg-primary" /> {cat.questions} questions</div>
                          <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {cat.time} minutes</div>
                        </div>
                        <div className="mt-4">
                          {tests.find((t) => (t.categories || []).includes(cat.key as AptitudeCategory)) ? (
                            <Link href={`/aptitude/test/${tests.find((t) => (t.categories || []).includes(cat.key as AptitudeCategory))!.id}`} className="inline-flex items-center justify-center w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-3 text-sm shadow-sm">
                              Start Test
                              <Play size={14} className="ml-2" />
                            </Link>
                          ) : (
                            <button disabled className="inline-flex items-center justify-center w-full rounded-xl border border-border bg-muted text-muted-foreground px-4 py-3 text-sm">Start Test</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* Right rail */}
  <aside className="space-y-6 md:sticky md:top-24">
          <PerformanceWidgets initialData={overview} />
        </aside>
      </div>
    </div>
  );
}

function PerformanceWidgets({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const load = async () => {
      try {
        if (initialData) {
          setData(initialData);
          return;
        }
        const res = await fetch('/api/aptitude/overview', { cache: 'no-store' });
        const json = await res.json();
        if (json?.ok) setData(json.overview);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [initialData]);

  return (
    <div className="space-y-6">
      {/* Your Performance */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-primary" />
          <div className="font-semibold">Your Performance</div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{data?.avgScore ?? '--'}</div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{data?.passed ?? 0}</div>
            <div className="text-xs text-muted-foreground">Passed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{data?.totalAttempts ?? 0}</div>
            <div className="text-xs text-muted-foreground">Attempts</div>
          </div>
        </div>
      </div>

      {/* Recent Tests */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="font-semibold mb-3">Recent Tests</div>
        <div className="space-y-3">
          {(data?.recentTests ?? []).slice(0, 5).map((r: any) => (
            <div key={r.attemptId} className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="truncate pr-3">
                <div className="font-medium truncate">{r.testTitle}</div>
                <div className="text-xs text-muted-foreground truncate">{new Date(r.startedAt).toLocaleString()}</div>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground">
                {r.percentage != null ? `${Math.round(r.percentage)}%` : r.status}
              </div>
            </div>
          ))}
          {(!data || (data?.recentTests ?? []).length === 0) && (
            <div className="text-sm text-muted-foreground">No attempts yet.</div>
          )}
        </div>
      </div>

      {/* Recommended Focus */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="font-semibold mb-3">Recommended Focus</div>
        <div className="space-y-2">
          {(data?.focus ?? []).map((f: any) => (
            <div key={f.category} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="capitalize font-medium">{f.category.replace('-', ' ')}</div>
              <div className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground">{f.avg}%</div>
            </div>
          ))}
          {(!data || (data?.focus ?? []).length === 0) && (
            <div className="text-sm text-muted-foreground">Start a test to get recommendations.</div>
          )}
        </div>
      </div>
    </div>
  );
}
