// Server-only utilities for interview management

// Create a new interview for a user
export async function createUserInterview({ role, level, type, techstack, questions, userId }: { 
  role: string; 
  level: string; 
  type: string; 
  techstack: string[]; 
  questions: string[]; 
  userId: string; 
}) {
  if (!userId) {
    throw new Error("User ID is required for interview creation");
  }
  
  const interview = {
    role,
    level,
    type,
    techstack,
    questions,
    userId,
    createdAt: new Date().toISOString(),
    finalized: false,
  };
  const db = (await import("@/firebase/admin")).db;
  const docRef = await db.collection("interviews").add(interview);
  return { id: docRef.id, ...interview };
} 