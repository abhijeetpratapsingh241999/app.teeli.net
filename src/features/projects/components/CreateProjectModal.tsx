"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProject } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Loader2 } from "lucide-react";

export default function CreateProjectModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    // Validate file if provided
    if (file) {
      const validExtensions = ['.glb', '.gltf', '.fbx'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!validExtensions.includes(fileExtension)) {
        setError(`Invalid file type. Only ${validExtensions.join(', ')} files are allowed.`);
        return;
      }
      
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        setError(`File size exceeds 50MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
        return;
      }
    }

    setIsUploading(true);

    try {
      let fileUrl: string | undefined;

      // Upload file to Supabase Storage if provided
      if (file) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError("Not authenticated");
          setIsUploading(false);
          return;
        }

        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${user.id}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("models")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          
          // Check if it's a connection error
          if (uploadError.message.includes('Failed to fetch') || uploadError.message.includes('network')) {
            setError('Connection failed. Please check your internet and try again.');
          } else {
            setError(`Upload failed: ${uploadError.message}`);
          }
          
          setIsUploading(false);
          return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("models")
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
      }

      // Create project in database
      const result = await createProject(name, fileUrl);

      if (result.error) {
        // Check if it's a connection error
        if (result.error.includes('Failed to fetch') || result.error.includes('network')) {
          setError('Database connection failed. Please check your internet and try again.');
        } else {
          setError(result.error);
        }
        setIsUploading(false);
        return;
      }

      // Success - close modal and refresh
      setOpen(false);
      setName("");
      setFile(null);
      router.refresh();
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Create New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Give your project a name and optionally upload a 3D model file
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="My Awesome Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isUploading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">3D Model File (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".glb,.gltf,.fbx"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0] || null;
                  setFile(selectedFile);
                  setError(null);
                }}
                disabled={isUploading}
                className="cursor-pointer"
              />
              {file && (
                <div className="flex items-center gap-1 text-sm text-zinc-400">
                  <Upload className="size-4" />
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
                </div>
              )}
            </div>
            <p className="text-xs text-zinc-500">
              Supported: .glb, .gltf, .fbx | Max size: 50MB
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  {file ? "Uploading..." : "Creating..."}
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
