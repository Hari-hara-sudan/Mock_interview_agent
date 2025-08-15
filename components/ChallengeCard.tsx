"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Challenge, ChallengeProgress } from "@/types/index";

interface ChallengeCardProps {
  challenge: Challenge;
  progress?: ChallengeProgress;
}

const ChallengeCard = ({ challenge, progress }: ChallengeCardProps) => {
  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", 
    hard: "bg-red-500/20 text-red-400 border-red-500/30"
  };

  const typeLabels = {
    "explain-before-code": "Explain First",
    "voice-debugging": "Voice Debug",
    "code-review": "Code Review",
    "black-box-contract": "Black Box",
    "performance-tuning": "Performance"
  };

  return (
    <div className="group relative bg-[#1a1a1a] rounded-lg border border-[#333] p-6 hover:border-[#444] transition-all duration-200 hover:transform hover:scale-[1.02]">
      <Link href={`/training/challenges/${challenge.slug}`} className="block">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            <span className={cn(
              "px-2 py-1 text-xs rounded border capitalize",
              difficultyColors[challenge.difficulty as keyof typeof difficultyColors]
            )}>
              {challenge.difficulty}
            </span>
            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
              {typeLabels[challenge.type as keyof typeof typeLabels]}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {challenge.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {challenge.description}
        </p>

        {/* Languages */}
        <div className="flex flex-wrap gap-2 mb-4">
          {challenge.supportedLanguages.slice(0, 3).map((lang: string) => (
            <span key={lang} className="px-2 py-1 text-xs bg-[#232323] text-gray-300 rounded border border-[#333]">
              {lang}
            </span>
          ))}
          {challenge.supportedLanguages.length > 3 && (
            <span className="px-2 py-1 text-xs bg-[#232323] text-gray-300 rounded border border-[#333]">
              +{challenge.supportedLanguages.length - 3} more
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {challenge.tags.slice(0, 2).map((tag: string) => (
            <span key={tag} className="px-2 py-1 text-xs bg-[#2a2a2a] text-gray-400 rounded">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-[#333]">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Image src="/star.svg" width={16} height={16} alt="score" />
            {progress?.bestScore || 0}/100
          </div>
          <div className="text-xs text-gray-500">
            {Math.floor((challenge.timeLimit || 0) / 60000)}min
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ChallengeCard;
