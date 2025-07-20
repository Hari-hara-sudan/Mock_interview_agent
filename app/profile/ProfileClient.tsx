"use client";

import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
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
} from "recharts";
import { FaUserCircle, FaStar, FaChartLine, FaTrophy, FaRegSadTear, FaSearch } from "react-icons/fa";

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
  const worstScore =
    totalInterviews > 0
      ? Math.min(
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

  const progress = useMemo(
    () => skillData.map((item) => ({ label: item.subject, value: item.A })),
    [skillData]
  );

  // Example badges (replace with real logic if you want dynamic badges)
  const badges = [
    { label: "Python Pro", color: "bg-green-400 text-black" },
    { label: "ML Novice", color: "bg-blue-400 text-black" },
    { label: "SQL Master", color: "bg-yellow-300 text-black" },
  ];

  // Animated stats
  const animatedTotal = useCountUp(totalInterviews);
  const animatedAvg = useCountUp(averageScore);
  const animatedBest = useCountUp(bestScore);
  const animatedWorst = useCountUp(worstScore);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* User Info Card with Stats Side-by-Side */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 p-8 rounded-3xl bg-gradient-to-r from-[#23243a] via-[#18181b] to-[#23243a] shadow-2xl border border-[#23243a] animate-fadeIn">
        {/* Left: Avatar, Name, Badges */}
        <div className="flex flex-col items-center md:items-start flex-1">
          <div className="relative">
            <img
              src="/user-avatar.png"
              alt="User Avatar"
              className="rounded-full border-4 border-blue-700 shadow-lg w-32 h-32 object-cover"
            />
            <span className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-[#18181b]"></span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <FaUserCircle className="text-blue-400" />
              {user?.name || "User"}
            </h2>
            <p className="text-gray-300 font-medium">{user?.email}</p>
            <p className="text-gray-500 text-xs mt-1">
              User ID: <span className="font-mono">{user?.id}</span>
            </p>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color} bg-opacity-80`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
        {/* Right: Stats Cards */}
        <div className="flex flex-col md:flex-row flex-wrap gap-6 justify-center md:justify-start min-w-[260px] md:min-w-[320px]">
          <div className="flex flex-col items-center bg-[#23243a] rounded-xl shadow p-4 min-w-[120px] border border-[#333] transition-all duration-700">
            <FaChartLine className="text-blue-400 text-2xl mb-1" />
            <div className="text-2xl font-bold text-blue-200">{animatedTotal}</div>
            <div className="text-xs text-gray-400">Total Interviews</div>
          </div>
          <div className="flex flex-col items-center bg-[#23243a] rounded-xl shadow p-4 min-w-[120px] border border-[#333] transition-all duration-700">
            <FaStar className="text-green-400 text-2xl mb-1" />
            <div className="text-2xl font-bold text-green-200">{animatedAvg}%</div>
            <div className="text-xs text-gray-400">Average Score</div>
          </div>
          <div className="flex flex-col items-center bg-[#23243a] rounded-xl shadow p-4 min-w-[120px] border border-[#333] transition-all duration-700">
            <FaTrophy className="text-yellow-400 text-2xl mb-1" />
            <div className="text-2xl font-bold text-yellow-200">{animatedBest}%</div>
            <div className="text-xs text-gray-400">Best Score</div>
          </div>
          <div className="flex flex-col items-center bg-[#23243a] rounded-xl shadow p-4 min-w-[120px] border border-[#333] transition-all duration-700">
            <FaRegSadTear className="text-red-400 text-2xl mb-1" />
            <div className="text-2xl font-bold text-red-200">{animatedWorst}%</div>
            <div className="text-xs text-gray-400">Lowest Score</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid md:grid-cols-2 gap-6">
        <div className="bg-[#18181b] rounded-2xl shadow p-6 border border-[#23243a]">
          <h4 className="font-semibold mb-2 text-white">Interview Scores Over Time</h4>
          {scoreData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={scoreData} margin={{ left: 10, right: 10 }}>
                <XAxis dataKey="date" stroke="#ccc" tick={{ fill: "#ccc", fontSize: 12 }} />
                <YAxis domain={[0, 100]} stroke="#ccc" tick={{ fill: "#ccc", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#23243a', border: '1px solid #444', color: '#fff' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Bar dataKey="score" fill="#8884d8" radius={[8, 8, 0, 0]} isAnimationActive={true} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-400 text-sm">No score data available.</div>
          )}
        </div>
        <div className="bg-[#18181b] rounded-2xl shadow p-6 border border-[#23243a]">
          <h4 className="font-semibold mb-2 text-white">Skill Breakdown</h4>
          {skillData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="70%"
                data={skillData}
              >
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#ccc", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#888", fontSize: 10 }} />
                <Radar
                  name="You"
                  dataKey="A"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                  isAnimationActive={true}
                  animationDuration={800}
                />
                <Legend wrapperStyle={{ color: "#ccc" }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-400 text-sm">No skill data available.</div>
          )}
        </div>
      </div>

      {/* Skill Progress Section */}
      <div className="mb-8 bg-[#18181b] rounded-2xl shadow p-6 border border-[#23243a]">
        <h4 className="font-semibold mb-4 text-white">Skill Progress</h4>
        <div className="space-y-4">
          {progress.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-200 text-sm flex items-center gap-2">
                  {item.label}
                </span>
                <span className="font-bold text-gray-100 text-xs">{item.value}%</span>
              </div>
              <div className="relative w-full h-5 bg-[#23243a] rounded-full overflow-hidden shadow-sm border border-[#333]">
                <div
                  className="absolute left-0 top-0 h-5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 animate-pulse"
                  style={{ width: `${item.value}%`, minWidth: item.value > 0 ? '2rem' : 0 }}
                >
                  <span
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white drop-shadow"
                    style={{ display: item.value > 15 ? 'inline' : 'none' }}
                  >
                    {item.value}%
                  </span>
                  {item.value > 0 && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-pink-400 rounded-full shadow"></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Filter & Search */}
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        {roles.map((role) => (
          <button
            key={role}
            className={`px-4 py-2 rounded-full border font-semibold transition text-xs ${roleFilter === role ? "bg-blue-600 text-white border-blue-600" : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"}`}
            onClick={() => setRoleFilter(role)}
            type="button"
          >
            {role === "ALL" ? "All Roles" : role}
          </button>
        ))}
        <div className="relative ml-auto w-full md:w-64">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-xl pointer-events-none" />
          <input
            type="text"
            placeholder="Search interviews..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 rounded-full bg-[#23243a]/80 text-white placeholder:text-gray-400 border border-blue-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 shadow-lg transition-all w-full outline-none"
          />
        </div>
      </div>

      {/* Interview Cards Grid */}
      <h3 className="text-xl font-semibold mb-4 text-white">Your Interviews</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredInterviews && filteredInterviews.length > 0 ? (
          filteredInterviews.map((interview: any) => (
            <InterviewCard
              key={interview.id}
              userId={user?.id}
              interviewId={interview.id}
              role={interview.role}
              type={interview.type}
              techstack={interview.techstack}
              createdAt={interview.createdAt}
              coverImage={interview.coverImage}
              feedback={interview.feedbacks?.[0]}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">You haven&apos;t taken any interviews yet.</p>
        )}
      </div>
    </div>
  );
}
