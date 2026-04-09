import './BrandingSection.css'
import squidImg from '../assets/squid.png'

export default function BrandingSection() {
  return (
    <section className="branding-section">
      <div className="branding-container">
        <h2 className="branding-title">
          <span className="branding-title-black">BRAND</span>
          <span className="branding-title-orange">ING</span>
        </h2>

        <div className="branding-top-row">
          <div className="branding-heading-copy">
            <h3>
              From the Depths
              <br />
              To the Surface
            </h3>
          </div>

          <div className="branding-body-copy">
            <p>
              Marea is a branding and interactive design agency that brings
              ideas to life through motion and digital experiences. We craft
              bold identities, immersive interfaces, and dynamic animations
              that connect brands with people and make a lasting impact.
            </p>
          </div>
        </div>

        <div className="branding-bottom-row">
          <div className="branding-vertical-wrap">
            <div className="branding-vertical-text">
              <span className="branding-vertical-black">FEATURED</span>
              <span className="branding-vertical-orange">WORK</span>
            </div>
          </div>

          <div className="branding-image-wrap">
            <div className="branding-image-glow" />
            <img
              src={squidImg}
              alt="Featured work"
              className="branding-image"
            />
           
          </div>
        </div>
      </div>
    </section>
  )
}