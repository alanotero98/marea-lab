import { useEffect, useMemo, useRef, useState } from 'react'
import './PremiumCarouselSection.css'

export const mockCarouselCards = [
  {
    id: 'talux',
    image: '/images/talux-card.png',
    featured: true,
  },
  {  id: 'talux',
    image: '/images/talux-card.png', },
  {  id: 'talux',
    image: '/images/talux-card.png', },
  {  id: 'talux',
    image: '/images/talux-card.png', },
  {  id: 'talux',
    image: '/images/talux-card.png', },
 {  id: 'talux',
    image: '/images/talux-card.png', },
  {  id: 'talux',
    image: '/images/talux-card.png', },
  {  id: 'talux',
    image: '/images/talux-card.png', },
]

function Card({ card, cardWidth, featured = false }) {
  return (
    <article className={`premium-carousel__card ${featured ? 'is-featured' : ''}`} style={{ width: `${cardWidth}px` }}>
      {card.image ? (
        <>
          <img src={card.image} alt="Talux project" className="premium-carousel__image" />
          <div className="premium-carousel__overlay" />
        </>
      ) : null}
    </article>
  )
}

export default function PremiumCarouselSection() {
  const stageRef = useRef(null)
  const [sharedCardWidth, setSharedCardWidth] = useState(220)

  useEffect(() => {
    if (!stageRef.current) return

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      const isDesktop = window.matchMedia('(min-width: 769px)').matches
      if (isDesktop) {
        setSharedCardWidth(554)
        return
      }

      const gap = 12
      const nextWidth = (width - gap * 2) / 3
      setSharedCardWidth(Math.max(nextWidth, 120))
    })

    observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [])

  const topCards = useMemo(
    () => [mockCarouselCards[1], mockCarouselCards[0], mockCarouselCards[2], mockCarouselCards[3], mockCarouselCards[4]],
    []
  )
  const bottomCards = useMemo(() => [mockCarouselCards[5], mockCarouselCards[6]], [])
  const loopedTopCards = useMemo(() => [...topCards, ...topCards], [topCards])

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
            {loopedTopCards.map((card, index) => (
              <Card key={`${card.id}-${index}`} card={card} cardWidth={sharedCardWidth} featured={card.featured} />
            ))}
          </div>
        </div>

        <div className="premium-carousel__lane premium-carousel__lane--bottom">
          <div className="premium-carousel__track premium-carousel__track--reverse">
          {loopedTopCards.map((card, index) => (
              <Card key={`${card.id}-${index}`} card={card} cardWidth={sharedCardWidth} featured={card.featured} />
            ))}  </div>
        </div>
      </div>
    </section>
  )
}
