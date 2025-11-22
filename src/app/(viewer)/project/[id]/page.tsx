import ViewerContent from "@/features/viewer/components/ViewerContent";
import ViewerHeader from "@/features/viewer/components/ViewerHeader";
import StateLoader from "@/features/viewer/components/StateLoader";
import ExitPresentationButton from "@/features/viewer/components/ExitPresentationButton";
import CollaborationPanel from "@/features/viewer/components/CollaborationPanel";
import KeyboardShortcuts from "@/features/viewer/components/KeyboardShortcuts";
import UnsupportedFormat from "@/features/viewer/components/UnsupportedFormat";
import { getProjectById } from "@/features/projects/actions";

import { notFound } from "next/navigation";
import { FileQuestion } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectViewerPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="relative h-screen w-full">
      <StateLoader sceneConfig={project.scene_config} />
      <ViewerHeader projectName={project.name} projectId={project.id} />
      <CollaborationPanel projectId={project.id} />
      <ExitPresentationButton />
      <KeyboardShortcuts />

      {/* 3D Scene or No Model Message */}
      {project.file_url ? (
        (() => {
          // Track project view
          if (typeof window !== 'undefined') {
            import('@/lib/analytics/useAnalytics').then(({ useAnalytics }) => {
              const { trackProjectView } = useAnalytics();
              trackProjectView(project.id);
            });
          }
          
          const fileExtension = project.file_url.split('.').pop()?.toLowerCase();
          if (fileExtension !== 'gltf' && fileExtension !== 'glb') {
            return <UnsupportedFormat fileUrl={project.file_url} />;
          }
          return <ViewerContent fileUrl={project.file_url} projectId={project.id} />;
        })()
      ) : (
        <div className="h-full w-full bg-zinc-950 flex items-center justify-center">
          <div className="text-center">
            <div className="size-20 mx-auto mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
              <FileQuestion className="size-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Model Uploaded</h3>
            <p className="text-zinc-400">This project doesn't have a 3D model yet</p>
          </div>
        </div>
      )}
    </div>
  );
}
