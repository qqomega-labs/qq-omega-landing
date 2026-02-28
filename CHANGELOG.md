# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unrealeased] - 2026-02-28 (QQAlpha)

### Added

- Initial project setup with React 19, Vite 7, TypeScript 5.9, and Tailwind CSS v4
- Vike file-based routing with SSG prerendering enabled
- Interactive 3D coin viewer with Three.js 0.183
  - PBR MeshStandardMaterial with procedural canvas textures
  - Engraved QQ logo with normal and roughness maps
  - Premium multi-directional lighting (pink/purple accent colors)
  - Raised outer ring geometry for luxury token aesthetic
- Drag-to-rotate interaction with momentum physics
  - Pointer event handling (mouse/touch support)
  - Velocity calculation with decay for natural momentum
  - Smooth blended auto-rotate resume after interaction
- Mobile-first responsive design
  - Adaptive camera FOV and position based on viewport aspect ratio
  - Reduced devicePixelRatio cap (1.5 on mobile, 2.0 on desktop)
  - Lower polygon count on mobile (32 vs 64 segments)
- Glassmorphism HUD UI
  - Floating glass panel with `backdrop-filter: blur(28px)`
  - Animated sweeping light glow beneath panel
  - Corner bracket markers for cyberpunk aesthetic
  - Status dot pulse animation
  - Social link icons with hover effects
- Dark crypto-themed design
  - QQ pink (`#FD015A`) accent color
  - JetBrains Mono variable font
  - Radial gradient backgrounds with vignette
  - Honeycomb filigree SVG pattern overlay
- Custom CSS utilities and animations
  - `bg-radial-deep`, `bg-filigree`, `bg-vignette` backgrounds
  - Staggered fade-in animations with delay classes
  - Loading screen with animated progress bar
  - Blinking cursor and orbit icon animations
- Three.js code splitting via Vite `manualChunks`
- Client-only rendering with lazy loading (`<ClientOnly>` + `React.lazy()`)
- Security and caching headers in `public/_headers` (Netlify/Cloudflare compatible)
- SEO metadata with Open Graph tags in `+Head.tsx`
- TypeScript strict mode with comprehensive type definitions
- Visibility API integration (pauses animation when tab inactive)

### Changed

- Separated `CoinViewer` from HUD overlay into dedicated components
  - `coin-viewer.tsx` now handles only 3D canvas and drag interaction
  - New `hud-overlay.tsx` for header, corner brackets, and glass panel
  - `+Page.tsx` orchestrates `ready`/`mounted` state via `onReady` callback
- Replaced Google Fonts CDN with self-hosted `@fontsource-variable/jetbrains-mono`
- Replaced white (`rgba(255,255,255,...)`) UI accents with palette colors (`qq-pink`, `qq-text`)
- Extracted drag interaction magic numbers into named constants (`DRAG_SENSITIVITY`, `MOMENTUM_THRESHOLD`, `MOMENTUM_MULTIPLIER`)
- Decoupled `coin-viewer` from `coin-scene` internals via `getRotation()`/`setRotation()` methods on `ICoinScene`

### Fixed

- Memory leak: Three.js textures, geometries, materials, and environment map now fully disposed on unmount
- Memory leak: procedural canvas elements tracked and released (`width=0, height=0`) on dispose
- Animation loop continues running when browser tab is hidden (now pauses via Visibility API)
- `animClass` helper recreated on every render (wrapped with `useCallback`)
