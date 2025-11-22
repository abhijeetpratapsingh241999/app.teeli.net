"use client";

import Scene from "./Scene";
import Loader from "./Loader";
import ViewerToolbar from "./ViewerToolbar";
import ViewerInspector from "./ViewerInspector";
import SceneGraph from "./SceneGraph";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ClientOnly from "@/components/ClientOnly";
import { useState } from "react";
import * as THREE from "three";

interface ViewerContentProps {
  fileUrl: string;
  projectId?: string;
}

export default function ViewerContent({ fileUrl, projectId }: ViewerContentProps) {
  const [scene, setScene] = useState<THREE.Group | null>(null)
  return (
    <ErrorBoundary>
      <ClientOnly fallback={<div className="h-full w-full bg-zinc-950 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
        <Scene fileUrl={fileUrl} />
        <Loader />
        <ViewerToolbar scene={scene} fileUrl={fileUrl} projectId={projectId} />
        <SceneGraph />
        <ViewerInspector />
      </ClientOnly>
    </ErrorBoundary>
  );
}
