"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useViewerStore } from "../store/useViewerStore";
import * as THREE from "three";

export default function SectionPlane() {
  const { scene } = useThree();
  const clippingEnabled = useViewerStore((state) => state.clippingEnabled);
  const clippingLevel = useViewerStore((state) => state.clippingLevel);

  useEffect(() => {
    if (!scene) return;

    // Create clipping plane (pointing upwards for horizontal cut)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -clippingLevel);

    // Apply clipping plane to all materials in the scene
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if (clippingEnabled) {
              mat.clippingPlanes = [plane];
              mat.clipShadows = true;
            } else {
              mat.clippingPlanes = [];
            }
            mat.needsUpdate = true;
          });
        }
      }
    });

    return () => {
      // Cleanup: remove clipping planes
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              mat.clippingPlanes = [];
              mat.needsUpdate = true;
            });
          }
        }
      });
    };
  }, [scene, clippingEnabled, clippingLevel]);

  return null;
}
