"use client";

import { useState } from "react";
import { Line, Html, Sphere } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useViewerStore, type Measurement } from "../store/useViewerStore";
import * as THREE from "three";

function MeasurementLine({ measurement }: { measurement: Measurement }) {
  const midpoint: [number, number, number] = [
    (measurement.start[0] + measurement.end[0]) / 2,
    (measurement.start[1] + measurement.end[1]) / 2,
    (measurement.start[2] + measurement.end[2]) / 2,
  ];

  return (
    <>
      {/* Start Point */}
      <Sphere args={[0.02]} position={measurement.start}>
        <meshBasicMaterial color="#8b5cf6" />
      </Sphere>

      {/* End Point */}
      <Sphere args={[0.02]} position={measurement.end}>
        <meshBasicMaterial color="#8b5cf6" />
      </Sphere>

      {/* Line */}
      <Line
        points={[measurement.start, measurement.end]}
        color="#8b5cf6"
        lineWidth={2}
        dashed
        dashScale={50}
        dashSize={0.1}
        gapSize={0.05}
      />

      {/* Distance Label */}
      <Html position={midpoint} center distanceFactor={10}>
        <div className="px-3 py-1.5 rounded-lg bg-purple-500/90 backdrop-blur-md border border-purple-400 shadow-lg">
          <span className="text-xs font-bold text-white whitespace-nowrap">
            {measurement.distance.toFixed(2)}m
          </span>
        </div>
      </Html>
    </>
  );
}

export default function Measurements() {
  const isMeasurementMode = useViewerStore((state) => state.isMeasurementMode);
  const measurements = useViewerStore((state) => state.measurements);
  const addMeasurement = useViewerStore((state) => state.addMeasurement);
  const [startPoint, setStartPoint] = useState<[number, number, number] | null>(null);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!isMeasurementMode) return;
    
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    const point = e.point;
    const position: [number, number, number] = [point.x, point.y, point.z];

    if (!startPoint) {
      // First click - set start point
      setStartPoint(position);
    } else {
      // Second click - calculate distance and add measurement
      const distance = Math.sqrt(
        Math.pow(position[0] - startPoint[0], 2) +
        Math.pow(position[1] - startPoint[1], 2) +
        Math.pow(position[2] - startPoint[2], 2)
      );

      const measurement: Measurement = {
        id: Date.now().toString(),
        start: startPoint,
        end: position,
        distance,
      };

      addMeasurement(measurement);
      setStartPoint(null);
    }
  };

  if (!isMeasurementMode && measurements.length === 0) return null;

  return (
    <group onClick={handleClick}>
      {/* Temporary start point indicator */}
      {isMeasurementMode && startPoint && (
        <Sphere args={[0.02]} position={startPoint}>
          <meshBasicMaterial color="#8b5cf6" />
        </Sphere>
      )}

      {/* Render all measurements */}
      {measurements.map((measurement) => (
        <MeasurementLine key={measurement.id} measurement={measurement} />
      ))}
    </group>
  );
}
