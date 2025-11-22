# 3D Model Upload & Rendering System

## Architecture

### State Management
**`store/useViewerStore.ts`**
- Zustand store managing `fileUrl` state
- `setFileUrl()` - Updates the current model URL

### Components

**`UploadOverlay.tsx`**
- Glassmorphism overlay with drag-and-drop zone
- Accepts `.glb` and `.gltf` files
- Creates blob URL using `URL.createObjectURL()`
- Updates store on file selection
- Hidden when model is loaded

**`ModelRenderer.tsx`**
- Uses `useGLTF` hook from @react-three/drei
- Wraps model in `<Center>` for automatic centering
- Cleans up blob URL on unmount
- Renders uploaded 3D model

**`Scene.tsx`**
- Conditionally renders:
  - `ModelRenderer` if fileUrl exists
  - `TestCube` if no file uploaded
- Maintains lighting, grid, and environment

### Flow
1. User opens `/project/[id]`
2. `UploadOverlay` appears over canvas
3. User drags/drops or selects .glb/.gltf file
4. Blob URL created and stored in Zustand
5. Overlay hides, model loads in scene
6. Model centered and rendered with PBR materials

## Features
- ✅ Drag & drop support
- ✅ File input fallback
- ✅ Client-side preview (no backend)
- ✅ Automatic model centering
- ✅ Memory cleanup (URL.revokeObjectURL)
- ✅ File type validation (.glb/.gltf)
- ✅ Visual feedback on drag
- ✅ Glassmorphism UI

## Supported Formats
- `.glb` (Binary GLTF)
- `.gltf` (JSON GLTF)
