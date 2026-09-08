import { useEffect, useState } from "react";
import { CATEGORIES, CONTACT } from "../data";

function categoryLabel(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.label : id;
}

function initials(title) {
  return title
    .split(/\s+/)
    .filter((w) => /[A-Za-zÀ-ÿ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const mailIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="1.6"/><path d="m4.5 6.5 7.5 6.2 7.5-6.2"/></svg>';
const telegramIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 4.5 3 11.6l6.1 2.1M21 4.5 15.2 20l-6.1-6.3M21 4.5 9.1 13.7"/></svg>';
const vintedIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5h4l3 12 3-12h4L14.5 19h-5Z"/></svg>';
const instagramIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none"/></svg>';

export default function Lightbox({ item, onClose }) {
  const [index, setIndex] = useState(0);
  const images = item.images || [];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasMultiple) setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight" && hasMultiple) setIndex((i) => (i + 1) % images.length);
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [hasMultiple, images.length, onClose]);

  return (
    <div className="lightbox open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="lightbox-close" aria-label="Chiudi" onClick={onClose}>
        &times;
      </button>

      <div className="lightbox-panel">
        <div className="lightbox-media">
          {images.length > 0 ? (
            <img src={images[index]} alt={item.title} />
          ) : (
            <div className="media-placeholder media-placeholder-lg" aria-hidden="true">
              <span>{initials(item.title)}</span>
            </div>
          )}

          {hasMultiple && (
            <>
              <button
                className="lightbox-nav lightbox-prev"
                aria-label="Foto precedente"
                onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              >
                &#8249;
              </button>
              <button
                className="lightbox-nav lightbox-next"
                aria-label="Foto successiva"
                onClick={() => setIndex((i) => (i + 1) % images.length)}
              >
                &#8250;
              </button>
              <span className="lightbox-counter">
                {index + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        <div className="lightbox-info">
          <p className="card-eyebrow">{categoryLabel(item.category)}</p>
          <h3 className="card-title" style={{ fontSize: "1.7rem" }}>
            {item.title}
          </h3>

          {item.comingSoon && (
            <p className="coming-soon-note">
              Questo pezzo è in lavorazione: le foto arriveranno presto. Scrivimi se vuoi essere avvisato quando è
              pronto.
            </p>
          )}

          {hasMultiple && (
            <div className="thumb-strip">
              {images.map((src, i) => (
                <button key={src} className={`thumb ${i === index ? "active" : ""}`} onClick={() => setIndex(i)}>
                  <img src={src} alt={`Foto ${i + 1} di ${item.title}`} />
                </button>
              ))}
            </div>
          )}

          <div className="lightbox-contact">
            <p className="lightbox-contact-lead">{CONTACT.productContact}</p>
            <div className="lightbox-social">
              <a
                className="lightbox-social-bubble"
                href={`mailto:${CONTACT.email}`}
                aria-label="Email"
                dangerouslySetInnerHTML={{ __html: mailIcon }}
              />
              <a
                className="lightbox-social-bubble"
                href={CONTACT.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                dangerouslySetInnerHTML={{ __html: telegramIcon }}
              />
              <a
                className="lightbox-social-bubble"
                href={CONTACT.vinted}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vinted"
                dangerouslySetInnerHTML={{ __html: vintedIcon }}
              />
              <a
                className="lightbox-social-bubble"
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                dangerouslySetInnerHTML={{ __html: instagramIcon }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
