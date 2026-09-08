import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Aurora from "../components/Aurora";
import Featured from "../components/Featured";
import CatalogSearch from "../components/CatalogSearch";
import Gallery from "../components/Gallery";
import Lightbox from "../components/Lightbox";
import Footer from "../components/Footer";
import { CATEGORIES, CREATIONS } from "../data";
import { slugify } from "../utils/slug";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const slug = searchParams.get("prodotto");
    if (!slug) return;
    const match = CREATIONS.find((c) => slugify(c.title) === slug);
    if (match) setSelectedItem(match);
  }, []);

  const openItem = (item) => {
    setSelectedItem(item);
    setSearchParams({ prodotto: slugify(item.title) }, { replace: true });
  };

  const closeItem = () => {
    setSelectedItem(null);
    setSearchParams({}, { replace: true });
  };

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
        </div>
      </header>

      <Featured onSelect={openItem} />

      <CatalogSearch
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="gallery" id="gallery">
        <Gallery items={filteredCreations} onSelect={openItem} />
      </main>

      <Footer />

      {selectedItem && <Lightbox item={selectedItem} onClose={closeItem} />}
    </>
  );
}
