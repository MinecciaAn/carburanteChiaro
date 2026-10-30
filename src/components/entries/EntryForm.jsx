import { useEffect, useRef, useState } from "react";
import {
  MAX_PHOTO_SIZE,
  PHOTO_TYPES,
  readPrice,
} from "../../data/entries.js";
import { getCountryOptions } from "../../data/translations.js";
import { PinMark } from "../shared/icons.jsx";

function EntryForm({ disabled, isSaving, locale, onClearMessage, onSave, t }) {
  const [priceInput, setPriceInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [photoInput, setPhotoInput] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [formError, setFormError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const photoInputRef = useRef(null);
  const canSave =
    readPrice(priceInput) !== null &&
    brandInput.trim().length > 0 &&
    countryInput.trim().length > 0;

  useEffect(() => {
    if (!photoInput) {
      setPhotoPreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(photoInput);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [photoInput]);

  function handlePhotoChange(event) {
    const file = event.target.files?.[0] ?? null;
    setPhotoError("");
    onClearMessage();

    if (!file) {
      setPhotoInput(null);
      return;
    }
    if (!PHOTO_TYPES.includes(file.type)) {
      setPhotoInput(null);
      event.target.value = "";
      setPhotoError("chooseImageError");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoInput(null);
      event.target.value = "";
      setPhotoError("photoSizeError");
      return;
    }

    setPhotoInput(file);
  }

  function clearPhoto() {
    setPhotoInput(null);
    setPhotoError("");
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    onClearMessage();

    const price = readPrice(priceInput);
    const brand = brandInput.trim();
    const country = countryInput.trim();

    if (price === null) {
      setFormError("invalidPrice");
      return;
    }
    if (!brand || !country) {
      setFormError("requiredFields");
      return;
    }

    const saved = await onSave({ price, brand, country, photo: photoInput });
    if (!saved) return;

    setPriceInput("");
    setBrandInput("");
    setCountryInput("");
    clearPhoto();
  }

  return (
    <section className="panel form-panel" aria-labelledby="form-title">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">{t("newNote")}</p>
          <h2 id="form-title">{t("addPrice")}</h2>
        </div>
        <span className="heading-mark" aria-hidden="true">＋</span>
      </div>
      <p className="panel-intro">
        {t("formIntro")}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <fieldset
          className="form-fields"
          disabled={disabled || isSaving}
          aria-busy={isSaving}
        >
          <div className="field-group">
            <label htmlFor="price">{t("pricePerLiter")}</label>
            <div className="input-with-suffix">
              <input
                id="price"
                name="price"
                type="text"
                required
                inputMode="decimal"
                autoComplete="off"
                placeholder={t("pricePlaceholder")}
                value={priceInput}
                onChange={(event) => setPriceInput(event.target.value)}
                aria-describedby={`price-help${formError ? " form-error" : ""}`}
                aria-invalid={Boolean(formError && readPrice(priceInput) === null)}
              />
              <span className="input-suffix" aria-hidden="true">€/L</span>
            </div>
            <p className="field-help" id="price-help">
              {t("decimalHelp")}
            </p>
          </div>

          <div className="field-group">
            <label htmlFor="brand">{t("brand")}</label>
            <input
              id="brand"
              name="brand"
              type="text"
              required
              autoComplete="organization"
              placeholder={t("brandPlaceholder")}
              value={brandInput}
              onChange={(event) => setBrandInput(event.target.value)}
              maxLength={60}
              aria-invalid={Boolean(formError && !brandInput.trim())}
              aria-describedby={formError ? "form-error" : undefined}
            />
          </div>

          <div className="field-group">
            <label htmlFor="country">{t("country")}</label>
            <div className="country-input">
              <span aria-hidden="true"><PinMark /></span>
              <input
                id="country"
                name="country"
                type="text"
                required
                autoComplete="country-name"
                list="country-suggestions"
                placeholder={t("countryPlaceholder")}
                value={countryInput}
                onChange={(event) => setCountryInput(event.target.value)}
                maxLength={60}
                aria-invalid={Boolean(formError && !countryInput.trim())}
                aria-describedby={formError ? "form-error" : undefined}
              />
            </div>
            <datalist id="country-suggestions">
              {getCountryOptions(locale).map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
          </div>

          <div className="field-group">
            <label htmlFor="photo">
              {t("photoLabel")}{" "}
              <span className="optional-label">{t("optional")}</span>
            </label>
            <input
              ref={photoInputRef}
              id="photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              aria-describedby={`photo-help${photoError ? " photo-error" : ""}`}
              aria-invalid={Boolean(photoError)}
            />
            <p className="field-help" id="photo-help">
              {t("photoHelp")}
            </p>
            {photoError && (
              <p
                className="form-message form-error"
                id="photo-error"
                role="alert"
              >
                {t(photoError)}
              </p>
            )}
            {photoInput && photoPreview && (
              <div className="photo-preview">
                <img
                  src={photoPreview}
                  alt={t("photoPreview", { name: photoInput.name })}
                />
                <div className="photo-preview-details">
                  <span className="photo-file-name">{photoInput.name}</span>
                  <button
                    className="remove-photo-button"
                    type="button"
                    onClick={clearPhoto}
                  >
                    {t("removePhoto")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {formError && (
            <p className="form-message form-error" id="form-error" role="alert">
              {t(formError)}
            </p>
          )}
          <button
            className="submit-button"
            type="submit"
            disabled={!canSave || disabled || isSaving}
          >
            <span>{t("saveEntry")}</span>
            <span className="button-arrow" aria-hidden="true">→</span>
          </button>
        </fieldset>
      </form>
      <p className="privacy-note">
        <span aria-hidden="true">◈</span>
        {t("localPrivacy")}
      </p>
    </section>
  );
}

export default EntryForm;
