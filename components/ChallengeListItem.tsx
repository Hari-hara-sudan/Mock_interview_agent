"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Challenge } from "@/types";
import { Play, CheckCircle2, Circle } from "lucide-react";

type Props = {
  challenge: Challenge;
  solved?: boolean;
};

const difficultyPill: Record<string, string> = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function ChallengeListItem({ challenge, solved }: Props) {
  const Pill = (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full border",
        difficultyPill[challenge.difficulty] ?? "bg-muted text-foreground border-border"
      )}
    >
      {challenge.difficulty === "easy" && <span className="size-2 rounded-full bg-emerald-500" />}
      {challenge.difficulty === "medium" && <span className="size-2 rounded-full bg-amber-500" />}
      {challenge.difficulty === "hard" && <span className="size-2 rounded-full bg-rose-500" />}
      <span className="capitalize">{challenge.difficulty}</span>
    </span>
  );

  return (
    <div className="group rounded-2xl border border-border bg-card hover:bg-card/80 transition-colors">
      <div className="flex items-center gap-4 p-5">
        {/* status icon */}
        <div className="shrink-0">
          {solved ? (
            <CheckCircle2 className="text-emerald-500" size={20} />
          ) : (
            <Circle className="text-muted-foreground" size={20} />
          )}
        </div>

        {/* main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/training/challenges/${challenge.slug}`}
              className="font-semibold text-foreground hover:text-primary truncate"
            >
              {challenge.title}
            </Link>
            {Pill}
          </div>
          <div className="mt-1 text-sm text-muted-foreground truncate">
            {/* secondary meta; acceptance not available, show first tag if present */}
            {challenge.tags?.[0] ? challenge.tags[0] : challenge.type}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(challenge.supportedLanguages || []).slice(0, 3).map((lang) => (
              <span
                key={lang}
                className="text-xs px-2 py-1 rounded-full border border-border bg-muted text-muted-foreground"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* actions */}
        <div className="shrink-0">
          <Link
            href={`/training/challenges/${challenge.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white text-neutral-900 dark:text-neutral-900 hover:bg-neutral-100 px-4 py-2 text-sm shadow-sm transition-colors"
          >
            <Play size={16} className="text-neutral-900" />
            Solve
          </Link>
        </div>
      </div>
    </div>
  );
}
