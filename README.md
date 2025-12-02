# Teeli Platform - High-End 3D Rendering SaaS

## 🎯 Project Overview

**Teeli** transforms how professionals work with 3D content - making it as easy as editing documents.

Upload → Diagnose → Repair → Render → Collaborate

### Key Features
- **Intelligent 3D Processing**: Auto-diagnose and repair mesh issues
- **Cloud Rendering**: Photorealistic renders powered by GPU clusters
- **Format Conversion**: Support for GLB, GLTF, OBJ, FBX, STL
- **Real-time Collaboration**: Work together on 3D projects
- **AI-Powered**: Automated mesh repair and optimization

---

## 📁 Project Structure (Complete Monorepo)

```
teeli-platform/
│
├── .cursor/                          # AI Assistant Rules & Context
│   ├── rules/
│   │   ├── 000-project-context.mdc   # Project overview & architecture
│   │   ├── 100-ui-style.mdc          # Design system & UI guidelines
│   │   ├── 200-tech-stack.mdc        # Technology decisions
│   │   └── 900-ignore.mdc            # Files to never modify
│   └── prompts/
│       └── READ_ME_FIRST.mdc         # Developer onboarding guide
│
├── apps/                             # Frontend Applications
│   └── web/                          # Next.js 15 Main Web App
│       ├── src/
│       │   ├── app/                  # App Router pages
│       │   │   ├── page.tsx          # Homepage
│       │   │   ├── layout.tsx        # Root layout
│       │   │   └── globals.css       # Global styles
│       │   ├── components/
│       │   │   └── ui/               # Shadcn UI components (10 components)
│       │   └── lib/
│       │       └── utils.ts          # Utility functions
│       ├── public/                   # Static assets
│       ├── package.json              # Dependencies (420 packages)
│       ├── tsconfig.json             # TypeScript config
│       ├── tailwind.config.ts        # Tailwind CSS v4 config
│       └── components.json           # Shadcn config
│
├── services/                         # Backend Microservices
│   ├── geometry-engine/              # Python 3D Processing Service
│   │   ├── src/
│   │   │   ├── diagnose/
│   │   │   │   └── index.py          # Mesh analysis (manifold, holes, normals)
│   │   │   ├── repair/
│   │   │   │   └── index.py          # Mesh repair (auto-fix issues)
│   │   │   ├── convert/
│   │   │   │   └── blender_convert.py # Format conversion (Blender API)
│   │   │   └── utils/
│   │   │       └── helper.py         # Common utilities
│   │   ├── main.py                   # FastAPI service entry point
│   │   └── requirements.txt          # Python dependencies (TBD)
│   │
│   ├── _orchestrator/                # Future: Service Orchestration
│   │   └── README.md                 # Job queue, coordination
│   │
│   └── _blockchain/                  # Future: NFT & Ownership
│       └── README.md                 # Blockchain integration
│
├── packages/                         # Shared Packages
│   ├── ui/                           # Reusable UI Components
│   │   ├── button.tsx                # Button with variants
│   │   ├── card.tsx                  # Card container
│   │   ├── glass.tsx                 # Glassmorphism components
│   │   ├── utils.ts                  # cn() utility
│   │   └── index.ts                  # Package exports
│   │
│   ├── hooks/                        # Shared React Hooks
│   │   ├── use-theme.ts              # Dark/light mode hook
│   │   └── use-upload.ts             # File upload hook (Uppy)
│   │
│   ├── three-utils/                  # 3D Utilities (Babylon.js)
│   │   ├── load-model.ts             # Model loader (GLB, OBJ, etc.)
│   │   ├── camera-utils.ts           # Camera setup & controls
│   │   └── lighting.ts               # Lighting presets
│   │
│   └── feature-flags/                # Feature Toggle System
│       └── index.ts                  # Feature flag manager
│
├── python-workers/                   # Python Background Workers (Empty)
│   └── (Future render workers)
│
└── README.md                         # This file
```

---

## 🎨 Tech Stack (Phase 1 - MVP)

### Frontend (`apps/web`)

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 16.0.5 | React framework with App Router |
| **UI Library** | React | 19.2.0 | Component-based UI |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Components** | Shadcn UI | Latest | Accessible component library |
| **3D Engine** | Babylon.js | 8.39.0 | WebGL 3D rendering |
| **State** | Zustand | 5.0.8 | Lightweight state management |
| **Animations** | Framer Motion | 12.23.24 | Smooth animations |
| **Icons** | Lucide React | 0.555.0 | Icon library (1000+ icons) |
| **Theme** | next-themes | 0.4.6 | Dark/light mode |
| **Uploads** | Uppy | 5.x | Resumable file uploads (TUS) |
| **Notifications** | Sonner | 2.0.7 | Toast notifications |
| **Utilities** | clsx, tailwind-merge | Latest | CSS class management |
| **Type Safety** | TypeScript | 5.x | Static typing |
| **Linting** | ESLint | 9.x | Code quality |

**Total Dependencies**: 420 packages

### Backend (`services/`)

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Language** | Python 3.11+ | 3D processing & AI |
| **API** | FastAPI | HTTP API server (planned) |
| **3D Libraries** | Trimesh, PyMeshLab, Open3D | Mesh processing |
| **Conversion** | Blender Python API | Format conversion |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+ (for frontend)
- **Python** 3.11+ (for backend)
- **Blender** (optional, for format conversion)

### 1. Frontend Setup

```bash
# Navigate to web app
cd apps/web

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Backend Setup (Geometry Engine)

```bash
# Navigate to geometry engine
cd services/geometry-engine

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies (when requirements.txt is ready)
pip install -r requirements.txt

# Run service
python main.py
```

---

## 📦 Installed Components & Utilities

### Shadcn UI Components (10)
✅ Button, Card, Slider, Tabs, Dialog, Progress, Sheet, Input, Dropdown Menu, Switch

### Shared Packages
- **UI**: Button, Card, Glass (glassmorphism)
- **Hooks**: useTheme, useUpload
- **3D Utils**: loadModel, setupCamera, setupLighting
- **Feature Flags**: Feature toggle system

### Python Modules
- **diagnose**: Mesh analysis (manifold, holes, normals)
- **repair**: Automated mesh repair
- **convert**: Format conversion via Blender
- **utils**: Helper functions (math, I/O, validation)

---

## 🎯 Development Roadmap

### ✅ Phase 1 (Current - MVP)
- [x] Monorepo structure setup
- [x] Next.js 15 frontend initialized
- [x] Babylon.js 3D engine integrated
- [x] UI component library (Shadcn)
- [x] Python geometry service scaffolded
- [ ] File upload system
- [ ] Basic 3D viewer
- [ ] Mesh diagnosis UI

### 📋 Phase 2 (Q1 2026)
- [ ] Mesh repair implementation
- [ ] Cloud rendering pipeline
- [ ] User authentication (Clerk/Auth.js)
- [ ] Database setup (PostgreSQL)
- [ ] Payment integration (Stripe)

### 🔮 Phase 3 (Q2 2026)
- [ ] Real-time collaboration
- [ ] AI texture generation
- [ ] Advanced material editor
- [ ] Mobile app (React Native)

### 🚀 Phase 4 (Q3 2026)
- [ ] Blockchain integration
- [ ] NFT minting
- [ ] Marketplace
- [ ] Public API

---

## 🏗️ Architecture Highlights

### Design Philosophy
- **"Apple-level polish meets Canva simplicity"**
- Glassmorphism UI with blur effects
- 60fps animations minimum
- WCAG 2.1 AA accessibility

### Monorepo Benefits
- **Code Sharing**: Reusable packages across apps
- **Type Safety**: Shared TypeScript types
- **Atomic Changes**: Update multiple apps in single commit
- **Consistent Tooling**: Unified build/test/deploy

### Performance Targets
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **3D Model Load**: <2s (10MB model)
- **Lighthouse Score**: 95+ (Performance)

---

## 🔧 Available Commands

### Frontend (apps/web)
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend (services/geometry-engine)
```bash
python main.py                # Start service (CLI mode)
python main.py --port 8000    # Start API server
python main.py --cli          # Interactive CLI
```

---

## 📚 Documentation

- **Developer Onboarding**: `.cursor/prompts/READ_ME_FIRST.mdc`
- **Project Context**: `.cursor/rules/000-project-context.mdc`
- **UI Style Guide**: `.cursor/rules/100-ui-style.mdc`
- **Tech Stack**: `.cursor/rules/200-tech-stack.mdc`
- **Ignore Rules**: `.cursor/rules/900-ignore.mdc`

---

## 🤝 Contributing

### Code Style
- **Frontend**: ESLint + Prettier (auto-format)
- **Backend**: PEP 8 (Python)
- **Commits**: Conventional commits

### Before Committing
1. Run linters
2. Test locally
3. Update documentation
4. Review `.cursor/rules/900-ignore.mdc` (files to never touch)

---

## 📊 Project Status

**Status**: 🟢 Phase 1 (MVP) - Active Development

- **Setup**: ✅ Complete
- **Frontend**: ✅ Initialized
- **Backend**: 🟡 Scaffolded (implementation pending)
- **Documentation**: ✅ Complete

---

## 🎨 Design Files
- **Figma**: [Link Placeholder]
- **Color Palette**: Zinc (neutral) + Blue (primary) + Purple (secondary)
- **Typography**: Geist Sans + Geist Mono

---

## 📝 License
Proprietary - All rights reserved

---

## 👥 Team
- **Founded**: 2025
- **Mission**: Democratize professional 3D workflows

---

**Built with ❤️ using Next.js, Babylon.js, and Python**
