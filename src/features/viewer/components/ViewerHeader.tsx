"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Play, Save, Share2 } from "lucide-react";
import Link from "next/link";
import { useViewerStore } from "../store/useViewerStore";
import { saveProjectState } from "@/features/projects/actions/saveProjectState";
import { uploadThumbnail } from "@/lib/uploadThumbnail";
import { useState } from "react";

interface ViewerHeaderProps {
  projectName: string;
  projectId: string;
}

export default function ViewerHeader({ projectName, projectId }: ViewerHeaderProps) {
  const toggleRenderModal = useViewerStore((state) => state.toggleRenderModal);
  const togglePresentationMode = useViewerStore((state) => state.togglePresentationMode);
  const isPresentationMode = useViewerStore((state) => state.isPresentationMode);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/view/${projectId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("Link copied!");
      setTimeout(() => setShareStatus(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      setShareStatus("Failed to copy");
      setTimeout(() => setShareStatus(null), 2000);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("Saving...");

    try {
      // Capture thumbnail
      const captureFunction = (window as any).captureScreenshot;
      let thumbnailUrl: string | undefined;

      if (captureFunction) {
        const dataUrl = await captureFunction();
        if (dataUrl) {
          // Convert data URL to blob
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          
          // Upload to storage
          const url = await uploadThumbnail(projectId, blob);
          if (url) thumbnailUrl = url;
        }
      }

      // Save config
      const state = useViewerStore.getState();
      const config = {
        environment: state.environmentPreset,
        showGrid: state.gridVisible,
        autoRotate: state.autoRotate,
        showBackground: state.showBackground,
        backgroundColor: state.backgroundColor,
        cameraFov: state.cameraFov,
        isOrthographic: state.isOrthographic,
        environmentRotation: state.environmentRotation,
        lightIntensity: state.lightIntensity,
      };

      const result = await saveProjectState(projectId, config, thumbnailUrl);

      if (result.error) {
        setSaveStatus("Error saving");
      } else {
        setSaveStatus("Project Saved!");
      }
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus("Error saving");
    }

    setIsSaving(false);
    setTimeout(() => setSaveStatus(null), 2000);
  };

  return (
    <div className={`absolute top-6 left-6 right-6 z-10 flex items-center justify-between transition-opacity duration-300 ${
      isPresentationMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="icon"
            className="bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 hover:bg-zinc-800"
          >
            <ArrowLeft className="size-5 text-white" />
          </Button>
        </Link>

        <div className="px-4 py-3 rounded-lg bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 shadow-xl">
          <h2 className="text-lg font-bold text-white">{projectName}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {saveStatus && (
          <div className="px-3 py-2 rounded-lg bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 text-sm text-white">
            {saveStatus}
          </div>
        )}
        {shareStatus && (
          <div className="px-3 py-2 rounded-lg bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 text-sm text-white">
            {shareStatus}
          </div>
        )}

        <Button
          onClick={handleShare}
          className="bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 hover:bg-zinc-800"
          size="icon"
          title="Share Project"
        >
          <Share2 className="size-4" />
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 hover:bg-zinc-800"
          size="icon"
          title="Save Project"
        >
          <Save className="size-4" />
        </Button>
        <Button
          onClick={togglePresentationMode}
          className="bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 hover:bg-zinc-800"
          size="icon"
          title="Enter Presentation Mode"
        >
          <Play className="size-4" />
        </Button>
        <Button
          onClick={toggleRenderModal}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
        >
          <Camera className="size-4" />
          Render
        </Button>
      </div>
    </div>
  );
}
