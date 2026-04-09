import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";

export default function IAProductionSlider() {
  const slides = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

  return (
    <div className="ia-production__slider-wrap">
      <div className="ia-production__slider">
        <Swiper
          className="ia-production-swiper"
          modules={[Navigation, Pagination]}
          slidesPerView={2}
          spaceBetween={20}
          speed={700}
          navigation={{
            prevEl: '.ia-slider-btn--prev',
            nextEl: '.ia-slider-btn--next',
          }}
          pagination={{ el: '.ia-slider-dots', clickable: true }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="ia-production__slide-card" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="ia-slider-controls">
        <button className="ia-slider-btn ia-slider-btn--prev" aria-label="Anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="ia-slider-dots" />
        <button className="ia-slider-btn ia-slider-btn--next" aria-label="Siguiente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
