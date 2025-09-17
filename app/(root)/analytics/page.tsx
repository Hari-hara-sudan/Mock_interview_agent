import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import { getAllFeedbacksByInterviewId } from "@/lib/actions/getAllFeedbacksByInterviewId";
import AnalyticsClient from "../../../components/AnalyticsClient";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  const interviews = user?.id ? await getInterviewsByUserId(user.id) : [];

  const interviewsWithFeedbacks = user?.id
    ? await Promise.all(
        (interviews || []).filter(Boolean).map(async (interview) => {
          const feedbacks = await getAllFeedbacksByInterviewId({ interviewId: interview.id, userId: user.id });
          return { ...interview, feedbacks };
        })
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">Visualize your interview and aptitude performance</p>
      </div>
      <AnalyticsClient interviews={JSON.parse(JSON.stringify(interviewsWithFeedbacks))} />
    </div>
  );
}
