"use client";

import Scene from "@/features/viewer/components/Scene";
import Loader from "@/features/viewer/components/Loader";
import StateLoader from "@/features/viewer/components/StateLoader";
import { getPublicProject } from "@/features/projects/actions";
import { notFound } from "next/navigation";
import { FileQuestion, Smartphone, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PublicViewerPage({ params }: PageProps) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    getPublicProject(id).then(data => {
      if (!data) notFound();
      setProject(data);
    });

    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, [id]);

  if (!project) return null;

  return (
    <div className="relative h-screen w-full bg-black">
      <StateLoader sceneConfig={project.scene_config} />
      
      {/* Header with project name */}
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
        <div className="px-4 py-3 rounded-lg bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 shadow-xl">
          <h2 className="text-lg font-bold text-white">{project.name}</h2>
        </div>
        
        {isMobile && (
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
            size="sm"
          >
            <Smartphone className="size-4" />
            View in AR
          </Button>
        )}
      </div>

      {/* Bottom Right Controls */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-3 items-end">
        <Button
          onClick={toggleFullscreen}
          size="icon"
          className="bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 hover:bg-zinc-800"
          title="Toggle Fullscreen"
        >
          <Maximize className="size-4" />
        </Button>
        <Link href="/" target="_blank">
          <div className="px-3 py-2 rounded-lg bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 shadow-xl hover:border-purple-500/50 transition-colors cursor-pointer">
            <p className="text-xs text-zinc-400">Powered by <span className="text-purple-400 font-semibold">TEELI</span></p>
          </div>
        </Link>
      </div>

      {/* 3D Scene */}
      {project.file_url ? (
        <>
          <Scene fileUrl={project.file_url} readOnly={true} />
          <Loader />
        </>
      ) : (
        <div className="h-full w-full bg-zinc-950 flex items-center justify-center">
          <div className="text-center">
            <div className="size-20 mx-auto mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
              <FileQuestion className="size-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Model Available</h3>
            <p className="text-zinc-400">This project doesn't have a 3D model</p>
          </div>
        </div>
      )}
    </div>
  );
}
