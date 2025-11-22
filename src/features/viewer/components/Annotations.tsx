"use client";

import { Html } from "@react-three/drei";
import { useState } from "react";
import { useViewerStore, type Annotation } from "../store/useViewerStore";
import { X } from "lucide-react";

function AnnotationMarker({ annotation, index }: { annotation: Annotation; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const removeAnnotation = useViewerStore((state) => state.removeAnnotation);

  return (
    <Html position={annotation.position} distanceFactor={10}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-7 h-7 rounded-full bg-purple-500 border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
        >
          <span className="text-white text-xs font-bold">{index + 1}</span>
        </button>
        
        {isOpen && (
          <div className="absolute left-10 top-0 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-3 z-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-purple-400 font-semibold">{annotation.author}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => removeAnnotation(annotation.id)}
                  className="text-red-400 hover:text-red-300 text-xs p-1"
                  title="Delete"
                >
                  <X className="size-3" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="text-sm text-white whitespace-pre-wrap">{annotation.content}</p>
          </div>
        )}
      </div>
    </Html>
  );
}

export default function Annotations() {
  const isAnnotationMode = useViewerStore((state) => state.isAnnotationMode);
  const annotations = useViewerStore((state) => state.annotations);

  if (!isAnnotationMode) return null;

  return (
    <>
      {annotations.map((annotation, index) => (
        <AnnotationMarker key={annotation.id} annotation={annotation} index={index} />
      ))}
    </>
  );
}
