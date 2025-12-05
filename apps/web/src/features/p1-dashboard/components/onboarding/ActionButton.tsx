"use client";

/**
 * Action Button Component
 * Simple "Render Project" button - appears after render complete
 * Created: Dec 3, 2025
 * @updated 2025-12-03 - Serious SaaS Professional Style
 */

import { motion } from "framer-motion";
import { Rocket } from "@phosphor-icons/react";

interface ActionButtonProps {
  isVisible: boolean;
  onAction?: () => void;
}

export function ActionButton({ isVisible, onAction }: ActionButtonProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="col-span-2 mt-2 sm:mt-2 xl:mt-4 flex justify-center tablet-action-button"
    >
      <button
        onClick={onAction}
        className="group relative px-5 sm:px-6 md:px-7 lg:px-8 py-2.5 sm:py-2.5 md:py-3 lg:py-3.5 rounded-lg md:rounded-xl font-semibold text-sm sm:text-sm md:text-base flex items-center gap-2 sm:gap-2 md:gap-2.5 lg:gap-3 transition-all duration-300 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-lg hover:shadow-xl"
        style={{
          letterSpacing: '0.3px',
        }}
      >
        <Rocket className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" weight="fill" />
        Launch Project
      </button>
    </motion.div>
  );
}
