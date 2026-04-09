import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'

useGLTF.preload('/models/blender-AnglerFish.glb')

// ─── Constants ───────────────────────────────────────────────────────────────

const MOUTH_ROT_Y = -0.20

const KF = [
  { posZ: -3,   scaleXYZ: 12,  posY: -0.5, swimAmp: 0.10, swimFreq: 1.8 },
  { posZ: -0.5, scaleXYZ: 20,  posY: -0.8, swimAmp: 0.32, swimFreq: 2.1 },
  { posZ:  1.5, scaleXYZ: 32,  posY: -2.0, swimAmp: 0.55, swimFreq: 2.6 },
  { posZ:  3.5, scaleXYZ: 95, posY: -2.0, swimAmp: 0.00, swimFreq: 2.6 },
]

// ─── FishModel ────────────────────────────────────────────────────────────────
// Responsabilidad única: modelo 3D + timeline GSAP.
// Los callbacks onComplete / onReverseComplete los asigna el padre dinámicamente
// vía tl.eventCallback() antes de cada play() / reverse(). No se pasan como props.

function FishModel({ onLoaded, timelineRef }) {
  const fishGroupRef      = useRef(null)
  const modelDirectionRef = useRef(null)
  const { scene }         = useGLTF('/models/blender-AnglerFish.glb')

  const baseRef    = useRef({ posY: KF[0].posY, posZ: KF[0].posZ, scaleXYZ: KF[0].scaleXYZ, swimAmp: KF[0].swimAmp, swimFreq: KF[0].swimFreq })
  const finBoneRef = useRef(null)

  useEffect(() => { onLoaded?.() }, [])

  useEffect(() => {
    if (!fishGroupRef.current || !modelDirectionRef.current) return

    const fish           = fishGroupRef.current
    const modelDirection = modelDirectionRef.current
    const fade           = document.querySelector('.hero__mouth-fade')
    const base           = baseRef.current

    scene.traverse((obj) => {
      if (obj.isBone && /fin|aleta/i.test(obj.name)) finBoneRef.current = obj
    })

    fish.position.set(0, base.posY, base.posZ)
    fish.rotation.set(0, MOUTH_ROT_Y, 0)
    fish.scale.setScalar(base.scaleXYZ)
    modelDirection.rotation.set(0, 0.20, 0)
    if (fade) gsap.set(fade, { opacity: 0 })

    // Timeline sin callbacks — el padre los asigna dinámicamente con eventCallback()
    const tl = gsap.timeline({ paused: true })

    tl.to(base, { posZ: KF[1].posZ, scaleXYZ: KF[1].scaleXYZ, posY: KF[1].posY, swimAmp: KF[1].swimAmp, swimFreq: KF[1].swimFreq, duration: 2.4, ease: 'power1.inOut' })
      .to(base, { posZ: KF[2].posZ, scaleXYZ: KF[2].scaleXYZ, posY: KF[2].posY, swimAmp: KF[2].swimAmp, swimFreq: KF[2].swimFreq, duration: 2.6, ease: 'power1.inOut' })
      .to(base, { posZ: KF[3].posZ, scaleXYZ: KF[3].scaleXYZ, posY: KF[3].posY, swimAmp: KF[3].swimAmp, swimFreq: KF[3].swimFreq, duration: 2.0, ease: 'power2.in'   })

    if (fade) {
      tl.to(fade, { opacity: 1, duration: 0.4, ease: 'power2.in' }, '>-0.20')
    }

    if (timelineRef) timelineRef.current = tl

    return () => { tl.kill() }
  }, [])

  useFrame(({ clock }) => {
    const fish = fishGroupRef.current
    if (!fish) return

    const t    = clock.getElapsedTime()
    const base = baseRef.current
    const f    = base.swimFreq

    fish.position.x = Math.sin(t * f) * base.swimAmp
    fish.position.y = base.posY + Math.sin(t * 0.7) * 0.04
    fish.position.z = base.posZ
    fish.rotation.y = MOUTH_ROT_Y + Math.sin(t * f - 0.3) * (base.swimAmp * 0.15)
    fish.rotation.z = Math.sin(t * f + 0.4) * (base.swimAmp * 0.18)
    fish.rotation.x = Math.sin(t * 0.9) * 0.012
    fish.scale.setScalar(base.scaleXYZ)

    if (finBoneRef.current) {
      finBoneRef.current.rotation.z = Math.sin(t * 3.0) * 0.08
    }
  })

  return (
    <group ref={fishGroupRef}>
      <group ref={modelDirectionRef}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function SceneContent({ onLoaded, timelineRef }) {
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 3, 4]} intensity={2.2} />
      <Suspense fallback={null}>
        <FishModel onLoaded={onLoaded} timelineRef={timelineRef} />
      </Suspense>
    </>
  )
}

// ─── FishScene ────────────────────────────────────────────────────────────────

export default function FishScene({ timelineRef }) {
  const [ready, setReady] = useState(false)

  return (
    <div className="fish-scene">

      <div
        style={{
          position:      'absolute',
          inset:         0,
          background:    '#000',
          zIndex:        10,
          transition:    'opacity 0.6s ease',
          opacity:       ready ? 0 : 1,
          pointerEvents: ready ? 'none' : 'all',
        }}
      />

      <div className="fish-scene__bg" />
      <div className="fish-scene__fog fish-scene__fog--one" />
      <div className="fish-scene__fog fish-scene__fog--two" />
      <div className="fish-scene__glow" />
      <div className="fish-scene__particles" />
      <div className="fish-scene__vignette" />

      <Canvas
        camera={{ position: [0, 0, 8], fov: 38 }}
        style={{ width: '100%', height: '100%', background: 'transparent', position: 'relative', zIndex: 3 }}
        dpr={[0.5]}
        gl={{ powerPreference: 'high-performance' }}
      >
        <SceneContent onLoaded={() => setReady(true)} timelineRef={timelineRef} />
      </Canvas>
    </div>
  )
}
