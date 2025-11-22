"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useViewerStore } from "../store/useViewerStore";

interface RenderModalProps {
  onCapture: (resolution: "1080p" | "4K", format: "PNG" | "JPG") => void;
}

export default function RenderModal({ onCapture }: RenderModalProps) {
  const isOpen = useViewerStore((state) => state.isRenderModalOpen);
  const toggleModal = useViewerStore((state) => state.toggleRenderModal);

  const [resolution, setResolution] = useState<"1080p" | "4K">("1080p");
  const [format, setFormat] = useState<"PNG" | "JPG">("PNG");

  const handleDownload = () => {
    onCapture(resolution, format);
    toggleModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Export Visualization</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Download a high-quality screenshot of your current view
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Resolution */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-white">Resolution</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setResolution("1080p")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  resolution === "1080p"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="text-sm font-semibold text-white">1080p (HD)</div>
                <div className="text-xs text-zinc-400 mt-1">1920 × 1080</div>
              </button>
              <button
                onClick={() => setResolution("4K")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  resolution === "4K"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="text-sm font-semibold text-white">4K (Ultra HD)</div>
                <div className="text-xs text-zinc-400 mt-1">3840 × 2160</div>
              </button>
            </div>
          </div>

          {/* Format */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-white">Format</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat("PNG")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  format === "PNG"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="text-sm font-semibold text-white">PNG</div>
                <div className="text-xs text-zinc-400 mt-1">Lossless</div>
              </button>
              <button
                onClick={() => setFormat("JPG")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  format === "JPG"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="text-sm font-semibold text-white">JPG</div>
                <div className="text-xs text-zinc-400 mt-1">Compressed</div>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
            <p className="text-xs text-zinc-400">
              ✨ Cinematic effects will be preserved in the export
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button variant="outline" onClick={toggleModal}>
            Cancel
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="size-4" />
            Download Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
