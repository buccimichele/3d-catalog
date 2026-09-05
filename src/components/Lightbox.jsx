import { useEffect, useState } from "react";
import { CATEGORIES, CONTACT, SITE } from "../data";

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

          <p className="lightbox-contact">
            <span className="lightbox-contact-lead">{CONTACT.productContact}</span>
            <br />
            <a href={`mailto:${CONTACT.email}`}>EMAIL: {CONTACT.email}</a>
            <br />
            <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer">
              TELEGRAM: @michelebuccii
            </a>
            <br />
            <a href={CONTACT.vinted} target="_blank" rel="noopener noreferrer">
              VINTED: {SITE.name}
            </a>
            <br />
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">
              INSTAGRAM: @skill3dlab
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
