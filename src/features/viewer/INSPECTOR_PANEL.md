# Inspector Panel

## Overview
Professional right-side inspector panel for scene settings and model properties.

## Component Structure

### ViewerInspector
Fixed right-side panel with glassmorphism styling.

**Position:**
```typescript
fixed right-0 top-0 h-full w-80
```

**Styling:**
```typescript
border-l border-white/10 bg-black/50 backdrop-blur-md
```

**Responsive:**
```typescript
hidden lg:block  // Hidden on mobile, visible on desktop
```

## Sections

### 1. Scene Settings
**Environment Selector:**
- Dropdown (Shadcn Select)
- Options: City, Sunset, Studio, Dawn
- Connected to `environmentPreset` in store
- Real-time updates to 3D scene

### 2. Model Stats
**Display Information:**
- Vertices: Calculating...
- Triangles: Calculating...
- File Size: 12 MB

**Future:**
- Calculate from loaded model
- Show material count
- Display texture info

### 3. Display Controls
**Toggle Buttons:**
- Grid On/Off
- Auto-Rotate On/Off
- Purple highlight when active
- Synced with bottom toolbar

## Store Integration

### New State
```typescript
interface ViewerStore {
  environmentPreset: Environment;  // 'city' | 'sunset' | 'studio' | 'dawn'
  setEnvironmentPreset: (preset) => void;
  showStats: boolean;
  toggleStats: () => void;
}
```

### Environment Presets
```typescript
type Environment = "city" | "sunset" | "studio" | "dawn";
```

**Presets:**
- **City**: Urban HDR lighting
- **Sunset**: Warm outdoor lighting
- **Studio**: Neutral studio lighting
- **Dawn**: Soft morning lighting

## Scene Connection

### Environment
```typescript
<Environment preset={environmentPreset} />
```
- Reads from store
- Updates in real-time
- Smooth transitions

### Display Controls
```typescript
{showGrid && <Grid ... />}
<OrbitControls autoRotate={autoRotate} />
```
- Synced with inspector toggles
- Consistent state across UI

## UI Layout

```
┌────────────────────────────────────┬─────────┐
│ [←] Project Name                   │Inspector│
│                                    │         │
│                                    │Scene    │
│     3D Viewer                      │Settings │
│                                    │         │
│                                    │Model    │
│        [Toolbar]                   │Stats    │
│                                    │         │
│                                    │Display  │
└────────────────────────────────────┴─────────┘
```

## Responsive Design

### Desktop (lg+)
- Inspector visible
- Full 320px width
- Scrollable content

### Mobile/Tablet
- Inspector hidden
- Full viewport for 3D
- Controls in bottom toolbar

## Styling Details

### Panel
```css
w-80                    /* 320px width */
border-l border-white/10 /* Subtle left border */
bg-black/50             /* Semi-transparent */
backdrop-blur-md        /* Blur effect */
overflow-y-auto         /* Scrollable */
```

### Sections
```css
p-6 space-y-6          /* Padding and spacing */
```

### Headers
```css
text-sm font-semibold text-white
```

### Content
```css
text-xs text-zinc-400  /* Small, muted text */
```

## Features

### Environment Selector
- Dropdown with 4 presets
- Instant preview
- Smooth transitions
- Professional look

### Model Stats
- Placeholder for now
- Future: Real calculations
- Clean layout
- Easy to read

### Display Toggles
- Full-width buttons
- Icon + text
- Active state highlighting
- Synced with toolbar

## Integration Points

### Store
```typescript
const environmentPreset = useViewerStore((state) => state.environmentPreset);
const setEnvironmentPreset = useViewerStore((state) => state.setEnvironmentPreset);
```

### Scene
```typescript
<Environment preset={environmentPreset} />
```

### Page
```typescript
<ViewerInspector />
```

## Future Enhancements

### Model Stats (Real Data)
```typescript
function Model({ url }) {
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    let vertices = 0;
    let triangles = 0;
    
    scene.traverse((child) => {
      if (child.isMesh) {
        vertices += child.geometry.attributes.position.count;
        triangles += child.geometry.index 
          ? child.geometry.index.count / 3 
          : vertices / 3;
      }
    });
    
    // Update store with stats
  }, [scene]);
}
```

### Additional Sections
- [ ] Materials editor
- [ ] Lighting controls
- [ ] Camera presets
- [ ] Animation controls
- [ ] Export settings
- [ ] Measurement tools

### Advanced Features
- [ ] Color picker for materials
- [ ] Slider for lighting intensity
- [ ] Wireframe toggle
- [ ] Bounding box display
- [ ] Performance stats (FPS)

## Accessibility

- Keyboard navigation
- Screen reader support
- Focus indicators
- ARIA labels

## Performance

- Minimal re-renders
- Zustand optimization
- Lazy loading sections
- Efficient updates

## Testing Checklist

- [ ] Environment changes update scene
- [ ] Grid toggle works
- [ ] Auto-rotate toggle works
- [ ] Hidden on mobile
- [ ] Visible on desktop
- [ ] Scrollable content
- [ ] Smooth transitions
- [ ] Synced with toolbar
