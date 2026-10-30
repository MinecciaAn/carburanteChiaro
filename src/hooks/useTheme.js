import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "carburante-chiaro-tema";
const THEME_OPTIONS = ["light", "dark", "system"];
const THEME_COLORS = {
  light: "#f5f6f2",
  dark: "#111a15",
};

function loadThemePreference() {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return {
      themePreference: THEME_OPTIONS.includes(savedTheme) ? savedTheme : "system",
      themeError: "",
    };
  } catch (error) {
    console.error("Impossibile leggere la preferenza del tema.", error);
    return { themePreference: "system", themeError: "themeLoadError" };
  }
}

function useTheme() {
  const [savedPreference] = useState(loadThemePreference);
  const [themePreference, setThemePreferenceState] = useState(
    savedPreference.themePreference,
  );
  const [systemTheme, setSystemTheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );
  const [themeError, setThemeError] = useState(savedPreference.themeError);
  const activeTheme =
    themePreference === "system" ? systemTheme : themePreference;

  useEffect(() => {
    const systemPreference = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );
    const updateSystemTheme = () => {
      setSystemTheme(systemPreference.matches ? "dark" : "light");
    };

    updateSystemTheme();
    systemPreference.addEventListener("change", updateSystemTheme);
    return () =>
      systemPreference.removeEventListener("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = activeTheme;
    document.documentElement.style.colorScheme = activeTheme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[activeTheme]);
  }, [activeTheme]);

  function setThemePreference(theme) {
    setThemePreferenceState(theme);
    setThemeError("");
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Impossibile salvare la preferenza del tema.", error);
      setThemeError("themeSaveError");
    }
  }

  return { activeTheme, themeError, themePreference, setThemePreference };
}

export default useTheme;
