/**
 * @dev Homepage React island.
 * Orchestrates loading state and 3D coin viewer with HUD overlay.
 */
import { useState, useEffect, useCallback } from 'react'
import CoinViewer from './coin-viewer'
import HudOverlay from './hud-overlay'

/**
 * @dev Loading screen displayed during scene initialization.
 * Shows QQ logo with animated progress bar.
 */
function LoadingScreen() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-qq-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <span className="text-[28px] sm:text-[32px] md:text-[36px] font-bold tracking-[2px] text-qq-text">
            QQ
          </span>
          <span className="block text-[10px] sm:text-[11px] md:text-[12px] font-light tracking-[4px] sm:tracking-[5px] text-qq-pink/80 mt-1">
            OMEGA LABS
          </span>
        </div>
        <div className="w-[100px] md:w-[120px] h-[2px] bg-qq-pink/6 rounded-[1px] overflow-hidden">
          <div className="w-2/5 h-full bg-qq-pink rounded-[1px] [animation:loader-slide_3s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [ready, setReady] = useState(false)
  const [mounted, setMounted] = useState(false)

  const handleReady = useCallback(() => setReady(true), [])

  // Trigger staggered entry animations after scene is ready
  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => setMounted(true), 100)
      return () => clearTimeout(timer)
    }
  }, [ready])

  return (
    <div className="bg-radial-deep w-full h-dvh relative overflow-hidden">
      {/* Background layers */}
      <div className="bg-filigree absolute inset-0 pointer-events-none z-[1]" />
      <div className="bg-vignette absolute inset-0 pointer-events-none z-[2]" />

      {/* 3D viewer + HUD */}
      <CoinViewer onReady={handleReady} />
      <HudOverlay mounted={mounted} />

      {/* Loading overlay - hides when scene is ready */}
      {!ready && <LoadingScreen />}
    </div>
  )
}
