# Smart Analysis Engine

## Overview
Real-time 3D model analysis system that powers the Inspector Panel and serves as the foundation for AI-driven recommendations.

## Architecture

### Phase 2: Smart Analysis Engine
```
Model Load → Scene Graph Traversal → Statistics Calculation → Store Update → UI Display
```

## Components

### 1. useModelStats Hook
**Location:** `src/features/viewer/hooks/useModelStats.ts`

**Purpose:** Analyze Three.js scene graph and extract technical statistics

**Calculations:**
```typescript
interface ModelStats {
  triangles: number;    // Total triangle count
  materials: number;    // Unique material count
  meshes: number;       // Total mesh objects
  meshNames: string[];  // Top-level mesh names (limit 10)
}
```

**Algorithm:**
1. Traverse scene graph using `scene.traverse()`
2. For each mesh:
   - Count triangles from geometry
   - Collect unique material UUIDs
   - Store mesh names
3. Return aggregated statistics

**Performance:**
- Runs once on model load
- Uses `useEffect` with scene dependency
- Memoized callback to prevent re-renders

### 2. Format Utilities
**Location:** `src/features/viewer/utils/formatStats.ts`

**formatNumber(num)**
```typescript
1234567 → "1.2M"
45678   → "45.7K"
123     → "123"
```

**getPerformanceGrade(triangles)**
```typescript
< 100K   → 🟢 Excellent (Mobile Ready)
< 500K   → 🟡 Good (Desktop Optimized)
< 1M     → 🟠 Moderate (High-End Desktop)
> 1M     → 🔴 Heavy (Desktop Only)
```

### 3. Store Integration
**Location:** `src/features/viewer/store/useViewerStore.ts`

```typescript
interface ViewerStore {
  modelStats: ModelStats | null;
  setModelStats: (stats: ModelStats) => void;
}
```

**State Flow:**
```
Model Component → useModelStats → setModelStats → Store → Inspector UI
```

### 4. Inspector Visualization
**Location:** `src/features/viewer/components/ViewerInspector.tsx`

**Display:**
- Triangle count (formatted)
- Material count
- Mesh count
- Performance grade with emoji
- Color-coded recommendations

## Performance Grading System

### Excellent (🟢)
- **Range:** < 100,000 triangles
- **Target:** Mobile devices
- **Description:** "Mobile Ready"
- **Color:** Green
- **Use Case:** AR/VR, mobile apps, web

### Good (🟡)
- **Range:** 100K - 500K triangles
- **Target:** Desktop browsers
- **Description:** "Desktop Optimized"
- **Color:** Yellow
- **Use Case:** Standard desktop viewing

### Moderate (🟠)
- **Range:** 500K - 1M triangles
- **Target:** High-end desktops
- **Description:** "High-End Desktop"
- **Color:** Orange
- **Use Case:** Professional workstations

### Heavy (🔴)
- **Range:** > 1M triangles
- **Target:** Desktop only
- **Description:** "Desktop Only"
- **Color:** Red
- **Use Case:** Rendering, high-detail work

## Technical Details

### Triangle Counting
```typescript
if (geometry.index) {
  triangles += geometry.index.count / 3;
} else if (geometry.attributes.position) {
  triangles += geometry.attributes.position.count / 3;
}
```

**Why divide by 3?**
- Each triangle has 3 vertices
- Position count = total vertices
- Triangles = vertices / 3

### Material Counting
```typescript
const materialUUIDs = new Set<string>();

if (Array.isArray(mesh.material)) {
  mesh.material.forEach((mat) => materialUUIDs.add(mat.uuid));
} else {
  materialUUIDs.add(mesh.material.uuid);
}
```

**Why use Set?**
- Materials can be shared across meshes
- Set ensures unique count
- UUID is unique identifier

### Mesh Counting
```typescript
scene.traverse((child) => {
  if ((child as THREE.Mesh).isMesh) {
    meshes++;
  }
});
```

**What counts as a mesh?**
- Any object with `isMesh === true`
- Includes visible and hidden meshes
- Excludes lights, cameras, helpers

## Data Flow

### 1. Model Loads
```typescript
function Model({ url }) {
  const { scene } = useGLTF(url);
  // scene is now available
}
```

### 2. Stats Calculated
```typescript
useModelStats(scene, handleStats);
// Traverses scene, calculates stats
```

### 3. Store Updated
```typescript
const handleStats = useCallback((stats) => {
  setModelStats(stats);
}, [setModelStats]);
```

### 4. UI Renders
```typescript
const modelStats = useViewerStore((state) => state.modelStats);
// Inspector displays real data
```

## Future: AI Recommendation System

### Phase 3: Sustainability Engine
Based on model stats, provide recommendations:

**Optimization Suggestions:**
- "Reduce triangles by 40% for mobile"
- "Combine materials to improve performance"
- "Simplify mesh hierarchy"

**Sustainability Metrics:**
- Carbon footprint per render
- Energy consumption estimate
- Optimization potential

**AI-Powered:**
- Automatic LOD generation
- Material consolidation
- Mesh simplification
- Texture optimization

## Performance Optimization

### Calculation Timing
- Runs once on model load
- Not on every frame
- Cached in store
- No performance impact

### Memory Usage
- Minimal overhead
- Set for unique materials
- Array for mesh names (limited to 10)
- No scene duplication

### UI Updates
- Zustand prevents unnecessary re-renders
- Only Inspector updates
- Scene unaffected
- Smooth 60fps maintained

## Use Cases

### 1. Technical Analysis
- Understand model complexity
- Identify optimization opportunities
- Compare model versions

### 2. Performance Planning
- Determine target platforms
- Set quality expectations
- Plan optimization strategy

### 3. Client Communication
- Show technical specifications
- Explain performance implications
- Justify optimization work

### 4. Quality Assurance
- Verify model meets requirements
- Check against performance budgets
- Ensure platform compatibility

## Testing

### Test Cases
1. **Simple Model** (< 100K triangles)
   - Should show 🟢 Excellent
   - Fast calculation
   - Accurate counts

2. **Complex Model** (> 1M triangles)
   - Should show 🔴 Heavy
   - Still performant
   - Correct statistics

3. **Multiple Materials**
   - Should count unique only
   - No duplicates
   - Accurate material count

4. **Nested Hierarchy**
   - Should traverse all levels
   - Count all meshes
   - Include hidden objects

## Integration Points

### Current
- Inspector Panel
- Performance grading
- Real-time display

### Future
- AI recommendations
- Optimization tools
- Sustainability metrics
- Export settings
- Quality presets

## Benefits

### For Users
- ✅ Understand model complexity
- ✅ Make informed decisions
- ✅ Optimize for target platform
- ✅ Professional insights

### For Platform
- ✅ Foundation for AI features
- ✅ Data-driven recommendations
- ✅ Competitive advantage
- ✅ Professional credibility

### For Development
- ✅ Extensible architecture
- ✅ Clean separation of concerns
- ✅ Easy to add new metrics
- ✅ Testable components

## Next Steps

1. ✅ Basic statistics (Done)
2. ✅ Performance grading (Done)
3. ⏳ Mesh hierarchy display
4. ⏳ Material analysis
5. ⏳ Texture information
6. ⏳ Animation detection
7. ⏳ AI recommendations
8. ⏳ Optimization tools
9. ⏳ Sustainability metrics
10. ⏳ Export optimization

**The brain is now connected to the body! 🧠✨**
