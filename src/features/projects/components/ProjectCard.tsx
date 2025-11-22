"use client";

import { Image, MoreVertical, ExternalLink, Edit, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { renameProject } from "../actions";
import { deleteProject } from "../actions/deleteProject";
import { useRouter } from "next/navigation";
import type { Project } from "@/types/database";

interface ProjectCardProps {
  project: Project;
}

function getRelativeTime(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return past.toLocaleDateString();
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRename = async () => {
    if (newName.trim() && newName !== project.name) {
      await renameProject(project.id, newName.trim());
      setIsRenameOpen(false);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteProject(project.id);
    setIsDeleteOpen(false);
    router.refresh();
  };

  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleShare = () => {
    const url = `${window.location.origin}/view/${project.id}`;
    navigator.clipboard.writeText(url);
    setShareStatus("Public Link Copied!");
    setTimeout(() => setShareStatus(null), 2000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      className="group relative cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient border - visible only on hover */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgb(168 85 247) 0%, rgb(6 182 212) 50%, rgb(59 130 246) 100%)',
          padding: '1px',
        }}
      >
        <div className="h-full w-full bg-zinc-900 rounded-2xl" />
      </div>

      {/* Spotlight glow effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
          }}
        />
      )}
      
      {/* Main card */}
      <div className="relative bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.01]">
        
        {/* Image section with gradient mask */}
        <div className="relative w-full aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden">
          {project.thumbnail_url ? (
            <img 
              src={project.thumbnail_url} 
              alt={project.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              {/* Subtle noise texture overlay */}
              <div className="absolute inset-0 opacity-[0.015]" 
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                }}
              />
              
              {/* Content */}
              <div className="relative z-10">
                <Image className="size-20 text-zinc-700 group-hover:text-zinc-600 transition-colors duration-500" />
              </div>
            </>
          )}
          
          {/* Bottom gradient fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-900 to-transparent" />
          
          {/* Actions Menu */}
          <div className="absolute top-4 right-4 z-10 flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRenameOpen(true)}
              className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:bg-zinc-800"
              title="Rename"
            >
              <Edit className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:bg-zinc-800"
              title="Share"
            >
              <Share2 className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteOpen(true)}
              className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:bg-zinc-800 text-red-400 hover:text-red-300"
              title="Delete"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        {/* Footer section */}
        <Link href={`/project/${project.id}`}>
          <div className="relative p-6 space-y-2 bg-linear-to-b from-transparent to-zinc-900/50 cursor-pointer">
            <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors duration-300 tracking-tight">
              {project.name}
            </h3>
            <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300 font-medium">
              Last edited {getRelativeTime(project.updated_at)}
            </p>
          </div>
        </Link>

        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 group-hover:ring-white/10 transition-all duration-500 pointer-events-none" />
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Toast */}
      {shareStatus && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg bg-zinc-900/90 backdrop-blur-lg border border-zinc-800 shadow-xl">
          <p className="text-sm text-white">{shareStatus}</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <p className="text-zinc-400">Are you sure you want to delete "{project.name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
