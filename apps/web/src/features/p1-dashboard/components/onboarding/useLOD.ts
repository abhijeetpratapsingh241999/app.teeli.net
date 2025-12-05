"use client";

/**
 * Level of Detail (LOD) Hook
 * Determines appropriate model quality based on device capability
 * Improves performance on tablets and lower-end devices
 * @created 2025-12-03
 */

import { useState, useEffect, useMemo } from "react";

// LOD Levels
export type LODLevel = "high" | "medium" | "low";

interface LODConfig {
  level: LODLevel;
  modelSuffix: string;           // e.g., "", "-medium", "-low"
  shadowQuality: number;         // Shadow map size: 2048, 1024, 512
  maxLights: number;             // Active lights
  glowEnabled: boolean;          // Glow layer
  antialiasEnabled: boolean;     // MSAA
  hardwareScalingLevel: number;  // Canvas resolution scale
  particlesEnabled: boolean;     // Particle effects
}

interface DeviceCapability {
  isTablet: boolean;
  isPortrait: boolean;
  isMobile: boolean;
  gpuTier: "high" | "medium" | "low";
  memoryGB: number;
  pixelRatio: number;
}

/**
 * Detect device capabilities for LOD decisions
 */
function detectDeviceCapability(): DeviceCapability {
  if (typeof window === "undefined") {
    return {
      isTablet: false,
      isPortrait: false,
      isMobile: false,
      gpuTier: "high",
      memoryGB: 8,
      pixelRatio: 1,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio || 1;

  // Device detection
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1280;
  const isPortrait = height > width;

  // GPU tier estimation using WebGL
  let gpuTier: "high" | "medium" | "low" = "high";
  
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
        const rendererLower = renderer.toLowerCase();
        
        // Check for integrated/low-power GPUs
        const lowTierIndicators = [
          "intel hd",
          "intel uhd",
          "intel iris",
          "mali-g",
          "mali-t",
          "adreno 5",
          "adreno 6",
          "powervr",
          "apple gpu", // iOS devices
          "swiftshader",
        ];
        
        const mediumTierIndicators = [
          "adreno 7",
          "nvidia geforce mx",
          "nvidia geforce gtx 16",
          "radeon rx 5",
        ];

        if (lowTierIndicators.some(i => rendererLower.includes(i))) {
          gpuTier = "low";
        } else if (mediumTierIndicators.some(i => rendererLower.includes(i))) {
          gpuTier = "medium";
        }
      }
    }
  } catch (e) {
    // WebGL not available, assume low tier
    gpuTier = "low";
  }

  // Memory detection (if available)
  let memoryGB = 8;
  if ("deviceMemory" in navigator) {
    memoryGB = (navigator as { deviceMemory?: number }).deviceMemory || 4;
  }

  // Tablet with portrait = treat as lower tier for performance
  if (isTablet && isPortrait) {
    gpuTier = gpuTier === "high" ? "medium" : "low";
  }

  // High pixel ratio with limited memory = reduce tier
  if (pixelRatio > 2 && memoryGB < 6) {
    gpuTier = gpuTier === "high" ? "medium" : "low";
  }

  return {
    isTablet,
    isPortrait,
    isMobile,
    gpuTier,
    memoryGB,
    pixelRatio,
  };
}

/**
 * Get LOD configuration based on device capability
 */
function getLODConfig(capability: DeviceCapability): LODConfig {
  const { isTablet, isPortrait, isMobile, gpuTier, memoryGB, pixelRatio } = capability;

  // Mobile devices - optimized for clarity
  if (isMobile) {
    return {
      level: "low",
      modelSuffix: "-low",
      shadowQuality: 512,
      maxLights: 2,
      glowEnabled: false,
      antialiasEnabled: true, // Enable AA for sharper edges
      hardwareScalingLevel: 1, // Full resolution - no blur
      particlesEnabled: false,
    };
  }

  // Tablet Portrait - medium-low quality but sharp
  if (isTablet && isPortrait) {
    return {
      level: gpuTier === "low" ? "low" : "medium",
      modelSuffix: gpuTier === "low" ? "-low" : "-medium",
      shadowQuality: gpuTier === "low" ? 512 : 1024,
      maxLights: gpuTier === "low" ? 2 : 3,
      glowEnabled: gpuTier !== "low",
      antialiasEnabled: true, // Always enable for sharpness
      hardwareScalingLevel: 1, // Full resolution
      particlesEnabled: false,
    };
  }

  // Tablet Landscape - medium quality, sharp
  if (isTablet) {
    return {
      level: gpuTier === "low" ? "low" : "medium",
      modelSuffix: gpuTier === "low" ? "-low" : "",
      shadowQuality: gpuTier === "low" ? 512 : 1024,
      maxLights: gpuTier === "low" ? 2 : 4,
      glowEnabled: gpuTier !== "low",
      antialiasEnabled: true,
      hardwareScalingLevel: 1, // Full resolution
      particlesEnabled: gpuTier !== "low",
    };
  }

  // Desktop - based on GPU tier
  switch (gpuTier) {
    case "low":
      return {
        level: "medium",
        modelSuffix: "-medium",
        shadowQuality: 1024,
        maxLights: 3,
        glowEnabled: true,
        antialiasEnabled: true,
        hardwareScalingLevel: 1,
        particlesEnabled: false,
      };
    case "medium":
      return {
        level: "medium",
        modelSuffix: "",
        shadowQuality: 1024,
        maxLights: 4,
        glowEnabled: true,
        antialiasEnabled: true,
        hardwareScalingLevel: 1,
        particlesEnabled: true,
      };
    case "high":
    default:
      return {
        level: "high",
        modelSuffix: "",
        shadowQuality: 2048,
        maxLights: 5,
        glowEnabled: true,
        antialiasEnabled: true,
        hardwareScalingLevel: 1,
        particlesEnabled: true,
      };
  }
}

/**
 * Hook to get LOD configuration for 3D scene
 * @returns LOD config and device capability info
 */
export function useLOD() {
  const [capability, setCapability] = useState<DeviceCapability>({
    isTablet: false,
    isPortrait: false,
    isMobile: false,
    gpuTier: "high",
    memoryGB: 8,
    pixelRatio: 1,
  });

  useEffect(() => {
    // Initial detection
    setCapability(detectDeviceCapability());

    // Update on resize/orientation change
    const handleChange = () => {
      setCapability(detectDeviceCapability());
    };

    window.addEventListener("resize", handleChange);
    window.addEventListener("orientationchange", handleChange);

    return () => {
      window.removeEventListener("resize", handleChange);
      window.removeEventListener("orientationchange", handleChange);
    };
  }, []);

  const config = useMemo(() => getLODConfig(capability), [capability]);

  return {
    config,
    capability,
    // Utility functions
    getModelUrl: (baseUrl: string) => {
      // Insert LOD suffix before extension
      // e.g., "/models/drone.glb" -> "/models/drone-medium.glb"
      if (config.modelSuffix === "") return baseUrl;
      
      const lastDot = baseUrl.lastIndexOf(".");
      if (lastDot === -1) return baseUrl + config.modelSuffix;
      
      return baseUrl.slice(0, lastDot) + config.modelSuffix + baseUrl.slice(lastDot);
    },
  };
}

/**
 * Apply LOD settings to Babylon.js Engine
 */
export function applyLODToEngine(
  engine: { setHardwareScalingLevel: (level: number) => void },
  config: LODConfig
) {
  engine.setHardwareScalingLevel(config.hardwareScalingLevel);
}

/**
 * Get engine creation options based on LOD config
 */
export function getEngineOptions(config: LODConfig) {
  return {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: config.antialiasEnabled,
    alpha: true,
  };
}

export type { LODConfig, DeviceCapability };
