"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Get ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Call backend to create session
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, idToken }),
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
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Handle Firebase auth errors
      let errorMessage = "An unexpected error occurred";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Invalid password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background pattern">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(262,83%,58%)]/10 via-transparent to-[hsl(316,70%,68%)]/10" />
      
      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md p-8">
        {/* Logo with VoxMentor branding */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="w-16 h-16 bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.3)] group-hover:shadow-[0_0_32px_rgba(147,51,234,0.3)] transition-all duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2C13.1 2 14 2.9 14 4V10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19C8.1 19 5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12V10H19M12 22V20H12C8.7 20 6 17.3 6 14H8C8 16.2 9.8 18 12 18C14.2 18 16 16.2 16 14H18C18 17.3 15.3 20 12 20V22H10V24H14V22H12Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-lg">Sign in to continue your journey</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-card/95 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-card-foreground font-medium">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="w-full h-12 px-4 rounded-xl border border-input bg-input text-card-foreground placeholder:text-muted-foreground focus:border-[hsl(262,83%,58%)] focus:ring-2 focus:ring-[hsl(262,83%,58%)]/20 transition-all"
              />
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-card-foreground font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-input bg-input text-card-foreground placeholder:text-muted-foreground focus:border-[hsl(262,83%,58%)] focus:ring-2 focus:ring-[hsl(262,83%,58%)]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground transition-colors"
                  suppressHydrationWarning
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-input bg-input text-[hsl(262,83%,58%)] focus:ring-[hsl(262,83%,58%)]/20"
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground">
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-[hsl(262,83%,58%)] hover:text-[hsl(262,83%,68%)] font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            
            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(316,70%,68%)] hover:from-[hsl(262,83%,68%)] hover:to-[hsl(316,70%,78%)] text-white font-semibold rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_0_32px_rgba(147,51,234,0.3)] transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-4 text-muted-foreground font-medium">OR CONTINUE WITH</span>
            </div>
          </div>
          
          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin("Google")}
              className="h-12 border-2 border-border bg-card hover:bg-accent text-card-foreground font-medium rounded-xl transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin("LinkedIn")}
              className="h-12 border-2 border-border bg-card hover:bg-accent text-card-foreground font-medium rounded-xl transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
            >
              <svg className="mr-2 h-5 w-5" fill="#0077B5" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </Button>
          </div>
          
          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-[hsl(262,83%,58%)] hover:text-[hsl(262,83%,68%)] font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;