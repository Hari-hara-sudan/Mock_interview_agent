import NavBar from "@/components/NavBar";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="root-layout min-h-screen flex flex-col">
      <NavBar path="" />
      <main className="flex-1">{children}</main>
      
      {/* Footer */}
      <footer className="mt-12 py-8 text-center text-xs text-gray-500 border-t border-[#161616] bg-[#0a0a0a]">
        <p>&copy; {new Date().getFullYear()} BlueBoard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
