import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import FishScene from '../components/FishScene'

// ─── Estados ──────────────────────────────────────────────────────────────────
// 'heroIdle'       – hero visible, scroll bloqueado, esperando scroll abajo
// 'heroPlaying'    – animación del pez corriendo hacia adelante
// 'toBranding'     – BrandingSection subiendo al viewport
// 'brandingActive' – BrandingSection protagonista, scroll libre
// 'toHero'         – BrandingSection bajando, pez revirtiendo

export default function HeroSection() {
  const fishTlRef          = useRef(null)
  const phaseRef           = useRef('heroIdle')
  const delayCallRef       = useRef(null)
  // Timestamp (ms) hasta el cual triggerForward está bloqueado.
  // performance.now() + 700ms después del reverse → inmune al momentum de trackpad.
  // Un boolean es insuficiente: el momentum genera muchos eventos; el primero
  // consume el boolean y el segundo dispara la animación sin gesto real.
  const forwardLockedUntil = useRef(0)

  // ── helpers ────────────────────────────────────────────────────────────────

  function isLocked() {
    const p = phaseRef.current
    return p === 'heroIdle' || p === 'heroPlaying' || p === 'toBranding' || p === 'toHero'
  }

  function setPhase(next) {
    phaseRef.current = next
    document.body.style.overflow = isLocked() ? 'hidden' : ''
  }

  // ── FORWARD: heroIdle → heroPlaying → toBranding → brandingActive ──────────

  function triggerForward() {
    if (phaseRef.current !== 'heroIdle') return
    // Guardia temporal: bloquea durante 700ms post-reverse sin depender de
    // conteo de eventos. Cubre cualquier ráfaga de momentum de trackpad.
    if (performance.now() < forwardLockedUntil.current) return

    const tl = fishTlRef.current
    if (!tl || tl.isActive()) return

    setPhase('heroPlaying')

    tl.eventCallback('onComplete',        handleFishComplete)
    tl.eventCallback('onReverseComplete', null)
    tl.timeScale(1)

    const fade = document.querySelector('.hero__mouth-fade')
    if (fade) gsap.set(fade, { opacity: 0 })

    tl.seek(0, true)
    tl.play()
  }

  function handleFishComplete() {
    if (phaseRef.current !== 'heroPlaying') return
    setPhase('toBranding')

    const branding = document.querySelector('.branding-section')
    const navbar   = document.querySelector('.main-nav')
    const hero     = document.querySelector('.hero')
    if (!branding || !hero) return

    gsap.killTweensOf(navbar)
    gsap.killTweensOf(branding)

    if (navbar) gsap.to(navbar, { yPercent: -100, duration: 0.4, ease: 'power2.in' })

    gsap.set(branding, { position: 'fixed', top: '100vh', left: 0, right: 0, zIndex: 50 })
    gsap.to(branding, {
      top:      0,
      duration: 1.0,
      ease:     'power3.inOut',
      onComplete: () => {
        window.scrollTo({ top: hero.offsetHeight, behavior: 'instant' })
        gsap.set(branding, { clearProps: 'position,top,left,right,zIndex' })
        setPhase('brandingActive')
      },
    })
  }

  // ── REVERSE: brandingActive → toHero → heroIdle ───────────────────────────

  function triggerReverse() {
    if (phaseRef.current !== 'brandingActive') return

    const tl = fishTlRef.current
    // Guard: si el timeline está activo (ya revirtiendo por alguna razón), no re-disparar.
    if (!tl || tl.isActive()) return

    setPhase('toHero')

    const branding = document.querySelector('.branding-section')
    const hero     = document.querySelector('.hero')
    if (!branding || !hero) return

    gsap.killTweensOf(branding)

    // Fija branding cubriendo el viewport ANTES del scroll jump — el usuario
    // no ve nada detrás durante el reposicionamiento.
    gsap.set(branding, { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 })
    window.scrollTo({ top: 0, behavior: 'instant' })
    gsap.to(branding, { top: '100vh', duration: 1.0, ease: 'power3.inOut' })

    tl.eventCallback('onReverseComplete', handleFishReverseComplete)
    tl.eventCallback('onComplete',        null)

    // Reset explícito de timeScale ANTES del delay — evita que un ciclo
    // interrumpido deje timeScale elevado y acumule velocidad entre ciclos.
    tl.timeScale(1)

    delayCallRef.current?.kill()
    delayCallRef.current = gsap.delayedCall(0.2, () => {
      if (phaseRef.current !== 'toHero') return
      tl.timeScale(1.2)   // levemente más rápido que forward, pero sin saturar
      tl.reverse()
    })
  }

  function handleFishReverseComplete() {
    if (phaseRef.current !== 'toHero') return

    delayCallRef.current?.kill()
    delayCallRef.current = null

    const branding = document.querySelector('.branding-section')
    const navbar   = document.querySelector('.main-nav')
    const tl       = fishTlRef.current

    if (tl) {
      tl.eventCallback('onReverseComplete', null)
      tl.timeScale(1)
      tl.seek(0, true)
    }

    gsap.killTweensOf(navbar)
    gsap.killTweensOf(branding)

    if (branding) gsap.set(branding, { clearProps: 'position,top,left,right,zIndex' })
    if (navbar)   gsap.to(navbar, { yPercent: 0, duration: 0.4, ease: 'power2.out' })

    // Bloquea triggerForward durante 700ms — cubre toda ráfaga de momentum
    // del trackpad sin depender del conteo de eventos individuales.
    forwardLockedUntil.current = performance.now() + 700

    setPhase('heroIdle')
  }

  // ── Listeners permanentes, filtrados por fase ─────────────────────────────

  useEffect(() => {
    setPhase('heroIdle')

    const onWheel = (e) => {
      if (e.deltaY > 0 && phaseRef.current === 'heroIdle') {
        triggerForward()
        return
      }
      if (e.deltaY < 0 && phaseRef.current === 'brandingActive') {
        const hero = document.querySelector('.hero')
        if (window.scrollY <= (hero?.offsetHeight ?? 0) + 80) triggerReverse()
      }
    }

    const onKey = (e) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key) && phaseRef.current === 'heroIdle') {
        e.preventDefault()
        forwardLockedUntil.current = 0  // teclado siempre es deliberado
        triggerForward()
        return
      }
      if (e.key === 'ArrowUp' && phaseRef.current === 'brandingActive') {
        const hero = document.querySelector('.hero')
        if (window.scrollY <= (hero?.offsetHeight ?? 0) + 80) triggerReverse()
      }
    }

    let touchStartY = 0
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY }
    const onTouchEnd   = (e) => {
      const delta = touchStartY - e.changedTouches[0].clientY
      if (delta > 30 && phaseRef.current === 'heroIdle') {
        forwardLockedUntil.current = 0  // touch siempre es deliberado
        triggerForward()
        return
      }
      if (delta < -30 && phaseRef.current === 'brandingActive') {
        const hero = document.querySelector('.hero')
        if (window.scrollY <= (hero?.offsetHeight ?? 0) + 80) triggerReverse()
      }
    }

    const preventTouch = (e) => { if (isLocked()) e.preventDefault() }

    window.addEventListener('wheel',      onWheel,      { passive: true  })
    window.addEventListener('keydown',    onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true  })
    window.addEventListener('touchmove',  preventTouch, { passive: false })

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('keydown',    onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('touchmove',  preventTouch)
      delayCallRef.current?.kill()
      document.body.style.overflow = ''
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="hero">
      <div className="hero__sticky">
        <div className="hero__scene">
          <FishScene timelineRef={fishTlRef} />
        </div>
        <div className="hero__mouth-fade" />
      </div>
    </section>
  )
}
