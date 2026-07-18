# Catalogo creazioni 3D

Sito statico per esporre le tue creazioni 3D: foto, titolo, descrizione e categorie.
Pensato per essere pubblicato con GitHub Pages: i visitatori possono solo sfogliarlo,
tu lo configuri modificando un unico file.

## Struttura del progetto

```
3d-catalog/
├── index.html          ← pagina del sito, non serve toccarla
├── css/style.css        ← stile grafico, non serve toccarla
├── js/
│   ├── data.js           ← QUESTO è il file da modificare
│   └── script.js         ← logica del sito, non serve toccarla
└── images/               ← metti qui le foto delle tue creazioni
```

## Come aggiungere le tue creazioni

Apri `js/data.js` con un editor di testo qualsiasi (anche il tuo browser
tramite GitHub, vedi sotto). Contiene tre sezioni:

1. **CONTACT** — la tua email e il link Telegram, mostrati sia in fondo
   alla pagina che nel dettaglio di ogni pezzo, e la frase mostrata in
   fondo alla pagina.
2. **CATEGORIES** — l'elenco delle categorie (aggiungine o togline quante ne vuoi).
3. **CREATIONS** — l'elenco dei pezzi. Copia un blocco e modifica i valori:

```js
{
  title: "Nome del pezzo",
  category: "decorativi",       // deve corrispondere a un id in CATEGORIES
  description: "Una breve descrizione del pezzo.",
  images: ["images/mio-pezzo-1.jpg", "images/mio-pezzo-2.jpg"],
}
```

Puoi mettere **una o più foto** per ogni pezzo nell'elenco `images`. La prima
è la copertina mostrata nella griglia (con un'etichetta "N foto" se ce ne
sono altre); aprendo il pezzo si possono sfogliare tutte con le frecce, le
miniature in basso, o le frecce della tastiera. Ogni pezzo, una volta
aperto, mostra anche email e Telegram per essere contattato.

Le foto di esempio in `images/` sono segnaposto generati: sostituiscile con
le tue, mantenendo gli stessi nomi file oppure aggiornando i percorsi in
`data.js`. Foto quadrate o leggermente orizzontali rendono meglio.

## Come pubblicarlo su GitHub Pages

1. Crea un nuovo repository su GitHub (es. `catalogo-3d`).
2. Carica dentro tutto il contenuto di questa cartella (`index.html`,
   `css/`, `js/`, `images/`) — con "Add file → Upload files" dal browser,
   oppure con git da terminale.
3. Vai nelle impostazioni del repository → **Pages**.
4. In "Source" seleziona il branch `main` e la cartella `/ (root)`, poi salva.
5. Dopo un paio di minuti il sito sarà online all'indirizzo
   `https://tuo-utente.github.io/catalogo-3d/`.

Da quel momento, ogni volta che vuoi aggiungere un pezzo nuovo ti basta
modificare `js/data.js` (anche direttamente su GitHub, con la matitina
"Edit" sul file) e caricare la relativa foto in `images/`: il sito
pubblicato si aggiorna da solo, senza bisogno di altre modifiche.

## Modificare in locale prima di pubblicare

Puoi aprire `index.html` direttamente nel browser per vedere le modifiche
prima di caricarle su GitHub. Se il browser blocca il caricamento delle
immagini locali, avvia un piccolo server dalla cartella del progetto:

```
python3 -m http.server 8000
```

e apri `http://localhost:8000`.
