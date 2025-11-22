"use client";

import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { PresentationControls, ContactShadows, Environment, OrbitControls, useGLTF, Grid, Select, TransformControls } from "@react-three/drei";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import { Suspense, useCallback, useEffect, useState, useMemo } from "react";
import { useViewerStore } from "../store/useViewerStore";
import ModelErrorFallback from "./ModelErrorFallback";
import { useModelStats, calculateCarbonFootprint } from "../hooks/useModelStats";
import * as THREE from "three";
import ScreenshotHandler from "./ScreenshotHandler";
import ScreenshotManager from "./ScreenshotManager";
import Effects from "./Effects";
import RenderModalWrapper from "./RenderModalWrapper";
import Annotations from "./Annotations";
import Measurements from "./Measurements";
import SectionPlane from "./SectionPlane";

interface ModelProps {
  url: string;
  readOnly?: boolean;
}

function Model({ url, readOnly = false }: ModelProps) {
  
  // Check file extension
  const fileExtension = url.split('.').pop()?.toLowerCase();
  
  // Check if file format is supported
  const supportedFormats = ['gltf', 'glb'];
  if (!supportedFormats.includes(fileExtension || '')) {
    console.warn(`Unsupported file format: ${fileExtension}`);
    return null; // Let ErrorBoundary handle it
  }
  
  const { scene } = useGLTF(url, true);
  
  if (!scene) {
    return null;
  }
  const setModelStats = useViewerStore((state) => state.setModelStats);
  const setCarbonScore = useViewerStore((state) => state.setCarbonScore);
  const selectMesh = useViewerStore((state) => state.selectMesh);
  const selectedMeshId = useViewerStore((state) => state.selectedMeshId);
  const selectedMaterialColor = useViewerStore((state) => state.selectedMaterialColor);
  const transformMode = useViewerStore((state) => state.transformMode);
  const setSceneNodes = useViewerStore((state) => state.setSceneNodes);
  const isAnnotationMode = useViewerStore((state) => state.isAnnotationMode);
  const addAnnotation = useViewerStore((state) => state.addAnnotation);
  const isMeasurementMode = useViewerStore((state) => state.isMeasurementMode);
  
  const handleStats = useCallback((stats: any) => {
    setModelStats(stats);
    const score = calculateCarbonFootprint(stats.triangles);
    setCarbonScore(score);
  }, [setModelStats, setCarbonScore]);

  // Build scene graph
  useEffect(() => {
    const nodes: Array<{ uuid: string; name: string; type: string }> = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        nodes.push({
          uuid: child.uuid,
          name: child.name || 'Unnamed',
          type: child.type
        });
      }
    });
    setSceneNodes(nodes);
  }, [scene, setSceneNodes]);
  
  useModelStats(scene, handleStats);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    if (readOnly) return;
    
    // Priority 1: Measurement mode - do nothing, let Measurements component handle it
    if (isMeasurementMode) {
      return;
    }
    
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    if (mesh.isMesh && mesh.material) {
      const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
        const currentColor = `#${material.color.getHexString()}`;
        selectMesh(mesh.uuid, currentColor);
      }
    }
  }, [selectMesh, readOnly, isMeasurementMode]);

  const handleDoubleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    if (readOnly || !isAnnotationMode) return;
    e.stopPropagation();
    
    const position: [number, number, number] = [e.point.x, e.point.y, e.point.z];
    const content = prompt("Enter your comment:");
    
    if (content && content.trim()) {
      const annotation = {
        id: Date.now().toString(),
        position,
        content: content.trim(),
        author: "User"
      };
      addAnnotation(annotation);
    }
  }, [readOnly, isAnnotationMode, addAnnotation]);

  // Apply color changes to selected mesh
  useEffect(() => {
    if (selectedMeshId) {
      scene.traverse((child) => {
        if (child.uuid === selectedMeshId && (child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshBasicMaterial) {
                mat.color.set(selectedMaterialColor);
              }
            });
          }
        }
      });
    }
  }, [selectedMeshId, selectedMaterialColor, scene]);
  
  const selectedObject = selectedMeshId ? scene.getObjectByProperty('uuid', selectedMeshId) : null;

  return (
    <>
      {!readOnly && transformMode && selectedObject ? (
        <TransformControls object={selectedObject} mode={transformMode}>
          <primitive object={scene} onClick={handleClick} onDoubleClick={handleDoubleClick} />
        </TransformControls>
      ) : (
        <primitive 
          object={scene} 
          onClick={readOnly ? undefined : handleClick} 
          onDoubleClick={readOnly ? undefined : handleDoubleClick}
        />
      )}
    </>
  );
}

function CameraController() {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    const handleReset = () => {
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      gl.domElement.dispatchEvent(new Event('dblclick'));
    };
    
    window.addEventListener('resetCamera', handleReset);
    return () => window.removeEventListener('resetCamera', handleReset);
  }, [camera, gl]);
  
  return null;
}

interface SceneProps {
  fileUrl: string;
  readOnly?: boolean;
}

export default function Scene({ fileUrl, readOnly = false }: SceneProps) {
  const [modelError, setModelError] = useState<string | null>(null);
  const showGrid = useViewerStore((state) => state.gridVisible);
  const autoRotate = useViewerStore((state) => state.autoRotate);
  const environmentPreset = useViewerStore((state) => state.environmentPreset);
  const showBackground = useViewerStore((state) => state.showBackground);
  const backgroundColor = useViewerStore((state) => state.backgroundColor);
  const cameraFov = useViewerStore((state) => state.cameraFov);
  const isOrthographic = useViewerStore((state) => state.isOrthographic);
  const environmentRotation = useViewerStore((state) => state.environmentRotation);
  const lightIntensity = useViewerStore((state) => state.lightIntensity);


  const handleRetry = () => {
    setModelError(null);
    window.location.reload();
  };

  return (
    <div className="h-full w-full relative">
      {modelError && <ModelErrorFallback error={modelError} onRetry={handleRetry} />}
      <RenderModalWrapper />
      <Canvas 
        camera={{ 
          position: [0, 0, 5], 
          fov: cameraFov,
          near: 0.1,
          far: 1000,
          ...(isOrthographic && { 
            orthographic: true,
            zoom: 100
          })
        }} 
        shadows
        gl={{ logarithmicDepthBuffer: true, localClippingEnabled: true }}
      >
        {!showBackground && <color attach="background" args={[backgroundColor]} />}
        <CameraController />
        <ScreenshotHandler />
        <ScreenshotManager />
        <Suspense fallback={null}>
          <Environment 
            preset={environmentPreset} 
            background={showBackground} 
            blur={0.8}
            environmentRotation={[0, (environmentRotation * Math.PI) / 180, 0]}
          />
          
          <ambientLight intensity={0.5 * lightIntensity} />
          <directionalLight position={[10, 10, 5]} intensity={lightIntensity} castShadow />
          
          {fileUrl && <Model key={fileUrl} url={fileUrl} readOnly={readOnly} />}
          {!readOnly && <Annotations />}
          {!readOnly && <Measurements />}
          {!readOnly && <SectionPlane />}
          
          <ContactShadows 
            resolution={1024} 
            scale={50} 
            blur={2} 
            opacity={0.4} 
            far={10} 
            color="#000000" 
          />
          
          {showGrid && (
            <Grid
              infiniteGrid={true}
              sectionColor="#555"
              cellColor="white"
              fadeDistance={50}
              fadeStrength={0.5}
              position={[0, -0.5, 0]}
            />
          )}
        </Suspense>
        
        <Effects />
        
        <OrbitControls 
          makeDefault 
          autoRotate={autoRotate} 
          autoRotateSpeed={2}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
