import * as THREE from 'three'
import { OUTER_PATH, CUTOUT_PATH, INNER_HOLE_PATH, SVG_SIZE } from './paths'

const TEX_SIZE = 1024

export interface ICoinRotation {
  x: number
  y: number
}

export interface ICoinScene {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  getRotation(): ICoinRotation
  setRotation(x: number, y: number): void
  pauseAutoRotate(): void
  resumeAutoRotate(): void
  applyMomentum(velocityX: number, velocityY: number): void
  dispose(): void
}

/* ------------------------------------------------------------------ */
/*  PRIVATE - Texture generators                                      */
/* ------------------------------------------------------------------ */

function drawLogo(ctx: CanvasRenderingContext2D, color: string, bgColor: string): void {
  const scale = TEX_SIZE / SVG_SIZE
  ctx.save()
  ctx.scale(scale, scale)
  ctx.fillStyle = color
  ctx.fill(new Path2D(OUTER_PATH))
  ctx.fillStyle = bgColor
  ctx.fill(new Path2D(CUTOUT_PATH))
  ctx.fill(new Path2D(INNER_HOLE_PATH))
  ctx.restore()
}

const canvases: HTMLCanvasElement[] = []

function makeCanvas(size = TEX_SIZE): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  canvases.push(c)
  return c
}

function createFaceTexture(logoColor: string, bgColor: string): THREE.CanvasTexture {
  const c = makeCanvas()
  const ctx = c.getContext('2d')!

  // Disc background
  ctx.fillStyle = bgColor
  ctx.beginPath()
  ctx.arc(TEX_SIZE / 2, TEX_SIZE / 2, TEX_SIZE / 2, 0, Math.PI * 2)
  ctx.fill()

  // Rim grooves
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 3
  ;[0.47, 0.44].forEach(r => {
    ctx.beginPath()
    ctx.arc(TEX_SIZE / 2, TEX_SIZE / 2, TEX_SIZE * r, 0, Math.PI * 2)
    ctx.stroke()
  })

  // Logo
  drawLogo(ctx, logoColor, bgColor)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function createNormalMap(): THREE.CanvasTexture {
  const c = makeCanvas()
  const ctx = c.getContext('2d')!

  // Base normal
  ctx.fillStyle = 'rgb(128,128,255)'
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE)

  // Engraved (inciso) logo - inverted normals (deeper blue = incised)
  const scale = TEX_SIZE / SVG_SIZE
  ctx.save()
  ctx.scale(scale, scale)
  const outer = new Path2D(OUTER_PATH)
  ctx.fillStyle = 'rgb(128,128,220)' // Incised area (lower B = depth)
  ctx.fill(outer)
  ctx.fillStyle = 'rgb(128,128,255)'
  ctx.fill(new Path2D(CUTOUT_PATH))
  ctx.fill(new Path2D(INNER_HOLE_PATH))

  // Edges with pronounced depth gradient
  ctx.strokeStyle = 'rgb(128,128,200)'
  ctx.lineWidth = 6
  ctx.stroke(outer)
  ctx.restore()

  // Rim grooves (subtle)
  ctx.strokeStyle = 'rgb(128,128,235)'
  ctx.lineWidth = 4
  ;[0.47, 0.44].forEach(r => {
    ctx.beginPath()
    ctx.arc(TEX_SIZE / 2, TEX_SIZE / 2, TEX_SIZE * r, 0, Math.PI * 2)
    ctx.stroke()
  })

  return new THREE.CanvasTexture(c)
}

function createRoughnessMap(): THREE.CanvasTexture {
  const c = makeCanvas()
  const ctx = c.getContext('2d')!

  ctx.fillStyle = 'rgb(45,45,45)' // Base polished surface
  ctx.beginPath()
  ctx.arc(TEX_SIZE / 2, TEX_SIZE / 2, TEX_SIZE / 2, 0, Math.PI * 2)
  ctx.fill()

  // Engraved logo area - rougher (catches less light)
  const scale = TEX_SIZE / SVG_SIZE
  ctx.save()
  ctx.scale(scale, scale)
  ctx.fillStyle = 'rgb(70,70,70)' // Rougher incised area
  ctx.fill(new Path2D(OUTER_PATH))
  ctx.fillStyle = 'rgb(45,45,45)'
  ctx.fill(new Path2D(CUTOUT_PATH))
  ctx.fill(new Path2D(INNER_HOLE_PATH))
  ctx.restore()

  // Rim polished
  ctx.strokeStyle = 'rgb(20,20,20)'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.arc(TEX_SIZE / 2, TEX_SIZE / 2, TEX_SIZE * 0.49, 0, Math.PI * 2)
  ctx.stroke()

  return new THREE.CanvasTexture(c)
}

/* ------------------------------------------------------------------ */
/*  PRIVATE - Coin geometry                                           */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */

/**
 * @dev Creates a premium face geometry with raised outer ring.
 * Inner area recessed, outer ring elevated for luxury coin look.
 */
function createPremiumFaceGeometry(
  radius: number,
  segments: number,
  ringWidth: number,
  ringHeight: number,
  faceY: number,
  rotateX: number
): THREE.BufferGeometry {
  const geo = new THREE.CircleGeometry(radius, segments, 16)
  geo.rotateX(rotateX)

  const pos = geo.attributes.position
  const ringStartRadius = radius - ringWidth
  const transitionWidth = ringWidth * 0.3 // Smooth transition

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const dist = Math.sqrt(x * x + z * z)

    let yOffset = 0

    // Inner flat area (recessed)
    if (dist < ringStartRadius - transitionWidth) {
      yOffset = 0
    }
    // Transition to ring (smooth rise)
    else if (dist < ringStartRadius) {
      const t = (dist - (ringStartRadius - transitionWidth)) / transitionWidth
      const smoothT = t * t * (3 - 2 * t)
      yOffset = ringHeight * smoothT
    }
    // Raised ring plateau
    else if (dist < ringStartRadius + transitionWidth) {
      yOffset = ringHeight
    }
    // Transition to edge (smooth descent)
    else {
      const t =
        (dist - (ringStartRadius + transitionWidth)) /
        (radius - (ringStartRadius + transitionWidth))
      const smoothT = 1 - t * t * (3 - 2 * t)
      yOffset = ringHeight * smoothT
    }

    pos.setY(i, pos.getY(i) + faceY + yOffset)
  }

  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

/**
 * @dev Creates the barrel (side) with simple bevel, no ridges.
 */
function createBarrelGeometry(
  radius: number,
  thickness: number,
  bevel: number,
  segments: number
): THREE.LatheGeometry {
  const halfH = thickness / 2
  const bevelSteps = 6

  const profile: THREE.Vector2[] = []

  // Bottom bevel
  for (let i = 0; i <= bevelSteps; i++) {
    const t = ((i / bevelSteps) * Math.PI) / 2
    profile.push(
      new THREE.Vector2(radius - bevel + Math.sin(t) * bevel, -halfH + bevel - Math.cos(t) * bevel)
    )
  }

  // Barrel
  profile.push(new THREE.Vector2(radius, halfH - bevel))

  // Top bevel
  for (let i = 0; i <= bevelSteps; i++) {
    const t = ((i / bevelSteps) * Math.PI) / 2
    profile.push(
      new THREE.Vector2(radius - bevel + Math.cos(t) * bevel, halfH - bevel + Math.sin(t) * bevel)
    )
  }

  const geo = new THREE.LatheGeometry(profile, segments)
  geo.computeVertexNormals()
  return geo
}

function createEnvMap(): THREE.CanvasTexture {
  const c = makeCanvas(512)
  c.height = 256
  const ctx = c.getContext('2d')!

  const grad = ctx.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, '#1a0510')
  grad.addColorStop(0.3, '#0d0208')
  grad.addColorStop(0.5, '#15040d')
  grad.addColorStop(0.7, '#200815')
  grad.addColorStop(1, '#0a0205')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 256)

  // Reflection hotspots
  const spots = [
    { x: 150, y: 80, r: 45, c: 'rgba(255,200,220,0.18)' },
    { x: 350, y: 55, r: 35, c: 'rgba(255,255,255,0.15)' },
    { x: 420, y: 180, r: 55, c: 'rgba(255,100,150,0.12)' },
    { x: 80, y: 200, r: 25, c: 'rgba(253,1,90,0.1)' },
  ]
  spots.forEach(({ x, y, r, c }) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  })

  const tex = new THREE.CanvasTexture(c)
  tex.mapping = THREE.EquirectangularReflectionMapping
  return tex
}

/* ------------------------------------------------------------------ */
/*  PRIVATE - Responsive camera helpers                               */
/* ------------------------------------------------------------------ */

const BASE_CAM_Y = 2.0

/**
 * @dev Computes camera Z offset and FOV for the given viewport.
 * On narrow screens the coin would clip, so we increase FOV and push
 * the camera back slightly to keep the full coin visible.
 */
function getResponsiveCameraParams(w: number, h: number): { fov: number; y: number; z: number } {
  const aspect = w / h

  // Landscape on small screens (phone rotated): very short viewport
  if (aspect > 1.3 && h < 500) {
    return { fov: 38, y: 1.8, z: 7.5 }
  }

  if (aspect < 0.6) {
    // Very narrow portrait (e.g. 375x667 iPhone SE, 393x852 iPhone Pro)
    return { fov: 46, y: BASE_CAM_Y, z: 11.0 }
  }
  if (aspect < 0.85) {
    // Standard portrait phone
    return { fov: 42, y: BASE_CAM_Y, z: 10.0 }
  }
  if (aspect < 1.1) {
    // Square-ish or tablet portrait
    return { fov: 40, y: BASE_CAM_Y, z: 9.5 }
  }
  // Landscape / desktop
  return { fov: 36, y: BASE_CAM_Y, z: 8.2 }
}

/* ------------------------------------------------------------------ */
/*  PUBLIC - Scene factory                                            */
/* ------------------------------------------------------------------ */

export function createCoinScene(container: HTMLElement): ICoinScene {
  const w = container.clientWidth
  const h = container.clientHeight

  // Cap pixel ratio: 1.5 on mobile saves GPU, 2 on desktop is fine
  const maxDpr = w < 768 ? 1.5 : 2

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.3
  renderer.domElement.style.touchAction = 'none'
  container.appendChild(renderer.domElement)

  // Scene + env
  const scene = new THREE.Scene()
  scene.environment = createEnvMap()

  // Camera - responsive to viewport dimensions
  const camParams = getResponsiveCameraParams(w, h)
  const camera = new THREE.PerspectiveCamera(camParams.fov, w / h, 0.1, 100)
  camera.position.set(0, camParams.y, camParams.z)
  camera.lookAt(0, 0, 0)

  // Premium lighting - docs inspired
  const lights: Array<{
    type: string
    color: number
    intensity: number
    pos: [number, number, number]
  }> = [
    { type: 'dir', color: 0xfff5e6, intensity: 3.2, pos: [3, 5, 4] },
    { type: 'dir', color: 0xffc0d0, intensity: 1.4, pos: [-4, 2, -2] },
    { type: 'dir', color: 0xff2070, intensity: 2.2, pos: [0, -1, -5] },
    { type: 'dir', color: 0xffffff, intensity: 0.9, pos: [0, 8, 0] },
    { type: 'point', color: 0xff4080, intensity: 1.8, pos: [2, 3, 3] },
  ]
  lights.forEach(l => {
    const light =
      l.type === 'point'
        ? new THREE.PointLight(l.color, l.intensity, 20)
        : new THREE.DirectionalLight(l.color, l.intensity)
    light.position.set(...l.pos)
    scene.add(light)
  })
  scene.add(new THREE.AmbientLight(0x1a0510, 0.5))

  // Textures
  const faceTexture = createFaceTexture('#FD015A', '#0a0312')
  const normalMap = createNormalMap()
  const roughnessMap = createRoughnessMap()

  // Coin geometry constants - smooth crypto token style
  const RADIUS = 2
  const THICKNESS = 0.18
  const BEVEL = 0.04
  const SEGMENTS = w < 768 ? 32 : 64 // Fewer segments on mobile to reduce GPU load

  // Materials - dark titanium metal
  const edgeMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a30, // Dark titanium gray
    metalness: 0.98,
    roughness: 0.08,
    envMapIntensity: 2.5,
  })
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture,
    normalMap,
    normalScale: new THREE.Vector2(0.5, 0.5),
    roughnessMap,
    metalness: 0.93,
    roughness: 0.18,
    envMapIntensity: 2.0,
  })
  const backMat = faceMat.clone()

  // Barrel (smooth side with bevel only)
  const barrelGeo = createBarrelGeometry(RADIUS, THICKNESS, BEVEL, SEGMENTS)
  const barrelMesh = new THREE.Mesh(barrelGeo, edgeMat)

  // Premium faces with raised outer ring
  const RING_WIDTH = (RADIUS - BEVEL) * 0.15 // Ring is 15% of face radius
  const RING_HEIGHT = 0.02 // Subtle elevation

  const topGeo = createPremiumFaceGeometry(
    RADIUS - BEVEL,
    256,
    RING_WIDTH,
    RING_HEIGHT,
    THICKNESS / 2,
    -Math.PI / 2
  )
  const topMesh = new THREE.Mesh(topGeo, faceMat)

  const bottomGeo = createPremiumFaceGeometry(
    RADIUS - BEVEL,
    256,
    RING_WIDTH,
    RING_HEIGHT,
    -THICKNESS / 2,
    Math.PI / 2
  )
  const bottomMesh = new THREE.Mesh(bottomGeo, backMat)

  // Assemble coin
  const coin = new THREE.Group()
  coin.add(barrelMesh, topMesh, bottomMesh)
  coin.rotation.x = -0.55
  coin.rotation.z = 0.15
  scene.add(coin)

  // Rotation state
  const RESUME_DELAY = 1500
  const BLEND_DURATION = 500
  const ROTATION_SPEED = 0.15 // Slower auto-rotation
  const MOMENTUM_DECAY = 0.97 // Slow decay for visible but gentle momentum

  let paused = false
  let resumeTimer: ReturnType<typeof setTimeout> | null = null
  let blendStart = 0
  let blending = false
  let blendAlpha = 1
  let momentumVelocityX = 0 // Vertical rotation (rotation.x)
  let momentumVelocityY = 0 // Horizontal rotation (rotation.y)
  let hasMomentum = false

  const timer = new THREE.Timer()
  let animId = 0
  let isVisible = !document.hidden

  const onVisibilityChange = (): void => {
    isVisible = !document.hidden
    if (isVisible && !animId) animate()
  }
  document.addEventListener('visibilitychange', onVisibilityChange)

  const animate = (): void => {
    if (!isVisible) {
      animId = 0
      return
    }
    animId = requestAnimationFrame(animate)
    timer.update()
    const delta = timer.getDelta()
    const t = timer.getElapsed()

    // Blend alpha ramp-up after resume
    if (blending) {
      const elapsed = performance.now() - blendStart
      blendAlpha = Math.min(elapsed / BLEND_DURATION, 1)
      if (blendAlpha >= 1) blending = false
    }

    // Momentum physics (both axes)
    if (hasMomentum) {
      coin.rotation.x += momentumVelocityX
      coin.rotation.y += momentumVelocityY
      momentumVelocityX *= MOMENTUM_DECAY
      momentumVelocityY *= MOMENTUM_DECAY
      // Stop momentum when both velocities are negligible
      if (Math.abs(momentumVelocityX) < 0.0001 && Math.abs(momentumVelocityY) < 0.0001) {
        hasMomentum = false
        momentumVelocityX = 0
        momentumVelocityY = 0
        // Resume auto-rotate after momentum stops
        resumeAutoRotate()
      }
    }
    // Auto-rotate (horizontal Y axis)
    else if (!paused) {
      coin.rotation.y += delta * ROTATION_SPEED * blendAlpha
    }

    // Subtle float independent of rotation state
    coin.position.y = Math.sin(t * 0.7) * 0.05

    renderer.render(scene, camera)
  }
  animate()

  // Resize - also adjusts camera for orientation changes on mobile
  const onResize = (): void => {
    const nw = container.clientWidth
    const nh = container.clientHeight
    const newParams = getResponsiveCameraParams(nw, nh)

    camera.fov = newParams.fov
    camera.aspect = nw / nh
    camera.position.set(0, newParams.y, newParams.z)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()

    // Re-evaluate DPR cap on resize (tablet/desktop may switch)
    const newMaxDpr = nw < 768 ? 1.5 : 2
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, newMaxDpr))
    renderer.setSize(nw, nh)
  }
  window.addEventListener('resize', onResize)

  function pauseAutoRotate() {
    paused = true
    hasMomentum = false
    momentumVelocityX = 0
    momentumVelocityY = 0
    blendAlpha = 0
    blending = false
    if (resumeTimer) clearTimeout(resumeTimer)
    resumeTimer = null
  }

  function resumeAutoRotate() {
    if (resumeTimer) clearTimeout(resumeTimer)
    resumeTimer = setTimeout(() => {
      paused = false
      blending = true
      blendStart = performance.now()
    }, RESUME_DELAY)
  }

  return {
    renderer,
    scene,
    camera,

    getRotation(): ICoinRotation {
      return { x: coin.rotation.x, y: coin.rotation.y }
    },

    setRotation(x: number, y: number) {
      coin.rotation.x = x
      coin.rotation.y = y
    },

    pauseAutoRotate,
    resumeAutoRotate,

    applyMomentum(velocityX: number, velocityY: number) {
      momentumVelocityX = velocityX // Vertical rotation (rotation.x)
      momentumVelocityY = velocityY // Horizontal rotation (rotation.y)
      hasMomentum = true
      paused = true
      if (resumeTimer) clearTimeout(resumeTimer)
      resumeTimer = null
    },

    dispose() {
      cancelAnimationFrame(animId)
      animId = 0
      if (resumeTimer) clearTimeout(resumeTimer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('resize', onResize)

      // Dispose textures
      faceTexture.dispose()
      normalMap.dispose()
      roughnessMap.dispose()
      if (scene.environment) {
        scene.environment.dispose()
        scene.environment = null
      }

      // Dispose geometries
      barrelGeo.dispose()
      topGeo.dispose()
      bottomGeo.dispose()

      // Dispose materials
      edgeMat.dispose()
      faceMat.dispose()
      backMat.dispose()

      // Release canvas memory
      canvases.forEach(c => {
        c.width = 0
        c.height = 0
      })
      canvases.length = 0

      renderer.domElement.remove()
      renderer.dispose()
    },
  }
}
