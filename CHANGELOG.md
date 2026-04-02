# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-04-02 (QQAlpha)

### Added

- **Outfit font**: loaded from Google Fonts (`wght@400;500;600;700`) via preconnect links in `Layout.astro`; `--font-sans` token added to `@theme` in `app.css`

### Changed

- **404 page typography**: content wrapper now uses `font-sans` (Outfit) instead of inheriting the site-wide JetBrains Mono body font, aligning the error page visually with the launchpad subdomain 404 page

## [Unreleased] - 2026-04-01 (QQAlpha)

### Changed

- **Background aura**: increased radial glow opacity and spread; responsive variants per breakpoint — mobile glow positioned higher (`50% 30%`, opacity `0.22`), tablet (`50% 38%`, opacity `0.24`), desktop (`50% 45%`, opacity `0.26`) with extra top-edge layer; landscape phone override with wider horizontal ellipse (`160% 80%`, opacity `0.18`); base dark gradient lightened from `#120610/#060110` to `#1c0a18/#0a0216/#010008`
- **Vignette**: opacity reduced from `0.65` (flat) to `0.50` mobile / `0.45` desktop to let the aura breathe

## [v0.1.2] - 2026-03-18 (QQAlpha)

### Added

- **Segmented CTA toggle switch** replacing single Buy button
  - Two-segment glassmorphism pill: `Buy $QQ` (Solana) and `Docs` (documentation)
  - Each segment is a direct `<a>` link with one-tap navigation
  - Sliding pink accent indicator with `cubic-bezier` animation on hover/tap
  - Persistent selection state: hovering Buy keeps it selected after pointer leave
  - `ResizeObserver` recalculates indicator position on viewport resize
  - `useLayoutEffect` initializes indicator before first paint (no flash)
  - `onPointerDown` for mobile touch support alongside `onPointerEnter` for desktop
- Added `lucide-react` dependency for `BookOpen` icon in Docs CTA segment
- Dedicated icon components: `XIcon`, `GithubIcon` (raw SVG), `SolanaIcon` (unchanged)

### Changed

- **Coin size reduced across all viewports** for better visual balance
  - Phone portrait narrow: `fov: 46`, `z: 11.0`
  - Phone portrait standard: `fov: 42`, `z: 10.0`
  - Tablet portrait: `fov: 40`, `z: 9.5` (was `36`/`7.8`)
  - Desktop/landscape: `fov: 36`, `z: 8.2` (was `32`/`6.5`)
- **Coin repositioned upward** (`BASE_CAM_Y: 2.8` to `2.0`) to center the background gradient
- **Landscape orientation support**
  - New camera breakpoint for phone landscape (`aspect > 1.3 && h < 500`): `fov: 38`, `y: 1.8`, `z: 7.5`
  - HUD overlay: reduced header padding, title size, CTA bottom offset, segment heights, and status bar spacing via `landscape:` Tailwind variant
- Social links refactored from raw SVG path strings in data to dedicated icon components (`XIcon`, `GithubIcon`)
- Docs link removed from bottom social bar (now in CTA segment)
- Updated `.gitignore` excluding `.astro` folder.

### Removed

- `SocialIcon` generic component (replaced by dedicated icon components)
- `BUY_ACTIONS` registry (replaced by `CTA_SEGMENTS`)

## [v0.1.1] - 2026-03-13 (QQAlpha)

### Fixed

- **SEO: sitemap never generated** (`astro.config.mjs`, `public/robots.txt`)
  - `robots.txt` referenced `https://qqomega.xyz/sitemap.xml` but no sitemap was ever produced - `@astrojs/sitemap` was not installed or configured
  - Added `@astrojs/sitemap` integration and `site: 'https://qqomega.xyz'` to `astro.config.mjs`
  - Astro generates a sitemap index at `sitemap-index.xml`; updated `robots.txt` to reference the correct filename
- **SEO: static `og:url` on every page** (`src/layouts/Layout.astro`)
  - `og:url` was hardcoded to `https://qqomega.xyz`, causing Google to treat every page as a duplicate of the homepage
  - Replaced with `Astro.url.href` for accurate per-page canonical URL
- **SEO: per-page meta tags not overridable** (`src/layouts/Layout.astro`)
  - `description`, `og:title`, `og:description`, `twitter:title`, `twitter:description` were static strings with no way to override per page
  - Exposed as optional props on `Layout` with sensible defaults - callers can now pass custom values per route
- **SEO: spurious `og:locale:alternate` for `zh_CN`** (`src/layouts/Layout.astro`)
  - This site has no Chinese locale; the alternate tag was misleading and has been removed
- Drag-to-rotate (coin spin) broken on mobile (Safari and Chrome)
  - Root cause: React synthetic event delegation does not reliably dispatch events that originate from non-React DOM children (the Three.js canvas appended via `appendChild`)
  - Replaced React `onPointer*` props on the container div with native `addEventListener` calls attached directly to `renderer.domElement` inside `useEffect`
  - Added `canvas.setPointerCapture(e.pointerId)` in `pointerdown` handler so `pointermove`/`pointerup` keep firing even when a fast swipe exits canvas bounds
  - Set `renderer.domElement.style.touchAction = 'none'` in `coin-scene.ts` to prevent the browser from intercepting single-finger pan gestures before pointer events fire
  - Added `pointercancel` listener aliased to the end-drag handler for clean state reset on browser-initiated cancellation

## [Unreleased] - 2026-03-12 (QQAlpha)

### Added

- Hero CTA `Buy $QQ on Solana` in the HUD overlay, positioned above the glass panel
  - Opens the Jupiter launchpad in a new tab (`rel="noopener noreferrer"`)
  - `Launchpad Live` status badge with green pulsing live indicator (`live-pulse` keyframe)
  - Analytics hook firing `buy_qq_solana_click` event to `gtag`/`plausible` if present
  - `data-cta="buy-qq-solana"` and `data-status="launchpad-live"` tracking attributes
  - Extensible `BUY_ACTIONS` registry for future multi-chain buy buttons (Base, ETH, etc.)
  - Installed `tailwind-merge` and `clsx` packages and created `cn` utility function.
- Solana logo icon (`SolanaIcon`) inside CTA button for brand recognition

### Changed

- Improved Hero CTA button UX
  - Replaced transparent gradient background with solid opaque surface (`rgba(10,3,18,0.75)`) for better readability
  - Increased spacing between CTA and glass panel (`bottom-[6rem]`/`[8rem]`/`[9.5rem]`)
  - Refined `LiveBadge`: smaller pill shape (`rounded-full`), tighter sizing
  - Arrow indicator styled with `text-qq-pink/60` for visual hierarchy
- Wrapped CSS reset (`*`, `html`, `body`, `::selection`) in `@layer base` to fix Tailwind v4 cascade issue where unlayered reset overrode utility classes (padding, margin)
- Refactored `src/styles/app.css`: removed all custom classes expressible as Tailwind utilities
  - Deleted dead code: `.safe-area-bottom/sm/md`, `.bg-grid-pink`, `.loader-content`, `.loader-text`, `.loader-subtitle`, `.animate-loading-pulse`, `@keyframes loading-pulse`
  - Converted to Tailwind in JSX: `.glass-divider`, `.social-link`, `.status-dot`, `.blink-cursor`, `.orbit-icon`, `.hint-text`, `.loader`, `.loader-bar`, `.loader-bar-fill`
  - CSS now contains only what Tailwind cannot express: pseudo-elements (`::before`/`::after`), `env(safe-area-inset-bottom)`, complex multi-layer backgrounds, `@keyframes`, and dynamically composed class names (`.animate-in`, `.delay-*`)
- `hud-overlay.tsx`: replaced `GlassDivider` component and all CSS-class-based elements with Tailwind utility classes; `[@media(hover:hover)]:hover:` variant used for pointer-device-only hover on social links
- `HomePage.tsx`: `LoadingScreen` loader markup converted to Tailwind; `loader-bar-fill` animation referenced via `[animation:loader-slide_...]` arbitrary value
- Adopted `cn()` utility across all components for Tailwind class readability
  - `hud-overlay.tsx`, `home-page.tsx`, `coin-viewer.tsx`, `404.astro`: long `className` strings split into semantic groups (layout, size, shape, typography, surface, hover, focus)
- Read package version from `package.json` in `HudOverlay.ts` component
- Replaced glass panel bottom bar with raw footer: no container, no blur, no rounded corners
  - Elements spread edge-to-edge: `sys.online` + version left, social links right
  - Removed "drag to rotate" interaction hint
  - Docs social link shows "documentation" label on tablet/desktop (`hidden sm:inline`), icon-only on mobile
  - Footer text scaled up to `md:text-[11px]` on desktop for legibility
- Raised title header closer to top edge (`mt-1/2/3`)
- Fixed footer social links not clickable: added `pointer-events-auto` to `nav`

## [0.1.0] - 2026-03-09 (QQAlpha)

### Added

- **Astro v5.18** as static site generator (replacing Vike)
  - Astro islands architecture for optimal performance
  - File-based routing with `src/pages/` directory
  - Static HTML generation with selective React hydration
- **Prettier** code formatting with Astro plugin
  - Configuration file `.prettierrc.json`
  - Ignore file `.prettierignore`
  - Format script `pnpm run format`
- New `src/layouts/Layout.astro` base layout with SEO metadata
- New `src/pages/404.astro` error page (Astro format)
- New `src/components/HomePage.tsx` React island orchestrating 3D viewer and HUD
- Test page `src/pages/test.astro` for debugging React integration
- MIT License file with brand asset restrictions
- `TRADEMARK.md` documenting QQ Omega brand usage policy
- TypeScript import type support for better bundling

### Changed

- **Migration from Vike to Astro**
  - Changed from Vike SSG to Astro static site generation
  - Restructured project: `pages/` → `src/pages/` with `.astro` files
  - Changed routing from Vike convention (`+Page.tsx`, `+Head.tsx`) to Astro file-based routing
  - React components now hydrate as Astro islands with `client:only="react"`
- **Removed lazy loading** from `HomePage` component
  - Removed `React.lazy()` and `Suspense` wrapper
  - Direct imports of `CoinViewer` and `HudOverlay` for better reliability with Astro islands
- **Performance optimization**
  - Bundle size reduced: ~194 KB total (Three.js: 124 KB, React: 58 KB, App: 12 KB)
  - Faster initial page load with static HTML + selective hydration
  - Server-side rendered loader screen for instant visual feedback
- Updated `package.json` scripts
  - `dev`: `astro dev` (was `vite`)
  - `build`: `astro check && astro build` (was `vite build`)
  - `preview`: `astro preview` (was `vite preview`)
- Updated `README.md` with Astro-specific documentation
  - New architecture section explaining Astro islands
  - Updated performance metrics and bundle sizes
  - Changed package manager examples from Bun to pnpm
- Updated `tsconfig.json` to extend Astro strict config
- Changed SEO metadata location from `pages/index/+Head.tsx` to `src/layouts/Layout.astro`

### Removed

- **Vike framework** and all related dependencies
  - Removed `vike` package
  - Removed `vike-react` package
  - Removed `vike-react/ClientOnly` wrapper
- Removed Vike-specific files and directories
  - Removed `pages/+Layout.tsx`
  - Removed `pages/index/+Page.tsx`
  - Removed `pages/index/+Head.tsx`
  - Removed `pages/_error/` directory
  - Removed entire `pages/` directory structure
- Removed `vite.config.ts` (Astro uses its own config)
- Removed `@astrojs/tailwind` integration (using `@tailwindcss/vite` directly)

### Fixed

- **TypeScript import error** for `ICoinScene` interface
  - Changed from value import to type import: `import type { ICoinScene }`
  - Resolves "Importing binding name 'ICoinScene' is not found" error during hydration
  - Fixes black screen issue where React components failed to hydrate
- Improved Tailwind CSS v4 integration with Astro
  - Configured `@tailwindcss/vite` plugin in `astro.config.mjs`
  - Ensures custom CSS classes and animations compile correctly
- Loader animation now displays correctly on initial page load
  - Server-side rendering ensures loader is visible immediately
  - Fixed hydration timing to prevent blank screen during Three.js initialization

## [Unreleased] - 2026-02-28 (QQAlpha)

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
- 404 error page using Vike `_error` convention
  - Pre-rendered error page at `pages/_error/+Page.tsx`
  - Generates `dist/404.html` with Vike SSG
  - Consistent design with main app (dark theme, QQ pink gradients, JetBrains Mono)
  - Mobile-responsive layout with glassmorphism aesthetics
  - Direct "Return to Home" CTA button
- Cloudflare Pages routing configuration via `public/_redirects`
  - Root `/` serves `index.html` (status 200)
  - All other routes serve `404.html` (status 404)

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
