(function () {
  "use strict";

  const galleryEl = document.getElementById("gallery");
  const filtersEl = document.getElementById("filters");
  const lightbox = document.getElementById("lightbox");
  const lightboxPanel = document.getElementById("lightbox-panel");

  let activeCategory = "all";
  let currentItem = null;
  let currentPhotoIndex = 0;

  function renderFilters() {
    const all = document.createElement("button");
    all.className = "filter-chip active";
    all.textContent = "Tutte";
    all.dataset.category = "all";
    filtersEl.appendChild(all);

    CATEGORIES.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "filter-chip";
      btn.textContent = cat.label;
      btn.dataset.category = cat.id;
      filtersEl.appendChild(btn);
    });

    filtersEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;
      activeCategory = btn.dataset.category;
      [...filtersEl.children].forEach((c) => c.classList.toggle("active", c === btn));
      renderGallery();
    });
  }

  function categoryLabel(id) {
    const found = CATEGORIES.find((c) => c.id === id);
    return found ? found.label : id;
  }

  function coverImage(item) {
    return item.images && item.images.length ? item.images[0] : "";
  }

  function renderGallery() {
    galleryEl.innerHTML = "";
    const items =
      activeCategory === "all"
        ? CREATIONS
        : CREATIONS.filter((c) => c.category === activeCategory);

    if (items.length === 0) {
      galleryEl.innerHTML = `<p class="empty-state">Nessun pezzo in questa categoria, per ora.</p>`;
      return;
    }

    items.forEach((item) => {
      const photoCount = item.images ? item.images.length : 0;
      const card = document.createElement("article");
      card.className = "card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Apri i dettagli di ${item.title}`);
      card.innerHTML = `
        <div class="card-media">
          <img src="${coverImage(item)}" alt="${item.title}" loading="lazy" />
          ${photoCount > 1 ? `<span class="photo-badge">${photoCount} foto</span>` : ""}
        </div>
        <div class="card-body">
          <p class="card-eyebrow">${categoryLabel(item.category)}</p>
          <h3 class="card-title">${item.title}</h3>
        </div>
      `;
      card.addEventListener("click", () => openLightbox(item));
      card.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") openLightbox(item);
      });
      galleryEl.appendChild(card);
      observeCard(card);
    });
  }

  let observer;
  function observeCard(card) {
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
    }
    observer.observe(card);
  }

  function openLightbox(item) {
    currentItem = item;
    currentPhotoIndex = 0;
    renderLightbox();
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function renderLightbox() {
    const item = currentItem;
    const images = item.images || [];
    const hasMultiple = images.length > 1;

    lightboxPanel.innerHTML = `
      <div class="lightbox-media">
        <img src="${images[currentPhotoIndex]}" alt="${item.title}" />
        ${
          hasMultiple
            ? `
          <button class="lightbox-nav lightbox-prev" aria-label="Foto precedente">&#8249;</button>
          <button class="lightbox-nav lightbox-next" aria-label="Foto successiva">&#8250;</button>
          <span class="lightbox-counter">${currentPhotoIndex + 1} / ${images.length}</span>
        `
            : ""
        }
      </div>
      <div class="lightbox-info">
        <p class="card-eyebrow">${categoryLabel(item.category)}</p>
        <h3 class="card-title" style="font-size:1.7rem;">${item.title}</h3>
        ${
          hasMultiple
            ? `<div class="thumb-strip">${images
                .map(
                  (src, i) =>
                    `<button class="thumb ${i === currentPhotoIndex ? "active" : ""}" data-index="${i}">
                      <img src="${src}" alt="Foto ${i + 1} di ${item.title}" />
                    </button>`
                )
                .join("")}</div>`
            : ""
        }
        <p class="lightbox-contact">
          Per informazioni: <br> <a href="mailto:${CONTACT.email}">EMAIL: ${CONTACT.email}</a> <br>
          <a href="${CONTACT.telegram}" target="_blank" rel="noopener">TELEGRAM: @michelebuccii</a>
        </p>
      </div>
    `;

    if (hasMultiple) {
      lightboxPanel.querySelector(".lightbox-prev").addEventListener("click", () => stepPhoto(-1));
      lightboxPanel.querySelector(".lightbox-next").addEventListener("click", () => stepPhoto(1));
      lightboxPanel.querySelectorAll(".thumb").forEach((btn) => {
        btn.addEventListener("click", () => {
          currentPhotoIndex = Number(btn.dataset.index);
          renderLightbox();
        });
      });
    }
  }

  function stepPhoto(delta) {
    const total = currentItem.images.length;
    currentPhotoIndex = (currentPhotoIndex + delta + total) % total;
    renderLightbox();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    currentItem = null;
  }

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft" && currentItem && currentItem.images.length > 1) stepPhoto(-1);
    if (e.key === "ArrowRight" && currentItem && currentItem.images.length > 1) stepPhoto(1);
  });

  function renderFooter() {
    document.getElementById("footer-message").textContent = CONTACT.footerMessage;
    document.getElementById("footer-contacts").innerHTML = `
      <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>
      <span class="footer-dot">·</span>
      <a href="${CONTACT.telegram}" target="_blank" rel="noopener">Telegram</a>
    `;
  }

  renderFilters();
  renderGallery();
  renderFooter();
})();
