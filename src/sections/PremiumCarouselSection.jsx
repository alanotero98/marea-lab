import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './PremiumCarouselSection.css'

export const mockCarouselCards = [
  { id: 'talux',     image: '/images/talux-card.png', featured: true },
  { id: 'Boronitas', image: '/images/Boronitas.png' },
  { id: 'goldberry', image: '/images/goldberry.png' },
  { id: 'Martinez',  image: '/images/Martinez.png' },
  { id: 'tempore',   image: '/images/tempora.png' },
  { id: 'bluepage',  image: '/images/bluepage.png' },
]

const talux = Array.from({ length: 34 }, (_, i) =>
  `/images/TALUX/985e9f27-e5c4-43b2-b813-84f03b5dbacc-${String(i + 1).padStart(2, '0')}.png`
)

const boronitas = Array.from({ length: 21 }, (_, i) =>
  `/images/BORONITAS/BORONITAS%20PORTAFOLIO%201/${i + 1}.png`
)

const goldberry = Array.from({ length: 46 }, (_, i) =>
  `/images/GOLDBERRY%20-20260416T180327Z-3-001/GOLDBERRY/${i + 1}.png`
)

// Files present: 1-28, 30-33
const tempore = [
  ...Array.from({ length: 28 }, (_, i) => `/images/TEMPORE-20260416T180411Z-3-001/TEMPORE/${i + 1}.png`),
  ...Array.from({ length: 4 },  (_, i) => `/images/TEMPORE-20260416T180411Z-3-001/TEMPORE/${30 + i}.png`),
]

// Files present: 1-16, 18-20
const bluepage = [
  ...Array.from({ length: 16 }, (_, i) => `/images/blupage-20260416T180357Z-3-001/blupage/${i + 1}.png`),
  '/images/blupage-20260416T180357Z-3-001/blupage/18.png',
  '/images/blupage-20260416T180357Z-3-001/blupage/19.png',
  '/images/blupage-20260416T180357Z-3-001/blupage/20.png',
]

// Files present: 1-15, 17, 19
const martinez = [
  ...Array.from({ length: 15 }, (_, i) => `/images/martinez-20260416T180341Z-3-001/martinez/${i + 1}.png`),
  '/images/martinez-20260416T180341Z-3-001/martinez/17.png',
  '/images/martinez-20260416T180341Z-3-001/martinez/19.png',
]

const projectImages = {
  talux:     talux,
  Boronitas: boronitas,
  goldberry: goldberry,
  tempore:   tempore,
  bluepage:  bluepage,
  Martinez:  martinez,
}

// ── Card ──────────────────────────────────────────────────

function Card({ card, cardWidth, featured = false, onClick }) {
  return (
    <article
      className={`premium-carousel__card ${featured ? 'is-featured' : ''}`}
      style={{ width: `${cardWidth}px` }}
      onClick={() => onClick(card)}
    >
      {card.image ? (
        <>
          <img src={card.image} alt={card.id} className="premium-carousel__image" />
          <div className="premium-carousel__overlay" />
        </>
      ) : null}
    </article>
  )
}

// ── Modal ─────────────────────────────────────────────────

function Modal({ card, onClose }) {
  const images = projectImages[card.id] ?? [card.image]
  const [index, setIndex]       = useState(0)
  const [prevIndex, setPrevIndex] = useState(null)
  const [direction, setDirection] = useState('next')
  const [busy, setBusy]          = useState(false)

  const indexRef = useRef(0)
  const touchStartX = useRef(null)

  const realGo = useCallback((dir) => {
    if (busy) return
    setBusy(true)
    setDirection(dir)
    setPrevIndex(indexRef.current)
    const next = dir === 'next'
      ? (indexRef.current + 1) % images.length
      : (indexRef.current - 1 + images.length) % images.length
    indexRef.current = next
    setIndex(next)
  }, [busy, images.length])

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) realGo(delta > 0 ? 'next' : 'prev')
    touchStartX.current = null
  }, [realGo])

  const handleExitEnd = useCallback(() => {
    setPrevIndex(null)
    setBusy(false)
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight') realGo('next')
      if (e.key === 'ArrowLeft')  realGo('prev')
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose, realGo])

  return (
    <div className="carousel-modal__backdrop" onClick={onClose}>
      <div className="carousel-modal" onClick={(e) => e.stopPropagation()}>

        <div className="carousel-modal__header">
          <h2 className="carousel-modal__title">{card.id}</h2>
          <span className="carousel-modal__counter">{index + 1} / {images.length}</span>
          <button className="carousel-modal__close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="carousel-modal__viewer">
          <button
            className="carousel-modal__arrow carousel-modal__arrow--prev"
            onClick={() => realGo('prev')}
            aria-label="Anterior"
          >
            ‹
          </button>

          <div className="carousel-modal__img-wrap" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {/* Imagen que sale — se anima hacia afuera */}
            {prevIndex !== null && (
              <img
                src={images[prevIndex]}
                alt=""
                aria-hidden="true"
                className={`carousel-modal__img carousel-modal__img--exit-${direction}`}
                onAnimationEnd={handleExitEnd}
              />
            )}
            {/* Imagen que entra — se anima desde afuera */}
            <img
              src={images[index]}
              alt={`${card.id} ${index + 1}`}
              className={`carousel-modal__img carousel-modal__img--enter-${direction}`}
            />
          </div>

          <button
            className="carousel-modal__arrow carousel-modal__arrow--next"
            onClick={() => realGo('next')}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>

      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────

export default function PremiumCarouselSection() {
  const stageRef = useRef(null)
  const [sharedCardWidth, setSharedCardWidth] = useState(220)
  const [selectedCard, setSelectedCard] = useState(null)

  useEffect(() => {
    if (!stageRef.current) return

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      const isDesktop = window.matchMedia('(min-width: 769px)').matches
      if (isDesktop) {
        setSharedCardWidth(554)
        return
      }
      const nextWidth = width - 32
      setSharedCardWidth(Math.max(nextWidth, 120))
    })

    observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [])

  const loopedCards = useMemo(() => [...mockCarouselCards, ...mockCarouselCards], [])

  const handleCardClick = useCallback((card) => setSelectedCard(card), [])
  const handleClose = useCallback(() => setSelectedCard(null), [])

  return (
    <section className="premium-carousel">
      <div className="premium-carousel__fade" aria-hidden="true" />

      <div
        ref={stageRef}
        className="premium-carousel__stage"
        style={{ '--shared-card-width': `${sharedCardWidth}px` }}
      >
        <div className="premium-carousel__lane premium-carousel__lane--top">
          <div className="premium-carousel__track">
            {loopedCards.map((card, index) => (
              <Card
                key={`top-${card.id}-${index}`}
                card={card}
                cardWidth={sharedCardWidth}
                featured={card.featured}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </div>

        <div className="premium-carousel__lane premium-carousel__lane--bottom">
          <div className="premium-carousel__track premium-carousel__track--reverse">
            {loopedCards.map((card, index) => (
              <Card
                key={`bot-${card.id}-${index}`}
                card={card}
                cardWidth={sharedCardWidth}
                featured={card.featured}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedCard && <Modal card={selectedCard} onClose={handleClose} />}
    </section>
  )
}
