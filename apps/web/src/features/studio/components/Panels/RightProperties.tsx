/**
 * RightProperties - React Component
 * Premium Floating Glass Panel with Object Properties
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEngineStore } from "../../core/EngineStore";

export function RightProperties(): React.ReactElement {
  const selectedMesh = useEngineStore((s) => s.selectedMesh);
  const selectedMeshName = useEngineStore((s) => s.selectedMeshName);
  
  return (
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-5 top-24 pointer-events-auto"
    >
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-b from-white/5 to-transparent rounded-3xl blur-xl opacity-50" />
      
      <div className="relative w-72 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/60 overflow-hidden">
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="relative px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
            <h2 className="text-white/80 font-medium text-sm tracking-wide">
              Properties
            </h2>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative p-4 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedMesh ? (
              <motion.div
                key="selected"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Selection Indicator */}
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-50" />
                    </div>
                    <span className="text-cyan-400 text-xs font-medium tracking-wide">
                      1 Object Selected
                    </span>
                  </div>
                </motion.div>
                
                {/* Object Name */}
                <div className="space-y-2">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-medium">
                    Name
                  </label>
                  <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                    <span className="text-white/90 text-sm font-medium">
                      {selectedMeshName || "Unnamed Object"}
                    </span>
                  </div>
                </div>
                
                {/* Transform Section */}
                <div className="space-y-3">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-medium">
                    Transform
                  </label>
                  
                  {/* Position */}
                  <TransformRow 
                    label="Position" 
                    x={selectedMesh.position.x}
                    y={selectedMesh.position.y}
                    z={selectedMesh.position.z}
                  />
                  
                  {/* Rotation */}
                  <TransformRow 
                    label="Rotation" 
                    x={selectedMesh.rotation.x * 180 / Math.PI}
                    y={selectedMesh.rotation.y * 180 / Math.PI}
                    z={selectedMesh.rotation.z * 180 / Math.PI}
                    suffix="°"
                  />
                  
                  {/* Scale */}
                  <TransformRow 
                    label="Scale" 
                    x={selectedMesh.scaling.x}
                    y={selectedMesh.scaling.y}
                    z={selectedMesh.scaling.z}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 flex flex-col items-center justify-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                  <span className="text-2xl text-white/15">◇</span>
                </div>
                <p className="text-white/30 text-sm font-medium">
                  No Selection
                </p>
                <p className="text-white/20 text-xs mt-1">
                  Click on a mesh to inspect
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

interface TransformRowProps {
  label: string;
  x: number;
  y: number;
  z: number;
  suffix?: string;
}

function TransformRow({ label, x, y, z, suffix = "" }: TransformRowProps): React.ReactElement {
  return (
    <div className="space-y-1.5">
      <span className="text-white/30 text-[10px] uppercase tracking-wider">{label}</span>
      <div className="grid grid-cols-3 gap-1.5">
        <TransformInput value={x} axis="X" color="red" suffix={suffix} />
        <TransformInput value={y} axis="Y" color="green" suffix={suffix} />
        <TransformInput value={z} axis="Z" color="blue" suffix={suffix} />
      </div>
    </div>
  );
}

interface TransformInputProps {
  value: number;
  axis: string;
  color: "red" | "green" | "blue";
  suffix?: string;
}

function TransformInput({ value, axis, color, suffix = "" }: TransformInputProps): React.ReactElement {
  const colors = {
    red: "text-red-400/90 bg-red-500/[0.08] border-red-500/20 hover:border-red-500/40",
    green: "text-green-400/90 bg-green-500/[0.08] border-green-500/20 hover:border-green-500/40",
    blue: "text-blue-400/90 bg-blue-500/[0.08] border-blue-500/20 hover:border-blue-500/40",
  };
  
  return (
    <div className={`px-2 py-2 rounded-lg border ${colors[color]} flex items-center gap-1.5 transition-colors duration-200 cursor-default`}>
      <span className="text-[10px] opacity-50 font-medium">{axis}</span>
      <span className="text-[11px] font-mono flex-1 text-right tabular-nums">
        {value.toFixed(2)}{suffix}
      </span>
    </div>
  );
}
