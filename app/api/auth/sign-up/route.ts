import { signUp } from "@/lib/actions/auth.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { uid, name, email } = await req.json();
    
    if (!uid || !name || !email) {
      return NextResponse.json(
        { success: false, message: "UID, name, and email are required" },
        { status: 400 }
      );
    }
    
    const result = await signUp({ uid, name, email });
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Sign-up API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
