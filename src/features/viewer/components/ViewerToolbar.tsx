"use client";

import { Button } from "@/components/ui/button";
import { Grid3x3, RotateCw, RefreshCcw, Move, RotateCcw, Maximize2, MessageCircle, Smartphone, Ruler, X, Download } from "lucide-react";
import * as THREE from "three";
import { useViewerStore } from "../store/useViewerStore";
import { useState, useEffect } from "react";
import ShareQR from "./ShareQR";
import QRCodeShare from "./QRCodeShare";
import VersionHistory from "@/features/projects/components/VersionHistory";
import RealPerformanceReport from "./RealPerformanceReport";
import CarbonFootprintReport from "./CarbonFootprintReport";
import VersionControl from "./VersionControl";
import AssetLibrary from "./AssetLibrary";

interface ViewerToolbarProps {
  scene?: THREE.Group | null
  fileUrl?: string
  projectId?: string
}

export default function ViewerToolbar({ scene, fileUrl, projectId }: ViewerToolbarProps = {}) {
  const showGrid = useViewerStore((state) => state.gridVisible);
  const toggleGrid = useViewerStore((state) => state.toggleGrid);
  const autoRotate = useViewerStore((state) => state.autoRotate);
  const toggleAutoRotate = useViewerStore((state) => state.toggleAutoRotate);
  const isPresentationMode = useViewerStore((state) => state.isPresentationMode);
  const transformMode = useViewerStore((state) => state.transformMode);
  const setTransformMode = useViewerStore((state) => state.setTransformMode);
  const isAnnotationMode = useViewerStore((state) => state.isAnnotationMode);
  const toggleAnnotationMode = useViewerStore((state) => state.toggleAnnotationMode);
  const isMeasurementMode = useViewerStore((state) => state.isMeasurementMode);
  const toggleMeasurementMode = useViewerStore((state) => state.toggleMeasurementMode);
  const measurements = useViewerStore((state) => state.measurements);
  const clearMeasurements = useViewerStore((state) => state.clearMeasurements);
  const resetCamera = useViewerStore((state) => state.resetCamera);
  const [isQROpen, setIsQROpen] = useState(false);

  // Change cursor when measurement mode is active
  useEffect(() => {
    if (isMeasurementMode) {
      document.body.style.cursor = 'crosshair';
    } else {
      document.body.style.cursor = 'default';
    }
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isMeasurementMode]);

  return (
    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-300 ${
      isPresentationMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 shadow-xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTransformMode(transformMode === 'translate' ? null : 'translate')}
          title="Move"
          className={transformMode === 'translate' ? "bg-purple-600/30 text-purple-300 hover:bg-purple-600/40" : "text-zinc-200 hover:text-white hover:bg-zinc-700/50"}
        >
          <Move className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTransformMode(transformMode === 'rotate' ? null : 'rotate')}
          title="Rotate"
          className={transformMode === 'rotate' ? "bg-purple-600/30 text-purple-300 hover:bg-purple-600/40" : "text-zinc-200 hover:text-white hover:bg-zinc-700/50"}
        >
          <RotateCcw className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTransformMode(transformMode === 'scale' ? null : 'scale')}
          title="Scale"
          className={transformMode === 'scale' ? "bg-purple-600/30 text-purple-300 hover:bg-purple-600/40" : "text-zinc-200 hover:text-white hover:bg-zinc-700/50"}
        >
          <Maximize2 className="size-5" />
        </Button>

        <div className="w-px h-6 bg-zinc-700" />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAnnotationMode}
          title="Add Comment"
          className={isAnnotationMode ? "bg-purple-600/30 text-purple-300 hover:bg-purple-600/40" : "text-zinc-200 hover:text-white hover:bg-zinc-700/50"}
        >
          <MessageCircle className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMeasurementMode}
          title="Measure Distance"
          className={isMeasurementMode ? "bg-purple-600/30 text-purple-300 hover:bg-purple-600/40" : "text-zinc-200 hover:text-white hover:bg-zinc-700/50"}
        >
          <Ruler className="size-5" />
        </Button>

        {measurements.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearMeasurements}
            title="Clear Measurements"
            className="text-red-400 hover:text-red-300 hover:bg-zinc-700/50"
          >
            <X className="size-5" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsQROpen(true)}
          title="Mobile / AR"
          className="text-zinc-200 hover:text-white hover:bg-zinc-700/50"
        >
          <Smartphone className="size-5" />
        </Button>

        <div className="w-px h-6 bg-zinc-700" />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleGrid}
          title="Toggle Grid"
          className={showGrid ? "bg-purple-600/30 text-purple-300 hover:bg-purple-600/40" : "text-zinc-200 hover:text-white hover:bg-zinc-700/50"}
        >
          <Grid3x3 className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAutoRotate}
          title="Auto Rotate"
          data-state={autoRotate ? "on" : "off"}
          className="data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 data-[state=off]:text-zinc-200 hover:text-white hover:bg-zinc-700/50"
        >
          <RotateCw className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={resetCamera}
          title="Reset Camera"
          className="text-zinc-200 hover:text-white hover:bg-zinc-700/50"
        >
          <RefreshCcw className="size-5" />
        </Button>

        <div className="w-px h-6 bg-zinc-700" />

        <VersionHistory 
          projectId="demo" 
          onRestore={(config) => {
            console.log('Restoring config:', config);
          }} 
        />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const state = useViewerStore.getState();
            state.triggerCapture();
          }}
          title="Export Screenshot"
          className="text-zinc-200 hover:text-white hover:bg-zinc-700/50"
        >
          <Download className="size-5" />
        </Button>
        
        <RealPerformanceReport scene={scene} fileUrl={fileUrl} />
        
        <CarbonFootprintReport scene={scene} fileUrl={fileUrl} />
        
        <VersionControl projectId={projectId || 'demo'} />
        
        <AssetLibrary />
        
        <QRCodeShare projectId="demo" />
      </div>
      
      <ShareQR 
        isOpen={isQROpen} 
        onClose={() => setIsQROpen(false)} 
        url={typeof window !== 'undefined' ? window.location.href : ''} 
      />
    </div>
  );
}
