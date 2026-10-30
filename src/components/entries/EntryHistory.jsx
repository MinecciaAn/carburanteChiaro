import { useMemo, useState } from "react";
import { formatDate, formatEuro } from "../../data/entries.js";
import EntryPhoto from "./EntryPhoto.jsx";
import { FuelMark, PinMark, TrashMark } from "../shared/icons.jsx";

function EntryHistory({ entries, isLoaded, isSaving, locale, onDelete, t }) {
  const [search, setSearch] = useState("");

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(locale);
    return [...entries]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter(
        (entry) =>
          !query ||
          entry.brand.toLocaleLowerCase(locale).includes(query) ||
          entry.country.toLocaleLowerCase(locale).includes(query),
      );
  }, [entries, locale, search]);

  return (
    <section className="panel history-panel" aria-labelledby="history-title">
      <div className="history-heading">
        <div>
          <p className="section-kicker">{t("historyKicker")}</p>
          <h2 id="history-title">{t("collectedPrices")}</h2>
        </div>
        {entries.length > 0 && (
          <span
            className="entry-count"
            aria-label={t("entriesCount", { count: entries.length })}
          >
            {entries.length.toString().padStart(2, "0")}
          </span>
        )}
      </div>

      {entries.length > 0 && (
        <div className="search-wrap">
          <label className="visually-hidden" htmlFor="search">
            {t("searchLabel")}
          </label>
          <span aria-hidden="true" className="search-icon">⌕</span>
          <input
            id="search"
            type="search"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button
              className="clear-search"
              type="button"
              onClick={() => setSearch("")}
              aria-label={t("clearSearch")}
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="entry-list" aria-live="polite">
        {!isLoaded ? (
          <div className="empty-state" role="status" aria-live="polite">
            <p>{t("loadingEntries")}</p>
          </div>
        ) : !entries.length ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">
              <FuelMark />
            </span>
            <h3>{t("emptyTitle")}</h3>
            <p>
              {t("emptyDescription")}
            </p>
          </div>
        ) : filteredEntries.length ? (
          filteredEntries.map((entry) => (
            <article className="entry-row" key={entry.id}>
              <div className="entry-logo" aria-hidden="true">
                {entry.brand.trim().charAt(0).toLocaleUpperCase(locale)}
              </div>
              <div className="entry-details">
                <h3>{entry.brand}</h3>
                <p>
                  <PinMark />
                  <span>{entry.country}</span>
                  <span className="entry-separator" aria-hidden="true">·</span>
                  <time dateTime={entry.date}>
                    {formatDate(new Date(entry.date), locale)}
                  </time>
                </p>
              </div>
              <div className="entry-price">
                <strong>{formatEuro(entry.price, locale)}</strong>
                <span>{t("perLiter")}</span>
              </div>
              <EntryPhoto entry={entry} t={t} />
              <button
                className="delete-button"
                type="button"
                onClick={() => onDelete(entry.id)}
                disabled={isSaving}
                aria-label={t("deleteEntry", {
                  brand: entry.brand,
                  country: entry.country,
                })}
              >
                <TrashMark />
              </button>
            </article>
          ))
        ) : (
          <div className="no-results">
            <p>{t("noSearchResults", { search })}</p>
            <button type="button" onClick={() => setSearch("")}>
              {t("showAllEntries")}
            </button>
          </div>
        )}
      </div>
      {entries.length > 0 && (
        <p className="history-footnote">
          {t("newestFirst")}
        </p>
      )}
    </section>
  );
}

export default EntryHistory;
