import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getCurrentUser();

  // Check for existing finalized interview with questions
  if (user?.id) {
    const interviews = await getInterviewsByUserId(user.id);
    const readyInterview = interviews?.find(
      (i) => i.finalized === true && Array.isArray(i.questions) && i.questions.length > 0
    );
    if (readyInterview) {
      redirect(`/interview/${readyInterview.id}`);
      return null; // Prevent Agent from mounting
    }
  }

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={user?.name!}
        userId={user?.id || ""}
        type="generate"
        role=""
        level=""
        techstack=""
        amount=""
      />
    </>
  );
};

export default Page;
