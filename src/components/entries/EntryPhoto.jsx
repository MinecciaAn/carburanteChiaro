import { useEffect, useState } from "react";
import { readPhoto } from "../../photoStorage.js";

function EntryPhoto({ entry, t }) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    if (!entry.photoId) return undefined;

    let isCurrent = true;
    let objectUrl = "";

    readPhoto(entry.photoId)
      .then((blob) => {
        if (!blob) {
          throw new Error("La foto non è presente nell'archivio locale.");
        }
        objectUrl = URL.createObjectURL(blob);
        if (isCurrent) setPhotoUrl(objectUrl);
      })
      .catch((error) => {
        console.error("Impossibile leggere la foto della rilevazione.", error);
        if (isCurrent) {
          setPhotoError("photoUnavailable");
        }
      });

    return () => {
      isCurrent = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [entry.photoId]);

  if (!entry.photoId) return null;
  if (photoError) {
    return <span className="entry-photo-error">{t(photoError)}</span>;
  }
  if (!photoUrl) {
    return <span className="entry-photo-loading">{t("photoLoading")}</span>;
  }

  return (
    <a
      className="entry-photo-link"
      href={photoUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={t("photoLink", {
        brand: entry.brand,
        country: entry.country,
      })}
    >
      <img
        className="entry-photo-thumbnail"
        src={photoUrl}
        alt={t("photoAlt", { brand: entry.brand, country: entry.country })}
      />
      <span>{t("openPhoto")}</span>
    </a>
  );
}

export default EntryPhoto;
