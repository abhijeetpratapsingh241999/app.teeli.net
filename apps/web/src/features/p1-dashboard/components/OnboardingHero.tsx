"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  SpotLight,
  DirectionalLight,
  Vector3,
  MeshBuilder,
  Color3,
  Color4,
  ShadowGenerator,
  Mesh,
  AbstractMesh,
  StandardMaterial,
  Scalar,
  PBRMaterial,
  GlowLayer,
  Plane,
  TransformNode,
} from "@babylonjs/core";
import { ShadowOnlyMaterial } from "@babylonjs/materials";
import "@babylonjs/loaders/glTF";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

// Modular Components
import { LoadingSpinner, PipelineCards, ProjectDashboard, ZoomControls, useLOD, applyLODToEngine, getEngineOptions } from "./onboarding";
import type { PipelineState } from "./onboarding";

// Icons (for future pipeline stages)
import { MagnifyingGlass, Wrench, Cube } from "@phosphor-icons/react";

// ============================================================================
// TYPES
// ============================================================================

interface OnboardingHeroProps {
  onComplete?: () => void;
  modelUrl?: string;
}

// ============================================================================
// MASTER LOGIC: DUAL-MESH CLIP PLANE ANIMATION
//
// Mesh A (Solid): Original PBR - visible where solidClip allows
// Mesh B (Wire):  Wireframe clone - visible where wireClip allows
//
// ClipPlane Math (Babylon.js):
// - Plane(0, 1, 0, d) clips where y > -d (hides ABOVE the line at y = -d)
// - Plane(0, -1, 0, d) clips where y < d (hides BELOW the line at y = d)
//
// Our Strategy:
// - solidClip = Plane(0, 1, 0, -scanLineY) → Hides solid ABOVE scanLineY
// - wireClip = Plane(0, -1, 0, scanLineY) → Hides wire BELOW scanLineY
//
// When scanLineY = maxY: Solid fully visible, Wire fully hidden
// When scanLineY = minY: Solid fully hidden, Wire fully visible
// ============================================================================

export function OnboardingHero({
  onComplete,
  modelUrl = "/models/hero-drone-final.glb",
}: OnboardingHeroProps) {
  // ========================================================================
  // LOD - Level of Detail configuration (only use initial config for scene)
  // ========================================================================
  const { config: lodConfig, capability, getModelUrl } = useLOD();
  
  // Store initial LOD config to prevent scene recreation on orientation change
  const initialLodConfigRef = useRef(lodConfig);
  const initialGetModelUrlRef = useRef(getModelUrl);

  // ========================================================================
  // REFS - Babylon Objects
  // ========================================================================
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);

  // Mesh Refs
  const meshARef = useRef<AbstractMesh | null>(null); // Solid PBR
  const meshBRef = useRef<AbstractMesh | null>(null); // Wireframe Clone
  const anchorRef = useRef<TransformNode | null>(null); // Parent for boat physics
  const wireframeMaterialRef = useRef<StandardMaterial | null>(null);
  const solidMaterialsRef = useRef<PBRMaterial[]>([]);

  // Lighting Refs
  const spotLightRef = useRef<SpotLight | null>(null);
  const glowLayerRef = useRef<GlowLayer | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null); // For tablet zoom adjustment

  // Bounding Box
  const boundsRef = useRef({ minY: -1, maxY: 1 });
  const originalYRef = useRef(0); // Store original Y for floating animation

  // Animation State
  const scanLineYRef = useRef(1); // Current Y position of scan line
  const animationRef = useRef<number | null>(null);
  const pipelineStateRef = useRef<PipelineState>("idle"); // For render loop access

  // ========================================================================
  // STATE - React UI
  // ========================================================================
  const [pipelineState, setPipelineState] = useState<PipelineState>("idle");
  const [progress, setProgress] = useState({ scan: 0, repair: 0, render: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showProjectDashboard, setShowProjectDashboard] = useState(false);
  const [isSlideOut, setIsSlideOut] = useState(false);

  // Keep pipelineStateRef in sync for render loop access
  useEffect(() => {
    pipelineStateRef.current = pipelineState;
  }, [pipelineState]);

  // ========================================================================
  // ZOOM CONTROLS HANDLER
  // ========================================================================
  const handleZoomChange = useCallback((zoomLevel: number) => {
    if (cameraRef.current) {
      // Smooth zoom animation
      const currentRadius = cameraRef.current.radius;
      const targetRadius = zoomLevel;
      const steps = 10;
      let step = 0;
      
      const animate = () => {
        step++;
        const progress = step / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        cameraRef.current!.radius = currentRadius + (targetRadius - currentRadius) * easeProgress;
        
        if (step < steps) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, []);

  // ========================================================================
  // SCENE INITIALIZATION (runs only once, not on orientation change)
  // ========================================================================
  useEffect(() => {
    if (!canvasRef.current) return;

    // Use initial LOD config (prevents scene recreation on rotate)
    const currentLodConfig = initialLodConfigRef.current;
    const currentGetModelUrl = initialGetModelUrlRef.current;

    // Create Engine with LOD-based options
    const engineOptions = getEngineOptions(currentLodConfig);
    const engine = new Engine(canvasRef.current, true, {
      ...engineOptions,
      stencil: true,
    }, true); // adaptToDeviceRatio
    
    // Apply LOD hardware scaling
    applyLODToEngine(engine, currentLodConfig);
    engineRef.current = engine;

    // Create Scene with transparent background
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0); // Fully transparent
    scene.autoClear = true;
    scene.autoClearDepthAndStencil = true;
    sceneRef.current = scene;

    // ====================================================================
    // CAMERA - Always interactive
    // ====================================================================
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2.5,
      5,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 10;
    camera.wheelPrecision = 50;
    camera.panningSensibility = 0; // Disable panning

    // Tablet zoom out - model appears smaller on tablets for better visibility
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;
    if (isTablet) {
      const isPortrait = window.innerHeight > window.innerWidth;
      // Portrait: zoom out more (cards at bottom take space)
      // Landscape: slight zoom out
      camera.radius = isPortrait ? 7 : 6;
      camera.lowerRadiusLimit = isPortrait ? 5 : 4;
      camera.upperRadiusLimit = 12;
    }
    cameraRef.current = camera; // Store ref for resize handler

    // ====================================================================
    // LIGHTING
    // ====================================================================
    const hemiLight = new HemisphericLight(
      "hemi",
      new Vector3(0, 1, 0),
      scene
    );
    hemiLight.intensity = 0.3; // Reduced for better contrast

    // Top-Left Sun Light (Main Key Light)
    const dirLight = new DirectionalLight(
      "dirLight",
      new Vector3(-1, -0.5, 1), // From top-left
      scene
    );
    dirLight.intensity = 2.5; // Punchy key light

    const spotLight = new SpotLight(
      "spot",
      new Vector3(0, 5, 0),
      new Vector3(0, -1, 0),
      Math.PI / 3,
      2,  // Soft falloff exponent (lower = wider/softer beam)
      scene
    );
    spotLight.intensity = 1.0;
    spotLightRef.current = spotLight;

    // Shadow Generator - LOD based quality
    const shadowGenerator = new ShadowGenerator(currentLodConfig.shadowQuality, spotLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = currentLodConfig.level === "high" ? 32 : currentLodConfig.level === "medium" ? 16 : 8;

    // Glow Layer - Conditional based on LOD (disabled on low-end devices)
    let glowLayer: GlowLayer | null = null;
    if (currentLodConfig.glowEnabled) {
      glowLayer = new GlowLayer("glow", scene, {
        mainTextureFixedSize: currentLodConfig.level === "high" ? 1024 : 512,
        blurKernelSize: currentLodConfig.level === "high" ? 64 : 32
      });
      glowLayer.intensity = 2.5;
    }
    glowLayerRef.current = glowLayer;

    // ====================================================================
    // GROUND (Shadow Receiver)
    // ====================================================================
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      scene
    );
    ground.position.y = -1.5;
    const groundMat = new ShadowOnlyMaterial("groundMat", scene);
    groundMat.activeLight = spotLight;
    groundMat.alpha = 0.5;
    ground.material = groundMat;
    ground.receiveShadows = true;

    // ====================================================================
    // WIREFRAME MATERIAL (Overlay on top of solid - bright neon glow)
    // ====================================================================
    const wireframeMat = new StandardMaterial("wireframeMat", scene);
    wireframeMat.wireframe = true;
    wireframeMat.emissiveColor = new Color3(1, 0.2, 0.2); // Bright RED
    wireframeMat.disableLighting = true;
    wireframeMat.backFaceCulling = false;
    wireframeMat.alpha = 0.9; // Slightly transparent for overlay effect
    wireframeMaterialRef.current = wireframeMat;

    // ====================================================================
    // LOAD MODEL - Always use original model file, only adjust rendering quality
    // ====================================================================
    const loadModel = async () => {
      setIsLoading(true);

      try {
        const lastSlash = modelUrl.lastIndexOf("/");
        const folderPath = modelUrl.substring(0, lastSlash + 1);
        const fileName = modelUrl.substring(lastSlash + 1);

        // Log LOD decision (dev only)
        if (process.env.NODE_ENV === "development") {
          console.log(`[LOD] Level: ${currentLodConfig.level}, Model: ${fileName}`);
        }

        const result = await SceneLoader.ImportMeshAsync(
          "",
          folderPath,
          fileName,
          scene
        );

        if (result.meshes.length > 0) {
          const rootMesh = result.meshes[0];

          // ==============================================================
          // MESH A (SOLID) - Original PBR
          // ==============================================================
          const pbrMaterials: PBRMaterial[] = [];
          result.meshes.forEach((mesh) => {
            if (mesh.name !== "__root__") {
              if (mesh.material && mesh.material instanceof PBRMaterial) {
                pbrMaterials.push(mesh.material);
              }
              shadowGenerator.addShadowCaster(mesh as Mesh);
              mesh.receiveShadows = true;
            }
          });
          solidMaterialsRef.current = pbrMaterials;

          // ==============================================================
          // BOOST EMISSION: Make glow parts look like soft neon clouds
          // ==============================================================
          pbrMaterials.forEach((mat) => {
            // Set pure cyan emissive color (not blown out white)
            mat.emissiveColor = new Color3(0, 1, 1); // Pure Cyan
            // Bright but not blown out - works with GlowLayer blur
            mat.emissiveIntensity = 3.0;
            
            // Force Premium Metal/Ceramic Look
            mat.metallic = 1.0;           // Fully metallic (not plastic)
            mat.roughness = 0.15;         // Very glossy/shiny
            mat.environmentIntensity = 1.5; // Strong reflections
          });

          // Scale and Center
          const initBounds = rootMesh.getHierarchyBoundingVectors(true);
          const size = initBounds.max.subtract(initBounds.min);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scaleFactor = 2.5 / maxDim;
          rootMesh.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);

          // Refresh and get final bounds
          result.meshes.forEach((m) => {
            if (m instanceof Mesh) m.refreshBoundingInfo();
          });
          const finalBounds = rootMesh.getHierarchyBoundingVectors(true);
          const centerY = (finalBounds.min.y + finalBounds.max.y) / 2;
          rootMesh.position.y = -centerY;
          originalYRef.current = -centerY; // Store for floating animation

          // Store accurate bounds
          const worldBounds = rootMesh.getHierarchyBoundingVectors(true);
          boundsRef.current = {
            minY: worldBounds.min.y - 0.1,
            maxY: worldBounds.max.y + 0.1,
          };

          // ==============================================================
          // CREATE ANCHOR (TransformNode) for Boat Physics
          // Both meshes are children of anchor - they inherit its motion
          // ==============================================================
          const anchor = new TransformNode("root_anchor", scene);
          anchor.position.y = 0; // Anchor starts at origin
          originalYRef.current = 0; // Anchor's base Y position
          anchorRef.current = anchor;
          
          // Parent solid mesh to anchor
          rootMesh.parent = anchor;
          rootMesh.position.y = -centerY; // Local position within anchor
          
          meshARef.current = rootMesh;

          // ==============================================================
          // MESH B (WIREFRAME) - Clone, scaled up slightly for overlay
          // ==============================================================
          const clonedRoot = rootMesh.clone("meshB_wire", null);
          if (clonedRoot) {
            // Parent wireframe to same anchor as solid
            clonedRoot.parent = anchor;
            
            // Scale up slightly to sit ON TOP of solid (avoid z-fighting)
            clonedRoot.scaling = new Vector3(
              scaleFactor * 1.003,
              scaleFactor * 1.003,
              scaleFactor * 1.003
            );
            
            const applyWireframe = (mesh: AbstractMesh) => {
              mesh.material = wireframeMat;
              mesh.getChildMeshes().forEach(applyWireframe);
            };
            if (clonedRoot instanceof Mesh) {
              clonedRoot.material = wireframeMat;
            }
            clonedRoot.getChildMeshes().forEach(applyWireframe);
            meshBRef.current = clonedRoot;
          }

          // ==============================================================
          // INITIAL STATE: OVERLAY MODE
          // Solid: ALWAYS visible (no clip plane)
          // Wire: Hidden initially (clipped entirely)
          // ==============================================================
          const { minY, maxY } = boundsRef.current;
          scanLineYRef.current = maxY;

          // Solid: NO clip plane - always fully visible
          pbrMaterials.forEach((mat) => {
            mat.clipPlane = null;
          });
          
          // Wire: Hide everything initially
          // Plane(0, -1, 0, d) clips where y < d
          // Set d = maxY + padding → clips where y < maxY = EVERYTHING hidden
          const wireClip = new Plane(0, -1, 0, maxY + 0.5);
          wireframeMat.clipPlane = wireClip;

          console.log("✅ Model Loaded (OVERLAY MODE):");
          console.log(`   Bounds: Y = ${minY.toFixed(2)} to ${maxY.toFixed(2)}`);
          console.log(`   Solid: Always visible (no clip)`);
          console.log(`   Wire: Hidden initially, will overlay on scan`);
        }
      } catch (error) {
        console.error("❌ Failed to load model:", error);
        createFallbackSphere(scene, shadowGenerator, wireframeMat);
      } finally {
        setIsLoading(false);
        setIsSceneReady(true);
      }
    };

    // Fallback sphere if model fails
    const createFallbackSphere = (
      scene: Scene,
      shadowGen: ShadowGenerator,
      wireMat: StandardMaterial
    ) => {
      const sphere = MeshBuilder.CreateSphere(
        "fallback",
        { diameter: 2, segments: 32 },
        scene
      );
      const sphereMat = new PBRMaterial("sphereMat", scene);
      sphereMat.metallic = 0.8;
      sphereMat.roughness = 0.2;
      sphereMat.albedoColor = new Color3(0.7, 0.7, 0.8);
      sphere.material = sphereMat;
      shadowGen.addShadowCaster(sphere);
      meshARef.current = sphere;
      solidMaterialsRef.current = [sphereMat];

      const wireClone = sphere.clone("fallback_wire");
      if (wireClone) {
        wireClone.material = wireMat;
        meshBRef.current = wireClone;
      }

      boundsRef.current = { minY: -1.1, maxY: 1.1 };
      scanLineYRef.current = 1.1;

      // Initial clip planes
      const solidClip = new Plane(0, 1, 0, -1.1);
      const wireClip = new Plane(0, -1, 0, 1.1);
      sphereMat.clipPlane = solidClip;
      wireMat.clipPlane = wireClip;
    };

    loadModel();

    // ====================================================================
    // RENDER LOOP with Alive Flicker + Floating Animation
    // ====================================================================
    engine.runRenderLoop(() => {
      // ================================================================
      // FLOATING ANIMATION: "Boat on Water" physics on ANCHOR
      // The anchor is the parent - both meshes inherit this motion
      // ================================================================
      const floatTime = Date.now() * 0.0015; // Smooth speed
      const anchor = anchorRef.current;
      
      if (anchor) {
        // 1. Bobbing (Up/Down) - Applied to anchor position
        anchor.position.y = Math.sin(floatTime) * 0.15;
        
        // 2. Rolling (Side-to-Side Tilt - Z Axis)
        anchor.rotation.z = Math.cos(floatTime * 0.8) * 0.08;
        
        // 3. Pitching (Forward-Back Tilt - X Axis)
        anchor.rotation.x = Math.sin(floatTime * 0.6) * 0.08;
      }
      
      // ================================================================
      // ALIVE FLICKER: Subtle pulse when in idle or complete state
      // Makes the light feel like a humming electronic engine
      // ================================================================
      const currentState = pipelineStateRef.current;
      const isLightOn = currentState === "idle" || currentState === "complete";
      
      if (isLightOn && solidMaterialsRef.current.length > 0) {
        // Time factor for smooth animation
        const time = Date.now() * 0.002;
        
        // 1. Base Breathing (Slow & rhythmic pulse)
        const breath = Math.sin(time) * 0.3;
        
        // 2. Micro Flicker (Random electrical noise - subtle!)
        const noise = (Math.random() - 0.5) * 0.15;
        
        // 3. Target Intensity = Base (3.0) + Breath + Noise
        const targetIntensity = 3.0 + breath + noise;
        
        // Apply to all solid mesh materials
        solidMaterialsRef.current.forEach((mat) => {
          mat.emissiveIntensity = targetIntensity;
        });
        
        // Sync SpotLight intensity (slightly less than material)
        if (spotLightRef.current && currentState === "complete") {
          spotLightRef.current.intensity = 0.8 + breath * 0.2 + noise * 0.1;
        }
      }
      
      scene.render();
    });

    // Resize handler - also adjusts camera zoom for tablet orientation changes
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    
    const handleResize = () => {
      // Debounce resize to let DOM settle after orientation change
      if (resizeTimeout) clearTimeout(resizeTimeout);
      
      resizeTimeout = setTimeout(() => {
        // Force canvas to recalculate dimensions
        if (canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          canvasRef.current.width = rect.width * window.devicePixelRatio;
          canvasRef.current.height = rect.height * window.devicePixelRatio;
        }
        
        engine.resize();
        
        // Adjust camera zoom on tablet orientation change
        if (cameraRef.current) {
          const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;
          const isDesktop = window.innerWidth >= 1280;
          
          if (isTablet) {
            const isPortrait = window.innerHeight > window.innerWidth;
            cameraRef.current.radius = isPortrait ? 7 : 6;
            cameraRef.current.lowerRadiusLimit = isPortrait ? 5 : 4;
            cameraRef.current.upperRadiusLimit = 12;
          } else if (isDesktop) {
            // Reset to desktop defaults
            cameraRef.current.radius = 5;
            cameraRef.current.lowerRadiusLimit = 3;
            cameraRef.current.upperRadiusLimit = 10;
          }
        }
      }, 150); // 150ms delay for orientation animation to complete
    };
    
    // Also listen for orientation change specifically
    const handleOrientationChange = () => {
      // Orientation change needs more time for iOS/Android to update viewport
      setTimeout(handleResize, 300);
    };
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      scene.dispose();
      engine.dispose();
    };
    // NOTE: Only modelUrl triggers scene recreation, NOT orientation/LOD changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelUrl]);

  // ========================================================================
  // HELPER: Update Wireframe Clip Plane (PAINT-ON / PAINT-OFF Effect)
  // 
  // ClipPlane Math:
  // Plane(0, -1, 0, d) clips where y < d (hides everything BELOW d)
  // Plane(0, 1, 0, d) clips where y > -d (hides everything ABOVE -d)
  //
  // PAINT-ON (Stage 1): Reveal wireframe from TOP to BOTTOM
  //   - Use Plane(0, -1, 0, scanY) → hides below scanY
  //   - Start: scanY = maxY → all hidden
  //   - End: scanY = minY → all visible (PERSISTS!)
  //
  // PAINT-OFF (Stage 3): Hide wireframe from BOTTOM to TOP  
  //   - Use Plane(0, -1, 0, scanY) → hides BELOW scanY, keeps ABOVE visible
  //   - Start: scanY = minY → clips below minY = nothing hidden
  //   - End: scanY = maxY → clips below maxY = everything hidden
  // ========================================================================
  const updateWireframeClip = useCallback((scanY: number, mode: 'paint-on' | 'paint-off') => {
    const wireMat = wireframeMaterialRef.current;
    if (!wireMat) return;

    if (mode === 'paint-on') {
      // PAINT-ON: Hide everything BELOW scanY, show everything ABOVE
      // As scanY moves down, more wireframe is revealed and STAYS visible
      wireMat.clipPlane = new Plane(0, -1, 0, scanY);
    } else {
      // PAINT-OFF: Hide everything BELOW scanY, keep everything ABOVE visible
      // As scanY moves up from minY to maxY, visible area shrinks upward
      wireMat.clipPlane = new Plane(0, -1, 0, scanY);
    }
  }, []);

  // ========================================================================
  // ANIMATION: Stage 1 - DIAGNOSIS (PAINT-ON: Wireframe coats the model)
  // Solid stays 100% visible. Wireframe "paints on" from top to bottom.
  // At the end, the ENTIRE wireframe stays visible!
  // ========================================================================
  const animateScan = useCallback(() => {
    if (pipelineState !== "idle") return;

    setPipelineState("scanning");
    setProgress({ scan: 0, repair: 0, render: 0 });

    // Dim lights for dramatic scanning effect
    if (spotLightRef.current) spotLightRef.current.intensity = 0.3;
    if (glowLayerRef.current) glowLayerRef.current.intensity = 1.2;

    // Set wireframe to bright neon RED
    if (wireframeMaterialRef.current) {
      wireframeMaterialRef.current.emissiveColor = new Color3(1, 0.1, 0.1);
    }

    const { minY, maxY } = boundsRef.current;
    const duration = 5000; // 5 seconds
    const startTime = performance.now();

    console.log(`✂️ DIAGNOSIS (PAINT-ON): Coating from Y=${maxY.toFixed(2)} down to Y=${minY.toFixed(2)}`);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);

      // LINEAR progress: Same value for both UI and 3D (perfect sync)
      // Scanline moves from TOP (maxY) to BOTTOM (minY)
      const scanY = Scalar.Lerp(maxY, minY, t);
      scanLineYRef.current = scanY;

      // PAINT-ON: Reveal wireframe from top, it STAYS visible
      updateWireframeClip(scanY, 'paint-on');

      // Update progress (same t value = perfect sync)
      setProgress((prev) => ({ ...prev, scan: t * 100 }));

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
        
        // Ensure wireframe is FULLY visible at end (no clipping)
        if (wireframeMaterialRef.current) {
          wireframeMaterialRef.current.clipPlane = null;
        }
        
        setPipelineState("idle");
        console.log("✅ DIAGNOSIS Complete - Model fully coated in RED wireframe!");
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [pipelineState, updateWireframeClip]);

  // ========================================================================
  // ANIMATION: Stage 2 - REPAIR (Color shift, 4 seconds)
  // ========================================================================
  const animateRepair = useCallback(() => {
    if (progress.scan < 100) return;

    setPipelineState("repairing");

    const wireMat = wireframeMaterialRef.current;
    if (!wireMat) return;

    // Make wireframe subtle and ghostly
    wireMat.alpha = 0.4;

    const duration = 4000; // 4 seconds
    const startTime = performance.now();

    console.log("🔧 REPAIR: Color shift RED → GREEN → CYAN");

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Color phases (MUTED for soft holographic look):
      // 0-25%: Subtle RED → GREEN flash (half intensity)
      // 25-100%: GREEN → Deep Cyberpunk Blue
      if (t < 0.25) {
        const phase = t / 0.25;
        const flash = Math.sin(phase * Math.PI * 4) * 0.5 + 0.5;
        // Muted colors: max green is 0.5, reduced red
        wireMat.emissiveColor = new Color3(0.5 - flash * 0.4, flash * 0.5, 0.1);
      } else {
        const phase = (t - 0.25) / 0.75;
        const smooth = phase * phase * (3 - 2 * phase); // Smoothstep
        // Transition to deep cyberpunk blue (0, 0.3, 0.6)
        wireMat.emissiveColor = new Color3(
          0.1 * (1 - smooth),
          0.5 - smooth * 0.2,
          0.1 + smooth * 0.5
        );
      }

      // Update progress
      setProgress((prev) => ({ ...prev, repair: t * 100 }));

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
        wireMat.emissiveColor = new Color3(0, 0.3, 0.6); // Final: Deep Cyberpunk Blue
        setPipelineState("idle");
        console.log("✅ REPAIR Complete - Wireframe now Deep Blue");
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [progress.scan]);

  // ========================================================================
  // ANIMATION: Stage 3 - RENDER (PAINT-OFF: Wireframe lifts off)
  // Solid stays 100% visible. Wireframe "peels off" from bottom to top.
  // ========================================================================
  const animateRender = useCallback(() => {
    if (progress.repair < 100) return;

    setPipelineState("rendering");

    const { minY, maxY } = boundsRef.current;
    const duration = 8000; // 8 seconds
    const startTime = performance.now();

    // Re-enable wireframe clipping: Start with full wireframe visible
    // Plane(0, -1, 0, minY) clips below minY = nothing hidden initially
    if (wireframeMaterialRef.current) {
      wireframeMaterialRef.current.clipPlane = new Plane(0, -1, 0, minY);
    }

    console.log(`🎬 RENDER (PAINT-OFF): Lifting from Y=${minY.toFixed(2)} up to Y=${maxY.toFixed(2)}`);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      const timeSeconds = elapsed / 1000;

      // LINEAR progress: Same value for both UI and 3D (perfect sync)
      // Scanline moves from BOTTOM (minY) to TOP (maxY)
      const scanY = Scalar.Lerp(minY, maxY, t);
      scanLineYRef.current = scanY;

      // PAINT-OFF: Hide wireframe from bottom up
      updateWireframeClip(scanY, 'paint-off');

      // ================================================================
      // CINEMATIC LIGHT SEQUENCE
      // ================================================================
      const spotLight = spotLightRef.current;
      const glowLayer = glowLayerRef.current;

      if (spotLight && glowLayer) {
        if (timeSeconds < 2) {
          // 0-2s: Dim
          spotLight.intensity = 0.3;
          glowLayer.intensity = 1.0;
        } else if (timeSeconds < 5) {
          // 2-5s: Random Flicker
          const flicker = Math.random() * 0.4 + 0.4;
          spotLight.intensity = flicker;
          glowLayer.intensity = flicker * 0.8;
        } else {
          // 5-8s: Ramp to full power
          const rampT = (timeSeconds - 5) / 3;
          const intensity = Scalar.Lerp(0.5, 1.0, rampT);
          spotLight.intensity = intensity;
          glowLayer.intensity = intensity * 0.8;
        }
      }

      // Update progress
      setProgress((prev) => ({ ...prev, render: t * 100 }));

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
        setPipelineState("complete");

        // Final state: Lights on, wireframe hidden
        if (spotLight) spotLight.intensity = 1.0;
        if (glowLayer) glowLayer.intensity = 0.8;

        // Fully hide wireframe (clip everything below maxY = everything)
        if (wireframeMaterialRef.current) {
          wireframeMaterialRef.current.clipPlane = new Plane(0, -1, 0, maxY);
        }

        // Disable wireframe mesh for performance
        if (meshBRef.current) {
          meshBRef.current.setEnabled(false);
        }

        console.log("✅ RENDER Complete - Clean solid model!");
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [progress.repair, updateWireframeClip]);

  // ========================================================================
  // HANDLER: Get Started
  // ========================================================================
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleGetStarted = useCallback(() => {
    setShowUpload(true);
    setTimeout(() => {
      onComplete?.();
    }, 500);
  }, [onComplete]);

  // ========================================================================
  // UI HELPERS (Reserved for future use)
  // ========================================================================
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _getButtonText = (stage: string): string => {
    const stageProgress =
      stage === "scan"
        ? progress.scan
        : stage === "repair"
        ? progress.repair
        : progress.render;
    const isComplete = stageProgress >= 100;

    if (stage === "scan") {
      if (pipelineState === "scanning") return "Scanning...";
      if (isComplete) return "✓ Scanned";
      return "Run Scan";
    }
    if (stage === "repair") {
      if (pipelineState === "repairing") return "Repairing...";
      if (isComplete) return "✓ Repaired";
      if (progress.scan >= 100) return "Fix Issues";
      return "Auto-Heal";
    }
    if (stage === "render") {
      if (pipelineState === "rendering") return "Rendering...";
      if (isComplete || pipelineState === "complete") return "✓ Complete";
      if (progress.repair >= 100) return "Finalize";
      return "Cloud Render";
    }
    return "Start";
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _isButtonDisabled = (stage: string): boolean => {
    if (pipelineState === "scanning" || pipelineState === "repairing" || pipelineState === "rendering") {
      return true;
    }
    if (stage === "scan") return progress.scan >= 100;
    if (stage === "repair") return progress.scan < 100 || progress.repair >= 100;
    if (stage === "render") return progress.repair < 100 || progress.render >= 100;
    return false;
  };

  // ========================================================================
  // ACTION COMPLETE - Slide transition to Project Dashboard
  // ========================================================================
  const handleActionComplete = useCallback(() => {
    // Start slide out animation
    setIsSlideOut(true);
    
    // After slide out, show project dashboard
    setTimeout(() => {
      setShowProjectDashboard(true);
    }, 400);
  }, []);

  // Handle back from Project Dashboard
  const handleBackFromDashboard = useCallback(() => {
    setShowProjectDashboard(false);
    
    // After dashboard slides out, slide content back in
    setTimeout(() => {
      setIsSlideOut(false);
    }, 100);
  }, []);

  // ========================================================================
  // RENDER UI (Reserved for future use)
  // ========================================================================
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _pipelineStages = [
    {
      id: "scan",
      title: "Stage 1: Diagnosis",
      description: "Scan mesh topology",
      icon: MagnifyingGlass,
      time: "5s",
      action: animateScan,
    },
    {
      id: "repair",
      title: "Stage 2: Repair",
      description: "Heal damaged geometry",
      icon: Wrench,
      time: "4s",
      action: animateRepair,
    },
    {
      id: "render",
      title: "Stage 3: Render",
      description: "Premium PBR output",
      icon: Cube,
      time: "8s",
      action: animateRender,
    },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main Content Wrapper - Slides left when action complete */}
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{ 
          transform: isSlideOut ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        {/* 3D Canvas - Full screen on mobile, side panel on tablets, full desktop layout */}
        <div 
          className="absolute inset-0 bottom-[40vh] sm:bottom-[35vh] xl:bottom-0 xl:right-[350px] bg-transparent xl:-translate-x-[100px] tablet-canvas-wrapper"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-transparent outline-none focus:outline-none active:outline-none ring-0 border-none"
            style={{ 
              touchAction: "none",
              background: "transparent",
              outline: "none",
              border: "none",
            }}
            tabIndex={-1}
          />
        </div>

        {/* Loading Overlay - Modular Component */}
        <AnimatePresence>
          {isLoading && <LoadingSpinner />}
        </AnimatePresence>

        {/* Zoom Controls - Tablet Landscape Only */}
        <ZoomControls
          onZoomChange={handleZoomChange}
          minZoom={3}
          maxZoom={12}
          initialZoom={6}
        />

        {/* Right Panel - Modular Pipeline Cards */}
        <AnimatePresence>
          {isSceneReady && !showUpload && (
            <PipelineCards
              pipelineState={pipelineState}
              progress={progress}
              onScan={animateScan}
              onRepair={animateRepair}
              onRender={animateRender}
              onActionComplete={handleActionComplete}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Project Dashboard - Slides in from right */}
      <AnimatePresence>
        {showProjectDashboard && (
          <ProjectDashboard 
            isVisible={showProjectDashboard}
            onBack={handleBackFromDashboard}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
