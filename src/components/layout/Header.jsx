import { FuelMark } from "../shared/icons.jsx";
import { SUPPORTED_LANGUAGES } from "../../data/translations.js";

function Header({
  languagePreference,
  onLanguageChange,
  onThemeChange,
  themePreference,
  t,
}) {
  return (
    <header className="topbar">
      <a
        className="brand-lockup"
        href="#inizio"
        aria-label={t("brandHome")}
      >
        <span className="brand-icon">
          <FuelMark />
        </span>
        <span className="brand-name">
          carburante<span>chiaro</span>
        </span>
      </a>
      <span className="local-badge">
        <span className="status-dot" aria-hidden="true" />
        {t("localData")}
      </span>
      <div className="header-controls">
        <label className="visually-hidden" htmlFor="language">
          {t("languageLabel")}
        </label>
        <span className="language-select-wrap">
          <select
            className="language-select"
            id="language"
            value={languagePreference}
            onChange={(event) => onLanguageChange(event.target.value)}
            aria-label={t("languageLabel")}
          >
            <option value="system">🌐 {t("languageSystem")}</option>
            {SUPPORTED_LANGUAGES.map(({ code, flag, name }) => (
              <option key={code} value={code}>
                {flag} {name}
              </option>
            ))}
          </select>
          <span className="language-select-arrow" aria-hidden="true" />
        </span>
        <div className="theme-control" role="group" aria-label={t("themeLabel")}>
          <button
            className="theme-option"
            type="button"
            aria-pressed={themePreference === "light"}
            onClick={() => onThemeChange("light")}
          >
            {t("themeLight")}
          </button>
          <button
            className="theme-option"
            type="button"
            aria-pressed={themePreference === "dark"}
            onClick={() => onThemeChange("dark")}
          >
            {t("themeDark")}
          </button>
          <button
            className="theme-option"
            type="button"
            aria-pressed={themePreference === "system"}
            onClick={() => onThemeChange("system")}
          >
            {t("themeSystem")}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
