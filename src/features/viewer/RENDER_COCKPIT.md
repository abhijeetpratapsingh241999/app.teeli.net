# 🎛️ Render Cockpit - Professional Cloud Rendering Interface

## Overview
The **Render Cockpit** is a high-end SaaS interface for configuring and triggering cloud GPU renderings.

---

## 🏗️ Architecture

### State Management
**Store:** `useViewerStore.ts`

```typescript
interface ViewerStore {
  isRenderModalOpen: boolean;
  toggleRenderModal: () => void;
}
```

**Actions:**
- `toggleRenderModal()` - Opens/closes the render configuration modal

---

## 🎨 Component: RenderModal.tsx

### Layout Structure
```
┌─────────────────────────────────────────────┐
│  Start Cloud Render                         │
│  Configure your render settings...          │
├──────────────────┬──────────────────────────┤
│  Camera Preview  │  Configuration           │
│  ┌────────────┐  │  • Resolution            │
│  │            │  │  • Aspect Ratio          │
│  │   [Icon]   │  │  • Format                │
│  │            │  │  • Engine                │
│  └────────────┘  │                          │
│  Current View    │                          │
├──────────────────┴──────────────────────────┤
│  Estimated Cost: 0 Credits  [Render Image]  │
└─────────────────────────────────────────────┘
```

### Left Column: Camera Preview
- **Aspect Ratio:** 16:9 video container
- **Background:** Zinc-900 with border
- **Content:** Image icon placeholder
- **Description:** "Current View" label
- **Future:** Real-time canvas snapshot

### Right Column: Configuration

#### 1. Resolution
```typescript
Options:
- 1920x1080 (HD)     → 0 credits
- 3840x2160 (4K)     → 2 credits
- 7680x4320 (8K)     → 5 credits
```

#### 2. Aspect Ratio
```typescript
Options:
- 16:9 (Widescreen)  → Standard video
- 4:3 (Standard)     → Classic format
- 1:1 (Square)       → Social media
- 9:16 (Portrait)    → Mobile/Stories
```

#### 3. Output Format
```typescript
Options:
- PNG (Lossless)     → Transparency support
- JPG (Compressed)   → Smaller file size
- EXR (HDR)          → High dynamic range
```

#### 4. Render Engine
```typescript
Options:
- Standard Renderer (Web)           → Real-time, free
- Cloud Ray-Tracing (Coming Soon)   → Disabled, premium
```

### Footer
- **Left:** Dynamic cost calculation
- **Right:** Primary action button with Camera icon

---

## 💰 Credit System

### Pricing Logic
```typescript
const RESOLUTION_CREDITS = {
  "1920x1080": 0,    // Free tier
  "3840x2160": 2,    // 4K premium
  "7680x4320": 5,    // 8K ultra
};
```

### Future Enhancements
```typescript
// Factor in engine type
const calculateCost = (resolution, engine, format) => {
  let cost = RESOLUTION_CREDITS[resolution];
  if (engine === 'cloud-raytracing') cost *= 3;
  if (format === 'EXR') cost += 1;
  return cost;
};
```

---

## 🎯 Integration Points

### 1. ViewerHeader
**Location:** Top-right corner

```typescript
<Button onClick={toggleRenderModal}>
  <Camera /> Render
</Button>
```

**Styling:**
- Glassmorphism effect
- Backdrop blur
- Zinc borders
- Hover state

### 2. Project Viewer Page
**Location:** `src/app/(viewer)/project/[id]/page.tsx`

```typescript
<RenderModal />
```

**Behavior:**
- Overlays entire scene
- Modal backdrop blur
- Escape key to close
- Click outside to close

---

## 🎨 Design System

### Color Palette
```css
Background:     bg-zinc-950
Borders:        border-zinc-800
Input BG:       bg-zinc-900
Text Primary:   text-white
Text Secondary: text-zinc-400
Text Muted:     text-zinc-500
```

### Typography
```css
Title:       text-2xl font-bold
Description: text-zinc-400
Labels:      text-sm font-semibold
Values:      text-white font-semibold
```

### Spacing
```css
Modal Padding:  p-6
Section Gap:    gap-6
Input Gap:      gap-4
Label Gap:      gap-2
```

---

## 🚀 User Flow

### Step-by-Step
1. **Trigger:** User clicks "Render" button in header
2. **Open:** Modal slides in with backdrop
3. **Preview:** Camera view shown (placeholder)
4. **Configure:** User selects resolution, aspect, format, engine
5. **Cost:** Dynamic credit calculation updates
6. **Submit:** User clicks "Render Image"
7. **Process:** Job submitted to cloud (future)
8. **Close:** Modal closes, notification shown

### Validation
```typescript
// Future validation logic
const validate = () => {
  if (!resolution) return "Select resolution";
  if (!format) return "Select format";
  if (credits < estimatedCost) return "Insufficient credits";
  return null;
};
```

---

## 🔮 Future Enhancements

### Phase 1: Real Preview
```typescript
// Capture current canvas view
const capturePreview = () => {
  const canvas = gl.domElement;
  const dataURL = canvas.toDataURL('image/png');
  setPreviewImage(dataURL);
};
```

### Phase 2: Advanced Options
```typescript
// Additional settings
- Samples: [128, 256, 512, 1024]
- Denoising: [On, Off]
- Transparency: [On, Off]
- Watermark: [On, Off]
```

### Phase 3: Batch Rendering
```typescript
// Multiple camera angles
const cameras = [
  { name: "Front", position: [0, 0, 5] },
  { name: "Top", position: [0, 5, 0] },
  { name: "Side", position: [5, 0, 0] },
];
```

### Phase 4: Render Queue
```typescript
// Show pending jobs
<RenderQueue>
  {jobs.map(job => (
    <JobCard 
      status={job.status}
      progress={job.progress}
      eta={job.estimatedTime}
    />
  ))}
</RenderQueue>
```

---

## 📊 Analytics Tracking

### Events to Track
```typescript
// User interactions
trackEvent('render_modal_opened');
trackEvent('resolution_selected', { value: '4K' });
trackEvent('engine_selected', { value: 'standard' });
trackEvent('render_submitted', { 
  resolution, 
  format, 
  engine,
  cost: estimatedCost 
});
```

### Metrics
- Modal open rate
- Average resolution selected
- Format preference
- Conversion rate (open → submit)
- Credit consumption

---

## 🎓 Developer Guide

### Adding New Resolution
```typescript
// 1. Update options
<SelectItem value="5120x2880">5120x2880 (5K)</SelectItem>

// 2. Update pricing
const RESOLUTION_CREDITS = {
  ...existing,
  "5120x2880": 3,
};
```

### Adding New Format
```typescript
// 1. Add to select
<SelectItem value="TIFF">TIFF (Uncompressed)</SelectItem>

// 2. Update backend handler
if (format === 'TIFF') {
  return renderAsTIFF(scene);
}
```

### Customizing Preview
```typescript
// Replace placeholder with real preview
<div className="aspect-video">
  {previewImage ? (
    <img src={previewImage} alt="Preview" />
  ) : (
    <ImageIcon />
  )}
</div>
```

---

## 🔐 Security Considerations

### Client-Side
```typescript
// Validate inputs
const sanitize = (input: string) => {
  return input.replace(/[^a-zA-Z0-9-_]/g, '');
};
```

### Server-Side
```typescript
// Rate limiting
const checkRateLimit = async (userId: string) => {
  const count = await redis.get(`render:${userId}`);
  if (count > 10) throw new Error('Rate limit exceeded');
};
```

### Credit Verification
```typescript
// Verify user has credits
const verifyCredits = async (userId: string, cost: number) => {
  const balance = await getCredits(userId);
  if (balance < cost) throw new Error('Insufficient credits');
};
```

---

## 🏆 Best Practices

### UX Guidelines
1. **Instant Feedback:** Show cost updates immediately
2. **Clear Labels:** Explain each option
3. **Smart Defaults:** Pre-select common settings
4. **Error Handling:** Show clear error messages
5. **Loading States:** Indicate processing

### Performance
1. **Lazy Load:** Only render when opened
2. **Debounce:** Delay cost calculations
3. **Memoize:** Cache expensive computations
4. **Optimize:** Minimize re-renders

### Accessibility
1. **Keyboard Nav:** Tab through all inputs
2. **Screen Readers:** Proper ARIA labels
3. **Focus Management:** Trap focus in modal
4. **Escape Key:** Close modal
5. **Color Contrast:** WCAG AA compliant

---

## 📱 Responsive Design

### Desktop (>1024px)
- Two-column layout
- Full preview size
- All options visible

### Tablet (768-1024px)
- Two-column maintained
- Smaller preview
- Compact spacing

### Mobile (<768px)
- Single column stack
- Preview on top
- Full-width inputs
- Sticky footer

---

## 🎯 Success Metrics

### KPIs
- **Engagement:** Modal open rate > 30%
- **Conversion:** Submit rate > 60%
- **Quality:** 4K+ selection > 40%
- **Revenue:** Credit consumption growth
- **Satisfaction:** User feedback > 4.5/5

### A/B Testing Ideas
1. Preview size (small vs large)
2. Button text ("Render" vs "Start Render")
3. Cost display (credits vs dollars)
4. Layout (2-col vs 1-col)
5. Default resolution (HD vs 4K)

---

## 🚀 Conclusion

### Achievement
**Professional Render Cockpit Interface** ✅

### Key Features
- ✅ High-end SaaS design
- ✅ Two-column layout
- ✅ Dynamic cost calculation
- ✅ Multiple configuration options
- ✅ Glassmorphism styling
- ✅ Dark mode optimized

### Status
**Production-ready, awaiting cloud backend integration**

**Tagline:** *"Configure. Render. Download."*
