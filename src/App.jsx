import { useState } from "react";
import EntryForm from "./components/entries/EntryForm.jsx";
import EntryHistory from "./components/entries/EntryHistory.jsx";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import Hero from "./components/overview/Hero.jsx";
import StatsGrid from "./components/overview/StatsGrid.jsx";
import useFuelEntries from "./hooks/useFuelEntries.js";
import useLanguage from "./hooks/useLanguage.js";
import useTheme from "./hooks/useTheme.js";

function App() {
  const [message, setMessage] = useState("");
  const {
    languageError,
    languagePreference,
    locale,
    setLanguage,
    t,
  } = useLanguage();
  const {
    entries,
    isLoaded,
    isSaving,
    storageError,
    storageLoadFailed,
    addEntry,
    deleteEntry,
  } = useFuelEntries(t, locale);
  const { themeError, themePreference, setThemePreference } = useTheme();

  async function handleSave(entry) {
    setMessage("");
    const successMessage = await addEntry(entry);
    if (!successMessage) return false;
    setMessage(successMessage);
    return true;
  }

  async function handleDelete(id) {
    setMessage("");
    const result = await deleteEntry(id);
    if (result.message) setMessage(result);
  }

  return (
    <div className="app-shell">
      <Header
        languagePreference={languagePreference}
        onLanguageChange={setLanguage}
        onThemeChange={setThemePreference}
        themePreference={themePreference}
        t={t}
      />
      <main id="inizio">
        <Hero t={t} />
        <StatsGrid entries={entries} locale={locale} t={t} />
        <div className="content-grid">
          <EntryForm
            disabled={!isLoaded || storageLoadFailed}
            isSaving={isSaving}
            locale={locale}
            onClearMessage={() => setMessage("")}
            onSave={handleSave}
            t={t}
          />
          <EntryHistory
            entries={entries}
            isLoaded={isLoaded}
            locale={locale}
            isSaving={isSaving}
            onDelete={handleDelete}
            t={t}
          />
        </div>
        {storageError ? (
          <p className="storage-alert" role="alert">
            {t(storageError)}
          </p>
        ) : (
          message && (
            <div className="sr-status" role="status" aria-live="polite">
              {t(message.message, message.values)}
            </div>
          )
        )}
      </main>
      {[themeError, languageError].filter(Boolean).map((error) => (
        <p className="storage-alert" role="alert" key={error}>
          {t(error)}
        </p>
      ))}
      <Footer t={t} />
    </div>
  );
}

export default App;
