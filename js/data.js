/* ============================================================
   CONFIGURAZIONE DEL CATALOGO
   Questo è l'UNICO file che devi modificare.
   Aggiungi foto, categorie e descrizioni qui sotto.
   Il sito si aggiorna da solo, non serve toccare altro.
   ============================================================ */

// --- 1. CONTATTI -------------------------------------------------
// "email" e "telegram" sono i tuoi contatti, mostrati sia in fondo
// alla pagina che nel dettaglio di ogni pezzo.
// "footerMessage" è la frase mostrata in fondo alla pagina, sopra i contatti.
const CONTACT = {
  email: "michelebucci388@gmail.com",
  telegram: "https://t.me/michelebuccii",
  footerMessage:
    "Non hai trovato quello che cercavi? Contattami!",
};

// --- 2. CATEGORIE -----------------------------------------------
// "id" deve essere unico e senza spazi, "label" è il testo mostrato.
const CATEGORIES = [
  { id: "funzionali", label: "Funzionali" },
  { id: "decorativi", label: "Decorativi" },
  { id: "miniature", label: "Miniature" },
  { id: "prototipi", label: "Prototipi" },
];

// --- 3. LE TUE CREAZIONI -----------------------------------------
// Copia un blocco { ... } per ogni nuovo oggetto e modifica i valori.
//
// "images" è un ELENCO di foto (una o più), tra parentesi quadre e
// separate da virgola. La prima è quella di copertina mostrata nella
// griglia, tutte insieme sono sfogliabili aprendo il pezzo.
// Possono essere file nella cartella images/ oppure URL esterni.
const CREATIONS = [
  {
    title: "Vaso a spirale",
    category: "decorativi",
    description:
      "Vaso stampato in un unico pezzo con la tecnica vase mode, senza pareti interne. Nessun supporto, nessuno spreco di materiale.",
    images: ["images/vase-1.svg", "images/vase-2.svg", "images/vase-3.svg"],
  },
  {
    title: "Ingranaggio maggiorato",
    category: "funzionali",
    description:
      "Sostituto di ricambio per un meccanismo di trasmissione, ridisegnato con dente più spesso per resistere meglio all'usura.",
    images: ["images/gear-1.svg", "images/gear-2.svg", "images/gear-3.svg"],
  },
  {
    title: "Figura articolata",
    category: "miniature",
    description:
      "Miniatura da 75mm con giunti stampati in-place, pronta all'uso senza assemblaggio successivo alla stampa.",
    images: ["images/figure-1.svg", "images/figure-2.svg", "images/figure-3.svg"],
  },
  {
    title: "Casco da concept",
    category: "prototipi",
    description:
      "Primo prototipo in scala 1:1 di un design per un casco, stampato per verificare ergonomia e ingombri prima dello stampo definitivo.",
    images: ["images/helmet-1.svg", "images/helmet-2.svg", "images/helmet-3.svg"],
  },
  {
    title: "Drone da corsa, telaio",
    category: "funzionali",
    description:
      "Telaio leggero a X, rinforzato sui bracci nei punti di massimo stress rilevati durante i test di volo.",
    images: ["images/drone-1.svg", "images/drone-2.svg", "images/drone-3.svg"],
  },
  {
    title: "Fioriera modulare",
    category: "decorativi",
    description:
      "Modulo impilabile pensato per essere stampato in serie e combinato in composizioni diverse a seconda dello spazio.",
    images: ["images/planter-1.svg", "images/planter-2.svg", "images/planter-3.svg"],
  },
];
