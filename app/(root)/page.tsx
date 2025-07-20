import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { interviewCovers } from "@/constants";
import { getAllFeedbacksByInterviewId } from "@/lib/actions/getAllFeedbacksByInterviewId";
import { redirect } from "next/navigation";

async function Home() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    redirect("/sign-in");
  }

  let userInterviews: any[] = [];
  let allInterview: any[] = [];
  if (user && user.id) {
    userInterviews = (await getInterviewsByUserId(user.id)) as any[] || [];
    allInterview = (await getLatestInterviews({ userId: user.id })) as any[] || [];
  }

  // Fetch feedbacks for each user interview
  const userInterviewsWithFeedback = userInterviews
    ? await Promise.all(
        userInterviews.map(async (interview) => {
          const feedbacks = await getAllFeedbacksByInterviewId({
            interviewId: interview.id,
            userId: user.id,
          });
          return { ...interview, feedback: feedbacks[0] || null };
        })
      )
    : [];

  const hasPastInterviews = userInterviewsWithFeedback.length > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  // Assign deterministic cover images
  const getCoverImage = (id: string, idx: number) =>
    interviewCovers[
      (parseInt(id.replace(/\D/g, "")) + idx) % interviewCovers.length
    ] || "/default-cover.png";

  return (
    <>
      <section className="w-full flex flex-col md:flex-row items-center justify-between gap-10 px-6 py-16 md:py-24 bg-[#18181b] rounded-3xl shadow-2xl mb-12 border-b border-[#232323]">
        <div className="flex flex-col gap-6 max-w-xl z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Get Interview-Ready with AI-Powered Practice & Feedback
          </h1>
          <p className="text-lg md:text-2xl text-[#e0e7ef] font-medium">
            Practice real interview questions & get instant feedback
          </p>
          <div className="flex gap-4 mt-4">
            <Button asChild className="bg-[#0a0a0a] border border-white text-white px-8 py-4 text-xl font-bold rounded-2xl shadow-lg hover:bg-[#232323] hover:border-[#e0e7ef] transition">
              <Link href="/interview">Start an Interview</Link>
            </Button>
          </div>
        </div>
        <div className="z-0 hidden md:block">
          <img src="/robot.png" alt="AI Interview Robot" width={340} height={340} className="drop-shadow-2xl animate-fadeIn" />
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviewsWithFeedback?.map((interview, idx) => (
              <InterviewCard
                key={interview.id}
                userId={user.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                coverImage={getCoverImage(interview.id, idx)}
                feedback={interview.feedback}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview, idx) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                coverImage={getCoverImage(interview.id, idx)}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
