"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Crosshair,
  Sparkle,
  Cpu,
  Leaf,
  Wallet,
  Play,
  MagnifyingGlass,
  Wrench,
  Cube,
  MagicWand,
} from "@phosphor-icons/react";

// ============================================================================
// TYPES
// ============================================================================

interface OnboardingHeroProps {
  onComplete?: () => void;
  modelUrl?: string;
}

type PipelineState = "idle" | "scanning" | "repairing" | "rendering" | "complete";

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

  // Keep pipelineStateRef in sync for render loop access
  useEffect(() => {
    pipelineStateRef.current = pipelineState;
  }, [pipelineState]);

  // ========================================================================
  // SCENE INITIALIZATION
  // ========================================================================
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Engine with alpha channel for transparency
    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
      alpha: true, // Enable transparent background
    }, true); // adaptToDeviceRatio
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

    // Shadow Generator
    const shadowGenerator = new ShadowGenerator(2048, spotLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;

    // Glow Layer - Foggy/Hazy bloom effect (soft spread-out glow)
    const glowLayer = new GlowLayer("glow", scene, {
      mainTextureFixedSize: 1024,  // Better quality
      blurKernelSize: 64           // High = Foggier/Softer spread
    });
    glowLayer.intensity = 2.5;     // Strength of the fog
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
    // LOAD MODEL
    // ====================================================================
    const loadModel = async () => {
      setIsLoading(true);

      try {
        const lastSlash = modelUrl.lastIndexOf("/");
        const folderPath = modelUrl.substring(0, lastSlash + 1);
        const fileName = modelUrl.substring(lastSlash + 1);

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

    // Resize handler
    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      scene.dispose();
      engine.dispose();
    };
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
  const handleGetStarted = useCallback(() => {
    setShowUpload(true);
    setTimeout(() => {
      onComplete?.();
    }, 500);
  }, [onComplete]);

  // ========================================================================
  // UI HELPERS
  // ========================================================================
  const getButtonText = (stage: string): string => {
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

  const isButtonDisabled = (stage: string): boolean => {
    if (pipelineState === "scanning" || pipelineState === "repairing" || pipelineState === "rendering") {
      return true;
    }
    if (stage === "scan") return progress.scan >= 100;
    if (stage === "repair") return progress.scan < 100 || progress.repair >= 100;
    if (stage === "render") return progress.repair < 100 || progress.render >= 100;
    return false;
  };

  // ========================================================================
  // RENDER UI
  // ========================================================================
  const pipelineStages = [
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
      {/* 3D Canvas - Ends before right card area (card won't affect canvas) */}
      <div 
        className="absolute top-0 bottom-0 left-0 right-[350px] bg-transparent"
        style={{ transform: "translateX(-100px)" }}
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

      {/* Loading Overlay - Transparent with floating spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            {/* Floating loader - no background box */}
            <motion.div 
              className="flex flex-col items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Spinner with glow effect */}
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" />
                {/* Glow */}
                <div className="absolute inset-0 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl" />
              </div>
              {/* Text with subtle shadow for readability */}
              <p className="mt-4 text-slate-600 font-mono text-sm tracking-wider drop-shadow-sm">
                Loading...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Panel - 5 Premium Pipeline Cards (2-Column Grid) */}
      <AnimatePresence>
        {isSceneReady && !showUpload && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute right-4 top-24 bottom-0 w-[560px] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-2 gap-3 pb-6">
              
              {/* Card 1: Auto-Diagnostic */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-xl backdrop-blur-xl transition-all duration-300 relative"
                style={{
                  background: pipelineState === "scanning" 
                    ? "linear-gradient(145deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)"
                    : progress.scan >= 100
                    ? "linear-gradient(145deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.04) 100%)"
                    : "linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.75) 100%)",
                  boxShadow: "0 4px 24px -2px rgba(0,0,0,0.08)"
                }}
              >
                {/* Gradient Border */}
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    padding: "1.5px",
                    background: "linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.08) 70%, rgba(255,255,255,0.15) 100%)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Crosshair 
                      size={36} 
                      weight="duotone" 
                      className={`${
                        progress.scan >= 100 
                          ? "text-green-500" 
                          : pipelineState === "scanning" 
                          ? "text-blue-500" 
                          : "text-blue-500"
                      }`}
                      style={{
                        filter: progress.scan >= 100 
                          ? "drop-shadow(0 0 8px rgba(34,197,94,0.6)) drop-shadow(0 0 16px rgba(34,197,94,0.4))"
                          : "drop-shadow(0 0 8px rgba(59,130,246,0.6)) drop-shadow(0 0 16px rgba(59,130,246,0.4))"
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Auto-Diagnostic</h3>
                      <span className="text-[10px] text-slate-400 dark:text-slate-300">Mesh Analysis</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-300">~5s</span>
                </div>
                
                {/* Mesh Health */}
                <div className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-300">Mesh Health</span>
                    <span className="font-medium text-slate-700 dark:text-white">{progress.scan >= 100 ? "100%" : `${progress.scan.toFixed(0)}%`}</span>
                  </div>
                  <div className="h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
                    <motion.div
                      className={progress.scan >= 100 ? "h-full bg-green-500" : "h-full bg-blue-500"}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.scan}%` }}
                    />
                  </div>
                </div>

                {/* Issues Found/Fixed */}
                <div className="grid grid-cols-3 gap-1.5 mb-3 text-center">
                  <div className={`rounded-lg py-1.5 bg-white dark:bg-slate-800/50 border ${progress.scan >= 100 ? "border-green-200 dark:border-green-500/30" : "border-amber-200 dark:border-amber-500/30"}`}>
                    <p className={`text-sm font-bold ${progress.scan >= 100 ? "text-green-600" : "text-amber-600"}`}>
                      {progress.scan >= 100 ? "0" : "12"}
                    </p>
                    <span className="text-[8px] text-slate-500 dark:text-slate-400">Edges</span>
                  </div>
                  <div className={`rounded-lg py-1.5 bg-white dark:bg-slate-800/50 border ${progress.scan >= 100 ? "border-green-200 dark:border-green-500/30" : "border-amber-200 dark:border-amber-500/30"}`}>
                    <p className={`text-sm font-bold ${progress.scan >= 100 ? "text-green-600" : "text-amber-600"}`}>
                      {progress.scan >= 100 ? "0" : "8"}
                    </p>
                    <span className="text-[8px] text-slate-500 dark:text-slate-400">Holes</span>
                  </div>
                  <div className={`rounded-lg py-1.5 bg-white dark:bg-slate-800/50 border ${progress.scan >= 100 ? "border-green-200 dark:border-green-500/30" : "border-amber-200 dark:border-amber-500/30"}`}>
                    <p className={`text-sm font-bold ${progress.scan >= 100 ? "text-green-600" : "text-amber-600"}`}>
                      {progress.scan >= 100 ? "0" : "4"}
                    </p>
                    <span className="text-[8px] text-slate-500 dark:text-slate-400">Normals</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={animateScan}
                  disabled={pipelineState !== "idle" || progress.scan > 0}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all backdrop-blur-md border shadow-lg shadow-black/30 antialiased ${
                    progress.scan >= 100
                      ? "bg-green-500/20 border-green-400/40 text-white"
                      : pipelineState === "scanning"
                      ? "bg-blue-500/20 border-blue-400/40 text-white"
                      : pipelineState !== "idle" || progress.scan > 0
                      ? "bg-slate-800/40 border-slate-600/30 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900/60 border-white/20 text-white hover:bg-slate-800/70 hover:border-white/30"
                  }`}
                >
                  {pipelineState === "scanning" ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-white" weight="fill" />
                  )}
                  <span className="tracking-wide">{progress.scan >= 100 ? "✓ Scanned" : pipelineState === "scanning" ? "Scanning..." : "Run Scan"}</span>
                </button>
              </motion.div>

              {/* Card 2: AI Auto-Heal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl backdrop-blur-xl transition-all duration-300 relative"
                style={{
                  background: pipelineState === "repairing" 
                    ? "linear-gradient(145deg, rgba(168,85,247,0.12) 0%, rgba(168,85,247,0.04) 100%)"
                    : progress.repair >= 100
                    ? "linear-gradient(145deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.04) 100%)"
                    : "linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.75) 100%)",
                  boxShadow: "0 4px 24px -2px rgba(0,0,0,0.08)"
                }}
              >
                {/* Gradient Border */}
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    padding: "1.5px",
                    background: "linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.08) 70%, rgba(255,255,255,0.15) 100%)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Sparkle 
                      size={36} 
                      weight="duotone" 
                      className={`${
                        progress.repair >= 100 
                          ? "text-green-500" 
                          : pipelineState === "repairing" 
                          ? "text-purple-500" 
                          : "text-purple-500"
                      }`}
                      style={{
                        filter: progress.repair >= 100 
                          ? "drop-shadow(0 0 8px rgba(34,197,94,0.6)) drop-shadow(0 0 16px rgba(34,197,94,0.4))"
                          : "drop-shadow(0 0 8px rgba(168,85,247,0.6)) drop-shadow(0 0 16px rgba(168,85,247,0.4))"
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white text-sm">AI Auto-Heal</h3>
                      <span className="text-[10px] text-slate-400 dark:text-slate-300">Mesh Repair</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 rounded-full text-purple-600 dark:text-purple-400">~4s</span>
                </div>

                {/* Repair Stats */}
                <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                  <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/30 rounded-lg px-3 py-2">
                    <span className="text-slate-400 dark:text-slate-400 text-[10px]">Algorithm</span>
                    <p className="font-medium text-slate-700 dark:text-white">LibIGL</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/30 rounded-lg px-3 py-2">
                    <span className="text-slate-400 dark:text-slate-400 text-[10px]">Precision</span>
                    <p className="font-medium text-slate-700 dark:text-white">High</p>
                  </div>
                </div>

                {/* Issues Fixed */}
                <div className={`rounded-lg py-2 px-3 mb-2 bg-white dark:bg-slate-800/50 border ${progress.repair >= 100 ? "border-green-200 dark:border-green-500/30" : "border-slate-200 dark:border-slate-600/30"}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Issues Fixed</span>
                    <span className={`text-sm font-bold ${progress.repair >= 100 ? "text-green-600" : "text-slate-400"}`}>
                      {progress.repair >= 100 ? "24/24" : "0/24"}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="h-1.5 bg-slate-200/50 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className={progress.repair >= 100 ? "h-full bg-green-500" : "h-full bg-purple-500"}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.repair}%` }}
                  />
                </div>

                {/* Action Button */}
                <button
                  onClick={animateRepair}
                  disabled={progress.scan < 100 || progress.repair >= 100}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all backdrop-blur-md border shadow-lg shadow-black/30 antialiased ${
                    progress.repair >= 100
                      ? "bg-green-500/20 border-green-400/40 text-white"
                      : pipelineState === "repairing"
                      ? "bg-purple-500/20 border-purple-400/40 text-white"
                      : progress.scan < 100
                      ? "bg-slate-800/40 border-slate-600/30 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900/60 border-white/20 text-white hover:bg-slate-800/70 hover:border-white/30"
                  }`}
                >
                  {pipelineState === "repairing" ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MagicWand className="w-3.5 h-3.5 text-white" weight="fill" />
                  )}
                  <span className="tracking-wide">{progress.repair >= 100 ? "✓ Repaired" : pipelineState === "repairing" ? "Healing..." : "Auto-Heal"}</span>
                </button>
              </motion.div>

              {/* Card 3: GPU Render - Spans full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="col-span-2 p-4 rounded-xl backdrop-blur-xl transition-all duration-300 relative"
                style={{
                  background: pipelineState === "rendering" 
                    ? "linear-gradient(145deg, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.04) 100%)"
                    : progress.render >= 100
                    ? "linear-gradient(145deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.04) 100%)"
                    : "linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.75) 100%)",
                  boxShadow: "0 4px 24px -2px rgba(0,0,0,0.08)"
                }}
              >
                {/* Gradient Border */}
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    padding: "1.5px",
                    background: "linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.08) 70%, rgba(255,255,255,0.15) 100%)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Cpu 
                      size={36} 
                      weight="duotone" 
                      className={`${progress.render >= 100 ? "text-green-500" : pipelineState === "rendering" ? "text-cyan-500" : "text-slate-400"}`}
                      style={{
                        filter: progress.render >= 100 
                          ? "drop-shadow(0 0 8px rgba(34,197,94,0.6)) drop-shadow(0 0 16px rgba(34,197,94,0.4))"
                          : pipelineState === "rendering"
                          ? "drop-shadow(0 0 8px rgba(6,182,212,0.6)) drop-shadow(0 0 16px rgba(6,182,212,0.4))"
                          : "none"
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Cloud Render</h3>
                      <span className="text-[10px] text-slate-400 dark:text-slate-300">GPU Accelerated</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-cyan-100 dark:bg-cyan-500/20 rounded-full text-cyan-600 dark:text-cyan-400">~8s</span>
                </div>

                {/* GPU Info Grid - Horizontal */}
                <div className="flex gap-2 mb-2 text-xs">
                  <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/30 rounded-lg px-3 py-2 flex-1">
                    <span className="text-slate-400 dark:text-slate-400 text-[10px]">GPU</span>
                    <p className="font-medium text-slate-700 dark:text-white">A100</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/30 rounded-lg px-3 py-2 flex-1">
                    <span className="text-slate-400 dark:text-slate-400 text-[10px]">Samples</span>
                    <p className="font-medium text-slate-700 dark:text-white">1024</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/30 rounded-lg px-3 py-2 flex-1">
                    <span className="text-slate-400 dark:text-slate-400 text-[10px]">Resolution</span>
                    <p className="font-medium text-slate-700 dark:text-white">4K</p>
                  </div>
                  <div className={`rounded-lg px-3 py-2 flex-1 bg-white dark:bg-slate-800/50 border ${progress.render >= 100 ? "border-green-200 dark:border-green-500/30" : "border-slate-200 dark:border-slate-600/30"}`}>
                    <span className="text-slate-400 dark:text-slate-400 text-[10px]">Output</span>
                    <p className={`font-medium ${progress.render >= 100 ? "text-green-600" : "text-slate-400"}`}>
                      {progress.render >= 100 ? "Ready" : "---"}
                    </p>
                  </div>
                </div>

                {/* Render Stats */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className={`rounded-lg py-1.5 text-center bg-white dark:bg-slate-800/50 border ${progress.render >= 100 ? "border-green-200 dark:border-green-500/30" : "border-slate-200 dark:border-slate-600/30"}`}>
                    <p className={`text-sm font-bold ${progress.render >= 100 ? "text-green-600" : "text-slate-400"}`}>
                      {progress.render >= 100 ? "1024" : "0"}
                    </p>
                    <span className="text-[8px] text-slate-500 dark:text-slate-400">Samples Done</span>
                  </div>
                  <div className={`rounded-lg py-1.5 text-center bg-white dark:bg-slate-800/50 border ${progress.render >= 100 ? "border-green-200 dark:border-green-500/30" : "border-slate-200 dark:border-slate-600/30"}`}>
                    <p className={`text-sm font-bold ${progress.render >= 100 ? "text-green-600" : "text-slate-400"}`}>
                      {progress.render >= 100 ? "3.2s" : "---"}
                    </p>
                    <span className="text-[8px] text-slate-500 dark:text-slate-400">Render Time</span>
                  </div>
                  <div className={`rounded-lg py-1.5 text-center bg-white dark:bg-slate-800/50 border ${progress.render >= 100 ? "border-green-200 dark:border-green-500/30" : "border-slate-200 dark:border-slate-600/30"}`}>
                    <p className={`text-sm font-bold ${progress.render >= 100 ? "text-green-600" : "text-slate-400"}`}>
                      {progress.render >= 100 ? "12MB" : "---"}
                    </p>
                    <span className="text-[8px] text-slate-500 dark:text-slate-400">File Size</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="h-1.5 bg-slate-200/50 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className={progress.render >= 100 ? "h-full bg-green-500" : "h-full bg-cyan-500"}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.render}%` }}
                  />
                </div>

                {/* Action Button */}
                <button
                  onClick={animateRender}
                  disabled={progress.repair < 100 || progress.render >= 100}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all backdrop-blur-md border shadow-lg shadow-black/30 antialiased ${
                    progress.render >= 100
                      ? "bg-green-500/20 border-green-400/40 text-white"
                      : pipelineState === "rendering"
                      ? "bg-cyan-500/20 border-cyan-400/40 text-white"
                      : progress.repair < 100
                      ? "bg-slate-800/40 border-slate-600/30 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900/60 border-white/20 text-white hover:bg-slate-800/70 hover:border-white/30"
                  }`}
                >
                  {pipelineState === "rendering" ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Cpu className="w-3.5 h-3.5 text-white" weight="fill" />
                  )}
                  <span className="tracking-wide">{progress.render >= 100 ? "✓ Complete" : pipelineState === "rendering" ? "Rendering..." : "Cloud Render"}</span>
                </button>
              </motion.div>

              {/* Card 4: CO₂ Estimate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="p-4 rounded-xl backdrop-blur-xl relative"
                style={{
                  background: "linear-gradient(145deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%)",
                  boxShadow: "0 4px 24px -2px rgba(0,0,0,0.08)"
                }}
              >
                {/* Gradient Border */}
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    padding: "1.5px",
                    background: "linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.08) 70%, rgba(255,255,255,0.15) 100%)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Leaf 
                      size={36} 
                      weight="duotone" 
                      className="text-emerald-500"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(16,185,129,0.6)) drop-shadow(0 0 16px rgba(16,185,129,0.4))"
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white text-sm">CO₂ Estimate</h3>
                      <span className="text-[10px] text-slate-400 dark:text-slate-300">Sustainability</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400">Eco</span>
                </div>

                {/* CO2 Value */}
                <div className="text-center py-2 bg-white dark:bg-slate-800/50 border border-emerald-200 dark:border-emerald-500/30 rounded-lg mb-2">
                  <span className="text-2xl font-bold text-emerald-600">0.2g</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">CO₂ Emitted</p>
                </div>

                {/* Eco Stats */}
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <div className="bg-white dark:bg-slate-800/50 border border-emerald-200 dark:border-emerald-500/30 rounded-lg py-1.5 text-center">
                    <p className="text-xs font-bold text-emerald-600">92%</p>
                    <span className="text-[8px] text-slate-500 dark:text-slate-400">Efficiency</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 border border-emerald-200 dark:border-emerald-500/30 rounded-lg py-1.5 text-center">
                    <p className="text-xs font-bold text-emerald-600">Green</p>
                    <span className="text-[8px] text-slate-500 dark:text-slate-400">Node Type</span>
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center">Powered by renewable energy</p>
              </motion.div>

              {/* Card 5: Cost Estimate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-4 rounded-xl backdrop-blur-xl relative"
                style={{
                  background: "linear-gradient(145deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%)",
                  boxShadow: "0 4px 24px -2px rgba(0,0,0,0.08)"
                }}
              >
                {/* Gradient Border */}
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    padding: "1.5px",
                    background: "linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.08) 70%, rgba(255,255,255,0.15) 100%)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Wallet 
                      size={36} 
                      weight="duotone" 
                      className="text-amber-500"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(245,158,11,0.6)) drop-shadow(0 0 16px rgba(245,158,11,0.4))"
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Cost Estimate</h3>
                      <span className="text-[10px] text-slate-400 dark:text-slate-300">Billing</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-400">USD</span>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-1.5 mb-2 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Diagnostic</span>
                    <span className="font-medium text-slate-700 dark:text-white">$0.005</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">AI-Repair</span>
                    <span className="font-medium text-slate-700 dark:text-white">$0.020</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">GPU Render</span>
                    <span className="font-medium text-slate-700 dark:text-white">$0.015</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-white dark:bg-slate-800/50 border border-amber-200 dark:border-amber-500/30 rounded-lg p-2 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-700 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-amber-600">$0.040</span>
                  </div>
                  <div className="flex justify-between text-[9px] mt-1">
                    <span className="text-slate-400 dark:text-slate-500">Credits</span>
                    <span className="font-medium text-amber-600">40 CR</span>
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center">⚡ Pay-per-use pricing</p>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
