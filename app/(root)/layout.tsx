import Header from "@/components/vox/layout/HeaderWrapper";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      
      {/* Footer */}
      <footer className="mt-12 py-8 text-center text-xs text-muted-foreground border-t border-border/50 bg-background">
        <p>&copy; {new Date().getFullYear()} BlueBoard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
