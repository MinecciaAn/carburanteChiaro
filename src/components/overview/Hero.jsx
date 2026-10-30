import { FuelMark } from "../shared/icons.jsx";

function Hero({ t }) {
  return (
    <section className="hero" aria-labelledby="page-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-line" aria-hidden="true" />
          {t("heroKicker")}
        </p>
        <h1 id="page-title">
          {t("heroTitleFirst")}
          <br />
          <span>{t("heroTitleSecond")}</span>
        </h1>
        <p className="hero-description">
          {t("heroDescription")}
        </p>
      </div>
      <div className="hero-illustration" aria-hidden="true">
        <div className="sun-disc" />
        <div className="road road-back" />
        <div className="road road-front" />
        <div className="hero-station">
          <FuelMark />
        </div>
        <span className="hero-price">€ / L</span>
      </div>
    </section>
  );
}

export default Hero;
