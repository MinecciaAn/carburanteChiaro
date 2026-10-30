import { useCallback, useEffect, useState } from "react";
import translations, { SUPPORTED_LANGUAGES } from "../data/translations.js";

const LANGUAGE_STORAGE_KEY = "carburante-chiaro-lingua";
const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(({ code }) => code);

function detectSystemLanguage() {
  const preferences = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const preference of preferences) {
    const languageCode = preference.split("-")[0].toLowerCase();
    if (LANGUAGE_CODES.includes(languageCode)) return languageCode;
  }

  return "it";
}

function loadLanguagePreference() {
  try {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === "system" || LANGUAGE_CODES.includes(savedLanguage)) {
      return { languagePreference: savedLanguage, languageError: "" };
    }
    return { languagePreference: "system", languageError: "" };
  } catch (error) {
    console.error("Impossibile leggere la preferenza della lingua.", error);
    return { languagePreference: "system", languageError: "languageLoadError" };
  }
}

function useLanguage() {
  const [savedPreference] = useState(loadLanguagePreference);
  const [languagePreference, setLanguagePreference] = useState(
    savedPreference.languagePreference,
  );
  const [systemLanguage, setSystemLanguage] = useState(detectSystemLanguage);
  const [languageError, setLanguageError] = useState(
    savedPreference.languageError,
  );
  const language =
    languagePreference === "system" ? systemLanguage : languagePreference;
  const languageDetails = SUPPORTED_LANGUAGES.find(
    (item) => item.code === language,
  );
  const locale = languageDetails.locale;

  useEffect(() => {
    function updateSystemLanguage() {
      setSystemLanguage(detectSystemLanguage());
    }

    window.addEventListener("languagechange", updateSystemLanguage);
    return () =>
      window.removeEventListener("languagechange", updateSystemLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = translations[language].pageTitle;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", translations[language].pageDescription);
  }, [language]);

  const t = useCallback(
    (key, values = {}) => {
      const template = translations[language][key] ?? translations.it[key] ?? key;
      return template.replace(/\{(\w+)\}/g, (match, name) =>
        Object.hasOwn(values, name) ? String(values[name]) : match,
      );
    },
    [language],
  );

  function changeLanguage(nextLanguage) {
    if (
      nextLanguage !== "system" &&
      !LANGUAGE_CODES.includes(nextLanguage)
    ) {
      return;
    }

    setLanguagePreference(nextLanguage);
    setLanguageError("");
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (error) {
      console.error("Impossibile salvare la preferenza della lingua.", error);
      setLanguageError("languageSaveError");
    }
  }

  return {
    language,
    languageError,
    languagePreference,
    locale,
    setLanguage: changeLanguage,
    t,
  };
}

export default useLanguage;
