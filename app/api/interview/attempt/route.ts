import { NextRequest } from "next/server";
import { createUserInterviewAttempt } from "@/lib/server-utils";

export async function POST(req: NextRequest) {
  const { templateId, userId } = await req.json();
  // Ensure userId is a real UID, not a display name
  if (!userId || userId.length < 20) {
    return Response.json({ success: false, error: "Invalid userId. Must be a real UID." });
  }
  try {
    const result = await createUserInterviewAttempt({ templateId, userId });
    return Response.json({ success: true, ...result });
  } catch (error) {
    console.error("Error creating user interview attempt:", error);
    return Response.json({ success: false, error: String(error) });
  }
} 