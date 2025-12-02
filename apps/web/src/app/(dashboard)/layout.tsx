import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-linear-to-br from-[#f0f4f8] via-[#e8f0f8] to-[#e0ecf8] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <Header />
      <Sidebar />
      <MobileNav />
      
      {/* Main Content Area */}
      <main className="h-full overflow-hidden pl-4 md:pl-28 pr-4">
        {children}
      </main>
    </div>
  );
}
