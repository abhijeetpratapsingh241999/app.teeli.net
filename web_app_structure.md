# Web Application Structure

## Root Directory
- **hh.txt**: Placeholder file, purpose unknown.
- **README.md**: Documentation for the project.
- **.cursor/**: Contains rules and configurations for the Cursor tool.

## apps/
### web/
- **Configuration Files**:
  - `.gitignore`: Specifies files to ignore in version control.
  - `components.json`: Likely a configuration file for components.
  - `eslint.config.mjs`: ESLint configuration for code linting.
  - `next.config.ts`: Next.js configuration file.
  - `package-lock.json` and `package.json`: Dependency management files.
  - `pnpm-lock.yaml`: Lock file for PNPM package manager.
  - `postcss.config.mjs`: Configuration for PostCSS.
  - `tsconfig.json`: TypeScript configuration file.

- **Public Assets**:
  - `public/`: Contains SVG files like `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, and `window.svg`.

- **Source Code**:
  - `src/`:
    - **app/**:
      - `favicon.ico`: Application icon.
      - `globals.css`: Global CSS styles.
      - `layout.tsx`: Layout component.
      - `page.tsx`: Main page component.
      - `(dashboard)/home/`: Dashboard home components.
      - `viewer/`: Viewer components.
    - **components/**:
      - `theme-provider.tsx`: Theme provider component.
      - **layout/**:
        - `Header.tsx`: Header component.
        - `MobileNav.tsx`: Mobile navigation component.
        - `Sidebar.tsx`: Sidebar component.
      - **shared/**:
        - `GlassCard.tsx`: Shared glass card component.
      - **ui/**:
        - Various reusable UI components like `badge.tsx`, `button.tsx`, `card.tsx`, etc.
    - **features/**:
      - **p1-dashboard/components/**:
        - `ControlPanel.tsx`: Control panel component.
        - `DashboardHome.tsx`: Dashboard home component.
        - `GreetingHero.tsx`: Greeting hero component.
        - `Viewer3D.tsx`: 3D viewer component.
    - **lib/**:
      - `utils.ts`: Utility functions.

## packages/
- **feature-flags/**: Feature flag utilities.
- **hooks/**: Custom React hooks like `use-theme.ts` and `use-upload.ts`.
- **three-utils/**: Utilities for 3D rendering, including `camera-utils.ts`, `lighting.ts`, and `load-model.ts`.
- **ui/**: Shared UI components and utilities.

## services/
- **_blockchain/**: Blockchain-related services.
- **_orchestrator/**: Orchestration services.
- **geometry-engine/**:
  - **main.py**: Main entry point for geometry engine.
  - **src/**:
    - **convert/**:
      - `blender_convert.py`: Blender conversion utilities.
    - **diagnose/**:
      - `index.py`: Diagnostic utilities.
    - **repair/**:
      - `index.py`: Repair utilities.
    - **utils/**:
      - `helper.py`: Helper functions.

## Summary
This web application is structured to support a modular and scalable architecture. It integrates frontend components, shared utilities, and backend services to provide a robust platform for managing and visualizing 3D models.
