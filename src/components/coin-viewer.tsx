import { useEffect, useRef, useCallback } from 'react'
import { createCoinScene } from '../lib/coin-scene'
import type { ICoinScene } from '../lib/coin-scene'
import { cn } from '../lib/utils'

/**
 * @dev Internal state for pointer drag interactions.
 * Tracks position, rotation deltas, and velocity for momentum calculation.
 */
interface IDragState {
  active: boolean
  startX: number
  startY: number
  rotX: number
  rotY: number
  lastX: number
  lastY: number
  lastTime: number
  velocityX: number
  velocityY: number
}

interface ICoinViewerProps {
  onReady: () => void
}

// Interaction constants
const DRAG_SENSITIVITY = 0.008
const MOMENTUM_MULTIPLIER = 0.008
const MOMENTUM_THRESHOLD = 0.005
const READY_DELAY = 1500

/**
 * @dev 3D coin viewer with pointer-based drag rotation and momentum.
 * Renders only the WebGL canvas. UI overlay lives in hud-overlay.tsx.
 */
export default function CoinViewer({ onReady }: ICoinViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<ICoinScene | null>(null)
  const dragRef = useRef<IDragState>({
    active: false,
    startX: 0,
    startY: 0,
    rotX: 0,
    rotY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    velocityX: 0,
    velocityY: 0,
  })

  // Initialize 3D scene
  useEffect(() => {
    if (!containerRef.current || sceneRef.current) return
    sceneRef.current = createCoinScene(containerRef.current)
    const timer = setTimeout(onReady, READY_DELAY)
    return () => {
      clearTimeout(timer)
      if (sceneRef.current) {
        sceneRef.current.dispose()
        sceneRef.current = null
      }
    }
  }, []) // onReady is stable (useCallback in parent)

  // PRIVATE - Pointer event handlers

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const scene = sceneRef.current
    if (!scene) return
    scene.pauseAutoRotate()
    const rot = scene.getRotation()
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      rotX: rot.x,
      rotY: rot.y,
      lastX: e.clientX,
      lastY: e.clientY,
      lastTime: performance.now(),
      velocityX: 0,
      velocityY: 0,
    }
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return
    const scene = sceneRef.current
    if (!scene) return

    const dx = (e.clientX - dragRef.current.startX) * DRAG_SENSITIVITY
    const dy = (e.clientY - dragRef.current.startY) * DRAG_SENSITIVITY
    scene.setRotation(dragRef.current.rotX + dy, dragRef.current.rotY + dx)

    const now = performance.now()
    const dt = now - dragRef.current.lastTime
    if (dt > 10) {
      const deltaX = e.clientX - dragRef.current.lastX
      const deltaY = e.clientY - dragRef.current.lastY
      dragRef.current.velocityY = (deltaX / dt) * MOMENTUM_MULTIPLIER
      dragRef.current.velocityX = (deltaY / dt) * MOMENTUM_MULTIPLIER
      dragRef.current.lastX = e.clientX
      dragRef.current.lastY = e.clientY
      dragRef.current.lastTime = now
    }
  }, [])

  const onPointerUp = useCallback(() => {
    dragRef.current.active = false
    const velX = dragRef.current.velocityX
    const velY = dragRef.current.velocityY
    if (Math.abs(velX) > MOMENTUM_THRESHOLD || Math.abs(velY) > MOMENTUM_THRESHOLD) {
      sceneRef.current?.applyMomentum(velX, velY)
    } else {
      sceneRef.current?.resumeAutoRotate()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 z-[3]', 'cursor-grab active:cursor-grabbing', 'touch-none')}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    />
  )
}
