"use client";

import { motion } from "framer-motion";
import { House, FolderOpen, Package, Gear, Upload, Question, Palette, User, CubeFocus } from "@phosphor-icons/react";
import { useState } from "react";

export function MobileNav() {
  const [activeItem, setActiveItem] = useState("home");

  const menuItems = [
    { id: "home", icon: House, label: "Home", colors: { start: "#3B82F6", end: "#22D3EE" } },
    { id: "editor", icon: CubeFocus, label: "Editor", colors: { start: "#8B5CF6", end: "#EC4899" } },
    { id: "projects", icon: FolderOpen, label: "Projects", colors: { start: "#A855F7", end: "#F472B6" } },
    { id: "gallery", icon: Palette, label: "Gallery", colors: { start: "#F97316", end: "#FACC15" } },
    { id: "upload", icon: Upload, label: "Upload", colors: { start: "#10B981", end: "#34D399" }, special: true },
    { id: "assets", icon: Package, label: "Assets", colors: { start: "#6366F1", end: "#3B82F6" } },
    { id: "profile", icon: User, label: "Profile", colors: { start: "#EC4899", end: "#FB7185" } },
    { id: "settings", icon: Gear, label: "Settings", colors: { start: "#64748B", end: "#94A3B8" } },
    { id: "help", icon: Question, label: "Help", colors: { start: "#14B8A6", end: "#22D3EE" } },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glass Container - NO GAPS */}
      <div className="relative h-20 bg-white/30 dark:bg-white/10 backdrop-blur-[30px] saturate-150 border-t-2 border-white/70 dark:border-white/20 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
        {/* Top Highlight Edge */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />

        {/* Scrollable Icons Container */}
        <div className="flex items-center gap-4 overflow-x-auto px-4 h-full scrollbar-hide">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const isSpecial = item.special;

            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                whileTap={{ scale: 0.92 }}
                className="relative shrink-0 flex flex-col items-center justify-center gap-1.5 min-w-16"
              >
                {/* Icon Container with Glass Background + Colored Glow Shadow when Active */}
                <motion.div
                  className={`
                    relative rounded-2xl flex items-center justify-center
                    transition-all duration-300
                    ${isSpecial ? "w-14 h-14" : "w-12 h-12"}
                    ${
                      isActive
                        ? "bg-white/90 dark:bg-white/15 dark:backdrop-blur-xl dark:saturate-150 dark:border dark:border-white/20"
                        : ""
                    }
                  `}
                  style={
                    isActive
                      ? {
                          boxShadow: `0 8px 24px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1), 0 0 4px ${item.colors.start}25, 0 0 8px ${item.colors.end}15`,
                        }
                      : undefined
                  }
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {/* SVG Icon with Direct Color Property + Enhanced Dark Mode Glow */}
                  <Icon
                    size={isSpecial ? 28 : 24}
                    weight={isActive ? "fill" : "regular"}
                    className="relative z-10 transition-all duration-300"
                    style={
                      isActive
                        ? {
                            color: item.colors.start,
                            filter: `drop-shadow(0 1px 2px ${item.colors.end}40) drop-shadow(0 0 4px ${item.colors.start}50) drop-shadow(0 0 8px ${item.colors.end}30)`,
                          }
                        : undefined
                    }
                    color={isActive ? item.colors.start : undefined}
                  />
                </motion.div>

                {/* Text Label - Colored when Active */}
                <span
                  className={`
                    text-[10px] leading-tight transition-all duration-300
                    ${
                      isActive
                        ? "font-bold"
                        : "font-medium text-gray-500 dark:text-gray-400"
                    }
                  `}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${item.colors.start}, ${item.colors.end})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }
                      : undefined
                  }
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
