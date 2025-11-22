"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";

function TestCube() {
  return (
    <mesh position={[0, 1, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8b5cf6" metalness={0.5} roughness={0.2} />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#18181b" metalness={0.1} roughness={0.8} />
    </mesh>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 5], fov: 50 }}
      className="w-full h-full"
    >
      <color attach="background" args={["#09090b"]} />
      
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      <TestCube />
      <Floor />
      
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#27272a"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#3f3f46"
        fadeDistance={30}
        fadeStrength={1}
        position={[0, 0.01, 0]}
      />
      
      <Environment preset="city" />
      
      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
