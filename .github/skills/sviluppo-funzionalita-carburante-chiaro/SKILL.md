---
name: sviluppo-funzionalita-carburante-chiaro
description: "Usa questa skill quando sviluppi o modifichi funzionalità di Carburante Chiaro, inclusi interfaccia multilingue e persistenza locale."
---

# Sviluppare funzionalità per Carburante Chiaro

Segui questa procedura per ogni intervento:

1. Prima di scrivere codice, controlla i componenti e gli hook esistenti e riutilizza quelli adatti.
2. Mantieni l'interfaccia multilingue, usa le traduzioni centralizzate e riutilizza lo stile e i pattern visivi già presenti nel progetto.
3. Considera gli stati di caricamento, gli errori e la persistenza locale dei dati. Mantieni coerenti le operazioni su `localStorage` e IndexedDB con l'architettura esistente.
4. Dopo le modifiche, esegui `npm run build` e segnala eventuali errori di compilazione.
5. Se cambia una funzionalità documentata o il suo utilizzo, aggiorna il README in modo coerente con il comportamento effettivo.
