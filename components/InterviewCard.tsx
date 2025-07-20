"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import InterviewCardActions from "./InterviewCardActions";

import { cn } from "@/lib/utils";
// Remove: import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  coverImage,
  feedback,
}: InterviewCardProps & { feedback?: any }) => {
  // Remove: const [feedback, setFeedback] = useState<any>(null);

  // Remove: useEffect(() => {
  // Remove:   let isMounted = true;
  // Remove:   async function fetchFeedback() {
  // Remove:     if (userId && interviewId) {
  // Remove:       const data = await getFeedbackByInterviewId({ interviewId, userId });
  // Remove:       if (isMounted) setFeedback(data);
  // Remove:     }
  // Remove:   }
  // Remove:   fetchFeedback();
  // Remove:   return () => {
  // Remove:     isMounted = false;
  // Remove:   };
  // Remove: }, [userId, interviewId]);

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="w-[360px] max-sm:w-full min-h-96 bg-[#18181b] border border-[#232323] rounded-2xl shadow-lg p-6 flex flex-col justify-between transition-transform hover:scale-[1.025] hover:shadow-2xl">
      {/* Top Row: Badge & Cover Image */}
      <div className="flex items-start justify-between relative">
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#232323] border border-[#333] shadow",
          "absolute top-0 right-0"
        )}>
          {normalizedType}
        </div>
        <Image
          src={coverImage || "/default-cover.png"}
          alt="cover-image"
          width={72}
          height={72}
          className="rounded-xl object-cover size-[72px] border border-[#232323] bg-[#232323]"
        />
      </div>

      {/* Middle: Role, Date, Score */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-white capitalize mb-2">{role} Interview</h3>
        <div className="flex flex-row gap-6 text-sm text-[#e0e7ef] mb-2">
          <div className="flex items-center gap-2">
            <Image src="/calendar.svg" width={18} height={18} alt="calendar" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/star.svg" width={18} height={18} alt="star" />
            <span>{feedback?.totalScore || "---"}/100</span>
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-2">
          <DisplayTechIcons techStack={techstack} />
        </div>
      </div>

      {/* Bottom: Feedback & Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <p className="text-[#e0e7ef] text-sm line-clamp-2">
          {feedback?.finalAssessment ||
            "You haven't taken this interview yet. Take it now to improve your skills."}
        </p>
        <div className="flex flex-row justify-end items-center gap-2 mt-2">
          <InterviewCardActions interviewId={interviewId || ""} feedback={feedback} />
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
