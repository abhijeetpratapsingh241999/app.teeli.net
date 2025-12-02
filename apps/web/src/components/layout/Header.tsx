"use client";

import { motion } from "framer-motion";
import { Bell, Gear, User, Lightning, Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const userCredits = 1250;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <>
      {/* Desktop Header - Floating Glass Capsule (Top Right) */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex fixed top-4 right-4 z-50"
      >
        {/* Floating Glass Capsule Container */}
        <div className="relative bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-180 rounded-4xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-4 py-3 border-2 border-white/60 dark:border-white/20 flex items-center gap-6 transition-colors duration-300">
          {/* Inner shine overlay for depth */}
          <div className="absolute inset-0 bg-linear-to-br from-white/30 via-white/8 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent rounded-4xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-6">
            {/* Credit Balance - Digital Wallet Indicator */}
            <div className="flex items-center gap-2">
              <Lightning 
                size={20}
                weight="fill"
                className="text-amber-500 dark:text-amber-400" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6)) drop-shadow(0 0 16px rgba(251, 191, 36, 0.4))' }}
              />
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{userCredits.toLocaleString()}</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">CR</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Theme Toggle - Bloom on Hover */}
            <motion.button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.12)] dark:bg-white/10 dark:backdrop-blur-xl dark:saturate-150 dark:border dark:border-white/20 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all group overflow-hidden relative"
            >
              {mounted && (
                <motion.div
                  initial={false}
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  {isDark ? (
                  <Moon 
                    size={18}
                    weight="duotone"
                    className="text-blue-400 dark:text-blue-300 transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-200" 
                    style={{ 
                      filter: 'drop-shadow(0 0 0px rgba(37, 99, 235, 0))',
                      transition: 'filter 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(147, 197, 253, 0.8)) drop-shadow(0 0 20px rgba(147, 197, 253, 0.4))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(37, 99, 235, 0))';
                    }}
                  />
                ) : (
                  <Sun 
                    size={18}
                    weight="duotone"
                    className="text-red-700 dark:text-orange-400 transition-all duration-300 group-hover:text-red-500 dark:group-hover:text-orange-300" 
                    style={{ 
                      filter: 'drop-shadow(0 0 0px rgba(220, 38, 38, 0))',
                      transition: 'filter 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(251, 146, 60, 0.9)) drop-shadow(0 0 20px rgba(251, 146, 60, 0.5))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(220, 38, 38, 0))';
                    }}
                  />
                )}
              </motion.div>
              )}
            </motion.button>

            {/* Divider */}
            <div className="h-8 w-px bg-white/40" />

            {/* Notifications - Bloom on Hover */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.12)] dark:bg-white/10 dark:backdrop-blur-xl dark:saturate-150 dark:border dark:border-white/20 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all group"
            >
              <Bell 
                size={18}
                weight="duotone"
                className="text-slate-700 dark:text-slate-200 transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" 
                style={{ 
                  filter: 'drop-shadow(0 0 0px rgba(37, 99, 235, 0))',
                  transition: 'filter 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(147, 197, 253, 0.8)) drop-shadow(0 0 20px rgba(147, 197, 253, 0.4))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(37, 99, 235, 0))';
                }}
              />
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center shadow-lg">
                3
              </span>
            </motion.button>

            {/* Settings - Bloom on Hover */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.12)] dark:bg-white/10 dark:backdrop-blur-xl dark:saturate-150 dark:border dark:border-white/20 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all group"
            >
              <Gear 
                size={18}
                weight="duotone"
                className="text-slate-700 dark:text-slate-200 transition-all duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" 
                style={{ 
                  filter: 'drop-shadow(0 0 0px rgba(99, 102, 241, 0))',
                  transition: 'filter 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(165, 180, 252, 0.8)) drop-shadow(0 0 20px rgba(165, 180, 252, 0.4))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(99, 102, 241, 0))';
                }}
              />
            </motion.button>

            {/* Profile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 shadow-[0_2px_10px_-2px_rgba(59,130,246,0.35),0_4px_18px_-3px_rgba(59,130,246,0.3)] flex items-center justify-center"
            >
              <User size={18} weight="duotone" className="text-white" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Header - Top Compact Bar */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="md:hidden fixed top-0 left-0 right-0 z-50"
      >
        {/* Glass Container */}
        <div className="relative bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          {/* Bottom Highlight Edge */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
          
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                {/* Logo glow */}
                <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-blue-600 rounded-xl blur-md opacity-60" />
                {/* Logo */}
                <div className="relative bg-linear-to-br from-purple-600 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-base font-bold">T</span>
                </div>
              </div>
              <h1 className="text-base font-bold text-slate-800 dark:text-white">Teeli</h1>
            </div>

            {/* Right: Compact Actions */}
            <div className="flex items-center gap-2">
              {/* Credit Balance */}
              <div className="flex items-center gap-1.5">
                <Lightning 
                  size={16}
                  weight="fill"
                  className="text-amber-500" 
                  style={{ filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.5))' }}
                />
                <span className="text-sm font-bold text-slate-700">{userCredits.toLocaleString()}</span>
                <span className="text-[10px] font-medium text-slate-500">CR</span>
              </div>

              {/* Notifications */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                className="relative w-9 h-9 rounded-xl bg-white/60 dark:bg-white/10 flex items-center justify-center"
              >
                <Bell size={16} weight="duotone" className="text-slate-700 dark:text-white" />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                  3
                </span>
              </motion.button>

              {/* Profile */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-[0_4px_12px_rgba(59,130,246,0.4)] flex items-center justify-center"
              >
                <User size={16} weight="duotone" className="text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}
