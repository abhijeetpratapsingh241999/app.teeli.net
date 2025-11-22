"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useViewerStore } from "../store/useViewerStore";

export default function ScreenshotManager() {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    // Store capture function for RenderModal
    (window as any).__captureImage = (resolution: "1080p" | "4K", format: "PNG" | "JPG") => {
      const RESOLUTIONS = {
        "1080p": { width: 1920, height: 1080 },
        "4K": { width: 3840, height: 2160 },
      };
      
      const { width, height } = RESOLUTIONS[resolution];
      const originalWidth = gl.domElement.width;
      const originalHeight = gl.domElement.height;

      gl.setSize(width, height, false);
      if ("aspect" in camera) {
        (camera as any).aspect = width / height;
        (camera as any).updateProjectionMatrix();
      }

      gl.render(scene, camera);
      const mimeType = format === "PNG" ? "image/png" : "image/jpeg";
      const dataURL = gl.domElement.toDataURL(mimeType, 0.95);

      const link = document.createElement("a");
      link.download = `render_${resolution}_${Date.now()}.${format.toLowerCase()}`;
      link.href = dataURL;
      link.click();

      gl.setSize(originalWidth, originalHeight, false);
      if ("aspect" in camera) {
        (camera as any).aspect = originalWidth / originalHeight;
        (camera as any).updateProjectionMatrix();
      }
    };

    // Store thumbnail capture function
    (window as any).captureScreenshot = () => {
      return new Promise((resolve) => {
        gl.render(scene, camera);
        const dataURL = gl.domElement.toDataURL("image/jpeg", 0.85);
        resolve(dataURL);
      });
    };
    
    return () => {
      delete (window as any).__captureImage;
      delete (window as any).captureScreenshot;
    };
  }, [gl, scene, camera]);

  return null;
}
