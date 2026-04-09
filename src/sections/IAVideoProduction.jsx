import IAProductionSlider from "../components/IAProductionSlider";
import "../components/IAProductionSlider.css";

export default function IAProductionSection() {
  return (
    <section className="ia-production">
      <div className="ia-production__container">
        <div className="ia-production__top">
          <div className="ia-production__title">
            <span className="ia-production__line ia-production__line--black">
              IA
            </span>
            <span className="ia-production__line ia-production__line--orange">
              VIDEO
            </span>
            <span className="ia-production__line ia-production__line--small">
              PRODUCTION
            </span>
          </div>

          <div className="ia-production__copy">
            <p>
              Next-generation video content powered by AI, blending creativity
              and technology to produce scalable, high-impact visuals.
            </p>
          </div>
        </div>

        <IAProductionSlider />
      </div>
    </section>
  );
}