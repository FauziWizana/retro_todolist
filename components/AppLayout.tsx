"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "./ThemeProvider";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <ThemeProvider>
      {!isAuthPage && (
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      )}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: !isAuthPage && sidebarOpen ? "max(15%, 240px)" : "0",
        }}
      >
        {!isAuthPage && <Header />}
        <main>{children}</main>
      </div>
    </ThemeProvider>
  );
}
