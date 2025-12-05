/**
 * LeftToolbar - React Component
 * Premium Floating Glass Pill with Bloom Effect Icons
 */

"use client";

import { motion } from "framer-motion";
import { useEngineStore, type ToolType } from "../../core/EngineStore";

interface ToolButton {
  id: ToolType;
  icon: string;
  label: string;
  shortcut: string;
}

const TOOLS: ToolButton[] = [
  { id: "select", icon: "↖", label: "Select", shortcut: "V" },
  { id: "move", icon: "✥", label: "Move", shortcut: "G" },
  { id: "rotate", icon: "⟳", label: "Rotate", shortcut: "R" },
  { id: "scale", icon: "⤢", label: "Scale", shortcut: "S" },
];

export function LeftToolbar(): React.ReactElement {
  const activeTool = useEngineStore((s) => s.activeTool);
  const setActiveTool = useEngineStore((s) => s.setActiveTool);
  
  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-auto"
    >
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-b from-white/5 to-transparent rounded-3xl blur-xl opacity-50" />
      
      <div className="relative flex flex-col gap-1.5 p-2.5 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/60">
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
        
        {TOOLS.map((tool, idx) => (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTool(tool.id)}
            className={`
              relative w-11 h-11 rounded-xl flex items-center justify-center
              transition-all duration-300 group overflow-hidden
              ${activeTool === tool.id 
                ? "bg-cyan-500/20 text-cyan-400" 
                : "bg-transparent text-white/50 hover:text-white hover:bg-white/[0.08]"
              }
            `}
            title={`${tool.label} (${tool.shortcut})`}
          >
            {/* Active glow ring */}
            {activeTool === tool.id && (
              <motion.div
                layoutId="activeToolRing"
                className="absolute inset-0 rounded-xl border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            
            {/* Icon with bloom on hover */}
            <span 
              className={`
                relative text-lg z-10 transition-all duration-300
                group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]
                ${activeTool === tool.id ? "drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" : ""}
              `}
            >
              {tool.icon}
            </span>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-black/90 backdrop-blur-xl border border-white/10 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 pointer-events-none shadow-xl">
              {tool.label}
              <span className="ml-2 px-1.5 py-0.5 rounded bg-white/10 text-white/50 text-[10px]">{tool.shortcut}</span>
            </div>
          </motion.button>
        ))}
        
        {/* Subtle divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1" />
        
        {/* More tools */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-300 group"
          title="More tools"
        >
          <span className="text-lg group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">⋯</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
