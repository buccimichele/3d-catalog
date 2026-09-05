import { useMemo, useState } from "react";
import Aurora from "../components/Aurora";
import Featured from "../components/Featured";
import CatalogSearch from "../components/CatalogSearch";
import Gallery from "../components/Gallery";
import Lightbox from "../components/Lightbox";
import Footer from "../components/Footer";
import { CATEGORIES, CREATIONS } from "../data";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredCreations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return CREATIONS.filter((c) => activeCategory === "all" || c.category === activeCategory)
      .filter((c) => !term || c.title.toLowerCase().includes(term))
      .slice()
      .reverse();
  }, [activeCategory, searchTerm]);

  return (
    <>
      <header className="hero" id="top">
        <div className="hero-aurora" aria-hidden="true">
          <Aurora colorStops={["#ff6b4a", "#ff4fa3", "#9b7bff"]} amplitude={1.0} blend={0.55} speed={0.6} />
        </div>

        <div className="hero-inner">
          <img src="images/logo.svg" alt="Skill3dLab" className="hero-logo" />
          <p className="hero-subtitle">Shaping your Ideas</p>
          <div className="hero-actions">
            <a href="#gallery" className="btn btn-primary">
              Esplora il catalogo
            </a>
            <a href="#footer" className="btn btn-ghost">
              Contattami
            </a>
          </div>
        </div>
      </header>

      <Featured onSelect={setSelectedItem} />

      <CatalogSearch
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="gallery" id="gallery">
        <Gallery items={filteredCreations} onSelect={setSelectedItem} />
      </main>

      <Footer />

      {selectedItem && <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </>
  );
}
