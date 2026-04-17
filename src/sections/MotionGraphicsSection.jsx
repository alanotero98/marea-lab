import './MotionGraphicsSection.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const motionCards = [
  { id: 'motion-1' },
  { id: 'motion-2' },
  { id: 'motion-3' },
  { id: 'motion-4' },
  { id: 'motion-5' },
]

// Aplica el efecto panorámico: cada slide rota en Y según su distancia al centro.
// En mobile usamos menos rotación (15°) para que las cards de los costados
// se vean como cards reales y no como finas líneas.
// PATRÓN REUTILIZABLE: pasar esta función a cualquier sección con Swiper panorámico.
function applyPanorama(swiper) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const deg = isMobile ? 15 : 38
  swiper.slides.forEach((slide) => {
    const progress = slide.progress
    const rotateY  = deg * progress
    const opacity  = 1 - Math.abs(progress) * (isMobile ? 0.15 : 0.25)
    slide.style.transform = `rotateY(${rotateY}deg)`
    slide.style.opacity   = Math.max(opacity, 0.4)
  })
}

export default function MotionGraphicsSection() {
  return (
    <section className="motion-graphics">
      <div className="motion-graphics__intro">
        <h2 className="motion-graphics__title">
          <span className="motion-graphics__title-black">MOTION</span>
          <span className="motion-graphics__title-orange">GRAPHICS</span>
        </h2>
        <p className="motion-graphics__copy">
          Dynamic visuals and animations designed
          <br />
          to capture attention and elevate brand
          <br />
          storytelling
        </p>
      </div>

      <div className="motion-graphics__carousel-wrap">
        <Swiper
          className="motion-graphics__swiper"
          modules={[Autoplay]}
          slidesPerView="auto"
          centeredSlides
          spaceBetween={74}
          breakpoints={{
            0:   { spaceBetween: 14 },
            769: { spaceBetween: 74 },
          }}
          loop
          speed={900}
          autoplay={{ delay: 2600, disableOnInteraction: false }}
          watchSlidesProgress
          onProgress={applyPanorama}
          onSetTranslate={applyPanorama}
          onInit={applyPanorama}
        >
          {motionCards.map((card) => (
            <SwiperSlide key={card.id} className="motion-graphics__slide">
              <article className="motion-graphics__card" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
