export const STORAGE_KEY = "carburante-chiaro-rilevazioni";
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function formatEuro(price, locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(price);
}

export function formatDate(date, locale) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function readPrice(value) {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d{1,3}(?:\.\d{1,3})?$/.test(normalized)) {
    return null;
  }

  const price = Number(normalized);
  return Number.isFinite(price) && price > 0 ? price : null;
}

export function loadEntries() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  const parsed = JSON.parse(saved);
  if (!Array.isArray(parsed)) {
    throw new Error("I dati salvati non hanno il formato previsto.");
  }

  return parsed.filter(
    (entry) =>
      entry !== null &&
      typeof entry === "object" &&
      typeof entry.id === "string" &&
      typeof entry.brand === "string" &&
      entry.brand.trim().length > 0 &&
      typeof entry.country === "string" &&
      entry.country.trim().length > 0 &&
      typeof entry.price === "number" &&
      Number.isFinite(entry.price) &&
      entry.price > 0 &&
      typeof entry.date === "string" &&
      Number.isFinite(Date.parse(entry.date)) &&
      (entry.photoId === undefined || typeof entry.photoId === "string"),
  );
}

export function saveEntries(entries) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
