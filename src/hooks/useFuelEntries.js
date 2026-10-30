import { useCallback, useEffect, useState } from "react";
import { formatEuro, loadEntries, saveEntries } from "../data/entries.js";
import { removePhoto, savePhoto } from "../photoStorage.js";

function useFuelEntries(t, locale) {
  const [entries, setEntries] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [storageLoadFailed, setStorageLoadFailed] = useState(false);

  useEffect(() => {
    try {
      setEntries(loadEntries());
    } catch (error) {
      console.error("Impossibile leggere le rilevazioni salvate.", error);
      setStorageLoadFailed(true);
      setStorageError("loadError");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addEntry = useCallback(
    async ({ price, brand, country, photo }) => {
      if (!isLoaded || storageLoadFailed || isSaving) return null;

      const entry = {
        id: window.crypto.randomUUID(),
        price,
        brand,
        country,
        date: new Date().toISOString(),
        ...(photo ? { photoId: window.crypto.randomUUID() } : {}),
      };
      const nextEntries = [entry, ...entries];
      setIsSaving(true);
      let photoSaved = false;
      let cleanupFailed = false;
      try {
        if (photo) {
          await savePhoto(entry.photoId, photo);
          photoSaved = true;
        }
        saveEntries(nextEntries);
        setEntries(nextEntries);
        setStorageError("");
        return {
          message: "savedMessage",
          values: { price: formatEuro(price, locale), brand },
        };
      } catch (error) {
        console.error("Impossibile salvare la rilevazione.", error);
        if (photoSaved) {
          try {
            await removePhoto(entry.photoId);
          } catch (cleanupError) {
            console.error(
              "Impossibile rimuovere la foto non salvata.",
              cleanupError,
            );
            cleanupFailed = true;
          }
        }
        setStorageError(cleanupFailed ? "saveCleanupError" : "saveError");
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [entries, isLoaded, isSaving, locale, storageLoadFailed, t],
  );

  const deleteEntry = useCallback(
    async (id) => {
      const entry = entries.find((item) => item.id === id);
      const nextEntries = entries.filter((item) => item.id !== id);
      try {
        saveEntries(nextEntries);
        setEntries(nextEntries);
        setStorageError("");
      } catch (error) {
        console.error("Impossibile aggiornare le rilevazioni salvate.", error);
        setStorageError("removeError");
        return { message: "" };
      }

      if (entry?.photoId) {
        try {
          await removePhoto(entry.photoId);
        } catch (error) {
          console.error(
            "Impossibile rimuovere la foto della rilevazione.",
            error,
          );
          setStorageError("removePhotoError");
        }
      }

      return {
        message: entry ? "removedMessage" : "genericRemovedMessage",
        values: entry ? { brand: entry.brand } : {},
      };
    },
    [entries],
  );

  return {
    entries,
    isLoaded,
    isSaving,
    storageError,
    storageLoadFailed,
    addEntry,
    deleteEntry,
  };
}

export default useFuelEntries;
