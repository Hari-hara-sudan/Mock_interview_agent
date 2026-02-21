import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getUidFromAuthHeader } from "@/lib/serverAuth";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  // Strict Authorization header check with debugging
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  console.log("[DEBUG] Authorization header received:", authHeader);
  console.log("[DEBUG] Expected VAPI_TOOL_SECRET:", process.env.VAPI_TOOL_SECRET);
  if (!authHeader || authHeader !== `Bearer ${process.env.VAPI_TOOL_SECRET}`) {
    console.log("[DEBUG] Authorization failed. Returning 401.");
    return new Response("Unauthorized", { status: 401 });
  }

  // ...existing code...
  console.log("=== VAPI Generate API Called ===");
  const authedUid = await getUidFromAuthHeader(request);
  if (authedUid) console.log("Authenticated UID from header:", authedUid);

  const body = await request.json();
  console.log("Request body:", JSON.stringify(body, null, 2));
  
  let { type, role, level, techstack, amount, userId } = body;

  // If userId is not in the body but we have VAPI context, try to extract it
  if (!userId && body.call && body.call.variableValues) {
    userId = body.call.variableValues.userId;
    console.log("📧 Extracted userId from VAPI context:", userId);
  }

  // Prefer the authenticated UID from the Authorization header if present
  if (!userId && authedUid) {
    userId = authedUid;
    console.log("Using authenticated UID as userId:", userId);
  }

  // Additional debugging for VAPI call structure
  if (body.call) {
    console.log("VAPI call structure:", {
      hasVariableValues: !!body.call.variableValues,
      variableValues: body.call.variableValues,
    });
  }

  console.log("✅ Final userId for interview:", userId);

  // Block if any required field is missing
  if (!type || !role || !level || !techstack || !amount || !userId) {
    return Response.json({ success: false, error: "Missing required interview details." }, { status: 400 });
  }

  try {
    const { text: questions } = await generateText({
      model: google("gemini-3-flash-preview"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });
    console.log("✅ Gemini working: Questions generated successfully");

    // Ensure userId is provided for all interviews - BLOCK if missing
    if (!userId || userId === null || userId === "" || userId === undefined) {
      console.log("❌ BLOCKING: User ID is required but not provided");
      return Response.json({ success: false, error: "User ID is required" }, { status: 400 });
    }
    
    console.log("✅ Creating interview with userId:", userId);
    
    const interview = {
      role,
      type,
      level,
      techstack,
      questions,
      coverImage: getRandomInterviewCover(),
      userId,
      createdAt: new Date().toISOString(),
      finalized: true,
    };

    // Remove template field if present
    if (interview && 'template' in interview) delete interview.template;
    console.log("📝 Final interview object (no template field):", interview);

    const docRef = await db.collection("interviews").add(interview);
    console.log("✅ Interview created successfully with ID:", docRef.id);
    return Response.json({ success: true, interviewId: docRef.id, ...interview });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}