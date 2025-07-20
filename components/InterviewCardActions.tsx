"use client";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { FiTrash2, FiEye } from "react-icons/fi";

interface InterviewCardActionsProps {
  interviewId: string;
  feedback: any;
}

export default function InterviewCardActions({ interviewId, feedback }: InterviewCardActionsProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    if (!confirm("Are you sure you want to delete this interview?")) {
      e.preventDefault();
    } else {
      setSubmitting(true);
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto max-w-full pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
      <form method="post" action={`/api/interview/${interviewId}/delete`} onSubmit={handleDelete}>
        <Button
          className="p-2 rounded-full border border-red-500 text-red-400 bg-transparent hover:bg-red-900 hover:text-white transition shadow-sm"
          type="submit"
          disabled={submitting}
          title="Delete Interview"
        >
          <FiTrash2 size={18} />
        </Button>
      </form>
      <Button
        className="p-2 rounded-full border border-white text-white bg-transparent hover:bg-white hover:text-[#18181b] transition shadow-sm"
        title={feedback && feedback.finalAssessment ? "Check Feedback" : "View Interview"}
      >
        <Link
          href={
            feedback && feedback.finalAssessment
              ? `/interview/${interviewId}/feedback`
              : `/interview/${interviewId}`
          }
          className="w-full h-full flex items-center justify-center"
        >
          <FiEye size={18} />
        </Link>
      </Button>
    </div>
  );
}
