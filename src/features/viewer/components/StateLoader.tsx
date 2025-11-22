"use client";

import { useEffect } from "react";
import { useViewerStore } from "../store/useViewerStore";
import type { SceneConfig } from "@/types/database";

interface StateLoaderProps {
  sceneConfig?: SceneConfig;
}

export default function StateLoader({ sceneConfig }: StateLoaderProps) {
  useEffect(() => {
    if (!sceneConfig) return;
    
    const store = useViewerStore.getState();
    
    if (sceneConfig.environment) {
      store.setEnvironmentPreset(sceneConfig.environment as any);
    }
    if (sceneConfig.showGrid !== undefined && sceneConfig.showGrid !== store.gridVisible) {
      store.toggleGrid();
    }
    if (sceneConfig.autoRotate !== undefined && sceneConfig.autoRotate !== store.autoRotate) {
      store.toggleAutoRotate();
    }
    if (sceneConfig.showBackground !== undefined && sceneConfig.showBackground !== store.showBackground) {
      store.toggleBackground();
    }
    if (sceneConfig.backgroundColor) {
      store.setBackgroundColor(sceneConfig.backgroundColor);
    }
    if (sceneConfig.cameraFov !== undefined) {
      store.setCameraFov(sceneConfig.cameraFov);
    }
    if (sceneConfig.isOrthographic !== undefined && sceneConfig.isOrthographic !== store.isOrthographic) {
      store.toggleOrthographic();
    }
    if (sceneConfig.environmentRotation !== undefined) {
      store.setEnvironmentRotation(sceneConfig.environmentRotation);
    }
    if (sceneConfig.lightIntensity !== undefined) {
      store.setLightIntensity(sceneConfig.lightIntensity);
    }
  }, [sceneConfig]);

  return null;
}
