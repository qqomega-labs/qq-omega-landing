/**
 * @dev HUD-style overlay with header, corner brackets, glass info panel, and hero CTA.
 * Pure presentational component, animation driven by `mounted` prop.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BookOpen } from 'lucide-react'
import { version } from 'package.json'
import { cn } from '../lib/utils'

// PRIVATE - Icons

const SOCIAL_ICON_SIZE = 'w-[13px] h-[13px] sm:w-[14px] sm:h-[14px] md:w-[15px] md:h-[15px]'

function SolanaIcon() {
  return (
    <svg
      className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]"
      viewBox="0 0 397.7 311.7"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
        fill="currentColor"
      />
      <path
        d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
        fill="currentColor"
      />
      <path
        d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
        fill="currentColor"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className={SOCIAL_ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg className={SOCIAL_ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

// PRIVATE - Data

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const

/**
 * @dev Segmented CTA options for the hero toggle switch.
 */
const ICON_SIZE = 'w-[13px] h-[13px] sm:w-[14px] sm:h-[14px]'

const CTA_SEGMENTS = [
  {
    id: 'buy' as const,
    label: 'Buy $QQ',
    href: 'https://jup.ag/tokens/76vURLKDqAMhiX2wvoedoWRNvwqSjsZ7EtrJKJiKArDN',
    trackingEvent: 'buy_qq_solana_click',
    icon: <SolanaIcon />,
  },
  {
    id: 'docs' as const,
    label: 'Docs',
    href: 'https://docs.qqomega.xyz/docs/about/why',
    trackingEvent: 'docs_click',
    icon: <BookOpen className={ICON_SIZE} aria-hidden="true" />,
  },
]

const SOCIAL_LINKS = [
  {
    label: 'Follow us on X',
    href: 'https://x.com/QQomega_labs',
    icon: <XIcon />,
  },
  {
    label: 'View source on GitHub',
    href: 'https://github.com/qqomega-labs',
    icon: <GithubIcon />,
  },
]

// PRIVATE - Analytics

/**
 * @dev Fires analytics event to gtag/plausible if either is loaded on the page.
 * No-op when neither is present.
 */
function trackClick(event: string) {
  if (typeof window === 'undefined') return
  if ('gtag' in window) (window as any).gtag('event', event)
  if ('plausible' in window) (window as any).plausible(event)
}

// PRIVATE - Subcomponents

function LiveBadge({ label }: { label: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-3 py-1.5 sm:px-3.5 sm:py-2',
        'rounded-full',
        'bg-[rgba(0,220,120,0.06)] border border-[rgba(0,220,120,0.2)]',
        'text-[8px] sm:text-[9px] tracking-[1.5px] uppercase text-[rgba(0,220,120,0.7)]'
      )}
      data-status="launchpad-live"
    >
      {/* live-dot: Tailwind can't express this box-shadow pulse keyframe */}
      <span
        className={cn(
          'inline-block w-[5px] h-[5px] rounded-full',
          'bg-[#00dc78] shrink-0',
          '[animation:live-pulse_2.4s_ease-in-out_infinite]'
        )}
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  )
}

function HeroCta({ anim }: { mounted: boolean; anim: (d: number) => string }) {
  const navRef = useRef<HTMLElement>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)
  const [activeIndex, setActiveIndex] = useState(1) // because of docs postion 1

  // Measure a segment element and update the sliding indicator position
  const updateIndicator = useCallback((el: HTMLElement) => {
    const nav = navRef.current
    if (!nav) return
    const navRect = nav.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setIndicator({
      left: elRect.left - navRect.left,
      width: elRect.width,
    })
  }, [])

  const segmentRefs = useRef<(HTMLAnchorElement | null)[]>([])

  // Recalculate indicator from ref when activeIndex or layout changes
  const syncIndicator = useCallback(() => {
    const el = segmentRefs.current[activeIndex]
    if (el) updateIndicator(el)
  }, [activeIndex, updateIndicator])

  // Measure the active segment before first paint
  useLayoutEffect(syncIndicator, [syncIndicator])

  // Recalculate on resize
  useEffect(() => {
    const ro = new ResizeObserver(syncIndicator)
    if (navRef.current) ro.observe(navRef.current)
    return () => ro.disconnect()
  }, [syncIndicator])

  const handleSelect = (e: React.PointerEvent, i: number) => {
    setActiveIndex(i)
    updateIndicator(e.currentTarget as HTMLElement)
  }

  return (
    <div
      className={cn(
        'absolute inset-x-0 z-[5]',
        'bottom-[4rem] sm:bottom-[5rem] md:bottom-[6rem]',
          'landscape:bottom-[2.5rem] landscape:sm:bottom-[3rem]',
        'flex justify-center items-center px-4 pointer-events-none',
        anim(3)
      )}
    >
      <div className="flex flex-col items-center gap-2.5 landscape:gap-1.5 pointer-events-auto">
        <LiveBadge label="Launchpad Live" />

        {/* Segmented CTA: each segment is a direct link */}
        <nav
          ref={navRef}
          className={cn(
            'relative flex items-stretch',
            'rounded-xl sm:rounded-[14px] md:rounded-2xl',
            'backdrop-blur-2xl bg-[rgba(10,3,18,0.75)]',
            'border border-qq-pink/35',
            'shadow-[0_0_24px_rgba(253,1,90,0.1),0_2px_16px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.04)]',
            'p-[3px] sm:p-1'
          )}
          aria-label="Main actions"
        >
          {/* Sliding accent indicator */}
          {indicator && (
            <span
              className={cn(
                'absolute top-[3px] sm:top-1 bottom-[3px] sm:bottom-1',
                'rounded-[9px] sm:rounded-[10px] md:rounded-xl',
                'bg-[rgba(253,1,90,0.12)]',
                'shadow-[0_0_20px_rgba(253,1,90,0.08)]',
                'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                'pointer-events-none'
              )}
              style={{ left: indicator.left, width: indicator.width }}
              aria-hidden="true"
            />
          )}

          {CTA_SEGMENTS.map((segment, i) => (
            <a
              key={segment.id}
              ref={el => { segmentRefs.current[i] = el }}
              href={segment.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                // Layout
                'relative z-[1] inline-flex items-center justify-center gap-2 sm:gap-2.5',
                // Size
                'min-h-[42px] sm:min-h-[44px] md:min-h-[48px]',
                'landscape:min-h-[36px] landscape:sm:min-h-[40px]',
                'py-2.5 sm:py-3 md:py-3.5',
                'landscape:py-1.5 landscape:sm:py-2',
                'px-5 sm:px-7 md:px-8',
                // Shape
                'rounded-[9px] sm:rounded-[10px] md:rounded-xl',
                // Typography
                'font-mono text-[12px] sm:text-[13px] md:text-[14px]',
                'font-semibold tracking-[0.3px]',
                'no-underline whitespace-nowrap',
                // Text color: active segment gets full text, inactive is dimmed
                activeIndex === i ? 'text-qq-text' : 'text-qq-text/45',
                // Transitions
                'transition-colors duration-200',
                // Active / Focus
                'active:scale-[0.97]',
                'focus-visible:outline-2 focus-visible:outline-qq-pink focus-visible:outline-offset-2'
              )}
              data-cta={segment.id}
              aria-label={segment.id === 'buy' ? 'Buy $QQ on Solana' : 'Read the documentation'}
              onClick={() => trackClick(segment.trackingEvent)}
              onPointerEnter={e => handleSelect(e, i)}
              onPointerDown={e => handleSelect(e, i)}
            >
              {segment.icon}
              <span>{segment.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

// PUBLIC

interface IHudOverlayProps {
  mounted: boolean
}

export default function HudOverlay({ mounted }: IHudOverlayProps) {
  const anim = (delay: number) => (mounted ? `animate-in delay-${delay}` : 'opacity-0')

  return (
    <>
      {/* Corner brackets */}
      <div className="absolute inset-0 z-[4] pointer-events-none" aria-hidden="true">
        {CORNERS.map(pos => (
          <div key={pos} className={`corner-bracket corner-${pos} ${anim(1)}`} />
        ))}
      </div>

      {/* Header */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 z-[5] pointer-events-none',
          'p-10 sm:p-14 md:p-20',
          'landscape:p-4 landscape:sm:p-6'
        )}
      >
        <div className="flex items-start justify-center mt-1 sm:mt-2 md:mt-3 landscape:mt-0">
          <header className={cn('text-center', anim(2))}>
            <div className="flex items-center justify-center">
              <span
                className={cn(
                  'text-[28px] sm:text-[32px] md:text-[36px]',
                  'landscape:text-[22px] landscape:sm:text-[26px]',
                  'font-bold tracking-[2px] text-qq-text'
                )}
              >
                QQ
              </span>
              {/* blink-cursor: step-end timing + 1em height tied to parent font-size */}
              <span
                className={cn(
                  'inline-block w-[2px] h-[1em]',
                  'bg-qq-pink ml-1 align-middle',
                  '[animation:blink-cursor_1s_step-end_infinite]'
                )}
                aria-hidden="true"
              />
            </div>
            <span
              className={cn(
                'block mt-1',
                'text-[10px] sm:text-[11px] md:text-[12px]',
                'landscape:text-[8px] landscape:sm:text-[9px]',
                'font-light tracking-[4px] sm:tracking-[5px] text-qq-pink/80'
              )}
            >
              OMEGA LABS
            </span>
          </header>
        </div>
      </div>

      {/* Hero CTA - segmented toggle switch */}
      <HeroCta mounted={mounted} anim={anim} />

      {/* Bottom status bar without container */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-[5]',
          'safe-area-bottom',
          'flex items-end justify-between',
          'px-3 pb-3 sm:px-5 sm:pb-4 md:px-8 md:pb-5',
          'landscape:pb-2 landscape:sm:pb-3',
          'pointer-events-none',
          anim(4)
        )}
      >
        {/* Left: status + social */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-block w-[6px] h-[6px] rounded-full',
                'bg-qq-pink',
                '[animation:status-pulse_2s_ease-in-out_infinite]'
              )}
              aria-hidden="true"
            />
            <span className="text-[8px] sm:text-[10px] md:text-[11px] tracking-[1.5px] text-qq-text/45 uppercase">
              sys.online
            </span>
          </div>

          <span
            className="text-[8px] sm:text-[10px] md:text-[11px] tracking-[2px] text-qq-text/45"
            aria-hidden="true"
          >
            |
          </span>

          {/* version */}
          <span
            className="text-[8px] sm:text-[10px] md:text-[11px] tracking-[2px] text-qq-text/45"
            aria-hidden="true"
          >
            {'v' + version}
          </span>
        </div>

        {/* Right: social links */}
        <nav
          className="flex items-center gap-3 sm:gap-4 pointer-events-auto"
          aria-label="Social links"
        >
          {SOCIAL_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                'inline-flex items-center justify-center',
                'text-qq-text/55',
                'transition-[color,transform] duration-200',
                '[@media(hover:hover)]:hover:text-qq-pink',
                'active:scale-95',
                'focus-visible:outline-2 focus-visible:outline-qq-pink focus-visible:outline-offset-2'
              )}
              aria-label={link.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}
