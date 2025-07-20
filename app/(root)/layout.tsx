import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="w-full px-6 py-4 bg-[#0a0a0a] border-b border-[#232323] flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="BlueBoard Logo" width={38} height={32} />
          <h2 className="text-white font-bold text-2xl tracking-wide">BlueBoard</h2>
        </Link>
        <div className="ml-auto">
          <Link href="/profile">
            <button className="rounded-full border border-[#232323] bg-[#0a0a0a] px-4 py-2 shadow hover:bg-[#232323] transition font-semibold text-white">
              Profile
            </button>
          </Link>
        </div>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
