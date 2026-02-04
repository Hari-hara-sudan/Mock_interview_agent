import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { interviewId, userId, transcript, feedbackId } = await req.json();
  // Dynamically import server-only modules
  const { generateObject } = await import("ai");
  const { google } = await import("@ai-sdk/google");
  const { db } = await import("@/firebase/admin");
  const { feedbackSchema } = await import("@/constants");

  try {
    const formattedTranscript = transcript
      .map((sentence: { role: string; content: string }) => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");

      const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", { structuredOutputs: false }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        
        IMPORTANT - Question & Answer Analysis:
        For each question the interviewer asked in the transcript:
        1. Extract the exact question that was asked
        2. Extract what the candidate actually answered (userAnswer)
        3. Provide the IDEAL/MODEL answer - what a perfect candidate should have said (modelAnswer). Make it comprehensive, professional, and educational.
        4. Give specific feedback comparing the user's answer to the ideal answer
        5. Score the individual answer from 0-100
        
        The model answers should be detailed, professional responses that the user can learn from. Include:
        - Key points that should be covered
        - Best practices and industry standards
        - Example phrases or structures to use
        - Why certain approaches work better
        
        This helps the candidate learn how to answer similar questions in real interviews.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories and provide educational model answers for each question to help the candidate learn and improve.",
    });    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      questionsAndAnswers: object.questionsAndAnswers || [],
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;
    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }
    await feedbackRef.set(feedback);

    return Response.json({ success: true, feedbackId: feedbackRef.id });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return Response.json({ success: false });
  }
} 