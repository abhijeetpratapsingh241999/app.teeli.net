"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderOpen, 
  Plus, 
  Clock, 
  Star,
  Package,
  MagnifyingGlass,
  SquaresFour,
  List,
  Cube,
  Image as ImageIcon,
  DotsThree,
  ShareNetwork,
  PencilSimple,
  HardDrive,
  Lightning,
  TrendUp,
  Users,
  FolderPlus,
  Tag,
  X,
  Check,
  Play,
  Fire,
} from "@phosphor-icons/react";
import { useState } from "react";

// Color classes for icons
const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
  blue: {
    bg: "from-blue-500/25 to-indigo-500/25 dark:from-blue-500/20 dark:to-indigo-500/20",
    border: "border-blue-400/30 dark:border-blue-400/20",
    icon: "text-blue-600 dark:text-blue-400",
  },
  cyan: {
    bg: "from-cyan-500/25 to-teal-500/25 dark:from-cyan-500/20 dark:to-teal-500/20",
    border: "border-cyan-400/30 dark:border-cyan-400/20",
    icon: "text-cyan-600 dark:text-cyan-400",
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
};

// Premium Vercel-style tag colors - light bg with strong text same color family
const tagColors: Record<string, { bg: string; text: string }> = {
  // Furniture & Interior
  furniture: { bg: "bg-amber-100 dark:bg-amber-500/15", text: "text-amber-700 dark:text-amber-400" },
  modern: { bg: "bg-blue-100 dark:bg-blue-500/15", text: "text-blue-700 dark:text-blue-400" },
  interior: { bg: "bg-purple-100 dark:bg-purple-500/15", text: "text-purple-700 dark:text-purple-400" },
  minimal: { bg: "bg-slate-100 dark:bg-slate-500/15", text: "text-slate-700 dark:text-slate-400" },
  minimalist: { bg: "bg-slate-100 dark:bg-slate-500/15", text: "text-slate-700 dark:text-slate-400" },
  office: { bg: "bg-cyan-100 dark:bg-cyan-500/15", text: "text-cyan-700 dark:text-cyan-400" },
  collection: { bg: "bg-indigo-100 dark:bg-indigo-500/15", text: "text-indigo-700 dark:text-indigo-400" },
  elegant: { bg: "bg-rose-100 dark:bg-rose-500/15", text: "text-rose-700 dark:text-rose-400" },
  
  // Lighting
  lighting: { bg: "bg-yellow-100 dark:bg-yellow-500/15", text: "text-yellow-700 dark:text-yellow-500" },
  lamp: { bg: "bg-yellow-100 dark:bg-yellow-500/15", text: "text-yellow-700 dark:text-yellow-500" },
  
  // Architecture
  architecture: { bg: "bg-stone-100 dark:bg-stone-500/15", text: "text-stone-700 dark:text-stone-400" },
  building: { bg: "bg-stone-100 dark:bg-stone-500/15", text: "text-stone-700 dark:text-stone-400" },
  exterior: { bg: "bg-emerald-100 dark:bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-400" },
  luxury: { bg: "bg-amber-100 dark:bg-amber-500/15", text: "text-amber-700 dark:text-amber-400" },
  residential: { bg: "bg-teal-100 dark:bg-teal-500/15", text: "text-teal-700 dark:text-teal-400" },
  commercial: { bg: "bg-sky-100 dark:bg-sky-500/15", text: "text-sky-700 dark:text-sky-400" },
  
  // Vehicles
  vehicle: { bg: "bg-red-100 dark:bg-red-500/15", text: "text-red-700 dark:text-red-400" },
  automotive: { bg: "bg-red-100 dark:bg-red-500/15", text: "text-red-700 dark:text-red-400" },
  car: { bg: "bg-red-100 dark:bg-red-500/15", text: "text-red-700 dark:text-red-400" },
  sports: { bg: "bg-orange-100 dark:bg-orange-500/15", text: "text-orange-700 dark:text-orange-400" },
  
  // Characters & Gaming
  character: { bg: "bg-violet-100 dark:bg-violet-500/15", text: "text-violet-700 dark:text-violet-400" },
  game: { bg: "bg-fuchsia-100 dark:bg-fuchsia-500/15", text: "text-fuchsia-700 dark:text-fuchsia-400" },
  fantasy: { bg: "bg-purple-100 dark:bg-purple-500/15", text: "text-purple-700 dark:text-purple-400" },
  
  // Environment & Nature
  environment: { bg: "bg-green-100 dark:bg-green-500/15", text: "text-green-700 dark:text-green-400" },
  nature: { bg: "bg-green-100 dark:bg-green-500/15", text: "text-green-700 dark:text-green-400" },
  forest: { bg: "bg-emerald-100 dark:bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-400" },
  outdoor: { bg: "bg-lime-100 dark:bg-lime-500/15", text: "text-lime-700 dark:text-lime-400" },
  
  // Tech & Industrial
  tech: { bg: "bg-blue-100 dark:bg-blue-500/15", text: "text-blue-700 dark:text-blue-400" },
  electronics: { bg: "bg-sky-100 dark:bg-sky-500/15", text: "text-sky-700 dark:text-sky-400" },
  gadget: { bg: "bg-cyan-100 dark:bg-cyan-500/15", text: "text-cyan-700 dark:text-cyan-400" },
  industrial: { bg: "bg-zinc-100 dark:bg-zinc-500/15", text: "text-zinc-700 dark:text-zinc-400" },
  robot: { bg: "bg-slate-100 dark:bg-slate-500/15", text: "text-slate-700 dark:text-slate-400" },
  mech: { bg: "bg-zinc-100 dark:bg-zinc-500/15", text: "text-zinc-700 dark:text-zinc-400" },
  sci: { bg: "bg-indigo-100 dark:bg-indigo-500/15", text: "text-indigo-700 dark:text-indigo-400" },
  
  // Product & Design
  product: { bg: "bg-pink-100 dark:bg-pink-500/15", text: "text-pink-700 dark:text-pink-400" },
  concept: { bg: "bg-violet-100 dark:bg-violet-500/15", text: "text-violet-700 dark:text-violet-400" },
  design: { bg: "bg-rose-100 dark:bg-rose-500/15", text: "text-rose-700 dark:text-rose-400" },
  prototype: { bg: "bg-orange-100 dark:bg-orange-500/15", text: "text-orange-700 dark:text-orange-400" },
};

// Get tag color with fallback
const getTagColor = (tag: string) => {
  const lowerTag = tag.toLowerCase();
  // Check for exact match
  if (tagColors[lowerTag]) return tagColors[lowerTag];
  // Check for partial match
  for (const [key, value] of Object.entries(tagColors)) {
    if (lowerTag.includes(key) || key.includes(lowerTag)) return value;
  }
  // Default fallback - neutral gray
  return { bg: "bg-gray-100 dark:bg-gray-500/15", text: "text-gray-700 dark:text-gray-400" };
};

// Category type
type CategoryType = "all" | "furniture" | "architecture" | "product" | "character" | "vehicle" | "environment";

// Project type
interface Project {
  id: string;
  name: string;
  thumbnail: string;
  category: CategoryType;
  lastEdited: string;
  createdAt: string;
  starred: boolean;
  fileSize: string;
  objectCount: number;
  renderCount: number;
  collaborators: number;
  status: "active" | "archived" | "draft";
  tags: string[];
}

// Mock projects data
const mockProjects: Project[] = [
  { 
    id: "1", 
    name: "Modern Chair v3", 
    thumbnail: "/projects/chair.jpg",
    category: "furniture",
    lastEdited: "2 hours ago", 
    createdAt: "Dec 1, 2024",
    starred: true,
    fileSize: "24.5 MB",
    objectCount: 12,
    renderCount: 8,
    collaborators: 2,
    status: "active",
    tags: ["furniture", "modern", "interior"],
  },
  { 
    id: "2", 
    name: "Office Table Design", 
    thumbnail: "/projects/table.jpg",
    category: "furniture",
    lastEdited: "1 day ago", 
    createdAt: "Nov 28, 2024",
    starred: false,
    fileSize: "18.2 MB",
    objectCount: 8,
    renderCount: 4,
    collaborators: 1,
    status: "active",
    tags: ["office", "minimal"],
  },
  { 
    id: "3", 
    name: "Pendant Lamp", 
    thumbnail: "/projects/lamp.jpg",
    category: "product",
    lastEdited: "3 days ago", 
    createdAt: "Nov 25, 2024",
    starred: true,
    fileSize: "8.7 MB",
    objectCount: 5,
    renderCount: 12,
    collaborators: 0,
    status: "active",
    tags: ["lighting", "elegant"],
  },
  { 
    id: "4", 
    name: "Villa Exterior", 
    thumbnail: "/projects/villa.jpg",
    category: "architecture",
    lastEdited: "5 days ago", 
    createdAt: "Nov 20, 2024",
    starred: false,
    fileSize: "156.3 MB",
    objectCount: 245,
    renderCount: 24,
    collaborators: 4,
    status: "active",
    tags: ["architecture", "exterior", "luxury"],
  },
  { 
    id: "5", 
    name: "Sports Car Model", 
    thumbnail: "/projects/car.jpg",
    category: "vehicle",
    lastEdited: "1 week ago", 
    createdAt: "Nov 15, 2024",
    starred: true,
    fileSize: "89.4 MB",
    objectCount: 67,
    renderCount: 16,
    collaborators: 1,
    status: "active",
    tags: ["vehicle", "automotive"],
  },
  { 
    id: "6", 
    name: "Game Character", 
    thumbnail: "/projects/character.jpg",
    category: "character",
    lastEdited: "2 weeks ago", 
    createdAt: "Nov 10, 2024",
    starred: false,
    fileSize: "45.8 MB",
    objectCount: 1,
    renderCount: 6,
    collaborators: 0,
    status: "draft",
    tags: ["character", "game"],
  },
  { 
    id: "7", 
    name: "Forest Environment", 
    thumbnail: "/projects/forest.jpg",
    category: "environment",
    lastEdited: "3 weeks ago", 
    createdAt: "Nov 5, 2024",
    starred: false,
    fileSize: "234.6 MB",
    objectCount: 890,
    renderCount: 3,
    collaborators: 2,
    status: "archived",
    tags: ["environment", "nature"],
  },
  { 
    id: "8", 
    name: "Sofa Set Collection", 
    thumbnail: "/projects/sofa.jpg",
    category: "furniture",
    lastEdited: "1 month ago", 
    createdAt: "Oct 28, 2024",
    starred: true,
    fileSize: "52.1 MB",
    objectCount: 28,
    renderCount: 18,
    collaborators: 3,
    status: "active",
    tags: ["furniture", "collection"],
  },
];

// Categories
const categories = [
  { id: "all", label: "All", icon: SquaresFour, count: 8 },
  { id: "furniture", label: "Furniture", icon: Package, count: 4 },
  { id: "architecture", label: "Architecture", icon: Cube, count: 1 },
  { id: "product", label: "Product", icon: Lightning, count: 1 },
  { id: "character", label: "Character", icon: Users, count: 1 },
  { id: "vehicle", label: "Vehicle", icon: Fire, count: 1 },
];

// Stats
const stats = [
  { label: "Total Projects", value: "24", icon: FolderOpen, color: "blue" },
  { label: "Active", value: "18", icon: Lightning, color: "green" },
  { label: "This Month", value: "6", icon: TrendUp, color: "amber" },
  { label: "Storage Used", value: "2.4 GB", icon: HardDrive, color: "purple" },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [projects, setProjects] = useState(mockProjects);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, starred: !p.starred } : p
    ));
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === "all" || project.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "recent") return 0;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "size") return parseFloat(b.fileSize) - parseFloat(a.fileSize);
    return 0;
  });

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main Container - Scrollable */}
      <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-3 sm:px-4 md:px-6 md:pl-20 lg:pl-6 pt-16 sm:pt-24 md:pt-28 lg:pt-32 pb-28 sm:pb-6">
        
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                Projects
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 truncate">
                Manage your 3D projects
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex-shrink-0"
            >
              <Plus size={16} weight="bold" className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">New</span>
              <span className="hidden sm:inline">Project</span>
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {stats.map((stat, index) => {
              const colors = colorClasses[stat.color];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-[1.8] rounded-xl border-2 border-white/60 dark:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none p-2.5 sm:p-4 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent pointer-events-none" />
                  <div className="relative flex items-center gap-2 sm:gap-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                      <stat.icon size={16} weight="duotone" className={`${colors.icon} sm:w-5 sm:h-5`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base sm:text-xl font-bold text-gray-800 dark:text-white truncate">{stat.value}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div className="flex gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <MagnifyingGlass size={16} className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-white/20 dark:bg-white/10 backdrop-blur-xl border-2 border-white/60 dark:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none rounded-xl text-xs sm:text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            {/* Sort - Hidden on mobile, shown on sm+ */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="hidden sm:block px-4 py-2.5 bg-white/20 dark:bg-white/10 backdrop-blur-xl border-2 border-white/60 dark:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="recent">Recent</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center bg-white/20 dark:bg-white/10 backdrop-blur-xl border-2 border-white/60 dark:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none rounded-xl p-0.5 sm:p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white/30 dark:bg-white/20" : "hover:bg-white/10"}`}
              >
                <SquaresFour size={16} className={`sm:w-[18px] sm:h-[18px] ${viewMode === "grid" ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500"}`} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white/30 dark:bg-white/20" : "hover:bg-white/10"}`}
              >
                <List size={16} className={`sm:w-[18px] sm:h-[18px] ${viewMode === "list" ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(category.id as CategoryType)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive 
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/40 text-cyan-600 dark:text-cyan-400" 
                    : "bg-white/10 dark:bg-white/5 border-2 border-white/30 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-white/20"
                }`}
              >
                <category.icon size={14} weight={isActive ? "fill" : "duotone"} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{category.label}</span>
                <span className="xs:hidden">{category.label.slice(0, 4)}</span>
                <span className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full ${isActive ? "bg-cyan-500/20" : "bg-gray-500/20"}`}>
                  {category.count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Projects Grid/List */}
        {sortedProjects.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
              {sortedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group relative bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-[1.8] rounded-xl sm:rounded-2xl border-2 border-white/60 dark:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none overflow-hidden hover:border-cyan-400/40 transition-all cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square sm:aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {project.category === "character" ? (
                        <Users size={32} weight="duotone" className="text-gray-300 dark:text-gray-600 sm:w-12 sm:h-12" />
                      ) : project.category === "vehicle" ? (
                        <Fire size={32} weight="duotone" className="text-gray-300 dark:text-gray-600 sm:w-12 sm:h-12" />
                      ) : project.category === "architecture" ? (
                        <Cube size={32} weight="duotone" className="text-gray-300 dark:text-gray-600 sm:w-12 sm:h-12" />
                      ) : (
                        <Package size={32} weight="duotone" className="text-gray-300 dark:text-gray-600 sm:w-12 sm:h-12" />
                      )}
                    </div>

                    {/* Status Badge */}
                    {project.status !== "active" && (
                      <div className={`absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-semibold uppercase ${
                        project.status === "draft" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-gray-500/20 text-gray-600 dark:text-gray-400"
                      }`}>
                        {project.status}
                      </div>
                    )}

                    {/* Favorite Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(project.id);
                      }}
                      className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    >
                      <Star size={12} weight={project.starred ? "fill" : "regular"} className={`sm:w-4 sm:h-4 ${project.starred ? "text-amber-400" : "text-white"}`} />
                    </motion.button>

                    {/* Hover Overlay - Hidden on mobile */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 hidden sm:flex group-hover:opacity-100 transition-opacity items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                      >
                        <Play size={20} weight="fill" className="text-white ml-0.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                      >
                        <PencilSimple size={20} weight="duotone" className="text-white" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-2.5 sm:p-4">
                    <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white truncate flex-1 leading-tight">
                        {project.name}
                      </h3>
                      {project.starred && (
                        <Star size={12} weight="fill" className="text-amber-400 flex-shrink-0 sm:w-3.5 sm:h-3.5" />
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                      {project.tags.slice(0, 2).map((tag) => {
                        const colors = getTagColor(tag);
                        return (
                          <span key={tag} className={`px-1.5 sm:px-2 py-0.5 ${colors.bg} rounded sm:rounded-md text-[8px] sm:text-[10px] font-medium ${colors.text} border border-current/10`}>
                            {tag}
                          </span>
                        );
                      })}
                      {project.tags.length > 2 && (
                        <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 dark:bg-gray-500/15 rounded sm:rounded-md text-[8px] sm:text-[10px] font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600/20">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock size={10} className="sm:w-3 sm:h-3" />
                        <span className="truncate">{project.lastEdited}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HardDrive size={10} className="sm:w-3 sm:h-3" />
                        <span>{project.fileSize}</span>
                      </div>
                    </div>

                    {/* Stats Row - Hidden on mobile */}
                    <div className="hidden sm:flex items-center gap-4 mt-3 pt-3 border-t border-white/10 dark:border-white/5">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Cube size={12} />
                        <span>{project.objectCount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <ImageIcon size={12} />
                        <span>{project.renderCount}</span>
                      </div>
                      {project.collaborators > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Users size={12} />
                          <span>{project.collaborators}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {sortedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group relative bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-[1.8] rounded-xl border-2 border-white/60 dark:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none p-2.5 sm:p-4 flex items-center gap-2.5 sm:gap-4 hover:border-cyan-400/40 transition-all cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Package size={20} weight="duotone" className="text-gray-400 sm:w-7 sm:h-7" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white truncate">
                        {project.name}
                      </h3>
                      {project.starred && (
                        <Star size={12} weight="fill" className="text-amber-400 flex-shrink-0 sm:w-3.5 sm:h-3.5" />
                      )}
                      {project.status !== "active" && (
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-semibold uppercase ${
                          project.status === "draft" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-gray-500/20 text-gray-600 dark:text-gray-400"
                        }`}>
                          {project.status}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={10} className="sm:w-3 sm:h-3" />
                        {project.lastEdited}
                      </span>
                      <span className="flex items-center gap-1">
                        <HardDrive size={10} className="sm:w-3 sm:h-3" />
                        {project.fileSize}
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Cube size={12} />
                        {project.objectCount} objects
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="hidden sm:flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => {
                      const colors = getTagColor(tag);
                      return (
                        <span key={tag} className={`px-2 py-0.5 ${colors.bg} rounded-md text-[10px] font-medium ${colors.text} border border-current/10`}>
                          {tag}
                        </span>
                      );
                    })}
                  </div>

                  {/* Actions - Always visible on mobile */}
                  <div className="flex items-center gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 dark:bg-white/10 flex items-center justify-center"
                    >
                      <Play size={14} weight="fill" className="text-gray-600 dark:text-gray-400 ml-0.5 sm:w-4 sm:h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(project.id);
                      }}
                      className="w-8 h-8 rounded-lg bg-white/20 dark:bg-white/10 flex items-center justify-center"
                    >
                      <Star size={16} weight={project.starred ? "fill" : "regular"} className={project.starred ? "text-amber-400" : "text-gray-600 dark:text-gray-400"} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-lg bg-white/20 dark:bg-white/10 flex items-center justify-center"
                    >
                      <DotsThree size={16} weight="bold" className="text-gray-600 dark:text-gray-400" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6">
              <FolderOpen size={48} weight="duotone" className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No projects found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              {searchQuery ? "Try adjusting your search or filters" : "Create your first project to get started"}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/25"
            >
              <Plus size={20} weight="bold" />
              Create New Project
            </motion.button>
          </motion.div>
        )}

        {/* Quick Actions Floating Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-[1.8] border-2 border-white/60 dark:border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.12)] dark:shadow-2xl rounded-xl sm:rounded-2xl p-1.5 sm:p-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-cyan-600 dark:text-cyan-400"
          >
            <Plus size={14} weight="bold" className="sm:w-4 sm:h-4" />
            New
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-white/20 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            <FolderPlus size={14} weight="duotone" className="sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Import</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-white/20 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            <Tag size={14} weight="duotone" className="sm:w-4 sm:h-4" />
            Tags
          </motion.button>
        </motion.div>
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {showNewProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewProjectModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-[1.8] rounded-2xl border-2 border-white/60 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-none overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/20 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">New Project</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNewProjectModal(false)}
                  className="w-8 h-8 rounded-lg bg-white/20 dark:bg-white/10 flex items-center justify-center"
                >
                  <X size={18} className="text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Name</label>
                  <input
                    type="text"
                    placeholder="Enter project name..."
                    className="w-full px-4 py-3 bg-white/20 dark:bg-white/10 border-2 border-white/40 dark:border-white/20 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Furniture", "Architecture", "Product", "Character", "Vehicle", "Other"].map((cat) => (
                      <button
                        key={cat}
                        className="px-3 py-2 bg-white/10 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-white/20 hover:border-cyan-400/40 transition-all"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Template</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-4 bg-white/10 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-xl text-left hover:bg-white/20 hover:border-cyan-400/40 transition-all">
                      <Package size={24} weight="duotone" className="text-cyan-600 dark:text-cyan-400 mb-2" />
                      <p className="text-sm font-medium text-gray-800 dark:text-white">Blank</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Start from scratch</p>
                    </button>
                    <button className="p-4 bg-white/10 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-xl text-left hover:bg-white/20 hover:border-cyan-400/40 transition-all">
                      <Cube size={24} weight="duotone" className="text-purple-600 dark:text-purple-400 mb-2" />
                      <p className="text-sm font-medium text-gray-800 dark:text-white">Basic Scene</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">With lights & camera</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-5 border-t border-white/20 dark:border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-cyan-500/25"
                >
                  <Check size={16} weight="bold" />
                  Create Project
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/20 dark:bg-white/10 backdrop-blur-[80px] saturate-[1.8] rounded-xl sm:rounded-2xl border-2 border-white/60 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-none"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-5 border-b border-white/20 dark:border-white/10">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
                    <Package size={20} weight="duotone" className="text-cyan-600 dark:text-cyan-400 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-lg font-semibold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 dark:from-white dark:via-cyan-200 dark:to-blue-200 bg-clip-text text-transparent truncate">{selectedProject.name}</h3>
                    <p className="text-[10px] sm:text-xs text-cyan-600/70 dark:text-cyan-400/70">Created {selectedProject.createdAt}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedProject(null)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 dark:bg-white/10 flex items-center justify-center shrink-0 ml-2"
                >
                  <X size={16} className="text-gray-600 dark:text-gray-400 sm:w-[18px] sm:h-[18px]" />
                </motion.button>
              </div>

              {/* Preview */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <Package size={80} weight="duotone" className="text-gray-300 dark:text-gray-600 w-12 h-12 sm:w-20 sm:h-20" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-5 border-b border-white/20 dark:border-white/10">
                <div className="text-center">
                  <p className="text-base sm:text-2xl font-bold bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">{selectedProject.objectCount}</p>
                  <p className="text-[10px] sm:text-xs font-medium text-blue-600/70 dark:text-blue-400/70">Objects</p>
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-2xl font-bold bg-gradient-to-br from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-300 bg-clip-text text-transparent">{selectedProject.renderCount}</p>
                  <p className="text-[10px] sm:text-xs font-medium text-purple-600/70 dark:text-purple-400/70">Renders</p>
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-2xl font-bold bg-gradient-to-br from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-300 bg-clip-text text-transparent">{selectedProject.fileSize}</p>
                  <p className="text-[10px] sm:text-xs font-medium text-amber-600/70 dark:text-amber-400/70">Size</p>
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-2xl font-bold bg-gradient-to-br from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">{selectedProject.collaborators}</p>
                  <p className="text-[10px] sm:text-xs font-medium text-emerald-600/70 dark:text-emerald-400/70">Collabs</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5">
                {/* Tags - scrollable on mobile */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-16 sm:max-h-none overflow-y-auto sm:overflow-visible">
                  {selectedProject.tags.map((tag) => {
                    const colors = getTagColor(tag);
                    return (
                      <span key={tag} className={`px-2 sm:px-2.5 py-0.5 sm:py-1 ${colors.bg} rounded-md text-[10px] sm:text-xs font-medium ${colors.text} border border-current/10 whitespace-nowrap`}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
                {/* Buttons - fixed row on mobile */}
                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    <ShareNetwork size={14} weight="duotone" className="sm:w-4 sm:h-4" />
                    Share
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm shadow-lg shadow-cyan-500/25"
                  >
                    <Play size={14} weight="fill" className="sm:w-4 sm:h-4" />
                    Open
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
