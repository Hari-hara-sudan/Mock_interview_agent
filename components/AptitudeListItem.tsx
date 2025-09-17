"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { AptitudeTest } from "@/types";
import { Play } from "lucide-react";

type Props = {
  test: AptitudeTest;
};

const diffPill: Record<string, string> = {
  easy: "bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-700 border-emerald-200",
  medium: "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-700 border-amber-200",
  hard: "bg-gradient-to-r from-rose-500/10 to-red-500/10 text-rose-700 border-rose-200",
};

export default function AptitudeListItem({ test }: Props) {
  const totalQuestions = (test.categories?.length || 0) * (test.questionsPerCategory || 0);

  return (
    <div className="group rounded-2xl border border-border bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:border-[hsl(262,83%,58%)]/20">
      <div className="flex items-center gap-4 p-5">
        {/* status bullet */}
        <div className="shrink-0">
          <span className="inline-block size-3 rounded-full bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)]" />
        </div>

        {/* main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/aptitude/test/${test.id}`} className="font-semibold text-foreground hover:text-transparent hover:bg-gradient-to-r hover:from-[hsl(262,83%,58%)] hover:to-[hsl(316,70%,68%)] hover:bg-clip-text transition-all truncate">
              {test.title}
            </Link>
            <span className={cn("inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full border",
              diffPill[test.difficulty] ?? "bg-gradient-to-r from-[hsl(262,83%,58%)]/10 to-[hsl(316,70%,68%)]/10 text-foreground border-[hsl(262,83%,58%)]/20"
            )}>
              {test.difficulty?.charAt(0).toUpperCase() + test.difficulty?.slice(1)}
            </span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground truncate">
            {test.description}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(test.categories || []).slice(0, 4).map((cat) => (
              <span key={cat} className="text-xs px-2 py-1 rounded-full border border-[hsl(262,83%,58%)]/20 bg-gradient-to-r from-[hsl(262,83%,58%)]/5 to-[hsl(316,70%,68%)]/5 text-muted-foreground">{cat}</span>
            ))}
            {test.categories && test.categories.length > 4 && (
              <span className="text-xs px-2 py-1 rounded-full border border-[hsl(262,83%,58%)]/20 bg-gradient-to-r from-[hsl(262,83%,58%)]/5 to-[hsl(316,70%,68%)]/5 text-muted-foreground">+{test.categories.length - 4} more</span>
            )}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {totalQuestions} questions • {test.timeLimit} min • Pass {test.passingScore}%
          </div>
        </div>

        {/* action */}
        <div className="shrink-0">
          <Link
            href={`/aptitude/test/${test.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] text-white hover:shadow-lg hover:scale-105 transition-all px-4 py-2 text-sm shadow-sm"
          >
            <Play size={16} className="text-white" />
            Start
          </Link>
        </div>
      </div>
    </div>
  );
}
