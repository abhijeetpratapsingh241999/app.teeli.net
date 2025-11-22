"use client";

import { useEffect } from "react";
import { useViewerStore } from "../store/useViewerStore";
import ViewerHeader from "./ViewerHeader";
import Scene from "./Scene";
import ViewerToolbar from "./ViewerToolbar";
import UploadOverlay from "./UploadOverlay";

interface ViewerWrapperProps {
  initialFileUrl?: string | null;
  projectName?: string;
  projectId?: string;
}

export default function ViewerWrapper({ initialFileUrl, projectName = "Untitled Project", projectId = "" }: ViewerWrapperProps) {
  const setFileUrl = useViewerStore((state) => state.setFileUrl);
  const fileUrl = useViewerStore((state) => state.fileUrl);

  useEffect(() => {
    if (initialFileUrl) {
      setFileUrl(initialFileUrl);
    }
  }, [initialFileUrl, setFileUrl]);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950">
      <ViewerHeader projectName={projectName} projectId={projectId} />
      <div className="absolute inset-0">
        {fileUrl ? <Scene fileUrl={fileUrl} /> : <UploadOverlay />}
      </div>
      <ViewerToolbar />
    </div>
  );
}
