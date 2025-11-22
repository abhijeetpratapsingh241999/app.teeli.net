import ProjectGrid from "@/features/projects/components/ProjectGrid";
import CreateProjectModal from "@/features/projects/components/CreateProjectModal";
import { FolderOpen, BarChart3 } from "lucide-react";
import { getUserProjects } from "@/features/projects/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PerformanceReportDemo from "@/features/viewer/components/PerformanceReportDemo";
import CarbonFootprintDemo from "@/features/viewer/components/CarbonFootprintDemo";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const projects = await getUserProjects();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-zinc-400">Continue working on your projects</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
        <div className="flex items-center gap-3">
          <Link href="/analytics">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="size-4" />
              Analytics
            </Button>
          </Link>
          <PerformanceReportDemo />
          <CarbonFootprintDemo />
          <CreateProjectModal />
        </div>
      </div>

      {projects.length > 0 ? (
        <ProjectGrid projects={projects} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-20 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
            <FolderOpen className="size-10 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-zinc-400 mb-6 max-w-md">
            Get started by creating your first 3D rendering project
          </p>
          <CreateProjectModal />
        </div>
      )}
    </div>
  );
}
