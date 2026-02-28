/**
 * @dev HUD-style overlay with header, corner brackets, and glass info panel.
 * Pure presentational component, animation driven by `mounted` prop.
 */

// PRIVATE - Data

const CORNERS = ["tl", "tr", "bl", "br"] as const;

const SOCIAL_LINKS = [
  {
    label: "Follow us on X",
    href: "https://x.com/QQomega_labs",
    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "View source on GitHub",
    href: "https://github.com/qqomega-labs",
    icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z",
  },
  {
    label: "Read the documentation",
    href: "https://docs.qqomega.xyz/docs/about/why",
    icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zM6 20V4h5v7h7v9H6zm2-7h8v2H8v-2zm0 4h5v2H8v-2z",
  },
] as const;

// PRIVATE - Subcomponents

function SocialIcon({ d }: { d: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function GlassDivider({ className = "" }: { className?: string }) {
  return <span className={`glass-divider ${className}`} aria-hidden="true" />;
}

// PUBLIC

interface IHudOverlayProps {
  mounted: boolean;
}

export default function HudOverlay({ mounted }: IHudOverlayProps) {
  const anim = (delay: number) =>
    mounted ? `animate-in delay-${delay}` : "opacity-0";

  return (
    <>
      {/* Corner brackets */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        aria-hidden="true"
      >
        {CORNERS.map((pos) => (
          <div
            key={pos}
            className={`corner-bracket corner-${pos} ${anim(1)}`}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute inset-x-0 top-0 z-[5] pointer-events-none p-10 sm:p-14 md:p-20">
        <div className="flex items-start justify-center mt-4 sm:mt-6 md:mt-8">
          <header className={`text-center ${anim(2)}`}>
            <div className="flex items-center justify-center">
              <span className="text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-[2px] text-qq-text">
                QQ
              </span>
              <span className="blink-cursor" aria-hidden="true" />
            </div>
            <span className="block text-[8px] sm:text-[9px] md:text-[10px] font-light tracking-[4px] sm:tracking-[5px] text-qq-pink/40 mt-1">
              OMEGA LABS
            </span>
          </header>
        </div>
      </div>

      {/* Glass panel */}
      <div className={`glass-panel-container ${anim(4)}`}>
        <div className="glass-panel pointer-events-auto">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="status-dot" aria-hidden="true" />
            <span className="text-[8px] sm:text-[9px] tracking-[2px] text-qq-text/35 uppercase">
              sys.online
            </span>
          </div>

          <GlassDivider />

          {/* Social links */}
          <nav
            className="flex items-center gap-1.5 sm:gap-2"
            aria-label="Social links"
          >
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="social-link"
                aria-label={link.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon d={link.icon} />
              </a>
            ))}
          </nav>

          <GlassDivider />

          {/* Interaction hint */}
          <div className="flex items-center gap-1.5 hint-text">
            <svg
              className="orbit-icon"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" />
              <ellipse cx="12" cy="12" rx="10" ry="4" />
            </svg>
            <span className="text-[8px] sm:text-[9px] text-qq-text/35 tracking-[1px] whitespace-nowrap">
              <span className="hidden sm:inline">drag to rotate</span>
              <span className="inline sm:hidden">tap &amp; drag</span>
            </span>
          </div>

          {/* Version (tablet+) */}
          <GlassDivider className="hidden sm:block" />
          <span
            className="hidden sm:block text-[8px] tracking-[2px] text-qq-text/25 whitespace-nowrap"
            aria-hidden="true"
          >
            v0.1.0
          </span>
        </div>
      </div>
    </>
  );
}
