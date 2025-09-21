import AuthForm from "@/components/AuthForm";
import Link from "next/link";

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

const Page = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gradient">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to continue your journey</p>
      </div>
      <AuthForm type="sign-in" />
      <div className="mt-4 text-center">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">Back to home</Link>
      </div>
    </div>
  );
};

export default Page;