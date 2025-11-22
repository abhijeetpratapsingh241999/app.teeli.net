# 3D Viewer Feature

## Overview
Full-screen 3D viewer built with React Three Fiber for rendering and manipulating 3D scenes.

## Components

### Scene.tsx
- Main 3D canvas component
- Includes test cube, floor, grid, and environment lighting
- OrbitControls for camera manipulation
- Suspense boundary for loading states

### ViewerHeader.tsx
- Floating header with glassmorphism effect
- Back to Dashboard navigation
- Export functionality (placeholder)

### ViewerToolbar.tsx
- Floating bottom toolbar
- Tools: Move, Rotate, Zoom, Lighting, Fullscreen
- Glassmorphism design with backdrop blur

## Route
`/project/[id]` - Dynamic route for individual project viewing

## Features
- ✅ Full-screen 3D canvas
- ✅ OrbitControls (rotate, zoom, pan)
- ✅ Environment lighting (city preset)
- ✅ Grid helper for spatial reference
- ✅ Shadow casting and receiving
- ✅ Responsive UI overlay
- ✅ Loading states with Suspense

## Tech Stack
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers and abstractions
- `three` - Core 3D library
