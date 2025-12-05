"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSettingsPage = pathname === "/settings";
  const isRendersPage = pathname === "/renders";
  const isProjectsPage = pathname === "/projects";
  const useBlackGradient = isSettingsPage || isRendersPage || isProjectsPage;

  return (
    <div className={`h-screen overflow-hidden transition-colors duration-300 ${
      useBlackGradient 
        ? "bg-linear-to-br from-[#f0f4f8] via-[#e8f0f8] to-[#e0ecf8] dark:bg-[radial-gradient(ellipse_at_top,_#1a1a2e_0%,_#000000_50%,_#000000_100%)]" 
        : "bg-linear-to-br from-[#f0f4f8] via-[#e8f0f8] to-[#e0ecf8] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    }`}>
      <Header />
      <Sidebar />
      <MobileNav />
      
      {/* Main Content Area - No padding on mobile, gradual padding for tablets/desktop */}
      <main className="h-full overflow-hidden sm:pl-0 md:pl-20 lg:pl-28 md:pr-2 lg:pr-4">
        {children}
      </main>
    </div>
  );
}
