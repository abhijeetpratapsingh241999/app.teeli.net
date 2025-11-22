"use client";

import { useProgress } from "@react-three/drei";

export default function Loader() {
  const { active, progress } = useProgress();

  if (!active) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="px-8 py-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
        <p className="text-white text-lg font-medium mb-3">
          Loading Model... {Math.round(progress)}%
        </p>
        <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
