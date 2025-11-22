import { useEffect } from "react";
import * as THREE from "three";

interface ModelStats {
  triangles: number;
  materials: number;
  meshes: number;
  meshNames: string[];
  textures: number;
  textureMemory: number;
  vertices: number;
  drawCalls: number;
  loadTime: number;
  complexity: 'Low' | 'Medium' | 'High' | 'Very High';
  optimizationScore: number;
  recommendations: string[];
}

export function calculateCarbonFootprint(triangles: number): string {
  // Assume 100k triangles = 0.5g CO2 per second
  const co2PerSecond = (triangles / 100000) * 0.5;
  
  if (co2PerSecond < 0.3) {
    return "Eco-Friendly 🌿";
  } else if (co2PerSecond < 1.0) {
    return "Moderate ⚠️";
  } else {
    return "High Emission 🏭";
  }
}

export function useModelStats(scene: THREE.Group | null, onStats: (stats: ModelStats) => void) {
  useEffect(() => {
    if (!scene) return;

    const startTime = performance.now();
    let triangles = 0;
    let vertices = 0;
    let meshes = 0;
    const materialUUIDs = new Set<string>();
    const textureUUIDs = new Set<string>();
    const meshNames: string[] = [];
    let totalTextureMemory = 0;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes++;
        const mesh = child as THREE.Mesh;
        
        // Count triangles and vertices
        if (mesh.geometry) {
          const geometry = mesh.geometry;
          if (geometry.index) {
            triangles += geometry.index.count / 3;
            vertices += geometry.index.count;
          } else if (geometry.attributes.position) {
            triangles += geometry.attributes.position.count / 3;
            vertices += geometry.attributes.position.count;
          }
        }

        // Collect unique materials and textures
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat: any) => {
            materialUUIDs.add(mat.uuid);
            
            // Check for textures
            Object.keys(mat).forEach(key => {
              const value = mat[key];
              if (value && value.isTexture && !textureUUIDs.has(value.uuid)) {
                textureUUIDs.add(value.uuid);
                
                // Estimate texture memory
                const width = value.image?.width || 512;
                const height = value.image?.height || 512;
                const memory = (width * height * 4) / (1024 * 1024); // MB
                totalTextureMemory += memory;
              }
            });
          });
        }

        // Collect mesh names
        if (mesh.name) {
          meshNames.push(mesh.name);
        }
      }
    });

    // Calculate performance metrics
    const loadTime = Math.round(performance.now() - startTime);
    let complexity: 'Low' | 'Medium' | 'High' | 'Very High' = 'Low';
    
    if (triangles < 10000) complexity = 'Low';
    else if (triangles < 50000) complexity = 'Medium';
    else if (triangles < 200000) complexity = 'High';
    else complexity = 'Very High';
    
    // Calculate optimization score
    let score = 100;
    if (triangles > 100000) score -= 20;
    if (totalTextureMemory > 50) score -= 15;
    if (meshes > 100) score -= 15;
    if (materialUUIDs.size > 50) score -= 10;
    
    // Generate recommendations
    const recommendations: string[] = [];
    if (triangles > 100000) recommendations.push('Reduce polygon count for better performance');
    if (totalTextureMemory > 50) recommendations.push('Optimize texture sizes to reduce memory usage');
    if (meshes > 100) recommendations.push('Consider merging small meshes');
    if (materialUUIDs.size > 50) recommendations.push('Reduce number of unique materials');

    const stats: ModelStats = {
      triangles: Math.round(triangles),
      materials: materialUUIDs.size,
      meshes,
      meshNames: meshNames.slice(0, 10),
      textures: textureUUIDs.size,
      textureMemory: Math.round(totalTextureMemory * 100) / 100,
      vertices: Math.round(vertices),
      drawCalls: meshes, // Approximate
      loadTime,
      complexity,
      optimizationScore: Math.max(0, score),
      recommendations
    };
    
    onStats(stats);
  }, [scene, onStats]);
}
