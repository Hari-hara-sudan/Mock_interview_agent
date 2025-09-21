import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

export default async function NewInterviewPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await getCurrentUser();
  const sp = (await searchParams) || {};
  const role = typeof sp.role === "string" ? sp.role : "Software Engineer";
  const level = typeof sp.level === "string" ? sp.level : "Mid-level";
  const type = typeof sp.type === "string" ? sp.type : "Technical";
  const techstack = typeof sp.techstack === "string" ? sp.techstack : "React, TypeScript, Node.js";
  const amount = typeof sp.amount === "string" ? sp.amount : "5";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Start a New Interview</h1>
        <p className="text-muted-foreground">Configure and start your AI voice interview</p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur shadow-medium p-4 md:p-6">
        <Agent
          userName={user?.name!}
          userId={user?.id || ""}
          type={type}
          role={role}
          level={level}
          techstack={techstack}
          amount={amount}
        />
      </div>
    </div>
  );
}
