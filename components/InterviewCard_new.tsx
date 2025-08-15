"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const InterviewCard = ({
  interview,
  userId,
  cover,
  feedbacks,
}: {
  interview: any;
  userId: string;
  cover: string;
  feedbacks: any[];
}) => {
  const normalizedType = /mix/gi.test(interview.type) ? "Mixed" : interview.type;

  const typeColors = {
    Behavioral: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Mixed: "bg-purple-500/20 text-purple-400 border-purple-500/30", 
    Technical: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  const formattedDate = dayjs(
    feedbacks?.[0]?.createdAt || interview.createdAt || Date.now()
  ).format("MMM D, YYYY");

  const hasResult = feedbacks && feedbacks.length > 0;
  const score = feedbacks?.[0]?.totalScore || 0;

  return (
    <div className="group relative bg-[#1a1a1a] rounded-lg border border-[#333] p-6 hover:border-[#444] transition-all duration-200 hover:transform hover:scale-[1.02]">
      <Link href={hasResult ? `/interview/${interview.id}/feedback` : `/interview/${interview.id}`} className="block">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            <span className={cn(
              "px-2 py-1 text-xs rounded border capitalize",
              typeColors[normalizedType as keyof typeof typeColors] || typeColors.Mixed
            )}>
              {normalizedType}
            </span>
            {hasResult && (
              <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded">
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {interview.role} Interview
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {normalizedType} interview for {interview.role} position
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {interview.techstack?.slice(0, 3).map((tech: string) => (
            <span key={tech} className="px-2 py-1 text-xs bg-[#232323] text-gray-300 rounded border border-[#333]">
              {tech}
            </span>
          ))}
          {interview.techstack?.length > 3 && (
            <span className="px-2 py-1 text-xs bg-[#232323] text-gray-300 rounded border border-[#333]">
              +{interview.techstack.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-[#333]">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Image src="/star.svg" width={16} height={16} alt="score" />
            {score}/100
          </div>
          <div className="text-xs text-gray-500">
            {formattedDate}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default InterviewCard;
