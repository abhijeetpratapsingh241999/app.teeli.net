"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function GlassCard({ children, className, noPadding = false }: GlassCardProps) {
  const { theme } = useTheme();
  
  const glassClass = theme === "dark" ? "glass-panel-dark" : "glass-panel-light";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={cn(
        glassClass,
        "rounded-xl transition-all duration-300",
        !noPadding && "p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
