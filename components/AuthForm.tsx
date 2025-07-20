"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
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

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Optionally, update the user's display name
        await updateProfile(userCredential.user, { displayName: name });

        // Create user in Firestore via backend API
        await fetch("/api/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            name,
            email,
            password,
          }),
        });

        toast.success("Account created successfully. Please sign in.");
        window.location.href = "/sign-in";
      } else {
        const { email, password } = data;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Get the ID token
        const idToken = await userCredential.user.getIdToken();
        // Call backend to set session cookie
        await fetch("/api/auth/sign-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, idToken }),
          credentials: "include",
        });
        toast.success("Signed in successfully.");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="bg-dark-200 rounded-2xl shadow-2xl ring-2 ring-primary-200/40 p-12 w-full max-w-xl border border-primary-200 mx-auto">
      <div className="flex flex-col items-center mb-10">
        <img src="/logo.svg" alt="PrepWise Logo" width={56} height={56} />
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
            className="w-full py-3 rounded-xl font-bold text-lg text-dark-100 bg-gradient-to-r from-primary-200 to-primary-100 shadow-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-200"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loader border-2 border-t-2 border-t-white border-blue-400 rounded-full w-4 h-4 animate-spin" />
                {isSignIn ? "Signing In..." : "Creating..."}
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