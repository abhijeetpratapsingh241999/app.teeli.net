"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
  SpotLight,
  Vector3,
  MeshBuilder,
  Color3,
  Color4,
  ShadowGenerator,
  AbstractMesh,
  Mesh,
  StandardMaterial,
  PBRMaterial,
  Scalar,
  Plane,
  GlowLayer,
  TransformNode,
} from "@babylonjs/core";
import { ShadowOnlyMaterial } from "@babylonjs/materials";
import "@babylonjs/loaders/glTF";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { SCENE_CONFIG } from "../../constants/pipeline";
import type { ViewerProps, PipelineState } from "../../types";

export function BabylonCanvas({
  modelUrl,
  pipelineState,
  onSceneReady,
  onModelLoaded,
  onProgressUpdate,
  onStateChange,
  animationControlsRef,
}: ViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  
  // Mesh refs
  const meshARef = useRef<AbstractMesh | null>(null);
  const meshBRef = useRef<AbstractMesh | null>(null);
  const anchorRef = useRef<TransformNode | null>(null);
  const wireframeMaterialRef = useRef<StandardMaterial | null>(null);
  const solidMaterialsRef = useRef<PBRMaterial[]>([]);
  
  // Animation refs
  const animationRef = useRef<number | null>(null);
  const boundsRef = useRef({ minY: -1, maxY: 1 });
  const scanLineYRef = useRef(1);
  const pipelineStateRef = useRef<PipelineState>("idle");
  
  // Lighting refs
  const spotLightRef = useRef<SpotLight | null>(null);
  const glowLayerRef = useRef<GlowLayer | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Keep pipelineStateRef in sync
  useEffect(() => {
    pipelineStateRef.current = pipelineState;
  }, [pipelineState]);

  // ========================================================================
  // HELPER: Update Wireframe Clip Plane
  // ========================================================================
  const updateWireframeClip = useCallback((scanY: number) => {
    const wireMat = wireframeMaterialRef.current;
    if (!wireMat) return;
    wireMat.clipPlane = new Plane(0, -1, 0, scanY);
  }, []);

  // ========================================================================
  // ANIMATION: Scan (Diagnosis)
  // ========================================================================
  const startScan = useCallback(() => {
    if (pipelineStateRef.current !== "idle") return;
    
    onStateChange?.("scanning");
    onProgressUpdate?.({ scan: 0 });

    if (spotLightRef.current) spotLightRef.current.intensity = 0.3;
    if (glowLayerRef.current) glowLayerRef.current.intensity = 1.2;

    if (wireframeMaterialRef.current) {
      wireframeMaterialRef.current.emissiveColor = new Color3(1, 0.1, 0.1);
    }

    const { minY, maxY } = boundsRef.current;
    const duration = 5000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      const scanY = Scalar.Lerp(maxY, minY, t);
      scanLineYRef.current = scanY;

      updateWireframeClip(scanY);
      onProgressUpdate?.({ scan: t * 100 });

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
        if (wireframeMaterialRef.current) {
          wireframeMaterialRef.current.clipPlane = null;
        }
        onStateChange?.("idle");
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [onProgressUpdate, onStateChange, updateWireframeClip]);

  // ========================================================================
  // ANIMATION: Repair
  // ========================================================================
  const startRepair = useCallback(() => {
    if (pipelineStateRef.current !== "idle") return;
    
    onStateChange?.("repairing");
    const wireMat = wireframeMaterialRef.current;
    if (!wireMat) return;

    wireMat.alpha = 0.4;
    const duration = 4000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);

      if (t < 0.25) {
        const phase = t / 0.25;
        const flash = Math.sin(phase * Math.PI * 4) * 0.5 + 0.5;
        wireMat.emissiveColor = new Color3(0.5 - flash * 0.4, flash * 0.5, 0.1);
      } else {
        const phase = (t - 0.25) / 0.75;
        const smooth = phase * phase * (3 - 2 * phase);
        wireMat.emissiveColor = new Color3(
          0.1 * (1 - smooth),
          0.5 - smooth * 0.2,
          0.1 + smooth * 0.5
        );
      }

      onProgressUpdate?.({ repair: t * 100 });

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
        wireMat.emissiveColor = new Color3(0, 0.3, 0.6);
        onStateChange?.("idle");
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [onProgressUpdate, onStateChange]);

  // ========================================================================
  // ANIMATION: Render
  // ========================================================================
  const startRender = useCallback(() => {
    if (pipelineStateRef.current !== "idle") return;
    
    onStateChange?.("rendering");

    const { minY, maxY } = boundsRef.current;
    const duration = 8000;
    const startTime = performance.now();

    if (wireframeMaterialRef.current) {
      wireframeMaterialRef.current.clipPlane = new Plane(0, -1, 0, minY);
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      const timeSeconds = elapsed / 1000;
      const scanY = Scalar.Lerp(minY, maxY, t);
      
      updateWireframeClip(scanY);

      const spotLight = spotLightRef.current;
      const glowLayer = glowLayerRef.current;

      if (spotLight && glowLayer) {
        if (timeSeconds < 2) {
          spotLight.intensity = 0.3;
          glowLayer.intensity = 1.0;
        } else if (timeSeconds < 5) {
          const flicker = Math.random() * 0.4 + 0.4;
          spotLight.intensity = flicker;
          glowLayer.intensity = flicker * 0.8;
        } else {
          const rampT = (timeSeconds - 5) / 3;
          const intensity = Scalar.Lerp(0.5, 1.0, rampT);
          spotLight.intensity = intensity;
          glowLayer.intensity = intensity * 0.8;
        }
      }

      onProgressUpdate?.({ render: t * 100 });

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
        if (spotLight) spotLight.intensity = 1.0;
        if (glowLayer) glowLayer.intensity = 0.8;
        if (wireframeMaterialRef.current) {
          wireframeMaterialRef.current.clipPlane = new Plane(0, -1, 0, maxY + 1);
        }
        onStateChange?.("complete");
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [onProgressUpdate, onStateChange, updateWireframeClip]);

  // Expose animation controls
  useEffect(() => {
    if (animationControlsRef) {
      animationControlsRef.current = {
        startScan,
        startRepair,
        startRender,
      };
    }
  }, [animationControlsRef, startScan, startRepair, startRender]);

  // ========================================================================
  // SCENE INITIALIZATION
  // ========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
      alpha: true,
    });
    engineRef.current = engine;

    const scene = new Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new Color4(0, 0, 0, 0);

    // Camera setup
    const { camera: camConfig } = SCENE_CONFIG;
    const camera = new ArcRotateCamera(
      "camera",
      camConfig.alpha,
      camConfig.beta,
      camConfig.radius,
      new Vector3(...camConfig.target),
      scene
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = camConfig.lowerRadiusLimit;
    camera.upperRadiusLimit = camConfig.upperRadiusLimit;
    camera.wheelPrecision = camConfig.wheelPrecision;
    camera.panningSensibility = camConfig.panningSensibility;

    // Lighting
    const { lighting } = SCENE_CONFIG;
    const ambientLight = new HemisphericLight(
      "ambient",
      new Vector3(...lighting.ambient.direction),
      scene
    );
    ambientLight.intensity = lighting.ambient.intensity;

    new DirectionalLight("keyLight", new Vector3(-1, -0.5, 1), scene).intensity = 2.5;

    const spotLight = new SpotLight(
      "spot",
      new Vector3(0, 5, 0),
      new Vector3(0, -1, 0),
      Math.PI / 3,
      2,
      scene
    );
    spotLight.intensity = 1.0;
    spotLightRef.current = spotLight;

    // Shadow generator
    const shadowGenerator = new ShadowGenerator(2048, spotLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;

    // Glow layer
    const glowLayer = new GlowLayer("glow", scene, {
      mainTextureFixedSize: 1024,
      blurKernelSize: 64,
    });
    glowLayer.intensity = 2.5;
    glowLayerRef.current = glowLayer;

    // Ground for shadows
    const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
    ground.position.y = -1.5;
    const shadowMaterial = new ShadowOnlyMaterial("shadowMat", scene);
    shadowMaterial.activeLight = spotLight;
    shadowMaterial.alpha = 0.5;
    ground.material = shadowMaterial;
    ground.receiveShadows = true;

    // Wireframe material
    const wireframeMat = new StandardMaterial("wireframeMat", scene);
    wireframeMat.wireframe = true;
    wireframeMat.emissiveColor = new Color3(1, 0.2, 0.2);
    wireframeMat.disableLighting = true;
    wireframeMat.backFaceCulling = false;
    wireframeMat.alpha = 0.9;
    wireframeMaterialRef.current = wireframeMat;

    // Load model
    SceneLoader.ImportMeshAsync("", "", modelUrl, scene, (event) => {
      if (event.lengthComputable) {
        setLoadingProgress((event.loaded / event.total) * 100);
      }
    }).then((result) => {
      if (result.meshes.length > 0) {
        const rootMesh = result.meshes[0];
        
        // Collect PBR materials
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

        // Boost emission for neon glow
        pbrMaterials.forEach((mat) => {
          mat.emissiveColor = new Color3(0, 1, 1);
          mat.emissiveIntensity = 3.0;
          mat.metallic = 1.0;
          mat.roughness = 0.15;
          mat.environmentIntensity = 1.5;
        });

        // Scale and center model
        const initBounds = rootMesh.getHierarchyBoundingVectors(true);
        const size = initBounds.max.subtract(initBounds.min);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 2.5 / maxDim;
        rootMesh.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);

        result.meshes.forEach((m) => {
          if (m instanceof Mesh) m.refreshBoundingInfo();
        });
        const finalBounds = rootMesh.getHierarchyBoundingVectors(true);
        const centerY = (finalBounds.min.y + finalBounds.max.y) / 2;
        
        // Store bounds for animations
        const worldBounds = rootMesh.getHierarchyBoundingVectors(true);
        boundsRef.current = {
          minY: worldBounds.min.y - 0.1,
          maxY: worldBounds.max.y + 0.1,
        };

        // Create anchor for floating animation
        const anchor = new TransformNode("root_anchor", scene);
        anchor.position.y = 0;
        anchorRef.current = anchor;
        
        rootMesh.parent = anchor;
        rootMesh.position.y = -centerY;
        meshARef.current = rootMesh;

        // Clone for wireframe overlay
        const clonedRoot = rootMesh.clone("meshB_wire", null);
        if (clonedRoot) {
          clonedRoot.parent = anchor;
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

        // Initial state: hide wireframe completely
        const { maxY } = boundsRef.current;
        scanLineYRef.current = maxY;
        pbrMaterials.forEach((mat) => {
          mat.clipPlane = null;
        });
        wireframeMat.clipPlane = new Plane(0, -1, 0, maxY + 0.5);
      }

      setIsLoading(false);
      onModelLoaded?.();
      onSceneReady?.();
    });

    // Render loop with floating animation and alive flicker
    engine.runRenderLoop(() => {
      const floatTime = Date.now() * 0.0015;
      const anchor = anchorRef.current;
      
      if (anchor) {
        anchor.position.y = Math.sin(floatTime) * 0.15;
        anchor.rotation.z = Math.cos(floatTime * 0.8) * 0.08;
        anchor.rotation.x = Math.sin(floatTime * 0.6) * 0.08;
      }
      
      // Alive flicker effect when idle or complete
      const currentState = pipelineStateRef.current;
      const isLightOn = currentState === "idle" || currentState === "complete";
      
      if (isLightOn && solidMaterialsRef.current.length > 0) {
        const time = Date.now() * 0.002;
        const breath = Math.sin(time) * 0.3;
        const noise = (Math.random() - 0.5) * 0.15;
        const targetIntensity = 3.0 + breath + noise;
        
        solidMaterialsRef.current.forEach((mat) => {
          mat.emissiveIntensity = targetIntensity;
        });
      }
      
      scene.render();
    });

    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      engine.dispose();
    };
  }, [modelUrl, onModelLoaded, onSceneReady]);

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-2xl outline-none"
        style={{ touchAction: "none" }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-2xl"
        >
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-400 mb-2">Loading 3D Model...</p>
          <div className="w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              animate={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {loadingProgress.toFixed(0)}%
          </p>
        </motion.div>
      )}
    </div>
  );
}
