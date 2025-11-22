"use client";

import RenderModal from "./RenderModal";

export default function RenderModalWrapper() {
  const handleCapture = (resolution: "1080p" | "4K", format: "PNG" | "JPG") => {
    // Access the capture function from window (set by ScreenshotManager inside Canvas)
    if ((window as any).__captureImage) {
      (window as any).__captureImage(resolution, format);
    }
  };

  return <RenderModal onCapture={handleCapture} />;
}
