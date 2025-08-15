import NavBar from "@/components/NavBar";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  // Determine current path for active link styling
  // In Next 13+/app we can access headers directly; ensure we unwrap the async if needed
  const hdrs = headers();
  const path = (hdrs as any).get?.("x-pathname") || ""; // some environments may not set this header
  // Links now handled inside NavBar component

  return (
    <div className="root-layout min-h-screen flex flex-col">
      <NavBar path={path} />
      <main className="flex-1">{children}</main>
      
      {/* Footer */}
      <footer className="mt-12 py-8 text-center text-xs text-gray-500 border-t border-[#161616] bg-[#0a0a0a]">
        <p>&copy; {new Date().getFullYear()} BlueBoard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
