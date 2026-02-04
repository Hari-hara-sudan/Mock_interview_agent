"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Step 2: Professional Background
    currentRole: "",
    experienceLevel: "",
    techStack: "",
    
    // Step 3: Interview Goals
    interviewGoals: "",
    preferredTopics: "",
    availableTime: "",
  });
  const router = useRouter();

  const totalSteps = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
          toast.error("Please fill in all required fields");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return false;
        }
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return false;
        }
        return true;
      case 2:
        if (!formData.currentRole || !formData.experienceLevel || !formData.techStack) {
          toast.error("Please fill in all professional background fields");
          return false;
        }
        return true;
      case 3:
        if (!formData.interviewGoals || !formData.preferredTopics || !formData.availableTime) {
          toast.error("Please fill in all interview goal fields");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Update display name
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await updateProfile(userCredential.user, { displayName: fullName });

      // Create user in Firestore via backend API
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          name: fullName,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          currentRole: formData.currentRole,
          experienceLevel: formData.experienceLevel,
          techStack: formData.techStack,
          interviewGoals: formData.interviewGoals,
          preferredTopics: formData.preferredTopics,
          availableTime: formData.availableTime,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("Account created successfully!");
        router.push("/sign-in");
      } else {
        throw new Error(result.message || "Failed to create account");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      // Handle Firebase auth errors
      let errorMessage = "An unexpected error occurred";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  required
                  className="border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  required
                  className="border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  required
                  className="border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                  className="border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentRole" className="text-white">Current Role</Label>
              <Input
                id="currentRole"
                name="currentRole"
                type="text"
                value={formData.currentRole}
                onChange={handleInputChange}
                placeholder="e.g., Software Engineer, Product Manager"
                required
                className="border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experienceLevel" className="text-white">Experience Level</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) => handleSelectChange("experienceLevel", value)}
              >
                <SelectTrigger className="border-white/20 bg-white/5 text-white focus:border-purple-500 focus:ring-purple-500/20">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="entry" className="text-white focus:bg-white/10">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid" className="text-white focus:bg-white/10">Mid Level (2-5 years)</SelectItem>
                  <SelectItem value="senior" className="text-white focus:bg-white/10">Senior Level (5-8 years)</SelectItem>
                  <SelectItem value="lead" className="text-white focus:bg-white/10">Lead/Principal (8+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="techStack" className="text-white">Primary Tech Stack</Label>
              <Input
                id="techStack"
                name="techStack"
                type="text"
                value={formData.techStack}
                onChange={handleInputChange}
                placeholder="e.g., React, Node.js, Python, Java"
                required
                className="border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interviewGoals" className="text-white">Interview Goals</Label>
              <Select
                value={formData.interviewGoals}
                onValueChange={(value) => handleSelectChange("interviewGoals", value)}
              >
                <SelectTrigger className="border-white/20 bg-white/5 text-white focus:border-purple-500 focus:ring-purple-500/20">
                  <SelectValue placeholder="What's your main goal?" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="job-search" className="text-white focus:bg-white/10">Active Job Search</SelectItem>
                  <SelectItem value="skill-improvement" className="text-white focus:bg-white/10">Skill Improvement</SelectItem>
                  <SelectItem value="career-growth" className="text-white focus:bg-white/10">Career Growth</SelectItem>
                  <SelectItem value="practice" className="text-white focus:bg-white/10">General Practice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferredTopics" className="text-white">Preferred Interview Topics</Label>
              <Input
                id="preferredTopics"
                name="preferredTopics"
                type="text"
                value={formData.preferredTopics}
                onChange={handleInputChange}
                placeholder="e.g., System Design, Algorithms, Behavioral"
                required
                className="border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="availableTime" className="text-white">Available Practice Time</Label>
              <Select
                value={formData.availableTime}
                onValueChange={(value) => handleSelectChange("availableTime", value)}
              >
                <SelectTrigger className="border-white/20 bg-white/5 text-white focus:border-purple-500 focus:ring-purple-500/20">
                  <SelectValue placeholder="How much time can you dedicate?" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="1-2-hours" className="text-white focus:bg-white/10">1-2 hours per week</SelectItem>
                  <SelectItem value="3-5-hours" className="text-white focus:bg-white/10">3-5 hours per week</SelectItem>
                  <SelectItem value="5-10-hours" className="text-white focus:bg-white/10">5-10 hours per week</SelectItem>
                  <SelectItem value="10-hours" className="text-white focus:bg-white/10">10+ hours per week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
              <Image 
                src="/logo.svg" 
                alt="Logo" 
                width={48} 
                height={48}
                className="text-white"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Create your account
            </CardTitle>
            <CardDescription className="text-gray-400">
              Step {currentStep} of {totalSteps}: {
                currentStep === 1 ? "Personal Information" :
                currentStep === 2 ? "Professional Background" :
                "Interview Goals"
              }
            </CardDescription>
            
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
              {renderStepContent()}
              
              <div className="flex justify-between space-x-3">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`${currentStep === 1 ? 'w-full' : 'flex-1'} bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2.5`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : currentStep === totalSteps ? (
                    "Create Account"
                  ) : (
                    <>
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            {currentStep === 1 && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-gray-400">Or continue with</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin("Google")}
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin("LinkedIn")}
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Sign in
              </Link>
            </div>
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Page;