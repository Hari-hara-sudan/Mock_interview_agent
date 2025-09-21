import { NextRequest } from "next/server";
import { db } from "@/firebase/admin";

export async function POST(req: NextRequest) {
  const { interviewId, userId } = await req.json();
  // Ensure userId is a real UID, not a display name
  if (!userId || userId.length < 20) {
    return Response.json({ success: false, error: "Invalid userId. Must be a real UID." });
  }
  try {
    // Get the existing interview to duplicate
    const interviewDoc = await db.collection("interviews").doc(interviewId).get();
    if (!interviewDoc.exists) {
      return Response.json({ success: false, error: "Interview not found" });
    }
    
    const originalInterview = interviewDoc.data();
    
    // Create a new interview for the user
    const newInterview = {
      ...originalInterview,
      userId,
      createdAt: new Date().toISOString(),
      finalized: false,
    };
    
    // Remove id if present (for safety)
    if (newInterview && 'id' in newInterview) delete newInterview.id;
    
    const docRef = await db.collection("interviews").add(newInterview);
    return Response.json({ success: true, id: docRef.id, ...newInterview });
  } catch (error) {
    console.error("Error creating interview attempt:", error);
    return Response.json({ success: false, error: String(error) });
  }
} 