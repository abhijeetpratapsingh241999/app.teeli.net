"use client";

import { useState } from "react";
import { Viewer3D } from "./Viewer3D";
import { ControlPanel } from "./ControlPanel";

export function DashboardHome() {
  const [step, setStep] = useState(0);

  return (
    <div className="w-full h-full min-h-[calc(100vh-120px)] p-6">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left: 3D Viewer - Fixed on desktop, 40% width */}
        <div className="lg:w-[40%] order-2 lg:order-1">
          <div className="relative lg:sticky lg:top-20 h-full min-h-[450px] lg:h-[calc(100vh-100px)] bg-transparent">
            {/* Viewer - zero background, floats on page */}
            <Viewer3D step={step} />

            {/* Minimal floating status - top left */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className={`
                w-1.5 h-1.5 rounded-full
                ${step === 0 ? "bg-slate-400 animate-pulse" : ""}
                ${step === 1 ? "bg-cyan-400 animate-pulse" : ""}
                ${step === 2 ? "bg-blue-500" : ""}
                ${step === 3 ? "bg-amber-400" : ""}
              `} />
              <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {step === 0 && "Raw"}
                {step === 1 && "Scanning"}
                {step === 2 && "Repaired"}
                {step === 3 && "Complete"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Control Panel - 2 column grid, aligned right */}
        <div className="lg:w-[60%] order-1 lg:order-2 flex justify-end">
          <div className="w-full max-w-2xl">
            <ControlPanel step={step} onStepChange={setStep} />
          </div>
        </div>
      </div>
    </div>
  );
}
