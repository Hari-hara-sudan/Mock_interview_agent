import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={user?.name!}
        userId={user?.id || ""}
        type="generate"
        role="Software Engineer"
        level="Mid-level"
        techstack="React, TypeScript, Node.js"
        amount="5"
      />
    </>
  );
};

export default Page;
