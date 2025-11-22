# Scene Component

## Overview
Simplified 3D scene component using React Three Fiber with Stage component for automatic lighting and centering.

## Component Structure

### Scene (Main Component)
```typescript
interface SceneProps {
  fileUrl: string;
}

export default function Scene({ fileUrl }: SceneProps)
```

**Props:**
- `fileUrl` (string, required) - URL to the GLTF/GLB model file

**Features:**
- Client Component (`"use client"`)
- Full width/height container
- Zinc-950 background
- TypeScript strict mode compliant

### Model (Sub-component)
```typescript
interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps)
```

**Features:**
- Loads GLTF/GLB using `useGLTF` hook
- Renders as primitive object
- Wrapped in Suspense

## Key Features

### 1. Stage Component
```typescript
<Stage environment="city" intensity={0.5}>
  <Model url={fileUrl} />
</Stage>
```

**Benefits:**
- Auto-centers model
- Auto-scales to fit viewport
- Built-in lighting
- Environment map (city preset)
- Shadows enabled

### 2. OrbitControls
```typescript
<OrbitControls makeDefault />
```

**Features:**
- Rotate: Left-click + drag
- Zoom: Scroll wheel
- Pan: Right-click + drag
- Damping enabled by default

### 3. Suspense Boundary
```typescript
<Suspense fallback={null}>
  <Stage>
    <Model url={fileUrl} />
  </Stage>
</Suspense>
```

**Benefits:**
- Handles async model loading
- No loading flicker (fallback: null)
- Prevents UI blocking

## Usage

### In ViewerWrapper
```typescript
{fileUrl ? (
  <Scene fileUrl={fileUrl} />
) : (
  <UploadOverlay />
)}
```

### Direct Usage
```typescript
<Scene fileUrl="https://example.com/model.glb" />
```

## Camera Setup

```typescript
camera={{ position: [0, 0, 5], fov: 50 }}
```

**Settings:**
- Position: 5 units away on Z-axis
- FOV: 50 degrees (balanced view)
- Auto-adjusts based on model size (Stage)

## Styling

```typescript
<div className="h-full w-full bg-zinc-950">
```

**Classes:**
- `h-full` - Full height of parent
- `w-full` - Full width of parent
- `bg-zinc-950` - Dark background

## TypeScript Types

### Props Interfaces
```typescript
interface SceneProps {
  fileUrl: string;
}

interface ModelProps {
  url: string;
}
```

**Strict Mode:**
- All props typed
- No implicit any
- Null checks enforced

## Performance

### Optimizations
- Suspense prevents blocking
- useGLTF caches loaded models
- Stage optimizes lighting
- OrbitControls uses RAF

### Memory Management
```typescript
const { scene } = useGLTF(url);
```
- Models cached by drei
- Auto-cleanup on unmount
- No manual disposal needed

## Supported Formats

- `.glb` (Binary GLTF) ✅
- `.gltf` (JSON GLTF) ✅

## Error Handling

### Model Load Failure
- Suspense catches errors
- Fallback: null (no UI flash)
- Console logs error

### Invalid URL
- useGLTF throws error
- Caught by Suspense
- User sees empty scene

## Comparison with Previous Implementation

### Old (Complex)
```typescript
- Manual lighting setup
- Custom floor/grid
- Store integration
- Multiple sub-components
- Toolbar controls
```

### New (Simple)
```typescript
- Stage auto-lighting
- No manual setup
- Props-based
- Single Model component
- Clean separation
```

## Integration Points

### ViewerWrapper
```typescript
<Scene fileUrl={fileUrl} />
```
Passes URL from store to Scene

### Project Page
```typescript
<ViewerWrapper initialFileUrl={project.file_url} />
```
Server fetches, client renders

## Future Enhancements

- [ ] Add loading progress
- [ ] Custom environment maps
- [ ] Model annotations
- [ ] Screenshot capture
- [ ] Animation controls
- [ ] Material editor
- [ ] Lighting controls

## Testing

### Manual Tests
1. Load .glb file → Model renders
2. Load .gltf file → Model renders
3. Rotate model → Smooth controls
4. Zoom in/out → Responsive
5. Invalid URL → No crash

### Edge Cases
- Very large models → Stage scales
- Very small models → Stage scales
- Complex materials → Renders correctly
- Animations → Plays automatically
