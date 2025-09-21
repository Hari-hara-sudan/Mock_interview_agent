import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import { getAllFeedbacksByInterviewId } from "@/lib/actions/getAllFeedbacksByInterviewId";
import { Cpu, MessageSquare, Brain, Star } from "lucide-react";

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

function timeAgo(input?: any) {
  if (!input) return "";
  let date: Date | null = null;
  if (typeof input === "string" || typeof input === "number") {
    date = new Date(input);
  } else if (input instanceof Date) {
    date = input;
  } else if (input && typeof input === "object" && typeof input.toDate === "function") {
    try {
      date = input.toDate();
    } catch (e) {
      date = null;
    }
  }
  if (!date || isNaN(date.getTime())) return "";
  const ms = Date.now() - date.getTime();
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (day > 0) return `${day} day${day > 1 ? "s" : ""} ago`;
  if (hr > 0) return `${hr} hr${hr > 1 ? "s" : ""} ago`;
  if (min > 0) return `${min} min ago`;
  return "just now";
}

const Page = async () => {
  const user = await getCurrentUser();

  // Fetch only user interviews
  const interviews = user?.id ? await getInterviewsByUserId(user.id) : [];
  const recent = user?.id
    ? await Promise.all(
        (interviews || [])
          .slice(0, 5)
          .map(async (intv: any) => {
            const feedbacks = await getAllFeedbacksByInterviewId({ interviewId: intv.id, userId: user.id! });
            const avgScore = feedbacks.length
              ? Math.round(
                  feedbacks.reduce((s: number, f: any) => s + (f.totalScore || 0), 0) / feedbacks.length
                )
              : (intv.totalScore || 0);
            return { ...intv, avgScore };
          })
      )
    : [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-hero py-8 md:py-10 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold">AI Voice Interviews</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Practice with realistic AI interviewers and get instant feedback
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Quick setup + Types */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Setup */}
            <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur p-6 shadow-medium">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Quick Interview Setup</h3>
                  <p className="text-sm text-muted-foreground">Start a new interview session in seconds</p>
                </div>
                <Link href="/interview/new" className="inline-flex">
                  <div className="inline-flex items-center px-5 py-3 rounded-xl bg-gradient-primary text-white font-semibold shadow-medium hover:shadow-strong transition">
                    Generate Interview
                  </div>
                </Link>
              </div>
            </div>

            {/* Interview Types */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Interview Types</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-border/50 bg-background/60 p-5 hover:bg-card-hover transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded-full border">Medium</span>
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-semibold">Technical</div>
                  <p className="text-sm text-muted-foreground mt-1">System design, coding problems, and technical concepts</p>
                  <div className="mt-3 text-xs text-muted-foreground">45-60 min</div>
                </div>
                <div className="rounded-xl border border-border/50 bg-background/60 p-5 hover:bg-card-hover transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded-full border">Easy</span>
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-semibold">Behavioral</div>
                  <p className="text-sm text-muted-foreground mt-1">Leadership, teamwork, and situational questions</p>
                  <div className="mt-3 text-xs text-muted-foreground">30-45 min</div>
                </div>
                <div className="rounded-xl border border-border/50 bg-background/60 p-5 hover:bg-card-hover transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded-full border">Hard</span>
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-semibold">System Design</div>
                  <p className="text-sm text-muted-foreground mt-1">Architecture, scalability, and design patterns</p>
                  <div className="mt-3 text-xs text-muted-foreground">60-90 min</div>
                </div>
              </div>
            </div>

            {/* Your Interviews (Grid) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold">Your Interviews</h4>
                <Link href="/interview/new" className="text-sm text-primary hover:underline">Create new</Link>
              </div>
              {interviews && interviews.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {(await Promise.all(
                    interviews.slice(0, 6).map(async (intv: any) => {
                      const feedbacks = await getAllFeedbacksByInterviewId({ interviewId: intv.id, userId: user!.id });
                      const type = (intv.type || "Technical") as string;
                      const Icon = type.toLowerCase().includes("behavior")
                        ? MessageSquare
                        : type.toLowerCase().includes("design")
                        ? Brain
                        : Cpu;
                      const avgScore = feedbacks.length
                        ? Math.round(feedbacks.reduce((s: number, f: any) => s + (f.totalScore || 0), 0) / feedbacks.length)
                        : (intv.totalScore || 0);
                      const targetHref = feedbacks.length > 0 ? `/interview/${intv.id}/feedback` : `/interview/${intv.id}`;
                      return { ...intv, _feedbacks: feedbacks, avgScore, Icon, targetHref };
                    })
                  )).map((i: any) => (
                    <Link key={i.id} href={i.targetHref} className="block">
                      <div className="rounded-xl border border-border/50 bg-background/60 p-5 hover:bg-card-hover transition">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs px-2 py-1 rounded-full border">{i.level || "Mid-level"}</span>
                          <i.Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="font-semibold">{i.role || "Interview"}</div>
                        <p className="text-sm text-muted-foreground mt-1">{i.type || "Technical"}</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{timeAgo(typeof i.createdAt === 'string' ? i.createdAt : '')}</span>
                          <span>Score <span className="text-foreground font-semibold">{i.avgScore}%</span></span>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, i.avgScore || 0))}%` }} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">No interviews yet.</div>
                  <Link 
                    href="/interview/new" 
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
                  >
                    Create Your First Interview
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: Recent Interviews */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Recent Interviews</h4>
              <Link href="/profile" className="text-sm text-primary hover:underline">View all</Link>
            </div>

            {(recent && recent.length > 0) ? (
              <div className="space-y-4">
                {recent.map((r: any) => (
                  <Link key={r.id} href={r.feedbackId ? `/interview/${r.id}/feedback` : `/interview/${r.id}`} className="block">
                    <div className="rounded-xl border border-border/50 bg-background/60 p-4 hover:bg-card-hover transition">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{r.role || "Interview"}</div>
                          <div className="text-xs text-muted-foreground">{r.type || "Technical"}</div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-yellow-500" />
                          <Star className="w-4 h-4 fill-yellow-500" />
                          <Star className="w-4 h-4 fill-yellow-500" />
                          <Star className="w-4 h-4 fill-yellow-500" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{timeAgo(r.createdAt)}</span>
                        <span>Score <span className="text-foreground font-semibold">{r.avgScore}%</span></span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, r.avgScore || 0))}%` }} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No recent interviews yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
