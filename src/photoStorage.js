const DATABASE_NAME = "carburante-chiaro";
const DATABASE_VERSION = 1;
const PHOTO_STORE = "photos";

let databasePromise;

function openPhotoDatabase() {
  if (!("indexedDB" in window)) {
    return Promise.reject(
      new Error("Questo browser non supporta l'archiviazione locale delle foto."),
    );
  }

  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      let settled = false;

      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(PHOTO_STORE)) {
          database.createObjectStore(PHOTO_STORE, { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        const database = request.result;
        if (settled) {
          database.close();
          return;
        }
        settled = true;
        database.onversionchange = () => {
          database.close();
          databasePromise = undefined;
        };
        resolve(database);
      };

      request.onerror = () => {
        if (settled) return;
        settled = true;
        reject(
          request.error ?? new Error("Impossibile aprire l'archivio delle foto."),
        );
      };

      request.onblocked = () => {
        if (settled) return;
        settled = true;
        reject(new Error("L'archivio delle foto è bloccato da un'altra scheda."));
      };
    }).catch((error) => {
      databasePromise = undefined;
      throw error;
    });
  }

  return databasePromise;
}

function runTransaction(mode, operation) {
  return openPhotoDatabase().then(
    (database) =>
      new Promise((resolve, reject) => {
        let result;
        const transaction = database.transaction(PHOTO_STORE, mode);
        const request = operation(transaction.objectStore(PHOTO_STORE));

        if (request) {
          request.onsuccess = () => {
            result = request.result;
          };
          request.onerror = () => {
            reject(request.error ?? new Error("Operazione sulla foto non riuscita."));
          };
        }

        transaction.oncomplete = () => resolve(result);
        transaction.onerror = () => {
          reject(
            transaction.error ?? new Error("Salvataggio della foto non riuscito."),
          );
        };
        transaction.onabort = () => {
          reject(transaction.error ?? new Error("Salvataggio della foto annullato."));
        };
      }),
  );
}

export function savePhoto(id, blob) {
  return runTransaction("readwrite", (store) => store.put({ id, blob }));
}

export function readPhoto(id) {
  return runTransaction("readonly", (store) => store.get(id)).then(
    (record) => record?.blob ?? null,
  );
}

export function removePhoto(id) {
  return runTransaction("readwrite", (store) => store.delete(id));
}
