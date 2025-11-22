"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Loader2, Sparkles } from "lucide-react";
import { useRenderStore } from "../store/useRenderStore";
import { submitRenderJob } from "../actions/submitRenderJob";
import { useViewerStore } from "../store/useViewerStore";

export default function RenderDialog() {
  const [open, setOpen] = useState(false);
  const [resolution, setResolution] = useState("1080p");
  const [engine, setEngine] = useState("standard");
  const [format, setFormat] = useState("png");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const addToQueue = useRenderStore((state) => state.addToQueue);
  const updateStatus = useRenderStore((state) => state.updateStatus);
  const environmentPreset = useViewerStore((state) => state.environmentPreset);
  const gridVisible = useViewerStore((state) => state.gridVisible);
  const autoRotate = useViewerStore((state) => state.autoRotate);

  const handleStartRender = async () => {
    setIsSubmitting(true);
    setMessage("");

    // Add to local queue
    const jobId = addToQueue({
      resolution,
      engine,
      format,
      status: "pending",
    });

    try {
      // Submit to cloud (mock)
      const result = await submitRenderJob({
        resolution,
        engine,
        format,
        cameraPosition: { x: 0, y: 0, z: 5 },
        sceneSettings: {
          environment: environmentPreset,
          gridVisible,
          autoRotate,
        },
      });

      if (result.success) {
        updateStatus(jobId, "processing");
        setMessage(`✅ ${result.message}. Estimated time: ${result.estimatedTime}`);
        
        // Simulate completion after delay
        setTimeout(() => {
          updateStatus(jobId, "completed");
        }, 5000);
      } else {
        updateStatus(jobId, "failed");
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      updateStatus(jobId, "failed");
      setMessage("❌ Failed to submit render job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Camera className="size-4" />
          Render Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cloud Render Manager</DialogTitle>
          <DialogDescription>
            Configure your render settings and submit to cloud GPU processing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Resolution */}
          <div className="space-y-2">
            <Label htmlFor="resolution">Resolution</Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger id="resolution">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1080p">1080p (1920x1080)</SelectItem>
                <SelectItem value="4k">4K (3840x2160)</SelectItem>
                <SelectItem value="8k">8K (7680x4320)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Engine */}
          <div className="space-y-2">
            <Label htmlFor="engine">Render Engine</Label>
            <Select value={engine} onValueChange={setEngine}>
              <SelectTrigger id="engine">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (WebGPU)</SelectItem>
                <SelectItem value="cloud-cycles" disabled>
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3" />
                    Cloud Ray-Tracing (Cycles) - Beta
                  </div>
                </SelectItem>
                <SelectItem value="cloud-unreal" disabled>
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3" />
                    Cloud Ray-Tracing (Unreal) - Coming Soon
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <Label htmlFor="format">Output Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (Lossless)</SelectItem>
                <SelectItem value="jpg">JPG (Compressed)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          {message && (
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300">
              {message}
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleStartRender}
            disabled={isSubmitting}
            className="w-full gap-2"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting to Cloud...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Start Cloud Render
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
