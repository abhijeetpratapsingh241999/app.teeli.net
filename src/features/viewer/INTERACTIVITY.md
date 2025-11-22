# Viewer Interactivity

## Overview
Complete interactive controls for the 3D viewer using Zustand state management.

## State Management

### Zustand Store (`useViewerStore.ts`)
```typescript
interface ViewerStore {
  showGrid: boolean;        // Grid visibility (default: true)
  autoRotate: boolean;      // Auto-rotation (default: false)
  toggleGrid: () => void;
  toggleAutoRotate: () => void;
}
```

## Components

### ViewerToolbar
Floating glassmorphism control bar at the bottom center.

**Features:**
- Grid toggle button (Grid3x3 icon)
- Auto-rotate toggle (RotateCw icon)
- Reset camera button (RefreshCcw icon)
- Active state highlighting (purple)
- Tooltips on hover

**Styling:**
```typescript
absolute bottom-8 left-1/2 -translate-x-1/2 z-20
bg-zinc-900/80 backdrop-blur-lg border-zinc-800
```

### Scene Integration
Reads state from store and applies to 3D scene:

**Grid Control:**
```typescript
{showGrid && <Grid ... />}
```

**Auto-Rotate:**
```typescript
<OrbitControls autoRotate={autoRotate} autoRotateSpeed={2} />
```

## User Interactions

### Toggle Grid
**Button:** Grid3x3 icon
**Action:** `toggleGrid()`
**Effect:** Shows/hides infinite grid
**Visual:** Purple highlight when active

### Toggle Auto-Rotate
**Button:** RotateCw icon
**Action:** `toggleAutoRotate()`
**Effect:** Camera orbits around model at 2 units/sec
**Visual:** Purple highlight when active

### Reset Camera
**Button:** RefreshCcw icon
**Action:** (To be implemented)
**Effect:** Will reset camera to default position

## State Flow

```
User clicks button
    ↓
Zustand action called
    ↓
Store state updated
    ↓
Scene re-renders
    ↓
Visual change applied
```

## Integration Points

### Page Layout
```typescript
{project.file_url ? (
  <>
    <Scene fileUrl={project.file_url} />
    <Loader />
    <ViewerToolbar />
  </>
) : (
  <NoModelMessage />
)}
```

**Z-Index Layers:**
- Scene: Base layer
- Loader: z-50 (when loading)
- Toolbar: z-20 (always visible)
- Project Info: z-10 (top-left overlay)

## Button States

### Inactive State
```typescript
className="text-zinc-400"
```
- Gray icon
- No background

### Active State
```typescript
className="bg-purple-500/20 text-purple-400"
```
- Purple icon
- Purple background (20% opacity)

## Keyboard Shortcuts (Future)
- [ ] G - Toggle grid
- [ ] R - Toggle auto-rotate
- [ ] Space - Reset camera
- [ ] F - Fullscreen

## Mobile Support
- Touch-friendly button sizes
- Responsive toolbar positioning
- Gesture controls (OrbitControls)

## Performance
- Zustand: Minimal re-renders
- Only affected components update
- No prop drilling
- Efficient state updates

## Testing Checklist
- [ ] Click grid button → Grid toggles
- [ ] Click rotate button → Model rotates
- [ ] Active state highlights correctly
- [ ] Toolbar stays centered
- [ ] Works on mobile
- [ ] Tooltips show on hover

## Future Enhancements
- [ ] Camera reset functionality
- [ ] Environment preset switcher
- [ ] Screenshot capture
- [ ] Fullscreen mode
- [ ] Measurement tools
- [ ] Annotation mode
- [ ] Share view link
