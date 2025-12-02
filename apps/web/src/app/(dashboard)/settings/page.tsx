"use client";

import { motion } from "framer-motion";
import { 
  Gear,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  CaretRight,
  Moon,
  Sun,
  Toggle,
} from "@phosphor-icons/react";
import { useTheme } from "next-themes";

// Settings sections data
const settingsSections = [
  {
    id: "account",
    icon: User,
    label: "Account",
    description: "Manage your profile & preferences",
    color: "blue",
  },
  {
    id: "notifications",
    icon: Bell,
    label: "Notifications",
    description: "Configure alerts & updates",
    color: "amber",
  },
  {
    id: "privacy",
    icon: Shield,
    label: "Privacy & Security",
    description: "Password & data settings",
    color: "green",
  },
  {
    id: "appearance",
    icon: Palette,
    label: "Appearance",
    description: "Theme & display options",
    color: "purple",
  },
  {
    id: "language",
    icon: Globe,
    label: "Language & Region",
    description: "Language, timezone & format",
    color: "cyan",
  },
  {
    id: "billing",
    icon: CreditCard,
    label: "Billing & Plans",
    description: "Subscription & payments",
    color: "pink",
  },
];

const colorClasses = {
  blue: {
    bg: "from-blue-500/25 to-indigo-500/25 dark:from-blue-500/20 dark:to-indigo-500/20",
    border: "border-blue-400/30 dark:border-blue-400/20",
    icon: "text-blue-600 dark:text-blue-400",
  },
  amber: {
    bg: "from-amber-500/25 to-orange-500/25 dark:from-amber-500/20 dark:to-orange-500/20",
    border: "border-amber-400/30 dark:border-amber-400/20",
    icon: "text-amber-600 dark:text-amber-400",
  },
  green: {
    bg: "from-emerald-500/25 to-green-500/25 dark:from-emerald-500/20 dark:to-green-500/20",
    border: "border-emerald-400/30 dark:border-emerald-400/20",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  purple: {
    bg: "from-purple-500/25 to-violet-500/25 dark:from-purple-500/20 dark:to-violet-500/20",
    border: "border-purple-400/30 dark:border-purple-400/20",
    icon: "text-purple-600 dark:text-purple-400",
  },
  cyan: {
    bg: "from-cyan-500/25 to-teal-500/25 dark:from-cyan-500/20 dark:to-teal-500/20",
    border: "border-cyan-400/30 dark:border-cyan-400/20",
    icon: "text-cyan-600 dark:text-cyan-400",
  },
  pink: {
    bg: "from-pink-500/25 to-rose-500/25 dark:from-pink-500/20 dark:to-rose-500/20",
    border: "border-pink-400/30 dark:border-pink-400/20",
    icon: "text-pink-600 dark:text-pink-400",
  },
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-full h-full min-h-[calc(100vh-120px)] p-6 flex items-start justify-center pt-12">
      {/* Settings Card - Compact like Projects card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-80"
      >
        <div className="relative bg-white/20 dark:bg-white/8 backdrop-blur-[40px] saturate-[1.8] rounded-2xl border border-white/30 dark:border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.2)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
          
          {/* Header */}
          <div className="relative p-5 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-500/25 to-slate-500/25 dark:from-gray-500/20 dark:to-slate-500/20 border border-gray-400/30 dark:border-gray-400/20 backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <Gear size={18} weight="duotone" className="text-gray-600 dark:text-gray-300" />
                </div>
                <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-gray-800 dark:text-white">
                  Settings
                </h3>
              </div>
              {/* Theme Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-400/30 dark:border-indigo-400/20 backdrop-blur-sm flex items-center justify-center transition-colors hover:from-indigo-500/30 hover:to-purple-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
              >
                {theme === "dark" ? (
                  <Moon size={16} weight="duotone" className="text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Sun size={16} weight="duotone" className="text-amber-600" />
                )}
              </motion.button>
            </div>
            <p className="text-[12px] font-medium tracking-[-0.01em] text-gray-500 dark:text-gray-400 mt-1.5">
              Preferences
            </p>
          </div>

          {/* Settings List - Compact */}
          <div className="relative p-2.5">
            {settingsSections.slice(0, 4).map((section, index) => {
              const Icon = section.icon;
              const colors = colorClasses[section.color as keyof typeof colorClasses];
              
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  className="w-full p-3 rounded-xl flex items-center gap-3 text-left transition-colors group"
                >
                  {/* Icon - Glass style */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]`}>
                    <Icon size={18} weight="duotone" className={colors.icon} />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] font-medium tracking-[-0.01em] text-gray-800 dark:text-white block">
                      {section.label}
                    </span>
                  </div>

                  {/* Arrow */}
                  <CaretRight 
                    size={14} 
                    weight="bold" 
                    className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" 
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="relative p-4 border-t border-white/20 dark:border-white/10">
            <button className="w-full py-2.5 text-[13px] font-medium tracking-[-0.01em] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              All Settings →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
