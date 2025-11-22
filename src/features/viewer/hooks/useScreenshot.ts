import { useThree } from "@react-three/fiber";
import { useCallback } from "react";

const RESOLUTIONS = {
  "1080p": { width: 1920, height: 1080 },
  "4K": { width: 3840, height: 2160 },
};

export function useScreenshot() {
  const { gl, scene, camera } = useThree();

  const captureImage = useCallback(
    (resolution: "1080p" | "4K", format: "PNG" | "JPG") => {
      const { width, height } = RESOLUTIONS[resolution];
      
      // Store original size
      const originalWidth = gl.domElement.width;
      const originalHeight = gl.domElement.height;

      // Resize renderer to target resolution
      gl.setSize(width, height, false);
      
      // Update camera aspect ratio
      if ("aspect" in camera) {
        (camera as any).aspect = width / height;
        (camera as any).updateProjectionMatrix();
      }

      // Render a single frame
      gl.render(scene, camera);

      // Capture image
      const mimeType = format === "PNG" ? "image/png" : "image/jpeg";
      const dataURL = gl.domElement.toDataURL(mimeType, 0.95);

      // Trigger download
      const link = document.createElement("a");
      link.download = `render_${resolution}_${Date.now()}.${format.toLowerCase()}`;
      link.href = dataURL;
      link.click();

      // Restore original size
      gl.setSize(originalWidth, originalHeight, false);
      
      if ("aspect" in camera) {
        (camera as any).aspect = originalWidth / originalHeight;
        (camera as any).updateProjectionMatrix();
      }
    },
    [gl, scene, camera]
  );

  return { captureImage };
}
