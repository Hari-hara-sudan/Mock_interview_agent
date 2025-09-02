"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import CustomFormField from "./FormField";
import { FormType } from "@/types";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      if (type === "sign-up") {
        // Sign up flow
        const { name, email, password } = data;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        
        // Update display name
        await updateProfile(userCredential.user, { displayName: name });

        // Create user in Firestore via backend API
        const response = await fetch("/api/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            name,
            email,
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          toast.success("Account created successfully!");
          router.push("/sign-in");
        } else {
          throw new Error(result.message || "Failed to create account");
        }
      } else {
        // Sign in flow
        const { email, password } = data;
        
        // Authenticate with Firebase
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        
        // Get ID token
        const idToken = await userCredential.user.getIdToken();
        
        // Call backend to create session
        const response = await fetch("/api/auth/sign-in", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, idToken }),
          credentials: "include",
        });
        
        const result = await response.json();
        
        if (result.success) {
          toast.success("Welcome back!");
          // Force a page reload to ensure session is properly set
          window.location.href = "/";
        } else {
          throw new Error(result.message || "Sign in failed");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Handle Firebase auth errors
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="bg-dark-200 rounded-2xl shadow-2xl ring-2 ring-primary-200/40 p-12 w-full max-w-xl border border-primary-200 mx-auto">
      <div className="flex flex-col items-center mb-10">
        <img src="/logo.svg" alt="VoxMentor Logo" width={56} height={56} />
        <h2 className="text-4xl font-extrabold mt-4 text-primary-200 tracking-tight">
          {isSignIn ? "Sign In" : "Create Account"}
        </h2>
        <p className="text-primary-100 text-lg mt-2">
          {isSignIn ? "Welcome back!" : "Start your interview journey."}
        </p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {!isSignIn && (
            <div className="relative mb-4">
              <CustomFormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
                inputClassName="rounded-xl h-14 text-base"
                labelClassName="text-light-100 font-semibold mb-1"
                icon={FiUser}
              />
            </div>
            )}
          <div className="relative mb-4">
            <CustomFormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
              inputClassName="rounded-xl h-14 text-base"
              labelClassName="text-light-100 font-semibold mb-1"
              icon={FiMail}
            />
          </div>
          <div className="relative mb-6">
            <CustomFormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              inputClassName="rounded-xl h-14 text-base pr-14"
              labelClassName="text-light-100 font-semibold mb-1"
              icon={FiLock}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-100 focus:outline-none"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff className="w-6 h-6" /> : <FiEye className="w-6 h-6" />}
            </button>
          </div>
          <button
            className="w-full py-3 rounded-xl font-bold text-lg text-dark-100 bg-gradient-to-r from-primary-200 to-primary-100 shadow-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loader border-2 border-t-2 border-t-white border-blue-400 rounded-full w-4 h-4 animate-spin" />
                {isSignIn ? "Signing In..." : "Creating Account..."}
              </span>
            ) : isSignIn ? "Sign In" : "Create Account"}
          </button>
          </form>
        </Form>
      <div className="text-center mt-8">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="text-primary-200 font-semibold ml-1 hover:underline"
          >
          {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
      </div>
    </div>
  );
};

export default AuthForm;