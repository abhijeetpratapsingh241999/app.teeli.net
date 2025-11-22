# Fullscreen Viewer Layout

## Overview
Immersive fullscreen 3D viewer experience without dashboard sidebar.

## Architecture Change

### Before (Dashboard Route)
```
src/app/(dashboard)/project/[id]/
  ├── layout.tsx (includes Sidebar)
  └── page.tsx
```
**Problem:** Sidebar takes up space, not immersive

### After (Viewer Route)
```
src/app/(viewer)/
  ├── layout.tsx (fullscreen, no sidebar)
  └── project/[id]/
      └── page.tsx
```
**Solution:** Dedicated fullscreen layout

## Route Groups

### (dashboard) Group
- Has Sidebar + Header
- For: Dashboard, Settings, etc.
- Layout: `flex` with sidebar

### (viewer) Group
- No Sidebar
- For: 3D Viewer
- Layout: `h-screen w-screen`

## Viewer Layout

```typescript
export default function ViewerLayout({ children }) {
  return (
    <div className="h-screen w-screen bg-zinc-950">
      {children}
    </div>
  );
}
```

**Features:**
- Full viewport height (`h-screen`)
- Full viewport width (`w-screen`)
- Dark background (`bg-zinc-950`)
- No sidebar, no header
- Just children

## ViewerHeader Component

### Features
**Back Button:**
- Links to `/dashboard`
- Glassmorphism style
- ArrowLeft icon
- Hover effect

**Project Name:**
- Bold white text
- Glassmorphism card
- No UUID clutter
- Clean design

### Layout
```typescript
<div className="absolute top-6 left-6 z-10 flex items-center gap-4">
  <BackButton />
  <ProjectNameCard />
</div>
```

**Positioning:**
- Absolute top-left
- 6 units padding
- z-10 layer
- Flex gap for spacing

### Styling
```typescript
bg-zinc-900/80 backdrop-blur-lg border-zinc-800
```
- Semi-transparent background
- Backdrop blur effect
- Subtle border
- Shadow for depth

## Page Structure

```typescript
<div className="relative h-screen w-full">
  <ViewerHeader projectName={project.name} />
  
  {project.file_url ? (
    <>
      <Scene fileUrl={project.file_url} />
      <Loader />
      <ViewerToolbar />
    </>
  ) : (
    <NoModelMessage />
  )}
</div>
```

## Z-Index Layers

```
ViewerHeader:  z-10  (top-left)
ViewerToolbar: z-20  (bottom-center)
Loader:        z-50  (when loading)
Scene:         base  (background)
```

## Navigation Flow

### From Dashboard
```
Dashboard → Click Project Card → /project/[id]
```
- Leaves dashboard layout
- Enters fullscreen viewer
- No sidebar visible

### Back to Dashboard
```
Viewer → Click Back Button → /dashboard
```
- Leaves fullscreen viewer
- Returns to dashboard layout
- Sidebar reappears

## Comparison

### Old Layout
```
┌─────────────────────────────┐
│ Sidebar │ Header            │
│         ├───────────────────┤
│ Nav     │                   │
│ Links   │   3D Viewer       │
│         │                   │
└─────────────────────────────┘
```
**Issues:**
- Sidebar takes space
- Not immersive
- Feels cramped

### New Layout
```
┌─────────────────────────────┐
│ [←] Project Name            │
│                             │
│                             │
│      3D Viewer              │
│      (Fullscreen)           │
│                             │
│         [Toolbar]           │
└─────────────────────────────┘
```
**Benefits:**
- Full viewport
- Immersive experience
- Professional look

## Benefits

### User Experience
- ✅ More screen space for 3D model
- ✅ Immersive editing experience
- ✅ Professional SaaS feel
- ✅ Clean, minimal UI

### Technical
- ✅ Separate route groups
- ✅ Independent layouts
- ✅ Better organization
- ✅ Easier to maintain

### Design
- ✅ Glassmorphism overlays
- ✅ Floating controls
- ✅ Dark theme
- ✅ Modern aesthetics

## Responsive Design

### Desktop
- Full screen viewer
- Floating overlays
- Optimal for 3D work

### Mobile
- Still fullscreen
- Touch-friendly controls
- Responsive overlays

## Future Enhancements

- [ ] Fullscreen API integration
- [ ] Hide UI on idle
- [ ] Keyboard shortcuts
- [ ] Presentation mode
- [ ] VR mode toggle
- [ ] Split view (multiple models)

## Testing Checklist

- [ ] Navigate from dashboard to viewer
- [ ] Back button returns to dashboard
- [ ] No sidebar visible in viewer
- [ ] Fullscreen layout works
- [ ] Overlays positioned correctly
- [ ] Mobile responsive
- [ ] All controls accessible
