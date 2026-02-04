import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Star, Calendar, BarChart3, CheckCircle2, Target, BookOpen, ArrowLeft, RotateCcw, MessageSquare, Lightbulb, Award } from "lucide-react";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { RouteParams } from "@/types";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 text-green-500 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    return 'bg-red-500/10 text-red-500 border-red-500/30';
  };

  const progressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-hero py-8 md:py-10 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">Interview Feedback</h1>
              <p className="text-muted-foreground mt-2 capitalize">{interview.role} Interview Assessment</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Overall Score Badge */}
              <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur p-4 flex items-center gap-3">
                <div className={`text-4xl font-bold ${scoreColor(feedback?.totalScore || 0)}`}>
                  {feedback?.totalScore || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium text-foreground">Overall</div>
                  <div>Score</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              {feedback?.categoryScores?.length || 0} Categories Evaluated
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Final Assessment Card */}
            <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur p-6 shadow-medium">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Final Assessment</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{feedback?.finalAssessment}</p>
            </div>

            {/* Performance Breakdown */}
            <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur p-6 shadow-medium">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Performance Breakdown</h2>
              </div>
              <div className="space-y-4">
                {feedback?.categoryScores?.map((category, index) => (
                  <div key={index} className="rounded-xl border border-border/50 bg-muted/30 p-5 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-lg">{category.name}</span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${scoreBg(category.score)}`}>
                        {category.score}/100
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted mb-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${progressColor(category.score)}`}
                        style={{ width: `${Math.min(100, Math.max(0, category.score))}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{category.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions & Answers Learning Section */}
            {feedback?.questionsAndAnswers && feedback.questionsAndAnswers.length > 0 && (
              <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur p-6 shadow-medium">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Learn From Your Interview</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Review each question with your answer and the recommended model answer to improve.
                </p>
                
                <div className="space-y-6">
                  {feedback.questionsAndAnswers.map((qa: any, index: number) => (
                    <div key={index} className="rounded-xl border border-border/50 bg-muted/30 p-6">
                      {/* Question Header */}
                      <div className="flex items-start gap-4 mb-5">
                        <span className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                          Q{index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-lg leading-relaxed">{qa.question}</p>
                          <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-semibold border ${scoreBg(qa.score)}`}>
                            Score: {qa.score}/100
                          </span>
                        </div>
                      </div>

                      {/* Your Answer */}
                      <div className="ml-14 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Your Answer</span>
                        </div>
                        <div className="rounded-xl border border-border/50 bg-background/80 p-4 border-l-4 border-l-muted-foreground">
                          <p className="text-sm leading-relaxed">{qa.userAnswer || "No answer provided"}</p>
                        </div>
                      </div>

                      {/* Model Answer */}
                      <div className="ml-14 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-green-500">Recommended Answer</span>
                        </div>
                        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 border-l-4 border-l-green-500">
                          <p className="text-sm leading-relaxed whitespace-pre-line">{qa.modelAnswer}</p>
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="ml-14">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-yellow-500">Tips for Improvement</span>
                        </div>
                        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 border-l-4 border-l-yellow-500">
                          <p className="text-sm leading-relaxed">{qa.feedback}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Strengths Card */}
            <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Strengths</h3>
              </div>
              <div className="space-y-3">
                {feedback?.strengths?.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-muted-foreground">{strength}</span>
                  </div>
                ))}
                {(!feedback?.strengths || feedback.strengths.length === 0) && (
                  <p className="text-sm text-muted-foreground">No strengths identified yet.</p>
                )}
              </div>
            </div>

            {/* Areas for Improvement Card */}
            <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold">Areas for Improvement</h3>
              </div>
              <div className="space-y-3">
                {feedback?.areasForImprovement?.map((area, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                    <span className="text-yellow-500 mt-0.5">→</span>
                    <span className="text-muted-foreground">{area}</span>
                  </div>
                ))}
                {(!feedback?.areasForImprovement || feedback.areasForImprovement.length === 0) && (
                  <p className="text-sm text-muted-foreground">No areas identified yet.</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link 
                href={`/interview/${id}`} 
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-primary text-white font-semibold shadow-medium hover:shadow-strong transition"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Interview
              </Link>
              <Link 
                href="/interview" 
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl border border-border/50 bg-background/60 text-foreground font-medium hover:bg-muted/50 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Interviews
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
