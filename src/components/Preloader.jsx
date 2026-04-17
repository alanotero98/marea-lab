import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Preloader.css'

// Logo from public/ — swap path here if needed
const LOGO_SRC = '/images/MAREA%20LOGO-02.png'

/**
 * Preloader — full-screen overlay with animated logo.
 *
 * Flow:
 *   1. Logo starts dark (~#444) via brightness(0.27)
 *   2. GSAP brightens it to white over ~3.2s (ease-in-out)
 *   3. Short pause, then overlay slides up + fades out (~0.7s)
 *   4. onComplete() fires → parent unmounts this component
 *
 * Props:
 *   onComplete  — called when exit animation finishes
 */
export default function Preloader({ onComplete }) {
  const overlayRef = useRef(null)
  const logoRef    = useRef(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const logoEl  = logoRef.current
    if (!overlay || !logoEl) return

    document.body.style.overflow = 'hidden'

    gsap.set(logoEl,  { filter: 'brightness(0.27)' })
    gsap.set(overlay, { opacity: 1, y: 0 })

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        onComplete?.()
      },
    })

    tl.to(logoEl, {
      filter:   'brightness(1)',
      duration: 3.2,
      ease:     'power2.inOut',
    })

    .to({}, { duration: 0.25 })

    .to(overlay, {
      opacity:  0,
      y:        '-100%',
      duration: 0.75,
      ease:     'power3.inOut',
    })

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={overlayRef} className="preloader" aria-hidden="true">
      <img
        ref={logoRef}
        src={LOGO_SRC}
        alt=""
        className="preloader__logo"
        draggable={false}
      />
    </div>
  )
}
