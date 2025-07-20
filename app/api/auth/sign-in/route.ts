import { signIn } from "@/lib/actions/auth.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, idToken } = await req.json();
  await signIn({ email, idToken });
  // The signIn function sets the session cookie via server actions/cookies API
  return NextResponse.json({ success: true });
} 