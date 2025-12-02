"use client";

import { motion } from "framer-motion";
import {
  House,
  FolderOpen,
  Package,
  Upload,
  User,
  Gear,
  SquaresFour,
  CubeFocus,
} from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { icon: House, label: "Home", id: "home", path: "/home" },
  { icon: CubeFocus, label: "The Editor", id: "editor", path: "/editor" },
  { icon: FolderOpen, label: "Projects", id: "projects", path: "/projects" },
  { icon: Package, label: "Assets", id: "assets", path: "/assets" },
  { icon: Upload, label: "Upload", id: "upload", path: "/upload" },
  { icon: User, label: "Profile", id: "profile", path: "/profile" },
  { icon: SquaresFour, label: "Gallery", id: "gallery", path: "/gallery" },
  { icon: Gear, label: "Settings", id: "settings", path: "/settings" },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Get active item from current path
  const getActiveItem = () => {
    const item = menuItems.find(item => pathname.startsWith(item.path));
    return item?.id || "home";
  };

  const handleItemClick = (itemPath: string) => {
    router.push(itemPath);
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50"
    >
      <div className="relative">
        {/* Main glass vertical bar - Premium Frosted Glass Effect */}
        <div className="relative bg-white/30 dark:bg-white/10 backdrop-blur-[30px] saturate-150 rounded-4xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-6 px-4 border-2 border-white/70 dark:border-white/20 transition-colors duration-300">
          {/* Inner shine overlay for depth */}
          <div className="absolute inset-0 bg-linear-to-br from-white/20 via-white/5 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent rounded-4xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-4">
            {/* Logo - Circle glass blur */}
            <div className="mb-2 pb-4 border-b-2 border-gray-300/50 dark:border-white/20">
              <div className="relative w-[60px] h-[60px] mx-auto rounded-full bg-white/25 dark:bg-white/8 backdrop-blur-xl saturate-150 border border-white/40 dark:border-white/15 shadow-[0_4px_15px_rgba(0,0,0,0.12),0_1px_4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.5),0_1px_4px_rgba(0,0,0,0.3)] flex items-center justify-center">
                <span className="text-gray-800 dark:text-white text-[28px] font-bold">T</span>
              </div>
            </div>

            {/* Menu Items - SOLID, NO BLUR ON BUTTONS */}
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = getActiveItem() === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  className="relative group"
                >
                  <motion.button
                    onClick={() => handleItemClick(item.path)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    className={`
                      relative w-[52px] h-[52px] rounded-2xl flex items-center justify-center
                      transition-all duration-300 overflow-hidden backdrop-blur-xl saturate-150
                      ${
                        isActive
                          ? "bg-[#00B8E6] dark:bg-[#00B8E6]/85 backdrop-blur-2xl saturate-150 border-2 border-[#00B8E6] dark:border-[#00B8E6] shadow-[0_4px_12px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,184,230,0.5),0_2px_8px_rgba(0,184,230,0.35)]"
                          : "bg-white/25 dark:bg-white/8 backdrop-blur-xl saturate-150 border border-white/40 dark:border-white/15 shadow-[0_4px_15px_rgba(0,0,0,0.12),0_1px_4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.5),0_1px_4px_rgba(0,0,0,0.3)] hover:bg-white/35 dark:hover:bg-white/12 hover:shadow-[0_8px_25px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]"
                      }
                    `}
                  >
                    <Icon
                      size={26}
                      weight={isActive ? "fill" : "regular"}
                      className={`relative z-10 transition-all duration-300 ${
                        isActive
                          ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] drop-shadow-[0_0_16px_rgba(255,255,255,0.6)]"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    />
                  </motion.button>

                  {/* Modern hover tooltip - Glass blur badge */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-4 py-2.5 bg-white/40 dark:bg-white/15 backdrop-blur-2xl saturate-150 border border-white/50 dark:border-white/25 text-gray-900 dark:text-white text-[13px] font-semibold rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15),0_2px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_4px_16px_rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap scale-95 group-hover:scale-100">
                    {item.label}
                    {/* Glass arrow pointer */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-8 border-r-white/40 dark:border-r-white/15" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

