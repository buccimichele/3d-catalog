import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "../data";

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

function GalleryCard({ item, onSelect }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const photoCount = item.images ? item.images.length : 0;
  const cover = photoCount ? item.images[0] : null;

  return (
    <article
      ref={ref}
      className={`card ${inView ? "in-view" : ""}`}
      data-category={item.category}
      tabIndex={0}
      role="button"
      aria-label={`Apri i dettagli di ${item.title}`}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item);
        }
      }}
    >
      <div className="card-media">
        {cover ? (
          <img src={cover} alt={item.title} loading="lazy" />
        ) : (
          <div className="media-placeholder" aria-hidden="true">
            <span>{initials(item.title)}</span>
          </div>
        )}

        {photoCount > 1 && <span className="photo-badge">{photoCount} foto</span>}
        {item.comingSoon && <span className="photo-badge badge-soon">In arrivo</span>}
      </div>

      <div className="card-body">
        <p className="card-eyebrow">{categoryLabel(item.category)}</p>
        <h3 className="card-title">{item.title}</h3>
      </div>
    </article>
  );
}

export default function Gallery({ items, onSelect }) {
  if (items.length === 0) {
    return <p className="empty-state">Nessun pezzo trovato.</p>;
  }

  return (
    <>
      {items.map((item) => (
        <GalleryCard key={item.title} item={item} onSelect={onSelect} />
      ))}
    </>
  );
}
