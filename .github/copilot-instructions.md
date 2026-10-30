# Istruzioni per Carburante Chiaro

## Stack e struttura
- Usa React 18 con JavaScript e JSX, Vite 7 e CSS in `src/styles.css`.
- Mantieni la struttura esistente: `src/App.jsx` contiene l'interfaccia, `src/main.jsx` monta React e `vite.config.js` configura Vite.
- Il progetto richiede Node.js 22.12 o successivo.

## Comportamento
- Le rilevazioni contengono prezzo al litro, marchio, paese e data; i metadati sono salvati in `localStorage` e le foto facoltative (JPEG/PNG/WebP, massimo 5 MB) in IndexedDB.
- Le foto non devono essere caricate su server; quando si eliminano le rilevazioni, eliminare anche le foto associate.
- Non introdurre account, server, servizi esterni o invio di dati senza una richiesta esplicita.
- Mantieni i prezzi compatibili con input decimali italiani (virgola) e la formattazione in euro con tre decimali, localizzata in base alla lingua selezionata.

## UI e accessibilità
- Conserva l'interfaccia multilingue (italiano, inglese, spagnolo, tedesco e francese), il layout responsive e lo stile visivo esistente.
- Usa HTML semantico, etichette associate ai campi, focus da tastiera visibile e messaggi accessibili per errori e aggiornamenti.
- Rispetta `prefers-reduced-motion` e mantieni un contrasto del testo leggibile.

## Verifica
- Installa le dipendenze con `npm install`.
- Avvia lo sviluppo con `npm run dev` e verifica la build con `npm run build`.
- Aggiorna il README quando cambiano i comandi o le funzionalità documentate.
