import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./CatalogSearch.css";

export default function CatalogSearch({ categories, activeCategory, onCategoryChange, searchTerm, onSearchChange }) {
  const [open, setOpen] = useState(false);
  const chipRefs = useRef([]);

  useEffect(() => {
    const chips = chipRefs.current.filter(Boolean);
    if (!open || !chips.length) return;

    gsap.killTweensOf(chips);
    gsap.set(chips, { scale: 0, transformOrigin: "50% 50%" });
    gsap.to(chips, {
      scale: 1,
      duration: 0.4,
      ease: "back.out(1.7)",
      stagger: 0.04
    });
  }, [open]);

  return (
    <div className="catalog-search-wrap">
      <div className="catalog-search">
        <div className="catalog-search-bar">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="search"
            className="catalog-search-input"
            placeholder="Cerca una creazione..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              onSearchChange(value);
              if (value.trim() !== "") {
                onCategoryChange("all");
              }
            }}
          />

          <button
            type="button"
            className={`catalog-filter-toggle ${open ? "open" : ""}`}
            aria-expanded={open}
            aria-label={open ? "Nascondi filtri" : "Mostra filtri"}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
          </button>
        </div>

        {open && (
          <div className="catalog-filter-chips">
            <button
              type="button"
              ref={(el) => (chipRefs.current[0] = el)}
              className={`filter-chip ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => onCategoryChange("all")}
            >
              Tutte
            </button>

            {categories.map((cat, i) => (
              <button
                type="button"
                key={cat.id}
                ref={(el) => (chipRefs.current[i + 1] = el)}
                className={`filter-chip ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
