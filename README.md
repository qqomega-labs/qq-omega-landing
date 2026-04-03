# QQ Omega Landing

Static landing page for QQ Omega Labs at [qqomega.xyz](https://qqomega.xyz).
Features a real-time 3D coin renderer built with Three.js and Astro islands architecture.

## Tech Stack

| Layer     | Tech                                             |
| --------- | ------------------------------------------------ |
| Framework | Astro 5 (static site generator)                  |
| UI        | React 19 (islands), Tailwind CSS 4               |
| 3D        | Three.js 0.183                                   |
| Language  | TypeScript 5.9                                   |
| Fonts     | JetBrains Mono (variable), Outfit (Google Fonts) |
| Deploy    | Cloudflare Pages + Wrangler                      |

## Getting Started

```bash
# install dependencies
pnpm install

# start dev server (http://localhost:4321)
pnpm dev

# expose on local network (mobile testing)
pnpm dev --host

# type-check + production build
pnpm build

# preview production build
pnpm preview

# lint
pnpm lint

# format
pnpm format
```

## Environment Variables

None required. The site is fully static with no backend dependencies.

## Browser Support

- Modern browsers with ES2020+ support
- WebGL 1.0 required (Three.js 3D renderer)
- `backdrop-filter` for glassmorphism effects (degrades gracefully)

## License

MIT. See [LICENSE](LICENSE) for details.

"QQ Omega Labs", "QQ Omega", and the QQ logo are trademarks of QQ Omega Labs.
Brand assets in `public/img/` require explicit permission for use outside this project.
