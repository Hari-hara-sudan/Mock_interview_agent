"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { User, SignUpParams, SignInParams } from "@/types/index";
import { redirect } from "next/navigation";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  try {
    const cookieStore = await cookies();

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION * 1000, // milliseconds
    });

    // Set cookie in the browser
    cookieStore.set("session", sessionCookie, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return { success: true };
  } catch (error) {
    console.error("Error setting session cookie:", error);
    return { success: false };
  }
}

// Sign up user
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

// Sign in user and set session
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    // Verify the ID token and get user info
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Check if user exists in database
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return {
        success: false,
        message: "User not found. Please create an account first.",
      };
    }

    // Set session cookie
    const result = await setSessionCookie(idToken);
    
    if (result.success) {
      return {
        success: true,
        message: "Signed in successfully",
        user: {
          id: decodedToken.uid,
          email: decodedToken.email,
          ...userDoc.data(),
        },
      };
    } else {
      return {
        success: false,
        message: "Failed to create session",
      };
    }
  } catch (error: any) {
    console.error("Sign in error:", error);
    return {
      success: false,
      message: "Failed to sign in. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false };
  }
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    
    if (!sessionCookie) {
      return null;
    }

    // Verify session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Get user info from database
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
      
    if (!userRecord.exists) {
      return null;
    }

    return {
      id: userRecord.id,
      ...userRecord.data(),
    } as User;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    console.error("Authentication check error:", error);
    return false;
  }
}
