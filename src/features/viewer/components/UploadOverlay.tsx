"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useViewerStore } from "../store/useViewerStore";

export default function UploadOverlay() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setFileUrl = useViewerStore((state) => state.setFileUrl);

  const handleFile = (file: File) => {
    if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
      setIsLoading(true);
      const url = URL.createObjectURL(file);
      setTimeout(() => {
        setFileUrl(url);
        setIsLoading(false);
      }, 100);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md mx-4 p-12 rounded-2xl border-2 border-dashed transition-all ${
          isDragging
            ? "border-purple-500 bg-purple-500/10"
            : "border-zinc-700 bg-zinc-900/80"
        } backdrop-blur-lg`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".glb,.gltf"
          className="hidden"
          onChange={handleChange}
        />
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="size-16 rounded-full bg-purple-500/20 flex items-center justify-center">
            {isLoading ? (
              <div className="size-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="size-8 text-purple-400" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isLoading ? "Processing..." : "Upload 3D Model"}
            </h3>
            <p className="text-sm text-zinc-400">
              {isLoading
                ? "Preparing your model"
                : "Drag & drop your .glb or .gltf file here"}
            </p>
            {!isLoading && (
              <p className="text-xs text-zinc-500 mt-2">or click to browse</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
