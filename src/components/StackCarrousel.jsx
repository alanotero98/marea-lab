import { useEffect, useRef, useState, useCallback } from 'react'
import './StackCarrousel.css'

export default function StackCarousel({ cards = [], autoplayInterval = 2400 }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const timerRef = useRef(null)
  const total = cards.length

  const next = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % total)
  }, [total])

  const goTo = useCallback((i) => {
    setActiveIndex(i)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, autoplayInterval)
  }, [next, autoplayInterval])

  useEffect(() => {
    timerRef.current = setInterval(next, autoplayInterval)
    return () => clearInterval(timerRef.current)
  }, [next, autoplayInterval])

  // offset 0 = front card, 1 = second, 2 = third (peeking below)
  const STACK_CONFIG = [
    { translateY: 0,  scale: 1,     opacity: 1,    zIndex: 10 },
    { translateY: 28, scale: 0.94,  opacity: 0.55, zIndex: 9  },
    { translateY: 50, scale: 0.88,  opacity: 0.30, zIndex: 8  },
  ]

  return (
    <div className="stack-carousel">
      <div className="stack-carousel__container">
        {cards.map((card, i) => {
          const offset = (i - activeIndex + total) % total
          const config = STACK_CONFIG[offset] ?? null
          if (!config) return null

          return (
            <article
              key={card.id}
              className={`stack-carousel__card ${offset === 0 ? 'is-active' : ''}`}
              style={{
                zIndex: config.zIndex,
                transform: `translateY(${config.translateY}px) scale(${config.scale})`,
                opacity: config.opacity,
                pointerEvents: offset === 0 ? 'auto' : 'none',
              }}
              onClick={offset === 0 ? next : undefined}
            >
              {card.image && (
                <img
                  src={card.image}
                  alt={card.alt || ''}
                  className="stack-carousel__img"
                />
              )}
            </article>
          )
        })}
      </div>

      <div className="stack-carousel__indicators">
        {cards.map((card, i) => (
          <button
            key={card.id}
            className={`stack-carousel__dot ${i === activeIndex ? 'is-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}