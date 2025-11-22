# Interactive 3D Viewer Features

## State Management (Zustand)

### Store States
```typescript
{
  fileUrl: string | null,           // Current model URL
  autoRotate: boolean,               // Auto-rotation toggle
  gridVisible: boolean,              // Grid visibility
  environment: 'city' | 'sunset' | 'studio'  // Lighting preset
}
```

### Store Actions
- `setFileUrl(url)` - Load new model
- `toggleAutoRotate()` - Toggle camera auto-rotation
- `toggleGrid()` - Show/hide grid helper
- `setEnvironment(env)` - Change lighting environment

## Interactive Toolbar

### Button 1: Auto Rotate (RotateCw Icon)
- **Action**: Toggles camera auto-rotation
- **Visual**: Purple highlight when active
- **Effect**: Camera orbits around model at 2 units/sec
- **State**: `autoRotate`

### Button 2: Toggle Grid (Grid3x3 Icon)
- **Action**: Shows/hides floor grid
- **Visual**: Purple highlight when visible
- **Effect**: 20x20 grid with 1m cells
- **State**: `gridVisible`

### Button 3: Environment Lighting (Cycles Icons)
- **Action**: Cycles through lighting presets
- **Icons**: 
  - Lightbulb (City) - Urban HDR
  - Sunset (Sunset) - Warm outdoor
  - Sun (Studio) - Neutral studio
- **Effect**: Changes environment map and reflections
- **State**: `environment`

## Loading States

### Upload Loading
- Spinner in upload overlay
- "Processing..." message
- Appears during file processing

### Model Loading
- In-canvas HTML loader
- Glassmorphism card with spinner
- "Loading Model..." message
- Suspense boundary handles async loading

## Scene Integration

### OrbitControls
```typescript
<OrbitControls
  autoRotate={autoRotate}
  autoRotateSpeed={2}
  enableDamping
  dampingFactor={0.05}
/>
```

### Grid
```typescript
{gridVisible && <Grid ... />}
```

### Environment
```typescript
<Environment preset={environment} />
```

## User Experience Flow

1. **Upload**: Drag/drop file → Loading spinner → Model appears
2. **Auto Rotate**: Click button → Camera starts orbiting
3. **Grid Toggle**: Click button → Grid shows/hides
4. **Lighting**: Click button → Cycles through 3 presets
5. **Manual Control**: Drag to orbit, scroll to zoom, right-drag to pan

## Performance
- Suspense prevents UI blocking
- Lazy loading with useGLTF
- Efficient state updates
- Smooth 60fps animations
