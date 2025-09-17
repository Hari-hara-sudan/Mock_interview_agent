"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

type AnalyticsClientProps = {
  interviews: any[];
};

export default function AnalyticsClient({ interviews }: AnalyticsClientProps) {
  // Build interview score timeline
  const scoreData = useMemo(() => {
    const data = (interviews || []).map((i) => {
      const feedbacks = i.feedbacks || [];
      let score = 0;
      if (feedbacks.length > 0) {
        const total = feedbacks.reduce((s: number, f: any) => s + (f.totalScore || 0), 0);
        score = Math.round(total / feedbacks.length);
      } else {
        score = i.totalScore || 0;
      }
      return {
        date: new Date(i.createdAt).toLocaleDateString(),
        score,
      };
    });
    return data;
  }, [interviews]);

  // Category aggregates from feedbacks
  const categoryData = useMemo(() => {
    const agg: Record<string, { total: number; count: number }> = {};
    (interviews || []).forEach((i) => {
      (i.feedbacks || []).forEach((f: any) => {
        (f.categoryScores || []).forEach((c: any) => {
          if (!agg[c.name]) agg[c.name] = { total: 0, count: 0 };
          agg[c.name].total += c.score || 0;
          agg[c.name].count += 1;
        });
      });
    });
    return Object.entries(agg).map(([name, { total, count }]) => ({
      name,
      avg: count ? Math.round(total / count) : 0,
    }));
  }, [interviews]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Left: charts */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="font-semibold mb-2">Interview Scores Over Time</div>
          {scoreData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={scoreData} margin={{ left: 8, right: 8 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(262 83% 58%)" />
                    <stop offset="100%" stopColor="hsl(316 70% 68%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--foreground))" 
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--foreground))" }}
                  tickLine={{ stroke: "hsl(var(--foreground))" }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="hsl(var(--foreground))" 
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--foreground))" }}
                  tickLine={{ stroke: "hsl(var(--foreground))" }}
                />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                <Line type="monotone" dataKey="score" stroke="url(#lineGrad)" strokeWidth={3} dot={{ r: 3, fill: 'url(#lineGrad)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-muted-foreground">No score data yet.</div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="font-semibold mb-2">Category Performance</div>
          {categoryData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData} margin={{ left: 8, right: 8 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(262 83% 58%)" />
                    <stop offset="100%" stopColor="hsl(316 70% 68%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--foreground))" 
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--foreground))" }}
                  tickLine={{ stroke: "hsl(var(--foreground))" }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="hsl(var(--foreground))" 
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--foreground))" }}
                  tickLine={{ stroke: "hsl(var(--foreground))" }}
                />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="avg" name="Average" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-muted-foreground">No category data yet.</div>
          )}
        </div>
      </div>

      {/* Right: aptitude widgets reuse */}
      <div className="space-y-6 lg:sticky lg:top-24">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="font-semibold mb-3">Overview</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{interviews?.length ?? 0}</div>
              <div className="text-xs text-muted-foreground">Interviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{Math.round((scoreData.reduce((s, d) => s + d.score, 0) / Math.max(1, scoreData.length)) || 0)}</div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{categoryData.length}</div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="font-semibold mb-3">Recent Activity</div>
          <div className="space-y-2 text-sm">
            {(interviews || []).slice(0, 5).map((i) => (
              <div key={i.id} className="flex items-center justify-between">
                <div className="truncate pr-3">
                  <div className="font-medium truncate">{i.role || 'Interview'}</div>
                  <div className="text-xs text-muted-foreground truncate">{new Date(i.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-xs px-2 py-1 rounded-full border border-border bg-muted text-muted-foreground">{(i.feedbacks?.[0]?.totalScore ?? 0)}%</div>
              </div>
            ))}
            {(!interviews || interviews.length === 0) && (
              <div className="text-sm text-muted-foreground">No recent items.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
