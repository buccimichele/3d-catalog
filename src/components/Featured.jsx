import { useEffect, useRef, useState } from "react";
import { CREATIONS, CATEGORIES } from "../data";

function categoryLabel(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.label : id;
}

function itemsPerView(width) {
  if (width < 700) return 1;
  if (width < 1180) return 3;
  return 5;
}

export default function Featured({ onSelect }) {
  const items = CREATIONS.filter((c) => c.featured).sort(
    (a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0)
  );

  const viewportRef = useRef(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const update = () => setPages(Math.max(1, Math.ceil(items.length / itemsPerView(window.innerWidth))));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [items.length]);

  const goTo = (p) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const clamped = Math.max(0, Math.min(p, pages - 1));
    viewport.scrollTo({ left: clamped * viewport.clientWidth, behavior: "smooth" });
    setPage(clamped);
  };

  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport || !viewport.clientWidth) return;
    const p = Math.round(viewport.scrollLeft / viewport.clientWidth);
    setPage(Math.max(0, Math.min(p, pages - 1)));
  };

  if (items.length === 0) return null;

  return (
    <section className="featured" id="featured" aria-label="Lavori in evidenza">
      <div className="section-head">
        <h2 className="section-title">Lavori in evidenza</h2>
      </div>

      <div className="carousel">
        <button
          className="carousel-nav carousel-prev"
          aria-label="Precedente"
          style={{ visibility: pages > 1 ? "visible" : "hidden" }}
          onClick={() => goTo(page - 1)}
        >
          &#8249;
        </button>

        <div className="carousel-viewport" ref={viewportRef} onScroll={handleScroll}>
          <div className="featured-track">
            {items.map((item) => (
              <article
                key={item.title}
                className="feature-card"
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
                <div className="feature-media">
                  <img src={item.images[0]} alt={item.title} loading="lazy" />
                </div>
                <div className="feature-body">
                  <p className="card-eyebrow">{categoryLabel(item.category)}</p>
                  <h3 className="feature-title">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button
          className="carousel-nav carousel-next"
          aria-label="Successivo"
          style={{ visibility: pages > 1 ? "visible" : "hidden" }}
          onClick={() => goTo(page + 1)}
        >
          &#8250;
        </button>
      </div>

      {pages > 1 && (
        <div className="carousel-dots">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              className={`dot ${i === page ? "active" : ""}`}
              aria-label={`Vai alla pagina ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
