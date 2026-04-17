import StackCarousel from '../components/StackCarrousel'
import './CreativeDirectionSection.css'

// Datos de las cards
const creativeCards = [
  {
    id: 'cd-1',
    image: '/images/creative-direction/creative-direction/1.jpg',
    alt: 'Creative Direction 1',
  },
  {
    id: 'cd-2',
    image: '/images/creative-direction/creative-direction/2.jpg',
    alt: 'Creative Direction 2',
  },
  {
    id: 'cd-3',
    image: '/images/creative-direction/creative-direction/3.jpg',
    alt: 'Creative Direction 3',
  },
  {
    id: 'cd-4',
    image: '/images/creative-direction/creative-direction/4.jpg',
    alt: 'Creative Direction 4',
  },
  {
    id: 'cd-5',
    image: '/images/creative-direction/creative-direction/5.jpg',
    alt: 'Creative Direction 5',
  },
 
]

export default function CreativeDirectionSection() {
  return (
    <section className="cd-section">
      <div className="lava-glow" aria-hidden="true" />
      <div className="lava-vignette" aria-hidden="true" />
      <h2 className="cd-title">
        <span className="cd-title__white">CREATIVE</span>
        <span className="cd-title__orange">DIRECTION</span>
      </h2>

      <div className="cd-body">
        {/* StackCarousel para las imágenes */}
        <div className="cd-carousel-wrapper">
          <StackCarousel 
            cards={creativeCards}
            autoplayInterval={2400}  // Mismo intervalo que el original
          />
        </div>

        {/* Texto de descripción */}
        <p className="cd-copy">
          We shape and lead creative vision across launches, live experiences,
          and artistic installations. From concept to execution, we craft
          cohesive narratives that translate into impactful concerts, immersive
          environments, and sculptural expressions — where branding, motion,
          and space come together to create unforgettable moments.
        </p>
      </div>
    </section>
  )
}