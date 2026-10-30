# Carburante Chiaro

Carburante Chiaro è una piccola applicazione web per annotare i prezzi del
carburante incontrati durante i propri spostamenti. Permette di consultare uno
storico locale, cercare le rilevazioni e tenere d'occhio il prezzo medio.

L'applicazione è realizzata con React e Vite. Non richiede un account né un
backend: le rilevazioni e le eventuali foto sono conservate nel browser e non
vengono inviate a un server applicativo.

## Indice

- [Funzionalità](#funzionalità)
- [Requisiti](#requisiti)
- [Avvio e comandi](#avvio-e-comandi)
- [Come usare l'applicazione](#come-usare-lapplicazione)
- [Dati e persistenza](#dati-e-persistenza)
- [Architettura del codice](#architettura-del-codice)
- [Accessibilità e interfaccia](#accessibilità-e-interfaccia)
- [Build e pubblicazione](#build-e-pubblicazione)
- [Limiti noti](#limiti-noti)

## Funzionalità

- Registra prezzo al litro, marchio del distributore e paese.
- Aggiunge automaticamente data e ora della rilevazione.
- Mostra il prezzo medio, il numero di rilevazioni e il numero di paesi distinti.
- Ordina lo storico dalla rilevazione più recente alla meno recente.
- Filtra lo storico cercando nel marchio o nel paese.
- Consente di allegare, visualizzare e rimuovere una foto della colonnina.
- Permette di scegliere il tema chiaro, scuro o automatico.
- Rileva la lingua preferita dal browser al primo avvio e permette di scegliere
  italiano, inglese, spagnolo, tedesco o francese.
- Localizza testi, date e prezzi in base alla lingua selezionata.
- Mantiene i dati sul dispositivo, senza account.

## Requisiti

- Node.js `22.12` o successivo (specificato anche in `package.json`).
- npm, distribuito con Node.js.
- Un browser moderno con supporto a `localStorage`, IndexedDB, `crypto.randomUUID`,
  `matchMedia` e `Intl.DisplayNames`.

## Avvio e comandi

Dalla cartella del progetto, installa le dipendenze e avvia il server di sviluppo:

```bash
npm install
npm run dev
```

Apri nel browser l'indirizzo locale stampato da Vite. Il server di sviluppo
aggiorna la pagina durante le modifiche al codice.

Comandi disponibili:

| Comando | Descrizione |
| --- | --- |
| `npm run dev` | Avvia il server di sviluppo Vite. |
| `npm run build` | Genera la build ottimizzata nella cartella `dist/`. |
| `npm run preview` | Serve localmente la build già generata in `dist/`. |

`npm run preview` va eseguito dopo `npm run build`; è uno strumento per
controllare localmente la build, non un server di produzione.

## Come usare l'applicazione

### Aggiungere una rilevazione

Compila prezzo, marchio e paese. Il pulsante **Salva rilevazione** rimane
disabilitato finché i tre campi obbligatori non contengono valori validi.
L'immagine è facoltativa. Dopo il salvataggio, i campi vengono svuotati e la
nuova rilevazione compare all'inizio dello storico.

Il prezzo accetta la virgola o il punto come separatore decimale e deve essere
maggiore di zero. Sono ammessi da una a tre cifre prima del separatore e, se
presente, da una a tre cifre decimali (per esempio `1,849` oppure `1.849`).
Marchio e paese vengono salvati senza spazi iniziali o finali e possono
contenere al massimo 60 caratteri.

Per allegare una foto, seleziona un file JPEG, PNG o WebP fino a 5 MB. È
possibile visualizzare un'anteprima e rimuovere il file prima di salvare.

### Consultare e gestire lo storico

Le rilevazioni sono visualizzate dalla più recente. Quando sono presenti
rilevazioni, il campo di ricerca filtra per marchio o paese senza distinzione
tra maiuscole e minuscole. La ricerca non modifica i dati salvati; è possibile
cancellarla o mostrare nuovamente tutti i risultati.

Il pulsante di eliminazione rimuove la rilevazione e, se presente, tenta di
eliminare anche la foto associata.

### Scegliere il tema

Il selettore nella barra superiore offre tre modalità:

- **Chiaro**: usa il tema chiaro.
- **Scuro**: usa il tema scuro.
- **Automatico**: segue la preferenza di sistema e si aggiorna se questa cambia
  mentre l'applicazione è aperta.

La modalità scelta viene memorizzata nel browser. Se il browser non consente di
salvare la preferenza, il tema scelto resta applicato nella pagina corrente, ma
potrebbe non essere mantenuto alla visita successiva.

### Scegliere la lingua

Al primo avvio l'applicazione usa la lingua preferita dal browser o dal
dispositivo, se supportata. Le lingue disponibili sono italiano, inglese,
spagnolo, tedesco e francese; se la lingua del dispositivo non è disponibile,
viene usato l'italiano. Il selettore nell'intestazione mostra una bandiera e il
nome di ogni lingua. La modalità automatica segue la lingua del browser.
La scelta viene memorizzata localmente; se il browser non consente il
salvataggio, la lingua resta applicata nella pagina corrente ma potrebbe non
essere mantenuta alla visita successiva.

## Dati e persistenza

L'applicazione usa due archivi locali distinti:

1. **Rilevazioni e preferenze del tema e della lingua**: `localStorage`.
2. **Foto**: IndexedDB, nell'archivio `carburante-chiaro`, database versione 1,
   object store `photos`.

Le rilevazioni vengono memorizzate sotto la chiave
`carburante-chiaro-rilevazioni`. Ogni elemento ha una forma simile alla
seguente; `photoId` è presente solo quando alla rilevazione è associata una
foto:

```json
{
  "id": "identificativo-generato-dal-browser",
  "price": 1.849,
  "brand": "Esempio",
  "country": "Italia",
  "date": "2026-10-30T14:00:00.000Z",
  "photoId": "identificativo-della-foto"
}
```

La foto è archiviata separatamente e collegata alla rilevazione tramite
`photoId`; non viene inserita nel JSON di `localStorage`. La preferenza del tema
è memorizzata sotto `carburante-chiaro-tema`, con i valori `light`, `dark` o
`system`.
La preferenza linguistica è memorizzata sotto
`carburante-chiaro-lingua`; in assenza di una scelta esplicita, l'applicazione
rileva la lingua del browser.

Gli archivi sono specifici del browser e dell'origine (protocollo, host e
porta). Non vengono sincronizzati tra dispositivi o browser. Cancellare i dati
del sito dal browser può eliminare rilevazioni, preferenza e foto. Se la
scrittura fallisce, l'applicazione mostra un messaggio di errore; se durante
l'eliminazione non è possibile cancellare una foto, la rilevazione viene
comunque rimossa e viene segnalato che la foto potrebbe essere rimasta
nell'archivio.

## Architettura del codice

La struttura separa composizione dell'interfaccia, componenti visivi,
comportamenti e accesso ai dati:

```text
src/
├── App.jsx
├── main.jsx
├── styles.css
├── photoStorage.js
├── components/
│   ├── entries/
│   │   ├── EntryForm.jsx
│   │   ├── EntryHistory.jsx
│   │   └── EntryPhoto.jsx
│   ├── layout/
│   │   ├── Footer.jsx
│   │   └── Header.jsx
│   ├── overview/
│   │   ├── Hero.jsx
│   │   └── StatsGrid.jsx
│   └── shared/
│       └── icons.jsx
├── data/
│   ├── entries.js
│   └── translations.js
└── hooks/
    ├── useFuelEntries.js
    ├── useLanguage.js
    └── useTheme.js
```

### Avvio e composizione

- `src/main.jsx` crea la root React, abilita `StrictMode` e carica gli stili.
- `src/App.jsx` compone le sezioni, collega i callback e presenta messaggi di
  stato o di errore.
- `index.html` definisce il documento HTML iniziale, la lingua, i metadati e
  l'elemento root.
- `vite.config.js` configura il plugin React per Vite.

### Componenti dell'interfaccia

I componenti sono raccolti per area funzionale in `src/components/`:

- `layout/`: `Header.jsx` contiene identità dell'app e selettore del tema;
  `Footer.jsx` contiene il piè di pagina.
- `overview/`: `Hero.jsx` contiene titolo e illustrazione introduttiva;
  `StatsGrid.jsx` mostra prezzo medio, numero delle rilevazioni e paesi distinti.
- `entries/`: `EntryForm.jsx` gestisce inserimento e validazione;
  `EntryHistory.jsx` visualizza, filtra ed elimina le rilevazioni;
  `EntryPhoto.jsx` carica e visualizza le foto associate.
- `shared/`: `icons.jsx` raccoglie le icone SVG condivise tra le sezioni.

### Stato e accesso ai dati

- `hooks/useFuelEntries.js` carica le rilevazioni, gestisce aggiunta e
  cancellazione, coordina `localStorage` e foto e raccoglie gli errori di
  persistenza.
- `hooks/useLanguage.js` rileva la lingua del browser, gestisce la scelta
  persistente dell'utente e aggiorna la lingua e i metadati del documento.
- `hooks/useTheme.js` gestisce la preferenza del tema, l'aggiornamento in base
  al sistema operativo e il colore del browser.
- `data/entries.js` contiene chiave e regole di validazione delle rilevazioni,
  formattatori locali e funzioni di lettura e scrittura del `localStorage`.
- `data/translations.js` raccoglie i testi delle lingue disponibili e le
  etichette localizzate per i paesi suggeriti.
- `photoStorage.js` incapsula apertura del database IndexedDB e operazioni di
  salvataggio, lettura e rimozione delle immagini.
- `styles.css` contiene stili, variabili cromatiche dei temi, layout responsive
  e regole di movimento/accessibilità.

## Accessibilità e interfaccia

- I campi hanno etichette associate, istruzioni e stati di validazione
  annunciabili.
- Gli errori e gli esiti delle operazioni sono comunicati tramite regioni
  `alert` e `status`.
- I controlli interattivi hanno indicatori di focus visibili e sono utilizzabili
  da tastiera.
- Il layout si adatta a schermi più stretti, con breakpoint a 780 px e 520 px.
- L'interfaccia rispetta `prefers-reduced-motion`.
- La lingua del documento viene aggiornata in base alla lingua selezionata.

## Build e pubblicazione

Per generare gli asset di produzione:

```bash
npm run build
```

Il risultato statico viene scritto in `dist/`. Può essere pubblicato su un
hosting di file statici; dopo la pubblicazione, l'app continua a conservare i
dati nel browser dell'utente, associati all'origine pubblicata. Per controllare
la build in locale:

```bash
npm run preview
```

Non è configurato un backend né uno script di test nel `package.json`.

### Pubblicazione su GitHub Pages

Il repository `MinecciaAn/carburanteChiaro` è configurato per generare e
pubblicare automaticamente la build con GitHub Actions quando viene aggiornato
il branch `main`. Nel repository, abilita GitHub Pages dalle impostazioni
aprendo **Settings → Pages** e scegliendo **GitHub Actions** come sorgente.
L'indirizzo previsto è
`https://minecciaan.github.io/carburanteChiaro/`; sarà disponibile dopo il
primo deploy completato correttamente.

## Limiti noti

- I dati non sono condivisi o sincronizzati tra browser e dispositivi.
- La disponibilità dello spazio dipende dai limiti imposti dal browser per
  `localStorage` e IndexedDB.
- Il prezzo medio considera tutte le rilevazioni salvate, senza distinguere il
  tipo di carburante.
- Sono disponibili cinque lingue; le lingue del dispositivo non supportate
  usano l'italiano come alternativa.
- La pagina importa i font DM Sans e Manrope da Google Fonts tramite il CSS;
  per caricarli è necessaria una connessione a Internet. Le rilevazioni e le
  foto non vengono inviate a Google Fonts né a un server applicativo.
