# Skill3dLab (React)

## Setup

```
npm install
npm run dev
```

## Immagini

Copia tutta la cartella `images/` del vecchio sito (logo.svg, logomini.svg, favicon.ico e tutte le foto dei prodotti) dentro `public/images/`. I percorsi in `src/data.js` sono già `images/nomefile.jpg`, quindi funzionano automaticamente una volta incollate le immagini in `public/images/`.

## Dominio personalizzato

Il file `public/CNAME` contiene già `skill3dlab.it`. Su GitHub vai in Settings → Pages → Custom domain e verifica che sia impostato allo stesso dominio, poi configura presso il tuo registrar i record DNS che GitHub richiede (A record verso gli IP di GitHub Pages oppure CNAME verso `username.github.io`, a seconda che tu usi l'apex o un sottodominio).

## Build

```
npm run build
```

Genera la cartella `dist/`.

## Deploy su GitHub Pages

Opzione A — GitHub Actions (consigliata):

1. Crea un repository su GitHub e caricaci questo progetto (branch `main`).
2. Su GitHub vai in Settings → Pages → Build and deployment → Source: seleziona "GitHub Actions".
3. Ad ogni push su `main`, il workflow in `.github/workflows/deploy.yml` builda il sito e lo pubblica automaticamente.

Opzione B — comando manuale:

```
npm run deploy
```

Pubblica il contenuto di `dist/` sul branch `gh-pages` usando il pacchetto `gh-pages`. In questo caso vai in Settings → Pages → Source e seleziona il branch `gh-pages`.

## Routing

Il sito usa `react-router-dom` con `BrowserRouter` (non `HashRouter`), così i link con `#` dentro le pagine (es. "Esplora il catalogo") restano semplici ancore di scorrimento e non vengono intercettati dal router.

Poiché GitHub Pages non supporta il rewrite lato server richiesto dalle Single Page App, il progetto include `public/404.html`: se qualcuno ricarica direttamente `/contatti`, GitHub Pages restituirebbe un 404, ma questo file redirige automaticamente a `index.html` preservando il percorso, che poi viene ripristinato da uno script in `index.html`. Non serve toccare nulla, funziona già così.

`vite.config.js` ha `base: "/"` perché il sito è pensato per essere servito dalla root del dominio personalizzato. Se in futuro rimuovi il dominio custom e torni a `username.github.io/nome-repo/`, andrà cambiato `base` in `"/nome-repo/"`.
