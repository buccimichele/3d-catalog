import { Link } from "react-router-dom";
import { CONTACT, SITE } from "../data";

export default function Privacy() {
  return (
    <main className="legal-page">
      <Link className="legal-back" to="/">
        &#8249; Torna al catalogo
      </Link>

      <h1>Contatti & Privacy</h1>

      <p className="legal-piva">
        {SITE.name} &middot; P.IVA {SITE.piva}
      </p>

      <h2>Contatti</h2>
      <p>
        Email: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <br />
        Telegram:{" "}
        <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer">
          @michelebuccii
        </a>
        <br />
        Vinted:{" "}
        <a href={CONTACT.vinted} target="_blank" rel="noopener noreferrer">
          {SITE.name}
        </a>
        <br />
        TikTok:{" "}
        <a href={CONTACT.tiktok} target="_blank" rel="noopener noreferrer">
          @skill3dlab
        </a>
        <br />
        Instagram:{" "}
        <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">
          @skill3dlab
        </a>
      </p>

      <h2>Titolare del trattamento</h2>
      <p>
        Il sito è gestito da Skill3dLab. Per qualsiasi richiesta relativa ai tuoi dati puoi scrivere ai contatti
        indicati sopra.
      </p>

      <h2>Dati raccolti e finalità</h2>
      <p>{CONTACT.privacyNote}</p>

      <h2>Cookie e servizi esterni</h2>
      <p>
        Questo sito non utilizza cookie di profilazione né strumenti di tracciamento pubblicitario. Per la
        visualizzazione dei caratteri tipografici viene caricata una risorsa esterna da Google Fonts: questo può
        comportare la trasmissione del tuo indirizzo IP ai server di Google, secondo l'informativa privacy di Google.
      </p>

      <h2>I tuoi diritti</h2>
      <p>
        Ai sensi del Regolamento UE 2016/679 (GDPR) puoi in qualsiasi momento chiedere accesso, rettifica o
        cancellazione dei tuoi dati, oppure opporti al loro trattamento, scrivendo ai contatti sopra indicati.
      </p>
    </main>
  );
}
