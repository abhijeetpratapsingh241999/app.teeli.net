"use client";

/**
 * Project Dashboard
 * Premium dashboard after launching a project
 * Beautiful glass morphism cards with smooth animations
 * @updated 2025-12-03
 */

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Cube, 
  Download, 
  Share, 
  Eye, 
  PencilSimple,
  Ruler,
  Palette,
  Lightning,
  CheckCircle,
  Clock,
  HardDrive,
  CubeTransparent,
  FilePng,
  Play,
  Wrench,
  MagnifyingGlass,
  Sparkle,
  ArrowsClockwise,
  CaretRight
} from "@phosphor-icons/react";

interface ProjectDashboardProps {
  isVisible: boolean;
  onBack?: () => void;
}

// Mock project data
const projectData = {
  name: "Drone Model v2.1",
  status: "Ready",
  createdAt: "2 min ago",
  stats: {
    vertices: "24.5K",
    triangles: "48.2K",
    fileSize: "12.4 MB",
    renderTime: "3.2s"
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring" as const, 
      stiffness: 300, 
      damping: 24 
    }
  }
};

const statCardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.9 },
  visible: (i: number) => ({ 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring" as const, 
      stiffness: 400, 
      damping: 20,
      delay: i * 0.05
    }
  })
};

export function ProjectDashboard({ isVisible, onBack }: ProjectDashboardProps) {
  if (!isVisible) return null;

  const statsData = [
    { label: "Vertices", value: projectData.stats.vertices, icon: CubeTransparent, gradient: "from-blue-500 to-cyan-400" },
    { label: "Triangles", value: projectData.stats.triangles, icon: Cube, gradient: "from-purple-500 to-pink-400" },
    { label: "File Size", value: projectData.stats.fileSize, icon: HardDrive, gradient: "from-amber-500 to-orange-400" },
    { label: "Render Time", value: projectData.stats.renderTime, icon: Lightning, gradient: "from-green-500 to-emerald-400" },
  ];

  const quickActions = [
    { label: "Re-run Diagnostics", desc: "Scan for new issues", icon: MagnifyingGlass, color: "blue" },
    { label: "Apply Auto-Fix", desc: "Repair detected issues", icon: Wrench, color: "purple" },
    { label: "Re-render Model", desc: "Generate new output", icon: ArrowsClockwise, color: "green" },
  ];

  const exportFormats = [
    { format: "GLTF", desc: "3D Format", icon: Cube, gradient: "from-blue-500 to-blue-600" },
    { format: "OBJ", desc: "Universal", icon: CubeTransparent, gradient: "from-emerald-500 to-green-600" },
    { format: "PNG", desc: "Image", icon: FilePng, gradient: "from-purple-500 to-violet-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute inset-0 z-30 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
    >
      {/* Content Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-full p-4 md:p-6 lg:p-8"
      >
        
        {/* Header */}
        <motion.div 
          variants={cardVariants}
          className="flex items-center justify-between mb-6 md:mb-8"
        >
          {/* Back Button + Title */}
          <div className="flex items-center gap-3 md:gap-4">
            <motion.button
              whileHover={{ scale: 1.08, rotate: -3 }}
              whileTap={{ scale: 0.92 }}
              onClick={onBack}
              className="w-11 h-11 rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-slate-200/80 dark:border-white/15 shadow-lg shadow-slate-200/50 dark:shadow-black/20 flex items-center justify-center text-slate-600 dark:text-white hover:bg-white dark:hover:bg-white/20 transition-all duration-200"
            >
              <ArrowLeft size={20} weight="bold" />
            </motion.button>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                {projectData.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-xs font-medium text-green-700 dark:text-green-400">
                  <CheckCircle size={12} weight="fill" />
                  {projectData.status}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Clock size={12} />
                  {projectData.createdAt}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-slate-200/80 dark:border-white/15 text-sm font-medium text-slate-700 dark:text-white hover:bg-white dark:hover:bg-white/20 shadow-lg shadow-slate-200/40 dark:shadow-black/20 transition-all duration-200"
            >
              <Share size={16} weight="bold" />
              Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 text-sm font-semibold text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
            >
              <Download size={16} weight="bold" />
              <span className="hidden sm:inline">Export</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* Left Column - 3D Preview + Stats */}
          <div className="lg:col-span-2 space-y-4 md:space-y-5">
            
            {/* 3D Model Preview Card - Premium Glass */}
            <motion.div
              variants={cardVariants}
              className="relative rounded-3xl overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl shadow-slate-300/30 dark:shadow-black/30"
            >
              {/* Decorative gradient orbs */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
              
              {/* Preview Area */}
              <div className="relative aspect-[16/10] md:aspect-[16/9] bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-800/80 dark:via-slate-900/80 dark:to-slate-950/80 flex items-center justify-center overflow-hidden">
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                {/* 3D Cube Icon with glow */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="relative text-center"
                >
                  <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-purple-400/40 via-blue-400/40 to-cyan-400/40 rounded-full scale-150" />
                  <Cube size={80} className="relative text-slate-400 dark:text-slate-500 mx-auto mb-4" weight="duotone" />
                  <p className="relative text-sm font-medium text-slate-500 dark:text-slate-400">Interactive 3D Preview</p>
                  <p className="relative text-xs text-slate-400 dark:text-slate-500 mt-1">Drag to rotate • Scroll to zoom</p>
                </motion.div>
              </div>
              
              {/* Preview Controls - Floating Pill */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-slate-400/30 dark:shadow-black/40 border border-slate-200/50 dark:border-white/10"
              >
                {[
                  { icon: Eye, label: "View" },
                  { icon: CubeTransparent, label: "Wireframe" },
                  { icon: Ruler, label: "Measure" },
                  { icon: Palette, label: "Materials" },
                ].map((ctrl, i) => (
                  <motion.button 
                    key={ctrl.label}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                    whileTap={{ scale: 0.9 }}
                    className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
                  >
                    <ctrl.icon size={18} weight="bold" />
                    {/* Tooltip */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {ctrl.label}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            {/* Quick Stats Row - Beautiful Cards */}
            <motion.div
              variants={cardVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4"
            >
              {statsData.map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  custom={i}
                  variants={statCardVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-black/20 overflow-hidden group cursor-default"
                >
                  {/* Gradient accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-80`} />
                  
                  {/* Background glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm`}>
                        <stat.icon size={14} className="text-white" weight="bold" />
                      </div>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{stat.value}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wider font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Actions & Export */}
          <div className="space-y-4 md:space-y-5">
            
            {/* Quick Actions Card - Premium Design */}
            <motion.div
              variants={cardVariants}
              className="relative p-5 rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-black/20 overflow-hidden"
            >
              {/* Subtle gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-purple-50/30 dark:from-slate-800/30 dark:to-purple-900/10" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Sparkle size={16} className="text-white" weight="fill" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Quick Actions</h3>
                </div>
                
                <div className="space-y-2.5">
                  {quickActions.map((action, i) => (
                    <motion.button 
                      key={action.label}
                      whileHover={{ x: 4, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 text-left transition-all duration-200 group flex items-center gap-3"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white' :
                        action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white' :
                        'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 group-hover:bg-green-500 group-hover:text-white'
                      }`}>
                        <action.icon size={18} weight="bold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 dark:text-white truncate">{action.label}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{action.desc}</p>
                      </div>
                      <CaretRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Export Options Card - Premium Design */}
            <motion.div
              variants={cardVariants}
              className="relative p-5 rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-black/20 overflow-hidden"
            >
              {/* Gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Download size={16} className="text-white" weight="bold" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Export Formats</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  {exportFormats.map((exp) => (
                    <motion.button 
                      key={exp.format}
                      whileHover={{ y: -3, scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 text-center transition-all duration-200 group overflow-hidden"
                    >
                      {/* Hover gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${exp.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      <div className={`relative w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${exp.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <exp.icon size={20} className="text-white" weight="bold" />
                      </div>
                      <p className="relative text-sm font-bold text-slate-700 dark:text-white">{exp.format}</p>
                      <p className="relative text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{exp.desc}</p>
                    </motion.button>
                  ))}
                </div>
                
                {/* Download All Button - Premium */}
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 text-sm font-bold text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download size={18} weight="bold" />
                  Download All Formats
                </motion.button>
              </div>
            </motion.div>

            {/* Credits Used Card - Premium Glass */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="relative p-5 rounded-3xl overflow-hidden cursor-default"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/90 via-orange-400/90 to-orange-500/90 dark:from-amber-600/40 dark:via-orange-600/40 dark:to-orange-700/40" />
              
              {/* Glass overlay */}
              <div className="absolute inset-0 backdrop-blur-sm bg-white/20 dark:bg-black/10" />
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-yellow-300/30 rounded-full blur-xl" />
              
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/80 dark:text-amber-200/80 mb-1 uppercase tracking-wider">Credits Used</p>
                  <p className="text-3xl font-black text-white dark:text-amber-100 tracking-tight">-25 CR</p>
                </div>
                <motion.div 
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="w-14 h-14 rounded-2xl bg-white/25 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg"
                >
                  <Lightning size={28} weight="fill" className="text-white dark:text-amber-300" />
                </motion.div>
              </div>
              <div className="relative mt-3 pt-3 border-t border-white/30 dark:border-amber-400/30 flex items-center justify-between">
                <p className="text-xs font-semibold text-white/90 dark:text-amber-200/90">Remaining Balance</p>
                <p className="text-sm font-bold text-white dark:text-amber-100">1,225 CR</p>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
