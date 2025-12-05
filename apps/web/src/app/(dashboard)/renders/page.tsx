"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play,
  FilmStrip,
  Image as ImageIcon,
  Lightning,
  FolderOpen,
  CheckCircle,
  Clock,
  Fire,
  MagnifyingGlass,
  SquaresFour,
  List,
  Star,
  Download,
  ShareNetwork,
  Trash,
  ArrowsOut,
  Plus,
  X,
  CloudArrowUp,
  Timer,
  Calendar,
  FileImage,
  FileVideo,
  DotsThree,
  Copy,
  Spinner,
  Warning,
  ListBullets,
  Cloud,
  Database,
  FolderPlus,
  Tag,
  ArrowCounterClockwise,
  XCircle,
  CheckSquare,
  Square,
  ArrowLeft,
  ArrowRight,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
} from "@phosphor-icons/react";
import { useState } from "react";

// Color classes for icons
const colorClasses = {
  blue: {
    bg: "from-blue-500/25 to-indigo-500/25 dark:from-blue-500/20 dark:to-indigo-500/20",
    border: "border-blue-400/30 dark:border-blue-400/20",
    icon: "text-blue-600 dark:text-blue-400",
  },
  green: {
    bg: "from-green-500/25 to-emerald-500/25 dark:from-green-500/20 dark:to-emerald-500/20",
    border: "border-green-400/30 dark:border-green-400/20",
    icon: "text-green-600 dark:text-green-400",
  },
  amber: {
    bg: "from-amber-500/25 to-orange-500/25 dark:from-amber-500/20 dark:to-orange-500/20",
    border: "border-amber-400/30 dark:border-amber-400/20",
    icon: "text-amber-600 dark:text-amber-400",
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
  red: {
    bg: "from-red-500/25 to-rose-500/25 dark:from-red-500/20 dark:to-rose-500/20",
    border: "border-red-400/30 dark:border-red-400/20",
    icon: "text-red-600 dark:text-red-400",
  },
};

// Mock render data
const mockRenders = [
  {
    id: "1",
    name: "Product_Hero_Shot.png",
    thumbnail: "/renders/thumb1.jpg",
    resolution: "4K",
    fileSize: "12.4 MB",
    date: "2 min ago",
    duration: "1m 24s",
    status: "completed",
    format: "PNG",
    isFavorite: true,
    project: "Brand Campaign",
  },
  {
    id: "2",
    name: "Animation_Loop.mp4",
    thumbnail: "/renders/thumb2.jpg",
    resolution: "1080p",
    fileSize: "45.2 MB",
    date: "15 min ago",
    duration: "5m 12s",
    status: "completed",
    format: "MP4",
    isFavorite: false,
    project: "Social Media",
  },
  {
    id: "3",
    name: "Interior_Scene_v2.png",
    thumbnail: "/renders/thumb3.jpg",
    resolution: "4K",
    fileSize: "18.7 MB",
    date: "1 hour ago",
    duration: "3m 45s",
    status: "rendering",
    format: "PNG",
    isFavorite: true,
    project: "Architecture",
    progress: 67,
  },
  {
    id: "4",
    name: "Character_Turntable.mp4",
    thumbnail: "/renders/thumb4.jpg",
    resolution: "2K",
    fileSize: "78.3 MB",
    date: "2 hours ago",
    duration: "8m 30s",
    status: "queued",
    format: "MP4",
    isFavorite: false,
    project: "Game Assets",
  },
  {
    id: "5",
    name: "Logo_Animation.mp4",
    thumbnail: "/renders/thumb5.jpg",
    resolution: "1080p",
    fileSize: "22.1 MB",
    date: "Yesterday",
    duration: "2m 15s",
    status: "failed",
    format: "MP4",
    isFavorite: false,
    project: "Branding",
  },
  {
    id: "6",
    name: "Product_360.png",
    thumbnail: "/renders/thumb6.jpg",
    resolution: "4K",
    fileSize: "8.9 MB",
    date: "Yesterday",
    duration: "45s",
    status: "completed",
    format: "PNG",
    isFavorite: true,
    project: "E-commerce",
  },
];

// Mock collections
const mockCollections = [
  { id: "1", name: "Brand Campaign", count: 12 },
  { id: "2", name: "Social Media", count: 24 },
  { id: "3", name: "Architecture", count: 8 },
  { id: "4", name: "Game Assets", count: 15 },
];

// Status badge component
const StatusBadge = ({ status, progress }: { status: string; progress?: number }) => {
  const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    completed: { bg: "bg-green-500/20", text: "text-green-600 dark:text-green-400", icon: CheckCircle },
    rendering: { bg: "bg-blue-500/20", text: "text-blue-600 dark:text-blue-400", icon: Spinner },
    queued: { bg: "bg-amber-500/20", text: "text-amber-600 dark:text-amber-400", icon: Clock },
    failed: { bg: "bg-red-500/20", text: "text-red-600 dark:text-red-400", icon: Warning },
  };
  
  const config = statusConfig[status] || statusConfig.completed;
  const Icon = config.icon;
  
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bg}`}>
      <Icon size={12} weight="duotone" className={`${config.text} ${status === "rendering" ? "animate-spin" : ""}`} />
      <span className={`text-[10px] font-semibold uppercase ${config.text}`}>
        {status === "rendering" && progress ? `${progress}%` : status}
      </span>
    </div>
  );
};

// Format badge component
const FormatBadge = ({ format }: { format: string }) => {
  const isVideo = ["MP4", "WebM"].includes(format);
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${isVideo ? "bg-purple-500/20" : "bg-cyan-500/20"}`}>
      {isVideo ? (
        <FileVideo size={10} weight="duotone" className="text-purple-600 dark:text-purple-400" />
      ) : (
        <FileImage size={10} weight="duotone" className="text-cyan-600 dark:text-cyan-400" />
      )}
      <span className={`text-[10px] font-semibold ${isVideo ? "text-purple-600 dark:text-purple-400" : "text-cyan-600 dark:text-cyan-400"}`}>
        {format}
      </span>
    </div>
  );
};

export default function RendersPage() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRenders, setSelectedRenders] = useState<string[]>([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewRender, setPreviewRender] = useState<typeof mockRenders[0] | null>(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [renders, setRenders] = useState(mockRenders);
  const [showNewRenderPanel, setShowNewRenderPanel] = useState(false);
  
  // Stats
  const stats = {
    totalRenders: 156,
    totalTime: "12h 45m",
    monthlyRenders: 42,
    queueCount: 3,
    storageUsed: "2.4 GB",
    storageTotal: "10 GB",
  };

  // Active renders
  const activeRenders = renders.filter(r => r.status === "rendering");
  const queuedRenders = renders.filter(r => r.status === "queued");

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setRenders(prev => prev.map(r => 
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedRenders(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Select all
  const selectAll = () => {
    if (selectedRenders.length === renders.length) {
      setSelectedRenders([]);
    } else {
      setSelectedRenders(renders.map(r => r.id));
    }
  };

  // Open preview
  const openPreview = (render: typeof mockRenders[0]) => {
    setPreviewRender(render);
    setShowPreviewModal(true);
    setPreviewZoom(1);
  };

  // Navigate preview
  const navigatePreview = (direction: "prev" | "next") => {
    if (!previewRender) return;
    const currentIndex = renders.findIndex(r => r.id === previewRender.id);
    const newIndex = direction === "prev" 
      ? (currentIndex - 1 + renders.length) % renders.length
      : (currentIndex + 1) % renders.length;
    setPreviewRender(renders[newIndex]);
    setPreviewZoom(1);
  };

  // Filter renders
  const filteredRenders = renders.filter(render => {
    if (searchQuery && !render.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeFilter === "images" && !["PNG", "JPG", "EXR"].includes(render.format)) {
      return false;
    }
    if (activeFilter === "videos" && !["MP4", "WebM"].includes(render.format)) {
      return false;
    }
    if (activeFilter === "favorites" && !render.isFavorite) {
      return false;
    }
    return true;
  });

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main Container - Scrollable */}
      <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-2 sm:px-4 md:px-6 md:pl-20 lg:pl-6 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-24 sm:pb-6">
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Renders
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage your rendered outputs
              </p>
            </div>
            
            {/* New Render Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewRenderPanel(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-shadow"
            >
              <Plus size={18} weight="bold" />
              <span>New Render</span>
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {[
              { icon: ImageIcon, label: "Total Renders", value: stats.totalRenders, color: "purple" },
              { icon: Timer, label: "Total Time", value: stats.totalTime, color: "blue" },
              { icon: Calendar, label: "This Month", value: stats.monthlyRenders, color: "green" },
              { icon: ListBullets, label: "In Queue", value: stats.queueCount, color: "amber" },
              { icon: Cloud, label: "Cloud Sync", value: "Synced", color: "cyan" },
              { icon: Database, label: "Storage", value: `${stats.storageUsed}/${stats.storageTotal}`, color: "pink" },
            ].map((stat, index) => {
              const colors = colorClasses[stat.color as keyof typeof colorClasses];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-white/20 dark:bg-white/10 backdrop-blur-[60px] saturate-[1.8] rounded-xl border border-white/40 dark:border-white/15 p-3 sm:p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg bg-linear-to-br ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                      <stat.icon size={14} weight="duotone" className={colors.icon} />
                    </div>
                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Active Renders Section */}
          {(activeRenders.length > 0 || queuedRenders.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-[1.8] rounded-2xl border-2 border-white/60 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500/25 to-indigo-500/25 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-400/30 dark:border-blue-400/20 flex items-center justify-center">
                  <Play size={18} weight="duotone" className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-800 dark:text-white">Active Renders</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{activeRenders.length} rendering, {queuedRenders.length} in queue</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {activeRenders.map(render => (
                  <div key={render.id} className="flex items-center gap-4 p-3 bg-white/10 dark:bg-white/5 rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      <ImageIcon size={24} weight="duotone" className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{render.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${render.progress || 0}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">{render.progress}%</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Est. 2 min remaining</p>
                    </div>
                    <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                      <XCircle size={18} weight="duotone" className="text-red-500" />
                    </button>
                  </div>
                ))}
                
                {queuedRenders.map(render => (
                  <div key={render.id} className="flex items-center gap-4 p-3 bg-white/5 dark:bg-white/2 rounded-xl opacity-60">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      <Clock size={24} weight="duotone" className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{render.name}</p>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">In queue • Position #1</p>
                    </div>
                    <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                      <X size={18} weight="bold" className="text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search, Filter, Sort, View Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <MagnifyingGlass size={18} weight="duotone" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search renders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/15 rounded-xl text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { id: "all", label: "All", icon: SquaresFour },
                { id: "images", label: "Images", icon: FileImage },
                { id: "videos", label: "Videos", icon: FileVideo },
                { id: "favorites", label: "Favorites", icon: Star },
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
                    activeFilter === filter.id
                      ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-400/30"
                      : "bg-white/10 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  <filter.icon size={14} weight={activeFilter === filter.id ? "fill" : "duotone"} />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Sort & View */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/15 rounded-lg text-[13px] text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
              </select>

              <div className="flex items-center bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/15 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white/30 dark:bg-white/15" : ""}`}
                >
                  <SquaresFour size={16} weight={viewMode === "grid" ? "fill" : "regular"} className="text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white/30 dark:bg-white/15" : ""}`}
                >
                  <List size={16} weight={viewMode === "list" ? "fill" : "regular"} className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Multi-Select Actions */}
          {isMultiSelect && selectedRenders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-400/30 rounded-xl mb-4"
            >
              <button onClick={selectAll} className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                {selectedRenders.length === renders.length ? <CheckSquare size={16} /> : <Square size={16} />}
                Select All
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedRenders.length} selected
              </span>
              <div className="flex-1" />
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors">
                <Download size={14} />
                Download ZIP
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors">
                <FolderPlus size={14} />
                Add to Collection
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors">
                <Trash size={14} />
                Delete
              </button>
            </motion.div>
          )}

          {/* Toggle Multi-Select */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                setIsMultiSelect(!isMultiSelect);
                setSelectedRenders([]);
              }}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              {isMultiSelect ? <CheckSquare size={16} /> : <Square size={16} />}
              Multi-select
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredRenders.length} renders
            </span>
          </div>
        </div>

        {/* Renders Gallery */}
        {filteredRenders.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
            : "space-y-3"
          }>
            {filteredRenders.map((render, index) => (
              <motion.div
                key={render.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`group relative bg-white/20 dark:bg-white/10 backdrop-blur-[60px] saturate-[1.8] rounded-xl border-2 border-white/40 dark:border-white/15 overflow-hidden transition-all hover:border-white/60 dark:hover:border-white/25 hover:shadow-xl ${
                  selectedRenders.includes(render.id) ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    {/* Thumbnail */}
                    <div 
                      className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer"
                      onClick={() => openPreview(render)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        {render.format === "MP4" || render.format === "WebM" ? (
                          <FilmStrip size={48} weight="duotone" className="text-gray-300 dark:text-gray-600" />
                        ) : (
                          <ImageIcon size={48} weight="duotone" className="text-gray-300 dark:text-gray-600" />
                        )}
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openPreview(render); }}
                          className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                        >
                          <ArrowsOut size={18} className="text-white" />
                        </button>
                        <button className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <Download size={18} className="text-white" />
                        </button>
                        <button className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <ShareNetwork size={18} className="text-white" />
                        </button>
                        <button className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <ArrowCounterClockwise size={18} className="text-white" />
                        </button>
                        <button className="p-2.5 bg-red-500/50 backdrop-blur-sm rounded-full hover:bg-red-500/70 transition-colors">
                          <Trash size={18} className="text-white" />
                        </button>
                      </div>

                      {/* Multi-select Checkbox */}
                      {isMultiSelect && (
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSelection(render.id); }}
                          className="absolute top-2 left-2 p-1 bg-white/20 backdrop-blur-sm rounded-md"
                        >
                          {selectedRenders.includes(render.id) ? (
                            <CheckSquare size={18} className="text-blue-500" />
                          ) : (
                            <Square size={18} className="text-white" />
                          )}
                        </button>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(render.id); }}
                        className="absolute top-2 right-2 p-1.5 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {render.isFavorite ? (
                          <Star size={16} weight="fill" className="text-yellow-400" />
                        ) : (
                          <Star size={16} className="text-white" />
                        )}
                      </button>

                      {/* Status Badge */}
                      <div className="absolute bottom-2 left-2">
                        <StatusBadge status={render.status} progress={render.progress} />
                      </div>

                      {/* Format Badge */}
                      <div className="absolute bottom-2 right-2">
                        <FormatBadge format={render.format} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{render.name}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                            <span>{render.resolution}</span>
                            <span>•</span>
                            <span>{render.fileSize}</span>
                            <span>•</span>
                            <span>{render.date}</span>
                          </div>
                        </div>
                        <button className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                          <DotsThree size={18} weight="bold" className="text-gray-500" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Tag size={12} className="text-gray-400" />
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">{render.project}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* List View */
                  <div className="flex items-center gap-4 p-3">
                    {isMultiSelect && (
                      <button onClick={() => toggleSelection(render.id)}>
                        {selectedRenders.includes(render.id) ? (
                          <CheckSquare size={18} className="text-blue-500" />
                        ) : (
                          <Square size={18} className="text-gray-400" />
                        )}
                      </button>
                    )}
                    
                    <div 
                      className="w-16 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer overflow-hidden"
                      onClick={() => openPreview(render)}
                    >
                      {render.format === "MP4" || render.format === "WebM" ? (
                        <FilmStrip size={24} weight="duotone" className="text-gray-400" />
                      ) : (
                        <ImageIcon size={24} weight="duotone" className="text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{render.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <StatusBadge status={render.status} progress={render.progress} />
                        <FormatBadge format={render.format} />
                        <span className="text-[11px] text-gray-500">{render.resolution}</span>
                        <span className="text-[11px] text-gray-500">{render.fileSize}</span>
                      </div>
                    </div>
                    
                    <div className="text-right text-[11px] text-gray-500 dark:text-gray-400">
                      <p>{render.date}</p>
                      <p className="text-gray-400">{render.duration}</p>
                    </div>
                    
                    <button onClick={() => toggleFavorite(render.id)} className="p-2">
                      {render.isFavorite ? (
                        <Star size={16} weight="fill" className="text-yellow-400" />
                      ) : (
                        <Star size={16} className="text-gray-400 hover:text-yellow-400" />
                      )}
                    </button>
                    
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <Download size={16} className="text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <ShareNetwork size={16} className="text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <DotsThree size={16} weight="bold" className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6">
              <ImageIcon size={48} weight="duotone" className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No renders yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              Start creating amazing renders for your 3D projects. Your rendered images and videos will appear here.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewRenderPanel(true)}
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25"
            >
              <Plus size={20} weight="bold" />
              Create Your First Render
            </motion.button>
          </motion.div>
        )}

        {/* Collections Section */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Collections</h2>
            <button className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              <FolderPlus size={14} />
              New Collection
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mockCollections.map((collection, index) => (
              <motion.button
                key={collection.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white/20 dark:bg-white/10 backdrop-blur-[60px] saturate-[1.8] rounded-xl border border-white/40 dark:border-white/15 p-4 text-left hover:border-white/60 dark:hover:border-white/25 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500/25 to-violet-500/25 border border-purple-400/30 flex items-center justify-center">
                    <FolderOpen size={20} weight="duotone" className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{collection.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{collection.count} items</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-dashed border-white/30 dark:border-white/15 p-8 mb-8"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center mb-4">
              <CloudArrowUp size={32} weight="duotone" className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Upload Existing Renders</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Drag and drop your render files here, or click to browse
            </p>
            <button className="px-4 py-2 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/20 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/30 transition-colors">
              Browse Files
            </button>
          </div>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && previewRender && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setShowPreviewModal(false)}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); navigatePreview("prev"); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ArrowLeft size={24} className="text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigatePreview("next"); }}
              className="absolute right-96 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ArrowRight size={24} className="text-white" />
            </button>

            {/* Preview Content */}
            <div 
              className="relative max-w-4xl max-h-[80vh] overflow-hidden mr-80"
              onClick={(e) => e.stopPropagation()}
              style={{ transform: `scale(${previewZoom})` }}
            >
              <div className="w-full h-[60vh] bg-gray-900 rounded-xl flex items-center justify-center">
                {previewRender.format === "MP4" || previewRender.format === "WebM" ? (
                  <FilmStrip size={120} weight="duotone" className="text-gray-600" />
                ) : (
                  <ImageIcon size={120} weight="duotone" className="text-gray-600" />
                )}
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 mr-40">
              <button onClick={() => setPreviewZoom(z => Math.max(0.5, z - 0.25))} className="p-1.5 hover:bg-white/20 rounded-full">
                <MagnifyingGlassMinus size={18} className="text-white" />
              </button>
              <span className="text-white text-sm font-medium w-16 text-center">{Math.round(previewZoom * 100)}%</span>
              <button onClick={() => setPreviewZoom(z => Math.min(3, z + 0.25))} className="p-1.5 hover:bg-white/20 rounded-full">
                <MagnifyingGlassPlus size={18} className="text-white" />
              </button>
            </div>

            {/* Details Sidebar */}
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute right-0 top-0 h-full w-80 bg-white/10 backdrop-blur-2xl border-l border-white/10 p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">{previewRender.name}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Status</span>
                  <StatusBadge status={previewRender.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Format</span>
                  <FormatBadge format={previewRender.format} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Resolution</span>
                  <span className="text-white text-sm">{previewRender.resolution}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">File Size</span>
                  <span className="text-white text-sm">{previewRender.fileSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Duration</span>
                  <span className="text-white text-sm">{previewRender.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Created</span>
                  <span className="text-white text-sm">{previewRender.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Project</span>
                  <span className="text-white text-sm">{previewRender.project}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 space-y-3">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500/20 text-green-400 rounded-lg font-medium hover:bg-green-500/30 transition-colors">
                  <Download size={18} />
                  Download
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-500/20 text-blue-400 rounded-lg font-medium hover:bg-blue-500/30 transition-colors">
                  <ShareNetwork size={18} />
                  Share
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-500/20 text-purple-400 rounded-lg font-medium hover:bg-purple-500/30 transition-colors">
                  <Copy size={18} />
                  Copy Link
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500/20 text-amber-400 rounded-lg font-medium hover:bg-amber-500/30 transition-colors">
                  <ArrowCounterClockwise size={18} />
                  Re-render
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors">
                  <Trash size={18} />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Render Panel */}
      <AnimatePresence>
        {showNewRenderPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowNewRenderPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-[1.8] rounded-2xl border-2 border-white/60 dark:border-white/20 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/20 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-500/25 to-emerald-500/25 border border-green-400/30 flex items-center justify-center">
                    <Play size={20} weight="duotone" className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">New Render</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Configure render settings</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowNewRenderPanel(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Resolution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resolution</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["720p", "1080p", "2K", "4K"].map(res => (
                      <button
                        key={res}
                        className="py-2 px-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output Format</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["PNG", "JPG", "MP4", "EXR"].map(format => (
                      <button
                        key={format}
                        className="py-2 px-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quality Preset</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Fast", icon: Lightning, desc: "~30s" },
                      { label: "Standard", icon: CheckCircle, desc: "~2min" },
                      { label: "High", icon: Fire, desc: "~5min" },
                    ].map(preset => (
                      <button
                        key={preset.label}
                        className="flex flex-col items-center gap-1 py-3 px-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
                      >
                        <preset.icon size={20} className="text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{preset.label}</span>
                        <span className="text-[10px] text-gray-500">{preset.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-5 border-t border-white/20 dark:border-white/10">
                <button 
                  onClick={() => setShowNewRenderPanel(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-shadow">
                  <Play size={16} weight="bold" />
                  Start Render
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
