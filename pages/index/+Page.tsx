/**
 * @dev Homepage with 3D coin viewer and HUD-style overlay.
 * Orchestrates loading state and staggered entry animations.
 */
import { lazy, Suspense, useState, useEffect, useCallback } from "react";
import { ClientOnly } from "vike-react/ClientOnly";

const CoinViewer = lazy(() => import("../../src/components/coin-viewer"));
const HudOverlay = lazy(() => import("../../src/components/hud-overlay"));

/**
 * @dev Loading screen displayed during scene initialization.
 * Shows QQ logo with animated progress bar.
 */
function LoadingScreen() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-qq-bg">
      <div className="loader">
        <div className="text-center">
          <span className="text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-[2px] text-qq-text">
            QQ
          </span>
          <span className="block text-[8px] sm:text-[9px] md:text-[10px] font-light tracking-[4px] sm:tracking-[5px] text-qq-pink/40 mt-1">
            OMEGA LABS
          </span>
        </div>
        <div className="loader-bar">
          <div className="loader-bar-fill" />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);

  // Trigger staggered entry animations after scene is ready
  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => setMounted(true), 100);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  return (
    <div className="bg-radial-deep w-full h-dvh relative overflow-hidden">
      {/* Background layers */}
      <div className="bg-filigree absolute inset-0 pointer-events-none z-[1]" />
      <div className="bg-vignette absolute inset-0 pointer-events-none z-[2]" />

      {/* Client-only 3D viewer + HUD */}
      <ClientOnly fallback={<LoadingScreen />}>
        <Suspense fallback={<LoadingScreen />}>
          <CoinViewer onReady={handleReady} />
          <HudOverlay mounted={mounted} />
        </Suspense>
      </ClientOnly>

      {/* Loading overlay - hides when scene is ready */}
      {!ready && <LoadingScreen />}
    </div>
  );
}
