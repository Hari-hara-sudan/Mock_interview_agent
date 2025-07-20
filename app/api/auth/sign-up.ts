import { signUp } from "@/lib/actions/auth.action";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { uid, name, email, password } = await req.json();
    if (!uid || !name || !email || !password) {
      return Response.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }
    const result = await signUp({ uid, name, email, password });
    return Response.json(result);
  } catch (error) {
    return Response.json({ success: false, message: "Server error." }, { status: 500 });
  }
} 