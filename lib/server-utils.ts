// Server-only utilities for interview management

// Create a new interview template (admin/system)
export async function createInterviewTemplate({ role, level, type, techstack, questions }: { role: string; level: string; type: string; techstack: string[]; questions: string[] }) {
  const interview = {
    role,
    level,
    type,
    techstack,
    questions,
    createdAt: new Date().toISOString(),
    finalized: false,
    template: true,
    userId: null,
  };
  const db = (await import("@/firebase/admin")).db;
  const docRef = await db.collection("interviews").add(interview);
  return { id: docRef.id, ...interview };
}

// Create a user-specific interview attempt (when a user takes an interview)
export async function createUserInterviewAttempt({ templateId, userId }: { templateId: string; userId: string }) {
  const db = (await import("@/firebase/admin")).db;
  const templateDoc = await db.collection("interviews").doc(templateId).get();
  if (!templateDoc.exists) throw new Error("Template not found");
  const template = templateDoc.data();
  // Remove id if present (for safety, but only if it exists)
  if (template && 'id' in template) delete template.id;
  const interview = {
    ...template,
    template: false,
    userId,
    createdAt: new Date().toISOString(),
    finalized: false,
  };
  const docRef = await db.collection("interviews").add(interview);
  return { id: docRef.id, ...interview };
} 