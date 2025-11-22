"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useViewerStore } from "../store/useViewerStore";

export default function ExitPresentationButton() {
  const isPresentationMode = useViewerStore((state) => state.isPresentationMode);
  const togglePresentationMode = useViewerStore((state) => state.togglePresentationMode);

  if (!isPresentationMode) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <Button
        onClick={togglePresentationMode}
        className="bg-zinc-900/90 backdrop-blur-lg border border-zinc-700 hover:bg-zinc-800 gap-2 shadow-2xl"
        size="lg"
      >
        <X className="size-4" />
        Exit Presentation
      </Button>
    </div>
  );
}
