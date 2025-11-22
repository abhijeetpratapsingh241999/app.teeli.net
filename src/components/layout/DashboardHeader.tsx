"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, User, LogOut } from "lucide-react";
import { signOut } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  const pathname = usePathname();
  
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      isLast: index === segments.length - 1,
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-400">Home</span>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="size-4 text-zinc-600" />
              <span className={crumb.isLast ? "text-white font-medium" : "text-zinc-400"}>
                {crumb.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            title="Sign Out"
          >
            <LogOut className="size-5 text-zinc-400" />
          </Button>
          <div className="size-9 rounded-full bg-zinc-800 flex items-center justify-center">
            <User className="size-5 text-zinc-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
