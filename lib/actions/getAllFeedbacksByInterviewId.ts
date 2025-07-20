import { db } from "@/firebase/admin";

export async function getAllFeedbacksByInterviewId({ interviewId, userId }: { interviewId: string, userId: string }) {
  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .get();
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
