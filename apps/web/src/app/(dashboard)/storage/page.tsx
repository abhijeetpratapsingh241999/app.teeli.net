"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  UploadSimple,
  FolderPlus,
  File,
  FileImage,
  FileVideo,
  FileCode,
  FilePdf,
  MagnifyingGlass,
  DotsThreeVertical,
  DownloadSimple,
  Trash,
  ShareNetwork,
  Clock,
  Star,
  Cube,
  Lightning,
  Check,
  ArrowUp,
  Sparkle,
} from "@phosphor-icons/react";
import { useState } from "react";

// Mock data for files
const recentFiles = [
  {
    id: 1,
    name: "Modern Chair.glb",
    type: "3d",
    size: "12.4 MB",
    modified: "2 hours ago",
    thumbnail: "/api/placeholder/120/120",
    starred: true,
  },
  {
    id: 2,
    name: "Product Render.png",
    type: "image",
    size: "8.2 MB",
    modified: "5 hours ago",
    thumbnail: "/api/placeholder/120/120",
    starred: false,
  },
  {
    id: 3,
    name: "Animation.mp4",
    type: "video",
    size: "45.8 MB",
    modified: "1 day ago",
    thumbnail: "/api/placeholder/120/120",
    starred: true,
  },
  {
    id: 4,
    name: "Scene Setup.blend",
    type: "3d",
    size: "28.5 MB",
    modified: "2 days ago",
    thumbnail: "/api/placeholder/120/120",
    starred: false,
  },
  {
    id: 5,
    name: "Tutorial Guide.pdf",
    type: "pdf",
    size: "2.1 MB",
    modified: "3 days ago",
    thumbnail: "/api/placeholder/120/120",
    starred: false,
  },
  {
    id: 6,
    name: "Texture Pack.zip",
    type: "code",
    size: "156 MB",
    modified: "4 days ago",
    thumbnail: "/api/placeholder/120/120",
    starred: true,
  },
];

const fileTypeIcons = {
  "3d": { icon: Cube, color: "from-purple-500 to-pink-500", bg: "bg-purple-100 dark:bg-purple-500/20" },
  image: { icon: FileImage, color: "from-cyan-500 to-blue-500", bg: "bg-cyan-100 dark:bg-cyan-500/20" },
  video: { icon: FileVideo, color: "from-orange-500 to-red-500", bg: "bg-orange-100 dark:bg-orange-500/20" },
  pdf: { icon: FilePdf, color: "from-red-500 to-pink-500", bg: "bg-red-100 dark:bg-red-500/20" },
  code: { icon: FileCode, color: "from-green-500 to-emerald-500", bg: "bg-green-100 dark:bg-green-500/20" },
};

const storageStats = [
  { type: "3D Models", size: "245 MB", percentage: 35, color: "bg-purple-500", bg: "bg-purple-100 dark:bg-purple-500/20", icon: Cube },
  { type: "Images", size: "182 MB", percentage: 26, color: "bg-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-500/20", icon: FileImage },
  { type: "Videos", size: "156 MB", percentage: 22, color: "bg-orange-500", bg: "bg-orange-100 dark:bg-orange-500/20", icon: FileVideo },
  { type: "Others", size: "120 MB", percentage: 17, color: "bg-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/20", icon: File },
];

export default function StoragePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const totalStorage = 15; // GB
  const usedStorage = 7.03; // GB
  const usagePercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="w-full h-full flex flex-col px-4 sm:px-6 md:pl-12 md:pr-6 lg:px-10 xl:px-12 pt-20 sm:pt-20 md:pt-36 lg:pt-24 xl:pt-20 2xl:pt-20 pb-4 sm:pb-5 md:pb-6 2xl:pb-2 overflow-y-auto overflow-x-hidden scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="max-w-[1600px] mx-auto md:ml-4 lg:mx-auto w-full flex flex-col gap-4 sm:gap-5 md:gap-6">
        
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-linear-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 dark:border-white/8 backdrop-blur-xl mb-3">
              <Cloud size={13} weight="fill" className="text-cyan-500 dark:text-cyan-400" />
              <span className="text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
                CLOUD STORAGE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
              Your Files
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage and organize your creative assets
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto"
          >
            <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-slate-200 dark:bg-white/8 border border-slate-300 dark:border-white/12 text-slate-900 dark:text-white text-sm font-semibold hover:bg-slate-300 dark:hover:bg-white/12 transition-all duration-300 shadow-md dark:shadow-none">
              <FolderPlus size={18} weight="duotone" />
              <span className="hidden sm:inline">New Folder</span>
            </button>
            <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 text-white text-sm font-bold shadow-xl shadow-cyan-500/30 dark:shadow-cyan-500/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <UploadSimple size={18} weight="bold" />
              Upload
            </button>
          </motion.div>
        </div>

        {/* Storage Overview & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          
          {/* Storage Usage Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl dark:shadow-none"
          >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-cyan-500/20 dark:via-blue-500/15 dark:to-purple-500/20 backdrop-blur-2xl" />
            <div className="absolute inset-0 bg-linear-to-br from-white/60 via-white/40 to-transparent dark:from-white/8 dark:via-transparent dark:to-transparent" />
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-cyan-300 dark:border-cyan-500/40 shadow-lg dark:shadow-none" />
            
            <div className="relative p-5 sm:p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">
                    Storage Usage
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {usedStorage} GB of {totalStorage} GB used
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-400 to-blue-500 dark:from-cyan-500/40 dark:to-blue-500/40 border border-cyan-300 dark:border-cyan-500/40 flex items-center justify-center shadow-lg">
                  <Cloud size={24} weight="duotone" className="text-white" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-4 sm:h-5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${usagePercentage}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full shadow-lg"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {usagePercentage.toFixed(1)}% Full
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {(totalStorage - usedStorage).toFixed(2)} GB Free
                  </span>
                </div>
              </div>

              {/* Storage Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {storageStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.type}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                      className="relative"
                    >
                      <div className="p-3 sm:p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-sm dark:shadow-none">
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${stat.bg} border border-slate-200 dark:border-white/10 flex items-center justify-center mb-2`}>
                          <Icon size={16} weight="duotone" className="text-slate-700 dark:text-white/80" />
                        </div>
                        <p className="text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                          {stat.type}
                        </p>
                        <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {stat.size}
                        </p>
                        <div className="mt-2 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                            className={`h-full ${stat.color} rounded-full`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Upgrade Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl dark:shadow-none"
          >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-linear-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-500/30 dark:via-pink-500/20 dark:to-purple-600/30 backdrop-blur-2xl" />
            <div className="absolute inset-0 bg-linear-to-br from-white/60 via-white/40 to-transparent dark:from-white/8 dark:via-transparent dark:to-transparent" />
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-purple-300 dark:border-purple-500/40 shadow-lg dark:shadow-none" />
            
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/3 bg-purple-400/20 dark:bg-purple-500/15 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="relative p-5 sm:p-6 h-full flex flex-col">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-400 to-pink-500 dark:from-purple-500/40 dark:to-pink-500/40 border border-purple-300 dark:border-purple-500/40 flex items-center justify-center shadow-lg mb-4">
                  <Lightning size={24} weight="duotone" className="text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Need More Space?
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-4">
                  Upgrade to get unlimited storage and premium features
                </p>
              </div>

              <div className="space-y-2 mb-4 flex-1">
                {["100 GB Cloud Storage", "Unlimited 3D Projects", "Priority Support", "Advanced Features"].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-5 h-5 rounded-lg bg-white/60 dark:bg-white/10 border border-purple-300 dark:border-white/20 flex items-center justify-center">
                      <Check size={12} weight="bold" className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-xs text-slate-700 dark:text-slate-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-linear-to-r from-purple-500 via-pink-500 to-purple-600 text-white text-sm font-bold shadow-xl shadow-purple-500/30 dark:shadow-purple-500/20 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowUp size={16} weight="bold" />
                Upgrade Now
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden shadow-lg dark:shadow-none"
        >
          <div className="absolute inset-0 bg-slate-100 dark:bg-white/5 backdrop-blur-xl" />
          <div className="absolute inset-0 border border-slate-200 dark:border-white/10 rounded-2xl" />
          
          <div className="relative px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3">
            <MagnifyingGlass size={20} className="text-slate-500 dark:text-slate-400" weight="bold" />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm outline-none"
            />
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/15 transition-all duration-200">
                All Files
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/15 transition-all duration-200">
                Recent
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recent Files Grid */}
        <div className="flex-1 min-h-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-4"
          >
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={20} weight="duotone" className="text-cyan-500" />
              Recent Files
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {recentFiles.map((file, index) => {
              const fileType = fileTypeIcons[file.type as keyof typeof fileTypeIcons];
              const Icon = fileType.icon;

              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                  className="group relative"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-lg dark:shadow-none hover:shadow-xl transition-all duration-300">
                    {/* Glassmorphism Background */}
                    <div className="absolute inset-0 bg-slate-50 dark:bg-white/5 backdrop-blur-xl" />
                    <div className="absolute inset-0 bg-linear-to-br from-white/60 via-white/40 to-transparent dark:from-white/8 dark:via-transparent dark:to-transparent" />
                    <div className="absolute inset-0 border border-slate-200 dark:border-white/10 group-hover:border-slate-300 dark:group-hover:border-white/15 rounded-2xl transition-all duration-300" />
                    
                    <div className="relative p-4">
                      {/* File Icon */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl ${fileType.bg} border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-md`}>
                          <Icon size={24} weight="duotone" className="text-slate-700 dark:text-white/80" />
                        </div>
                        <div className="flex items-center gap-1">
                          {file.starred && (
                            <Star size={16} weight="fill" className="text-yellow-500" />
                          )}
                          <button className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-white/15">
                            <DotsThreeVertical size={16} weight="bold" className="text-slate-700 dark:text-white" />
                          </button>
                        </div>
                      </div>

                      {/* File Info */}
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 truncate">
                        {file.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>{file.size}</span>
                        <span>{file.modified}</span>
                      </div>

                      {/* Quick Actions - Show on Hover */}
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-white/15 transition-all duration-200">
                          <DownloadSimple size={14} weight="bold" />
                          Download
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/15 flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-white/15 transition-all duration-200">
                          <ShareNetwork size={14} weight="bold" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 transition-all duration-200">
                          <Trash size={14} weight="bold" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}


