"use client";

import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { FaSearch } from "react-icons/fa";
import { 
  Mail, 
  Phone, 
  MapPin, 
  CalendarDays,
  User as UserIcon,
  Award,
  BookOpen,
  BarChart3,
  TrendingUp,
  Target,
  Download,
  Filter,
  RefreshCw,
  Trophy,
  Zap,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  Calendar
} from "lucide-react";
import { User } from "@/types";

interface ProfileClientProps {
  user: User | null;
  interviews: any[];
}

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    let frame: number | undefined;
    function animate() {
      start += increment;
      if (start < target) {
        setValue(Math.round(start));
        frame = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    }
    animate();
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [target, duration]);
  return value;
}

export default function ProfileClient({ user, interviews }: ProfileClientProps) {
  // Role filter state
  const [roleFilter, setRoleFilter] = useState("ALL");
  // Search state
  const [search, setSearch] = useState("");
  // Tabs
  const tabs = ["Overview", "Analytics", "Test Results", "Interviews", "Settings"] as const;
  type TabKey = typeof tabs[number];
  const [activeTab, setActiveTab] = useState<TabKey>("Overview");
  
  // Get unique roles from interviews
  const roles = useMemo(() => {
    const set = new Set<string>();
    interviews.forEach((i: any) => {
      if (i.role) set.add(i.role);
    });
    return ["ALL", ...Array.from(set)];
  }, [interviews]);
  
  // Filtered interviews with search
  const filteredInterviews = useMemo(
    () =>
      roleFilter === "ALL"
        ? interviews.filter((i: any) =>
            i.role.toLowerCase().includes(search.toLowerCase())
          )
        : interviews.filter(
            (i: any) =>
              i.role === roleFilter &&
              i.role.toLowerCase().includes(search.toLowerCase())
          ),
    [interviews, roleFilter, search]
  );

  // Dashboard metrics
  const totalInterviews = filteredInterviews.length;
  const averageScore =
    totalInterviews > 0
      ? Math.round(
          filteredInterviews.reduce((sum, i) => {
            const feedbacks = i.feedbacks || [];
            if (feedbacks.length > 0) {
              const total = feedbacks.reduce((s: number, f: any) => s + (f.totalScore || 0), 0);
              return sum + Math.round(total / feedbacks.length);
            }
            return sum + (i.totalScore || 0);
          }, 0) / totalInterviews
        )
      : 0;
  const bestScore =
    totalInterviews > 0
      ? Math.max(
          ...filteredInterviews.map((i) => {
            const feedbacks = i.feedbacks || [];
            if (feedbacks.length > 0) {
              const total = feedbacks.reduce((s: number, f: any) => s + (f.totalScore || 0), 0);
              return Math.round(total / feedbacks.length);
            }
            return i.totalScore || 0;
          })
        )
      : 0;

  // Analytics data exactly like Vox Ace Hub
  const overallStats = [
    {
      title: "Total Interviews",
      value: String(totalInterviews),
      change: "+12%",
      trend: "up" as const,
      icon: BarChart3,
      color: "text-blue-600",
    },
    {
      title: "Average Score", 
      value: `${averageScore}%`,
      change: "+8%",
      trend: "up" as const, 
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Current Streak",
      value: "12 days",
      change: "+3 days",
      trend: "up" as const,
      icon: Zap,
      color: "text-purple-600",
    },
    {
      title: "Time Practiced",
      value: "28h",
      change: "+5h",
      trend: "up" as const,
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  const performanceData = [
    { category: "Voice Interviews", score: 87, trend: 5, sessions: totalInterviews },
    { category: "Coding Challenges", score: 78, trend: -2, sessions: 45 },
    { category: "Aptitude Tests", score: 84, trend: 8, sessions: 15 },
    { category: "Technical Questions", score: 82, trend: 3, sessions: 18 },
  ];

  const recentAchievements = [
    {
      title: "Interview Marathon",
      description: "Completed 10 interviews in a week",
      date: "2 days ago",
      icon: Trophy,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      title: "Code Master",
      description: "Solved 50 coding challenges",
      date: "1 week ago", 
      icon: Award,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Consistency Champion",
      description: "Practiced for 7 consecutive days",
      date: "2 weeks ago",
      icon: Star,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  const weeklyProgress = [
    { day: "Mon", interviews: 2, score: 85 },
    { day: "Tue", interviews: 1, score: 78 },
    { day: "Wed", interviews: 3, score: 92 },
    { day: "Thu", interviews: 2, score: 88 },
    { day: "Fri", interviews: 4, score: 82 },
    { day: "Sat", interviews: 1, score: 95 },
    { day: "Sun", interviews: 2, score: 89 },
  ];

  const improvementAreas = [
    {
      area: "System Design",
      currentScore: 68,
      targetScore: 80,
      priority: "High",
      suggestion: "Practice more distributed systems concepts",
    },
    {
      area: "Algorithm Complexity",
      currentScore: 75,
      targetScore: 85,
      priority: "Medium", 
      suggestion: "Focus on time and space complexity analysis",
    },
    {
      area: "Communication Skills",
      currentScore: 82,
      targetScore: 90,
      priority: "Low",
      suggestion: "Practice explaining solutions clearly",
    },
  ];

  // Prepare data for charts
  const scoreData = useMemo(
    () =>
      filteredInterviews.map((interview: any) => {
        const feedbacks = interview.feedbacks || [];
        let score = 0;
        if (feedbacks.length > 0) {
          const total = feedbacks.reduce((sum: number, f: any) => sum + (f.totalScore || 0), 0);
          score = Math.round(total / feedbacks.length);
        } else {
          score = interview.totalScore || 0;
        }
        return {
          date: new Date(interview.createdAt).toLocaleDateString(),
          score,
        };
      }),
    [filteredInterviews]
  );

  // Compute skill breakdown from all feedbacks (array)
  const skillData = useMemo(() => {
    const categories: Record<string, { total: number; count: number }> = {};
    filteredInterviews.forEach((interview: any) => {
      const feedbacks = interview.feedbacks || [];
      feedbacks.forEach((feedback: any) => {
        if (feedback.name && typeof feedback.score === 'number') {
          if (!categories[feedback.name]) categories[feedback.name] = { total: 0, count: 0 };
          categories[feedback.name].total += feedback.score;
          categories[feedback.name].count += 1;
        }
        (feedback.categoryScores || []).forEach((cat: any) => {
          if (!categories[cat.name]) categories[cat.name] = { total: 0, count: 0 };
          categories[cat.name].total += cat.score;
          categories[cat.name].count += 1;
        });
      });
    });
    return Object.entries(categories).map(([subject, { total, count }]) => ({
      subject,
      A: count ? Math.round(total / count) : 0,
      fullMark: 100,
    }));
  }, [filteredInterviews]);

  const progress = useMemo(
    () => skillData.map((item) => ({ label: item.subject, value: item.A })),
    [skillData]
  );

  // Derive top tech tags from interviews
  const techCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (interviews || []).forEach((i: any) => (i.techstack || []).forEach((t: string) => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts).sort((a,b) => b[1]-a[1]).map(([name]) => name).slice(0,3);
  }, [interviews]);
  const badges = techCounts.map(t => ({ label: t }));

  const timeAgo = (d: any) => {
    const date = new Date(d);
    const diffMs = Date.now() - date.getTime();
    const days = Math.floor(diffMs / (1000*60*60*24));
    if (days <= 0) return "today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days/7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  };

  // Animated stats
  const animatedTotal = useCountUp(totalInterviews);
  const animatedAvg = useCountUp(averageScore);
  const animatedBest = useCountUp(bestScore);
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <img 
                src="/user-avatar.png" 
                alt="Profile picture" 
                className="h-24 w-24 rounded-full object-cover border-2 border-border"
              />
              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">{user?.name || "John Doe"}</h1>
                    <p className="text-lg text-muted-foreground">{badges.length ? `${badges[0].label} Developer` : "Software Engineer"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button className="px-4 py-2 rounded-xl text-white bg-gradient-primary shadow-sm">
                      Edit Profile
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <span key={badge.label} className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="rounded-2xl border border-border bg-card p-2 flex items-center gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-background shadow-sm text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user?.email || "john.doe@example.com"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined March 2024</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3 text-sm">
                    {filteredInterviews.slice(0, 3).map((interview: any, index: number) => (
                      <div key={interview.id || index} className="flex justify-between items-center">
                        <span>Voice Interview: {interview.role}</span>
                        <span className="text-xs text-muted-foreground">{timeAgo(interview.createdAt)}</span>
                      </div>
                    ))}
                    {filteredInterviews.length === 0 && (
                      <div className="text-muted-foreground">No recent activity</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-border rounded-lg bg-background">
                    <div className="text-2xl font-bold text-primary">{animatedTotal}</div>
                    <div className="text-sm text-muted-foreground">Tests Completed</div>
                  </div>
                  <div className="text-center p-4 border border-border rounded-lg bg-background">
                    <div className="text-2xl font-bold text-primary">3</div>
                    <div className="text-sm text-muted-foreground">Interviews Done</div>
                  </div>
                  <div className="text-center p-4 border border-border rounded-lg bg-background">
                    <div className="text-2xl font-bold text-primary">{animatedAvg}%</div>
                    <div className="text-sm text-muted-foreground">Average Score</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Analytics" && (
            <div className="space-y-6">
              {/* Analytics Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">Track your progress and identify areas for improvement</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overallStats.map((stat, index) => (
                  <div key={index} className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg bg-accent/10 ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className={`flex items-center text-xs font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? (
                          <ArrowUp className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDown className="w-3 h-3 mr-1" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Performance & Progress */}
                <div className="lg:col-span-2 space-y-6">


                  {/* Performance by Category */}
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-6">Performance by Category</h3>
                    <div className="space-y-4">
                      {performanceData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-accent/20 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{item.category}</h4>
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                  {item.sessions} sessions
                                </span>
                                <div className={`flex items-center text-xs font-medium ${
                                  item.trend > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {item.trend > 0 ? (
                                    <ArrowUp className="w-3 h-3 mr-1" />
                                  ) : (
                                    <ArrowDown className="w-3 h-3 mr-1" />
                                  )}
                                  {Math.abs(item.trend)}%
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)]"
                                  style={{ width: `${item.score}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-12 text-right">{item.score}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Progress Chart */}
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-6">This Week's Activity</h3>
                    <div className="flex items-end justify-between h-40 space-x-2">
                      {weeklyProgress.map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="flex flex-col items-center space-y-1 mb-2">
                            <div 
                              className="w-8 bg-gradient-to-t from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] rounded-t"
                              style={{ height: `${(day.interviews / 4) * 100}px` }}
                            />
                            <div className="text-xs text-center">
                              <div className="font-medium">{day.interviews}</div>
                              <div className="text-muted-foreground">{day.score}%</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground font-medium">{day.day}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] rounded mr-2" />
                        Interviews
                      </div>
                      <div>Score shown below bars</div>
                    </div>
                  </div>

                  {/* Improvement Areas */}
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-6">Areas for Improvement</h3>
                    <div className="space-y-4">
                      {improvementAreas.map((area, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{area.area}</h4>
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                area.priority === 'High' ? 'text-red-600 border-red-200 bg-red-50' : 
                                area.priority === 'Medium' ? 'text-yellow-600 border-yellow-200 bg-yellow-50' :
                                'text-green-600 border-green-200 bg-green-50'
                              }`}
                            >
                              {area.priority} Priority
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Current: {area.currentScore}%</span>
                                <span>Target: {area.targetScore}%</span>
                              </div>
                              <div className="bg-muted rounded-full h-2 relative">
                                <div 
                                  className="bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] h-2 rounded-full"
                                  style={{ width: `${(area.currentScore / area.targetScore) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{area.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Achievements & Quick Actions */}
                <div className="space-y-6">
                  {/* Recent Achievements */}
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <h4 className="font-semibold mb-4 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-primary" />
                      Recent Achievements
                    </h4>
                    <div className="space-y-4">
                      {recentAchievements.map((achievement, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${achievement.color}`}>
                            <achievement.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm">{achievement.title}</h5>
                            <p className="text-xs text-muted-foreground mb-1">
                              {achievement.description}
                            </p>
                            <p className="text-xs text-muted-foreground">{achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <h4 className="font-semibold mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-start px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-sm">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Start Practice Session
                      </button>
                      <button className="w-full flex items-center justify-start px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-sm">
                        <Target className="w-4 h-4 mr-2" />
                        Set New Goals
                      </button>
                      <button className="w-full flex items-center justify-start px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Study Time
                      </button>
                      <button className="w-full flex items-center justify-start px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-sm">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Detailed Report
                      </button>
                    </div>
                  </div>

                  {/* Next Milestone */}
                  <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] p-4 text-white">
                    <h4 className="font-semibold mb-2">Next Milestone</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Interview Expert Badge</span>
                          <span>47/50</span>
                        </div>
                        <div className="bg-white/20 rounded-full h-2">
                          <div className="bg-white h-2 rounded-full" style={{ width: '94%' }} />
                        </div>
                      </div>
                      <p className="text-xs opacity-90">
                        Complete 3 more interviews to unlock the Interview Expert badge
                      </p>
                    </div>
                  </div>

                  {/* Skill Progress Chart */}
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <h4 className="font-semibold mb-4">Skill Progress</h4>
                    <div className="space-y-3">
                      {progress.slice(0, 5).map((item) => (
                        <div key={item.label} className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{item.label}</span>
                            <span className="font-bold text-sm">{item.value}%</span>
                          </div>
                          <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="absolute left-0 top-0 h-2 rounded-full transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${item.value}%`, 
                                background: 'linear-gradient(90deg, hsl(262 83% 58%), hsl(316 70% 68%))',
                                minWidth: item.value > 0 ? '4px' : 0 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      {progress.length === 0 && (
                        <div className="text-muted-foreground text-xs text-center py-4">
                          No skill data available yet. Complete some interviews to see your progress!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Skill Breakdown Radar Chart */}
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <h4 className="font-semibold mb-3">Skill Breakdown</h4>
                    {skillData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={skillData.slice(0, 6)}>
                          <defs>
                            <linearGradient id="sidebarRadarGrad" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="hsl(262 83% 58%)" />
                              <stop offset="100%" stopColor="hsl(316 70% 68%)" />
                            </linearGradient>
                          </defs>
                          <PolarGrid stroke="hsl(var(--border))" />
                          <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: "hsl(var(--foreground))", fontSize: 10, fontWeight: 500 }} 
                          />
                          <PolarRadiusAxis 
                            angle={30} 
                            domain={[0, 100]} 
                            tick={{ fill: "hsl(var(--foreground))", fontSize: 8 }}
                            tickCount={4}
                          />
                          <Radar 
                            name="Skills" 
                            dataKey="A" 
                            stroke="url(#sidebarRadarGrad)" 
                            fill="url(#sidebarRadarGrad)" 
                            fillOpacity={0.2} 
                            strokeWidth={2} 
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-muted-foreground text-xs text-center py-8">
                        No skill data available.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Test Results" && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Test History</h3>
              <p className="text-muted-foreground text-sm mb-6">Your completed assessments and coding challenges</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">JavaScript Fundamentals</h4>
                    <p className="text-sm text-muted-foreground">Completed on March 15, 2024</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">92%</span>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">React Components</h4>
                    <p className="text-sm text-muted-foreground">Completed on March 10, 2024</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">85%</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Interviews" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 items-center">
                {roles.map((role) => (
                  <button
                    key={role}
                    className={`px-4 py-2 rounded-full border font-semibold transition text-xs ${
                      roleFilter === role 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                    onClick={() => setRoleFilter(role)}
                    type="button"
                  >
                    {role === "ALL" ? "All Roles" : role}
                  </button>
                ))}
                <div className="relative ml-auto w-full md:w-64">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search interviews..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/30 w-full outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredInterviews && filteredInterviews.length > 0 ? (
                  filteredInterviews.map((interview: any) => (
                    <InterviewCard
                      key={interview.id}
                      userId={user?.id as string}
                      interview={interview}
                      cover={interview.coverImage}
                      feedbacks={interview.feedbacks || []}
                    />
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground">You haven't taken any interviews yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "Settings" && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              <p className="text-muted-foreground text-sm mb-6">Manage your account preferences</p>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-start px-4 py-3 rounded-lg border border-border bg-background hover:bg-muted">
                  Change Password
                </button>
                <button className="w-full flex items-center justify-start px-4 py-3 rounded-lg border border-border bg-background hover:bg-muted">
                  Update Email
                </button>
                <button className="w-full flex items-center justify-start px-4 py-3 rounded-lg border border-border bg-background hover:bg-muted">
                  Privacy Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
