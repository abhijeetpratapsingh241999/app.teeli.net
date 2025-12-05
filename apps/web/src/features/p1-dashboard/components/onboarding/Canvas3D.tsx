"use client";

/**
 * Canvas3D Component
 * Babylon.js 3D viewer with model loading
 * @updated 2025-12-03 - Added tablet responsive (portrait/landscape)
 * 
 * Responsive Strategy:
 * - Mobile (default): Full width canvas
 * - Tablet Portrait: Full width, bottom space for cards (uses tablet.css)
 * - Tablet Landscape: Side space for cards panel (uses tablet.css)
 * - Desktop (xl+): Side panel layout
 */

import { forwardRef } from "react";

interface Canvas3DProps {
  className?: string;
}

export const Canvas3D = forwardRef<HTMLCanvasElement, Canvas3DProps>(
  ({ className }, ref) => {
    return (
      <div 
        className="absolute inset-0 bg-transparent tablet-canvas-wrapper md:max-xl:right-0 xl:right-[560px]"
      >
        <canvas
          ref={ref}
          className={`w-full h-full bg-transparent outline-none focus:outline-none active:outline-none ring-0 border-none ${className || ""}`}
          style={{ 
            touchAction: "none",
            background: "transparent",
            outline: "none",
            border: "none",
          }}
          tabIndex={-1}
        />
      </div>
    );
  }
);

Canvas3D.displayName = "Canvas3D";
