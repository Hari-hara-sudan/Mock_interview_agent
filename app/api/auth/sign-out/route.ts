import { signOut } from "@/lib/actions/auth.action";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await signOut();
    
    if (result.success) {
      return NextResponse.json({ success: true, message: "Signed out successfully" });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to sign out" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Sign-out API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
