"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
import { SCENE_CONFIG, MODEL_CONFIG } from "../constants/pipeline";
import type { PipelineState, PipelineProgress } from "../types";

interface UseBabylonSceneProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  modelUrl: string;
  pipelineState: PipelineState;
  progress: PipelineProgress;
  onModelLoaded?: () => void;
}

export function useBabylonScene({
  canvasRef,
  modelUrl,
  pipelineState,
  progress,
  onModelLoaded,
}: UseBabylonSceneProps) {
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const modelMeshesRef = useRef<AbstractMesh[]>([]);
  const clipPlaneRef = useRef<Plane | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Initialize scene
  const initializeScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
    });

    const scene = new Scene(engine);
    const { background } = SCENE_CONFIG;
    scene.clearColor = new Color4(...background.color);

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
    camera.lowerBetaLimit = camConfig.lowerBetaLimit;
    camera.upperBetaLimit = camConfig.upperBetaLimit;
    camera.wheelPrecision = camConfig.wheelPrecision;
    camera.panningSensibility = camConfig.panningSensibility;
    camera.inertia = camConfig.inertia;

    // Lighting
    const { lighting } = SCENE_CONFIG;
    const ambientLight = new HemisphericLight(
      "ambient",
      new Vector3(...lighting.ambient.direction),
      scene
    );
    ambientLight.intensity = lighting.ambient.intensity;

    const keyLight = new DirectionalLight(
      "keyLight",
      new Vector3(-1, -2, -1),
      scene
    );
    keyLight.position = new Vector3(...lighting.key.position);
    keyLight.intensity = lighting.key.intensity;

    // Shadow generator
    const shadowGenerator = new ShadowGenerator(1024, keyLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
    shadowGenerator.darkness = lighting.key.shadowDarkness;

    // Ground for shadows
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      scene
    );
    ground.position.y = -0.5;
    const shadowMaterial = new ShadowOnlyMaterial("shadowMat", scene);
    shadowMaterial.activeLight = keyLight;
    ground.material = shadowMaterial;
    ground.receiveShadows = true;

    // Glow layer
    const glowLayer = new GlowLayer("glow", scene);
    glowLayer.intensity = 0.3;

    // Initialize clip plane
    clipPlaneRef.current = new Plane(0, -1, 0, MODEL_CONFIG.clipPlane.startY);

    return { engine, scene, shadowGenerator };
  }, [canvasRef]);

  // Load model
  const loadModel = useCallback(
    async (scene: Scene, shadowGenerator: ShadowGenerator) => {
      try {
        setIsLoading(true);
        setLoadingProgress(0);

        const result = await SceneLoader.ImportMeshAsync(
          "",
          "",
          modelUrl,
          scene,
          (event) => {
            if (event.lengthComputable) {
              const progress = (event.loaded / event.total) * 100;
              setLoadingProgress(progress);
            }
          }
        );

        modelMeshesRef.current = result.meshes.filter(
          (mesh) => mesh.name !== "__root__"
        );

        // Setup meshes
        modelMeshesRef.current.forEach((mesh) => {
          mesh.receiveShadows = true;
          shadowGenerator.addShadowCaster(mesh);

          if (mesh.material) {
            mesh.material.backFaceCulling = false;
            if (clipPlaneRef.current) {
              mesh.material.clipPlane = clipPlaneRef.current;
            }
          }
        });

        setIsLoading(false);
        onModelLoaded?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load model");
        setIsLoading(false);
      }
    },
    [modelUrl, onModelLoaded]
  );

  // Main effect
  useEffect(() => {
    const result = initializeScene();
    if (!result) return;

    const { engine, scene, shadowGenerator } = result;
    engineRef.current = engine;
    sceneRef.current = scene;

    loadModel(scene, shadowGenerator);

    engine.runRenderLoop(() => {
      scene.render();
    });

    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      engine.dispose();
    };
  }, [initializeScene, loadModel]);

  // Clip plane animation for scan
  useEffect(() => {
    if (!clipPlaneRef.current || !modelMeshesRef.current.length) return;

    if (pipelineState === "scanning") {
      const startY = MODEL_CONFIG.clipPlane.startY;
      const endY = MODEL_CONFIG.clipPlane.endY;
      const newY = Scalar.Lerp(startY, endY, progress.scan / 100);
      clipPlaneRef.current.d = newY;

      modelMeshesRef.current.forEach((mesh) => {
        if (mesh.material) {
          mesh.material.clipPlane = clipPlaneRef.current;
        }
      });
    }
  }, [pipelineState, progress.scan]);

  return {
    isLoading,
    loadingProgress,
    error,
    scene: sceneRef.current,
  };
}
