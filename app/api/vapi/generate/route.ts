import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("=== VAPI Generate API Called ===");
  console.log("Request body:", JSON.stringify(body, null, 2));
  
  let { type, role, level, techstack, amount, userId } = body;

  // If userId is not in the body but we have VAPI context, try to extract it
  if (!userId && body.call && body.call.variableValues) {
    userId = body.call.variableValues.userId;
    console.log("📧 Extracted userId from VAPI context:", userId);
  }

  // Additional debugging for VAPI call structure
  if (body.call) {
    console.log("VAPI call structure:", {
      hasVariableValues: !!body.call.variableValues,
      variableValues: body.call.variableValues,
    });
  }

  console.log("✅ Final userId for interview:", userId);

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
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

    // Ensure userId is provided for all interviews - BLOCK if missing
    if (!userId || userId === null || userId === "" || userId === undefined) {
      console.log("❌ BLOCKING: User ID is required but not provided");
      return Response.json({ success: false, error: "User ID is required" }, { status: 400 });
    }
    
    console.log("✅ Creating interview with userId:", userId);
    
    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userId, // Always set the user ID
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      // 🚫 DELIBERATELY NOT SETTING template field - it should never exist!
    };

    console.log("📝 Final interview object (no template field):", {
      ...interview,
      questions: `[${interview.questions.length} questions]`
    });

    const docRef = await db.collection("interviews").add(interview);
    console.log("✅ Interview created successfully with ID:", docRef.id);

    return Response.json({ success: true, interviewId: docRef.id }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}