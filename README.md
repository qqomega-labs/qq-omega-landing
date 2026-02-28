# QQ Omega Landing

Inlanding page for QQ Omega Labs.

## Overview

A fully static website built with Vike SSG showcasing the QQ token through a real-time 3D renderer.
The coin features PBR materials, procedural textures, and engraved logo details with momentum-based rotation physics.

## Tech Stack

- **Framework**: [Vike](https://vike.dev/) (file-based SSG with prerendering)
- **UI Library**: React 19
- **3D Engine**: Three.js 0.183
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 7
- **Language**: TypeScript 5.9
- **Font**: JetBrains Mono (variable)

## Project Structure

```
qq-omega-website/
├── pages/
│   ├── +Layout.tsx           # Root layout (loads global CSS)
│   └── index/
│       ├── +Page.tsx         # Homepage with lazy-loaded CoinViewer
│       └── +Head.tsx         # SEO metadata and Open Graph tags
├── src/
│   ├── components/
│   │   └── coin-viewer.tsx   # 3D viewer component with drag interaction
│   ├── lib/
│   │   ├── coin-scene.ts     # Three.js scene factory and physics
│   │   └── paths.ts          # SVG path data for QQ logo
│   └── styles/
│       └── app.css           # Global styles, custom utilities, animations
├── public/
│   ├── _headers              # Security and caching headers (Netlify/Cloudflare)
│   ├── favicon.*             # Favicon (ICO, SVG, PNG sizes)
│   ├── apple-*.png           # Apple touch icons
│   ├── web-app-manifest-*.png # PWA icons
│   ├── manifest.json         # PWA manifest
│   ├── robots.txt            # Search engine directives
│   └── img/
│       ├── qq-og-image.png   # Open Graph share image (1200x630)
│       └── QQ*.{svg,png}     # Logo variants
├── dist/                     # Build output (static files)
├── package.json
├── tsconfig.json
├── vite.config.ts            # Vite config with Three.js code splitting
└── CHANGELOG.md
```

## Prerequisites

- Bun 1.x (or Node.js 20+ with npm/pnpm/yarn)

## Installation

```bash
bun install
```

Alternative package managers:

```bash
pnpm install
# or
npm install
```

## Development

Start local dev server with hot module replacement:

```bash
bun run dev
```

Default URL: `http://localhost:5173`

The site uses client-only rendering for Three.js content via `<ClientOnly>` wrapper and lazy loading for optimal performance.

## Build

Generate static site with Vike prerendering:

```bash
bun run build
```

Output directory: `dist/`

The build:

- Prerenders all pages to static HTML
- Extracts Three.js into separate chunk (`three.*.js`)
- Applies tree-shaking and minification
- Generates optimized asset filenames with content hashes

## Preview

Serve production build locally:

```bash
bun run preview
```

This simulates the production environment to verify build output.

## Lint

Run ESLint:

```bash
bun run lint
```

## Deployment

The site is fully static and compatible with any hosting provider that serves static files.

### Cloudflare Pages

1. Connect repository
2. Set build command: `bun run build`
3. Set publish directory: `dist`

The `public/_headers` file provides:

- Security headers (CSP, X-Frame-Options, etc.)
- Asset caching with 1-year max-age for versioned files
- Immutable caching for hashed assets

### Other Providers

Upload the `dist/` directory to your static hosting provider. No server-side runtime required.

## Environment Variables

None required. Site is fully static with no backend dependencies.

## Architecture Notes

### Vike File-Based Routing

Vike uses filesystem-based routing with special files:

- `+Page.tsx`: Page component
- `+Head.tsx`: HTML head metadata (title, meta tags)
- `+Layout.tsx`: Shared layout wrapper

All pages are prerendered at build time for instant first paint.

### Three.js Scene Management

The 3D coin is rendered via `createCoinScene()` factory in `src/lib/coin-scene.ts`:

- **Geometry**: LatheGeometry for barrel, CircleGeometry for faces with raised ring
- **Textures**: Procedural canvas-based diffuse, normal, and roughness maps
- **Materials**: PBR MeshStandardMaterial with metalness 0.93-0.98
- **Lighting**: Mixed directional and point lights with pink/purple accent colors
- **Camera**: Responsive FOV and position based on viewport aspect ratio
- **Physics**: Momentum decay system for natural drag-release behavior

### Client-Only Rendering

Three.js requires browser APIs (WebGL, DOM). The `<ClientOnly>` wrapper from `vike-react` ensures:

- Server-side prerendering skips Three.js code
- Component hydrates only in browser
- Lazy loading via React.lazy() reduces initial bundle size

## Progressive Web App

- **Manifest**: `manifest.json` with app name, icons, and theme
- **Icons**: 192x192 and 512x512 PNG icons for install prompts
- **Apple Touch Icon**: 180x180 icon for iOS home screen
- **Theme Color**: `#282828` for browser UI theming

All SEO assets are located in `public/` and automatically served by Vike during build.

## Browser Support

- Modern browsers with ES2020 support
- WebGL 1.0 required for Three.js
- CSS backdrop-filter for glassmorphism (degrades gracefully)

## License

Private repository for QQ Omega Labs.
