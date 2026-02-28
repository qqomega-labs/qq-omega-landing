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
- Comprehensive SEO infrastructure
  - Favicon set (ICO, SVG, 16x16, 32x32)
  - Apple touch icons (180x180)
  - PWA manifest with 192x192 and 512x512 icons
  - robots.txt with sitemap reference
  - Open Graph image (`qq-og-image.png` 1200x630)
  - Twitter Card metadata
  - Keywords, author, and locale meta tags
  - QQ logos (SVG and PNG variants) in `public/img/`
- 404 error page with dual implementation strategy
  - Static `public/404.html` for Cloudflare Pages fallback
  - Pre-rendered Vike route at `/404` with React component (`pages/404/+Page.tsx`)
  - Consistent design with main app (dark theme, QQ pink gradients, JetBrains Mono)
  - Mobile-responsive layout with glassmorphism aesthetics
  - Direct "Return to Home" CTA button
- SPA routing configuration via `public/_redirects` for Cloudflare Pages

### Changed

- Improved text readability across all UI elements
  - Increased font sizes: "QQ" 28-36px (was 22-28px), "OMEGA LABS" 10-12px (was 8-10px)
  - Increased text opacity: "OMEGA LABS" 80% (was 40%), status 70% (was 35%), hints 75% (was 35%), version 60% (was 25%)
  - Enhanced glass panel contrast: background 85% opacity (was 55%), stronger border, increased blur 32px (was 28px)
  - Increased glass panel padding for better text spacing
  - Applied changes to LoadingScreen component for consistency
- Enhanced SEO configuration in `+Head.tsx` with comprehensive meta tags
  - Added Twitter Card tags (`twitter:card`, `twitter:site`, `twitter:image`)
  - Extended Open Graph tags (image dimensions, locale, site name)
  - Added keywords meta tag with crypto-focused terms
  - Expanded description meta tag for better search results
  - Linked favicon set (SVG, ICO, PNG 16x16, PNG 32x32)
  - Linked Apple touch icon (180x180)
  - Linked PWA manifest
- Updated `+config.ts` with full site title and description
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
- Cloudflare Pages deployment returning 404: modified build script to flatten `dist/client/` structure to `dist/` root
  - Build script now copies all pre-rendered files from `dist/client/` to `dist/` and removes temporary subdirectories
  - Ensures all static assets (favicon, manifest.json, robots.txt, images) are deployed correctly
  - Fixes missing files issue (16 files uploaded vs 34 required)
- Glass panel overlapping system UI widgets on mobile devices (iOS home bar, Android navigation)
  - Added `viewport-fit=cover` to viewport meta tag
  - Added CSS `safe-area-inset` support with `@supports` query
  - Created `.glass-panel-container` class with responsive safe-area-aware positioning
  - Bottom padding now uses `max()` with `env(safe-area-inset-bottom)` fallback
  - Glass panel maintains minimum 2rem/3rem/4rem spacing plus device-specific insets
