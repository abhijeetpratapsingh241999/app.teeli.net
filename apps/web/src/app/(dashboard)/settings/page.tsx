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
  ToggleRight,
  Key,
  DeviceMobile,
  Envelope,
  Info,
  Question,
  SignOut,
  Trash,
  Export,
  CloudArrowUp,
  Scales,
  FileText,
  Cookie,
  ShieldCheck,
  Handshake,
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
    <div className="relative w-full h-screen min-h-screen xl:h-screen xl:max-h-screen px-2 sm:p-4 md:p-6 md:pl-20 lg:pl-6 pt-20 sm:pt-24 md:pt-32 lg:pt-52 xl:pt-36 2xl:pt-36 pb-24 sm:pb-6 xl:pb-4 xl:px-6 overflow-x-hidden overflow-y-auto xl:overflow-hidden scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Cards Grid - Responsive for all devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-4 xl:gap-4 justify-items-stretch xl:h-full xl:items-start">
        
        {/* Card 1: General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full"
        >
          <div className="relative bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-[1.8] rounded-2xl border-2 border-white/60 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 bg-linear-to-br from-white/30 via-white/8 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent rounded-2xl pointer-events-none" />
            
            {/* Header */}
            <div className="relative p-5 border-b border-white/20 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-gray-500/25 to-slate-500/25 dark:from-gray-500/20 dark:to-slate-500/20 border border-gray-400/30 dark:border-gray-400/20 backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <Gear size={18} weight="duotone" className="text-gray-600 dark:text-gray-300" />
                  </div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-gray-800 dark:text-white">
                    Settings
                  </h3>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-400/30 dark:border-indigo-400/20 backdrop-blur-sm flex items-center justify-center transition-colors hover:from-indigo-500/30 hover:to-purple-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
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

            {/* Settings List */}
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
                    <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]`}>
                      <Icon size={18} weight="duotone" className={colors.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[14px] font-medium tracking-[-0.01em] text-gray-800 dark:text-white block">
                        {section.label}
                      </span>
                    </div>
                    <CaretRight size={14} weight="bold" className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
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

        {/* Card 2: Account & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
          className="w-full"
        >
          <div className="relative bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-[1.8] rounded-2xl border-2 border-white/60 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 bg-linear-to-br from-white/30 via-white/8 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent rounded-2xl pointer-events-none" />
            
            {/* Header */}
            <div className="relative p-5 border-b border-white/20 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500/25 to-indigo-500/25 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-400/30 dark:border-blue-400/20 backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <Shield size={18} weight="duotone" className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-gray-800 dark:text-white">
                  Security
                </h3>
              </div>
              <p className="text-[12px] font-medium tracking-[-0.01em] text-gray-500 dark:text-gray-400 mt-1.5">
                Account protection
              </p>
            </div>

            {/* Security Options */}
            <div className="relative p-2.5">
              {[
                { icon: Key, label: "Change Password", color: "blue" },
                { icon: DeviceMobile, label: "Two-Factor Auth", color: "green" },
                { icon: Envelope, label: "Email Verification", color: "amber" },
                { icon: CloudArrowUp, label: "Backup & Sync", color: "cyan" },
              ].map((item, index) => {
                const colors = colorClasses[item.color as keyof typeof colorClasses];
                return (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    className="w-full p-3 rounded-xl flex items-center gap-3 text-left transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]`}>
                      <item.icon size={18} weight="duotone" className={colors.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[14px] font-medium tracking-[-0.01em] text-gray-800 dark:text-white block">
                        {item.label}
                      </span>
                    </div>
                    <CaretRight size={14} weight="bold" className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="relative p-4 border-t border-white/20 dark:border-white/10">
              <button className="w-full py-2.5 text-[13px] font-medium tracking-[-0.01em] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                Security Center →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Help & Support */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
          className="w-full"
        >
          <div className="relative bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-[1.8] rounded-2xl border-2 border-white/60 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 bg-linear-to-br from-white/30 via-white/8 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent rounded-2xl pointer-events-none" />
            
            {/* Header */}
            <div className="relative p-5 border-b border-white/20 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-purple-500/25 to-pink-500/25 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-400/30 dark:border-purple-400/20 backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <Question size={18} weight="duotone" className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-gray-800 dark:text-white">
                  Help & More
                </h3>
              </div>
              <p className="text-[12px] font-medium tracking-[-0.01em] text-gray-500 dark:text-gray-400 mt-1.5">
                Support & actions
              </p>
            </div>

            {/* Help Options */}
            <div className="relative p-2.5">
              {[
                { icon: Question, label: "Help Center", color: "purple" },
                { icon: Info, label: "About Teeli", color: "cyan" },
                { icon: Export, label: "Export Data", color: "green" },
                { icon: SignOut, label: "Sign Out", color: "amber" },
              ].map((item, index) => {
                const colors = colorClasses[item.color as keyof typeof colorClasses];
                return (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    className="w-full p-3 rounded-xl flex items-center gap-3 text-left transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]`}>
                      <item.icon size={18} weight="duotone" className={colors.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[14px] font-medium tracking-[-0.01em] text-gray-800 dark:text-white block">
                        {item.label}
                      </span>
                    </div>
                    <CaretRight size={14} weight="bold" className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </motion.button>
                );
              })}
            </div>

            {/* Footer - Danger Zone */}
            <div className="relative p-4 border-t border-white/20 dark:border-white/10">
              <button className="w-full py-2.5 text-[13px] font-medium tracking-[-0.01em] text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors flex items-center justify-center gap-2">
                <Trash size={14} weight="duotone" />
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Legal */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
          className="w-full"
        >
          <div className="relative bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-[1.8] rounded-2xl border-2 border-white/60 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 bg-linear-to-br from-white/30 via-white/8 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent rounded-2xl pointer-events-none" />
            
            {/* Header */}
            <div className="relative p-5 border-b border-white/20 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-slate-500/25 to-gray-500/25 dark:from-slate-500/20 dark:to-gray-500/20 border border-slate-400/30 dark:border-slate-400/20 backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <Scales size={18} weight="duotone" className="text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-gray-800 dark:text-white">
                  Legal
                </h3>
              </div>
              <p className="text-[12px] font-medium tracking-[-0.01em] text-gray-500 dark:text-gray-400 mt-1.5">
                Terms & policies
              </p>
            </div>

            {/* Legal Options */}
            <div className="relative p-2.5">
              {[
                { icon: FileText, label: "Terms of Service", color: "blue" },
                { icon: ShieldCheck, label: "Privacy Policy", color: "green" },
                { icon: Cookie, label: "Cookie Policy", color: "amber" },
                { icon: Handshake, label: "Licensing", color: "purple" },
              ].map((item, index) => {
                const colors = colorClasses[item.color as keyof typeof colorClasses];
                return (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    className="w-full p-3 rounded-xl flex items-center gap-3 text-left transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]`}>
                      <item.icon size={18} weight="duotone" className={colors.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[14px] font-medium tracking-[-0.01em] text-gray-800 dark:text-white block">
                        {item.label}
                      </span>
                    </div>
                    <CaretRight size={14} weight="bold" className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="relative p-4 border-t border-white/20 dark:border-white/10">
              <button className="w-full py-2.5 text-[13px] font-medium tracking-[-0.01em] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                View All Legal →
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
