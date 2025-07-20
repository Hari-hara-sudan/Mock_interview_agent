import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import { getAllFeedbacksByInterviewId } from "@/lib/actions/getAllFeedbacksByInterviewId";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const interviews = user?.id ? await getInterviewsByUserId(user.id) : [];

  // Fetch all feedbacks for each interview and attach as feedbacks array
  const interviewsWithFeedbacks = user?.id
    ? await Promise.all(
        (interviews || []).map(async (interview) => {
          const feedbacks = await getAllFeedbacksByInterviewId({ interviewId: interview.id, userId: user.id });
          // Assign a deterministic cover image based on interview id (to avoid hydration mismatch)
          const coverImages = [
            "/adobe.png","/amazon.png","/facebook.png","/hostinger.png","/pinterest.png","/quora.png","/reddit.png","/skype.png","/spotify.png","/telegram.png","/tiktok.png","/yahoo.png"
          ];
          // Use a hash of the interview id for deterministic selection
          let hash = 0;
          for (let i = 0; i < interview.id.length; i++) {
            hash = interview.id.charCodeAt(i) + ((hash << 5) - hash);
          }
          const index = Math.abs(hash) % coverImages.length;
          const coverImage = `/covers${coverImages[index]}`;
          return { ...interview, feedbacks, coverImage };
        })
      )
    : [];

  return (
    <ProfileClient
      user={user ? JSON.parse(JSON.stringify(user)) : null}
      interviews={interviewsWithFeedbacks ? JSON.parse(JSON.stringify(interviewsWithFeedbacks)) : []}
    />
  );
}
