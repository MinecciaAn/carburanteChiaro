import { useMemo } from "react";
import { formatEuro } from "../../data/entries.js";
import { PinMark } from "../shared/icons.jsx";

function StatsGrid({ entries, locale, t }) {
  const averagePrice = useMemo(() => {
    if (!entries.length) return null;
    return entries.reduce((total, entry) => total + entry.price, 0) / entries.length;
  }, [entries]);

  const countryCount = useMemo(
    () =>
      new Set(entries.map((entry) => entry.country.toLocaleLowerCase(locale))).size,
    [entries, locale],
  );

  return (
    <section className="stats-grid" aria-label={t("statsLabel")}>
      <article className="stat-card stat-card-primary">
        <div className="stat-topline">
          <span className="stat-label">{t("averagePrice")}</span>
          <span className="stat-icon" aria-hidden="true">↗</span>
        </div>
        <p className="stat-value">
          {averagePrice === null ? "—" : formatEuro(averagePrice, locale)}
        </p>
        <p className="stat-footnote">
          {averagePrice === null
            ? t("firstEntryHint")
            : t("allEntriesHint")}
        </p>
      </article>
      <article className="stat-card">
        <div className="stat-topline">
          <span className="stat-label">{t("entries")}</span>
          <span className="stat-icon stat-icon-soft" aria-hidden="true">#</span>
        </div>
        <p className="stat-value">{entries.length}</p>
        <p className="stat-footnote">{t("savedPrices")}</p>
      </article>
      <article className="stat-card">
        <div className="stat-topline">
          <span className="stat-label">{t("countries")}</span>
          <span className="stat-icon stat-icon-soft" aria-hidden="true">
            <PinMark />
          </span>
        </div>
        <p className="stat-value">{countryCount}</p>
        <p className="stat-footnote">{t("fuelCountries")}</p>
      </article>
    </section>
  );
}

export default StatsGrid;
