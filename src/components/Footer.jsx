import { Link } from "react-router-dom";
import Aurora from "./Aurora";
import { CONTACT, SITE } from "../data";

const mailIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="1.6"/><path d="m4.5 6.5 7.5 6.2 7.5-6.2"/></svg>';
const telegramIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 4.5 3 11.6l6.1 2.1M21 4.5 15.2 20l-6.1-6.3M21 4.5 9.1 13.7"/></svg>';
const vintedIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5h4l3 12 3-12h4L14.5 19h-5Z"/></svg>';
const tiktokIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M14 3.5c.7 1.9 2.1 3.1 4.2 3.3v2.6c-1.5 0-2.9-.4-4.2-1.3v6.1a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v2.6a2.8 2.8 0 1 0 2 2.7V3.5Z"/></svg>';
const instagramIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none"/></svg>';

export default function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-aurora" aria-hidden="true">
        <Aurora colorStops={["#9b7bff", "#ff4fa3", "#ff6b4a"]} amplitude={1.0} blend={0.5} speed={0.5} />
      </div>

      <div className="footer-content">
        <p className="footer-message">{CONTACT.footerMessage}</p>

        <p className="footer-contacts">
          <a
            className="pill-link"
            href={`mailto:${CONTACT.email}`}
            dangerouslySetInnerHTML={{ __html: `${mailIcon} Email` }}
          />
          <a
            className="pill-link"
            href={CONTACT.telegram}
            target="_blank"
            rel="noopener noreferrer"
            dangerouslySetInnerHTML={{ __html: `${telegramIcon} Telegram` }}
          />
          <a
            className="pill-link"
            href={CONTACT.vinted}
            target="_blank"
            rel="noopener noreferrer"
            dangerouslySetInnerHTML={{ __html: `${vintedIcon} Vinted` }}
          />
          <a
            className="pill-link"
            href={CONTACT.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            dangerouslySetInnerHTML={{ __html: `${tiktokIcon} TikTok` }}
          />
          <a
            className="pill-link"
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            dangerouslySetInnerHTML={{ __html: `${instagramIcon} Instagram` }}
          />
        </p>

        <p className="footer-fine">
          © {new Date().getFullYear()} {SITE.name} &middot; P.IVA {SITE.piva} &middot; <Link to="/contatti">Contatti e Privacy</Link>
        </p>
      </div>
    </footer>
  );
}
