"use client";

import { useViewerStore } from "../store/useViewerStore";
import { Box, ChevronRight } from "lucide-react";

export default function SceneGraph() {
  const sceneNodes = useViewerStore((state) => state.sceneNodes);
  const selectedMeshId = useViewerStore((state) => state.selectedMeshId);
  const selectMesh = useViewerStore((state) => state.selectMesh);
  const isPresentationMode = useViewerStore((state) => state.isPresentationMode);

  const handleNodeClick = (uuid: string) => {
    selectMesh(uuid, "#ffffff");
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-64 border-r border-white/10 bg-black/50 backdrop-blur-md overflow-y-auto hidden lg:block transition-opacity duration-300 ${
      isPresentationMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">Scene Graph</h2>
          <p className="text-xs text-zinc-400 mt-1">Click to select objects</p>
        </div>

        <div className="space-y-1">
          {sceneNodes && sceneNodes.length > 0 ? (
            sceneNodes.map((node) => (
              <button
                key={node.uuid}
                onClick={() => handleNodeClick(node.uuid)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedMeshId === node.uuid
                    ? 'bg-purple-500/20 border border-purple-500/50 text-white'
                    : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-700'
                }`}
              >
                <Box className="size-4 flex-shrink-0" />
                <span className="truncate flex-1 text-left">{node.name}</span>
                {selectedMeshId === node.uuid && (
                  <ChevronRight className="size-4 flex-shrink-0 text-purple-400" />
                )}
              </button>
            ))
          ) : (
            <div className="text-xs text-zinc-500 text-center py-8">
              Loading scene...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
