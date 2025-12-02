"use client";

import { motion } from "framer-motion";
import { 
  FolderOpen, 
  Plus, 
  Clock, 
  Star,
  Package,
} from "@phosphor-icons/react";

// Sample projects data
const recentProjects = [
  { id: 1, name: "Chair Model", lastEdited: "2 hours ago", starred: true },
  { id: 2, name: "Table Design", lastEdited: "1 day ago", starred: false },
  { id: 3, name: "Lamp v2", lastEdited: "3 days ago", starred: true },
];

export default function ProjectsPage() {
  return (
    <div className="w-full h-full min-h-[calc(100vh-120px)] p-6 flex items-start justify-center pt-12">
      {/* Projects Card - Apple-style Premium Glass */}
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
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-500/25 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-400/30 dark:border-cyan-400/20 backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <FolderOpen size={18} weight="duotone" className="text-cyan-600 dark:text-[#00B8E6]" />
                </div>
                <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-gray-800 dark:text-white">
                  Projects
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 dark:from-[#00B8E6]/20 dark:to-[#00B8E6]/20 border border-cyan-400/30 dark:border-[#00B8E6]/30 backdrop-blur-sm flex items-center justify-center transition-colors hover:from-cyan-500/30 hover:to-blue-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
              >
                <Plus size={18} weight="bold" className="text-cyan-600 dark:text-[#00B8E6]" />
              </motion.button>
            </div>
            <p className="text-[12px] font-medium tracking-[-0.01em] text-gray-500 dark:text-gray-400 mt-1.5">
              Recent projects
            </p>
          </div>

          {/* Projects List */}
          <div className="relative p-2.5">
            {recentProjects.map((project, index) => (
              <motion.button
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                className="w-full p-3.5 rounded-xl flex items-center gap-3.5 text-left transition-colors group"
              >
                {/* Project Icon - Glass style */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/25 to-purple-500/25 dark:from-purple-500/20 dark:to-pink-500/20 border border-indigo-400/30 dark:border-white/20 backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <Package size={20} weight="duotone" className="text-indigo-600 dark:text-purple-400" />
                </div>
                
                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium tracking-[-0.01em] text-gray-800 dark:text-white truncate">
                      {project.name}
                    </span>
                    {project.starred && (
                      <Star size={13} weight="fill" className="text-amber-500 dark:text-amber-400 flex-shrink-0 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock size={11} weight="bold" className="text-gray-500 dark:text-gray-400" />
                    <span className="text-[12px] text-gray-600 dark:text-gray-400 tracking-[-0.01em]">
                      {project.lastEdited}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          <div className="relative p-4 border-t border-white/20 dark:border-white/10">
            <button className="w-full py-2.5 text-[13px] font-medium tracking-[-0.01em] text-cyan-600 dark:text-[#00B8E6] hover:text-cyan-700 dark:hover:text-[#00D4FF] transition-colors">
              View All Projects →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
