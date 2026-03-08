# QQ Omega Landing

Landing page for QQ Omega Labs.

## Overview

A fully static website built with Astro showcasing the QQ token through a real-time 3D renderer.
The coin features PBR materials, procedural textures, and engraved logo details with momentum-based rotation physics.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v5 (static site generator)
- **UI Library**: React 19 (as Astro islands)
- **3D Engine**: Three.js 0.183
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 7
- **Language**: TypeScript 5.9
- **Font**: JetBrains Mono (variable)

## Project Structure

```
qq-omega-landing/
├── src/
│   ├── pages/
│   │   ├── index.astro       # Homepage
│   │   └── 404.astro         # Error page
│   ├── layouts/
│   │   └── Layout.astro      # Base HTML layout with SEO
│   ├── components/
│   │   ├── HomePage.tsx      # React island orchestrating 3D + HUD
│   │   ├── coin-viewer.tsx   # 3D viewer with drag interaction
│   │   └── hud-overlay.tsx   # Glass HUD with social links
│   ├── lib/
│   │   ├── coin-scene.ts     # Three.js scene factory and physics
│   │   └── paths.ts          # SVG path data for QQ logo
│   └── styles/
│       └── app.css           # Global styles, custom utilities, animations
├── public/
│   ├── _headers              # Security and caching headers (Cloudflare)
│   ├── favicon.*             # Favicon (ICO, SVG, PNG sizes)
│   ├── apple-*.png           # Apple touch icons
│   ├── web-app-manifest-*.png # PWA icons
│   ├── manifest.json         # PWA manifest
│   ├── robots.txt            # Search engine directives
│   └── img/
│       ├── qq-og-image.png   # Open Graph share image (1200x630)
│       └── QQ*.{svg,png}     # Logo variants
├── dist/                     # Build output (static files)
├── astro.config.mjs          # Astro configuration
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js 20+ with pnpm

## Installation

```bash
pnpm install
```

## Development

Start local dev server with hot module replacement:

```bash
pnpm run dev
```

Default URL: `http://localhost:4321`

The site uses Astro islands architecture: static HTML with React islands for interactive components (3D viewer, HUD).

## Build

Generate static site:

```bash
pnpm run build
```

Output directory: `dist/`

The build:

- Generates static HTML for all pages
- Extracts Three.js into separate chunk (`three.*.js`)
- Applies tree-shaking and minification
- Optimizes assets with content hashes
- Runs TypeScript checks

## Preview

Serve production build locally:

```bash
pnpm run preview
```

This simulates the production environment to verify build output.

## Lint & Format

Run ESLint:

```bash
pnpm run lint
```

Format code with Prettier:

```bash
pnpm run format
```

## Deployment

The site is fully static and compatible with any hosting provider that serves static files.

### Cloudflare Pages

1. Connect repository
2. Set build command: `pnpm run build`
3. Set publish directory: `dist`
4. Node.js version: 20+

The `public/_headers` file provides:

- Security headers (CSP, X-Frame-Options, etc.)
- Asset caching with 1-year max-age for versioned files
- Immutable caching for hashed assets

### Other Providers

Upload the `dist/` directory to your static hosting provider. No server-side runtime required.

## Environment Variables

None required. Site is fully static with no backend dependencies.

## Architecture Notes

### Astro Islands Architecture

Astro generates static HTML by default and hydrates only interactive components:

- **Static parts**: Layout, SEO tags, background layers
- **Interactive islands**: CoinViewer (Three.js), HudOverlay (React)

Benefits:

- Minimal JavaScript (~80KB vs ~120KB with traditional SPA)
- Faster initial page load
- Better SEO and performance scores

### File-Based Routing

Astro uses filesystem-based routing:

- `src/pages/index.astro` → `/`
- `src/pages/404.astro` → `/404`

Each `.astro` file can import React components as islands using `client:only="react"`.

### Three.js Scene Management

The 3D coin is rendered via `createCoinScene()` factory in `src/lib/coin-scene.ts`:

- **Geometry**: LatheGeometry for barrel, CircleGeometry for faces with raised ring
- **Textures**: Procedural canvas-based diffuse, normal, and roughness maps
- **Materials**: PBR MeshStandardMaterial with metalness 0.93-0.98
- **Lighting**: Mixed directional and point lights with pink/purple accent colors
- **Camera**: Responsive FOV and position based on viewport aspect ratio
- **Physics**: Momentum decay system for natural drag-release behavior

### Loading State

The site includes a custom loading screen that displays while the Three.js scene initializes:

- QQ logo with animated progress bar
- CSS-only animations (no JavaScript)
- Automatically hidden when scene is ready
- Defined in `src/styles/app.css` (`.loader` classes)

### Client-Side Hydration

Three.js requires browser APIs (WebGL, DOM). React islands with `client:only="react"`:

- Skip server-side rendering entirely
- Hydrate only in browser
- Lazy load components with React.lazy()

All SEO assets are located in `public/` and automatically served by Astro during build.

## Browser Support

- Modern browsers with ES2020 support
- WebGL 1.0 required for Three.js
- CSS backdrop-filter for glassmorphism (degrades gracefully)

## Performance

**Bundle Sizes (gzipped):**

- Three.js: ~124 KB
- React runtime: ~58 KB
- App code: ~12 KB
- **Total JS: ~194 KB**

**Lighthouse Scores (expected):**

- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Note:** While the code is open source under MIT, the QQ Omega brand, logo, and visual assets remain the exclusive property of QQ Omega Labs. See the LICENSE file for full details on trademark and asset restrictions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Trademark

"QQ Omega Labs", "QQ Omega", and the QQ logo are trademarks of QQ Omega Labs. Use of these trademarks requires explicit permission.
