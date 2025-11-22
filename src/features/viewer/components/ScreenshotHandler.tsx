"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useViewerStore } from "../store/useViewerStore";

export default function ScreenshotHandler() {
  const { gl, scene, camera } = useThree();
  const captureScreenshot = useViewerStore((state) => state.captureScreenshot);

  useEffect(() => {
    if (captureScreenshot) {
      // Render the scene
      gl.render(scene, camera);
      
      // Get canvas data URL
      const dataURL = gl.domElement.toDataURL("image/png");
      
      // Create download link
      const link = document.createElement("a");
      link.download = "render.png";
      link.href = dataURL;
      link.click();
    }
  }, [captureScreenshot, gl, scene, camera]);

  return null;
}
