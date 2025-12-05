/**
 * Tablet Breakpoints Index
 * =========================
 * 
 * @description Export tablet responsive utilities and constants
 * @updated 2025-12-03
 * @version 2.0.0 - Container Queries Based
 * 
 * This file provides:
 * - Breakpoint constants for TypeScript usage
 * - Device viewport reference for testing
 * - CSS class documentation
 */

/**
 * Breakpoint Reference (Tailwind defaults + Custom)
 */
export const BREAKPOINTS = {
  // Tailwind defaults
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  
  // Tablet range (handled via CSS media queries in tablet.css)
  tabletMin: 768,
  tabletMax: 1279,
} as const;

/**
 * Orientation detection helper
 * Use this for JavaScript-based orientation checks if needed
 */
export const getOrientation = (): 'portrait' | 'landscape' => {
  if (typeof window === 'undefined') return 'landscape';
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

/**
 * Tablet detection helper
 * Returns true if viewport is in tablet range (768-1279px)
 */
export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= BREAKPOINTS.tabletMin && width <= BREAKPOINTS.tabletMax;
};

/**
 * Device Reference for Testing
 * Use these values in DevTools for accurate testing
 */
export const DEVICE_VIEWPORTS = {
  // Mobile
  'iPhone SE': { width: 375, height: 667 },
  'iPhone 14': { width: 390, height: 844 },
  'iPhone 14 Pro Max': { width: 430, height: 932 },
  
  // Tablet Portrait
  'iPad Mini Portrait': { width: 768, height: 1024 },
  'iPad Air Portrait': { width: 820, height: 1180 },
  'iPad Pro 11 Portrait': { width: 834, height: 1194 },
  'iPad Pro 12.9 Portrait': { width: 1024, height: 1366 },
  
  // Tablet Landscape
  'iPad Mini Landscape': { width: 1024, height: 768 },
  'iPad Air Landscape': { width: 1180, height: 820 },
  'iPad Pro 11 Landscape': { width: 1194, height: 834 },
  'iPad Pro 12.9 Landscape': { width: 1366, height: 1024 },
  
  // Desktop
  'Desktop HD': { width: 1280, height: 720 },
  'Desktop Full HD': { width: 1920, height: 1080 },
  'Desktop 2K': { width: 2560, height: 1440 },
} as const;

/**
 * CSS Class Reference
 * 
 * These classes are defined in tablet.css and activated via media queries:
 * 
 * ============================================================================
 * CONTAINER CLASSES (for Container Queries)
 * ============================================================================
 * .dashboard-container  → Main dashboard, defines container context
 * .canvas-container     → Canvas area, inline-size container
 * .cards-container      → Cards panel, inline-size container
 * 
 * ============================================================================
 * TABLET LAYOUT CLASSES (activated on 768-1279px viewport)
 * ============================================================================
 * .tablet-canvas-wrapper    → Canvas positioning for tablets
 * .tablet-cards-container   → Cards container positioning
 * .tablet-cards-grid        → Cards layout (flex horizontal / grid vertical)
 * .tablet-card              → Regular card (fixed width in portrait scroll)
 * .tablet-card-wide         → Full-width card like RenderCard
 * .tablet-scroll-horizontal → Scroll container styling
 * 
 * ============================================================================
 * TABLET UTILITY CLASSES
 * ============================================================================
 * .tablet-padding           → Consistent card padding (0.625rem)
 * .tablet-text-xs           → Extra small text (0.625rem)
 * .tablet-text-sm           → Small text (0.75rem)
 * .tablet-text-base         → Base text (0.8125rem)
 * .tablet-icon-sm           → Small icons (1rem)
 * .tablet-icon-md           → Medium icons (1.25rem)
 * .tablet-btn               → Button sizing
 * .tablet-stat-value        → Stats value typography
 * .tablet-stat-label        → Stats label typography
 * 
 * ============================================================================
 * CONTAINER QUERY CLASSES (respond to container size, not viewport)
 * ============================================================================
 * .cards-grid-responsive    → Grid that responds to cards-panel container
 * .canvas-compact-mode      → Canvas styles for small container
 * .canvas-full-mode         → Canvas styles for large container
 */

export type DeviceName = keyof typeof DEVICE_VIEWPORTS;
export type Breakpoint = keyof typeof BREAKPOINTS;
