# Responsive Breakpoints System

> **Last Updated:** 2025-12-03
> **Author:** Teeli Platform Team
> **Version:** 2.0.0 - Container Queries Based

## Overview

This directory contains device-specific responsive styles for the Teeli Platform.
We use a **Mobile-First** approach with **Container Queries** for tablets.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    RESPONSIVE STRATEGY                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Mobile (<768px)     →  Tailwind default classes            │
│                         (Cards bottom, vertical scroll)      │
│                                                              │
│  Tablet (768-1279px) →  Container Queries + Media Queries   │
│                         Portrait: Horizontal scroll          │
│                         Landscape: Side panel                │
│                                                              │
│  Desktop (≥1280px)   →  Tailwind xl: classes                │
│                         (Cards right side panel)             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Container Queries (New in v2.0)

Container Queries allow components to respond to their **container's size** 
rather than the viewport. This is crucial for:

- Editor page with resizable panels
- Studio page with dynamic layouts
- Any component that can appear in different contexts

### How It Works

```css
/* Define container */
.canvas-container {
  container-type: inline-size;
  container-name: canvas-area;
}

/* Style based on container size */
@container canvas-area (min-width: 600px) {
  .canvas-content { /* full mode */ }
}
```

## Breakpoint Reference

### Tailwind Defaults (Unchanged)
| Breakpoint | Width | Usage |
|------------|-------|-------|
| `default` | < 640px | Mobile |
| `sm` | 640px+ | Mobile Large |
| `xl` | 1280px+ | Desktop |
| `2xl` | 1536px+ | Large Desktop |

### Tablet Media Queries (tablet.css)
| Query | Target | Layout |
|-------|--------|--------|
| Portrait (768-1279px) | iPad Portrait | Cards bottom, horizontal scroll |
| Landscape (768-1279px) | iPad Landscape | Cards side panel |

### Device-Specific Fine-Tuning
| Device | Portrait | Landscape |
|--------|----------|-----------|
| iPad Mini | 768×1024 | 1024×768 |
| iPad Air | 820×1180 | 1180×820 |
| iPad Pro 11" | 834×1194 | 1194×834 |
| iPad Pro 12.9" | 1024×1366 | 1366×1024 |

## CSS Classes Reference

### Container Classes
```css
.dashboard-container  /* Main dashboard - container context */
.canvas-container     /* Canvas area - inline-size container */
.cards-container      /* Cards panel - inline-size container */
```

### Tablet Layout Classes
```css
.tablet-canvas-wrapper    /* Canvas positioning */
.tablet-cards-container   /* Cards container */
.tablet-cards-grid        /* Cards layout (flex/grid) */
.tablet-card              /* Regular card */
.tablet-card-wide         /* Full-width card (RenderCard) */
.tablet-scroll-horizontal /* Horizontal scroll container */
```

### Tablet Utility Classes
```css
.tablet-padding           /* Consistent card padding */
.tablet-text-xs/sm/base   /* Text scaling */
.tablet-icon-sm/md        /* Icon sizing */
.tablet-btn               /* Button sizing */
.tablet-stat-value/label  /* Stats typography */
```

## Usage in Components

### Step 1: Add tablet classes to your component
```tsx
<div className="... tablet-canvas-wrapper">
  {/* Canvas content */}
</div>

<div className="... tablet-cards-container tablet-scroll-horizontal">
  <div className="... tablet-cards-grid">
    <Card className="tablet-card tablet-padding" />
    <WideCard className="tablet-card-wide tablet-padding" />
  </div>
</div>
```

### Step 2: Tailwind handles mobile & desktop
```tsx
// Mobile (default) + Desktop (xl:)
className="bottom-0 left-0 right-0 xl:right-4 xl:left-auto xl:top-24"
```

### Step 3: tablet.css handles tablet automatically
The CSS media queries in tablet.css will override when viewport is 768-1279px.

## Testing Guide

### Edge/Chrome DevTools
1. Press `Ctrl+Shift+M` for device toolbar
2. Select iPad model or set custom size
3. Click rotate icon for portrait/landscape

### Test Viewports
| Device | Portrait | Landscape |
|--------|----------|-----------|
| iPad Mini | 768×1024 | 1024×768 |
| iPad Air | 820×1180 | 1180×820 |
| iPad Pro 11" | 834×1194 | 1194×834 |
| iPad Pro 12.9" | 1024×1366 | 1366×1024 |

## File Structure

```
src/styles/breakpoints/
├── README.md           # This documentation
├── tablet.css          # All tablet media queries + container queries
└── index.ts            # TypeScript constants & device reference
```

## Important Notes

1. **Mobile layout is NOT affected** - Uses Tailwind defaults
2. **Desktop layout is NOT affected** - Uses Tailwind xl: classes
3. **Only tablet (768-1279px)** uses these custom styles
4. **Container Queries** are for future complex layouts (editor, studio)
5. **!important** is used to override Tailwind specificity on tablets

## Future Phases

- **Phase 1 (Current):** Home page responsive ✅
- **Phase 2 (Planned):** Studio/Editor page responsive
- **Phase 3 (Planned):** Project pages responsive
