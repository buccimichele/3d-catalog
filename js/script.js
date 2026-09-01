(function () {
  "use strict";

  const ICONS = {
    mail:
      `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="1.6"/><path d="m4.5 6.5 7.5 6.2 7.5-6.2"/></svg>`,
    telegram:
      `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 4.5 3 11.6l6.1 2.1M21 4.5 15.2 20l-6.1-6.3M21 4.5 9.1 13.7"/></svg>`,
    vinted:
      `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5h4l3 12 3-12h4L14.5 19h-5Z"/></svg>`,
    tiktok:
      `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M14 3.5c.7 1.9 2.1 3.1 4.2 3.3v2.6c-1.5 0-2.9-.4-4.2-1.3v6.1a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v2.6a2.8 2.8 0 1 0 2 2.7V3.5Z"/></svg>`,
  };

  const galleryEl = document.getElementById("gallery");
  const filtersEl = document.getElementById("filters");
  const featuredEl = document.getElementById("featured-track");
  const featuredViewportEl = document.getElementById("featured-viewport");
  const featuredPrevBtn = document.getElementById("featured-prev");
  const featuredNextBtn = document.getElementById("featured-next");
  const featuredDotsEl = document.getElementById("featured-dots");
  const lightbox = document.getElementById("lightbox");
  const lightboxPanel = document.getElementById("lightbox-panel");

  let activeCategory = "all";
  let currentItem = null;
  let currentPhotoIndex = 0;

  let featuredItems = [];
  let featuredPage = 0;

  function categoryLabel(id) {
    const found = CATEGORIES.find((c) => c.id === id);
    return found ? found.label : id;
  }

  function coverImage(item) {
    return item.images && item.images.length ? item.images[0] : null;
  }

  function placeholderMedia(item) {
    const initials = item.title
      .split(/\s+/)
      .filter((w) => /[A-Za-zÀ-ÿ]/.test(w))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

    return `
      <div class="media-placeholder" aria-hidden="true">
        <span>${initials}</span>
      </div>
    `;
  }

  function renderFilters() {
    filtersEl.innerHTML = "";

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

      [...filtersEl.children].forEach((c) => {
        c.classList.toggle("active", c === btn);
      });

      renderGallery();

      const filtersOffset =
        filtersEl.getBoundingClientRect().height + 16;

      const galleryTop =
        galleryEl.getBoundingClientRect().top +
        window.scrollY;

      window.scrollTo({
        top: galleryTop - filtersOffset,
        behavior: "smooth"
      });
    });
  }

  function renderFeatured() {
    if (!featuredEl) return;

    featuredItems = CREATIONS
      .filter((c) => c.featured)
      .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));

    if (featuredItems.length === 0) {
      document.getElementById("featured")?.remove();
      return;
    }

    featuredEl.innerHTML = "";

    featuredItems.forEach((item) => {
      const card = document.createElement("article");

      card.className = "feature-card";
      card.dataset.category = item.category;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute(
        "aria-label",
        `Apri i dettagli di ${item.title}`
      );

      const cover = coverImage(item);

      card.innerHTML = `
        <div class="feature-media">
          ${
            item.comingSoon
              ? placeholderMedia(item)
              : `
                <img
                  src="${cover}"
                  alt="${item.title}"
                  loading="lazy"
                />
              `
          }
        </div>

        <div class="feature-body">
          <p class="card-eyebrow">
            ${categoryLabel(item.category)}
          </p>

          <h3 class="feature-title">
            ${item.title}
          </h3>
        </div>
      `;

      if (!item.comingSoon) {
        card.addEventListener("click", () => {
          openLightbox(item);
        });

        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox(item);
          }
        });
      }

      featuredEl.appendChild(card);
    });

    featuredPrevBtn.onclick = () => {
      goToFeaturedPage(featuredPage - 1);
    };

    featuredNextBtn.onclick = () => {
      goToFeaturedPage(featuredPage + 1);
    };

    let scrollTimer;

    featuredViewportEl.addEventListener("scroll", () => {
      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        syncFeaturedPage();
      }, 80);
    });

    let resizeTimer;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        renderFeaturedDots();
        syncFeaturedPage();
      }, 150);
    });

    renderFeaturedDots();
    syncFeaturedPage();
  }

  function itemsPerView() {
    if (window.innerWidth < 700) {
      return 1;
    }

    if (window.innerWidth < 1180) {
      return 3;
    }

    return 5;
  }

  function totalFeaturedPages() {
    return Math.max(
      1,
      Math.ceil(
        featuredItems.length / itemsPerView()
      )
    );
  }

  function renderFeaturedDots() {
    featuredDotsEl.innerHTML = "";

    const pages = totalFeaturedPages();

    for (let i = 0; i < pages; i++) {
      const dot = document.createElement("button");

      dot.className = "dot";

      dot.setAttribute(
        "aria-label",
        `Vai alla pagina ${i + 1}`
      );

      dot.addEventListener("click", () => {
        goToFeaturedPage(i);
      });

      featuredDotsEl.appendChild(dot);
    }

    const multiplePages = pages > 1;

    featuredDotsEl.style.display =
      multiplePages ? "flex" : "none";

    featuredPrevBtn.style.visibility =
      multiplePages ? "visible" : "hidden";

    featuredNextBtn.style.visibility =
      multiplePages ? "visible" : "hidden";
  }

  function goToFeaturedPage(page) {
    const pages = totalFeaturedPages();

    featuredPage = Math.max(
      0,
      Math.min(page, pages - 1)
    );

    const viewportWidth =
      featuredViewportEl.clientWidth;

    featuredViewportEl.scrollTo({
      left: featuredPage * viewportWidth,
      behavior: "smooth"
    });

    updateFeaturedDots();
  }

  function syncFeaturedPage() {
    const viewportWidth =
      featuredViewportEl.clientWidth;

    if (!viewportWidth) return;

    const pages = totalFeaturedPages();

    featuredPage = Math.round(
      featuredViewportEl.scrollLeft /
        viewportWidth
    );

    featuredPage = Math.max(
      0,
      Math.min(featuredPage, pages - 1)
    );

    updateFeaturedDots();
  }

  function updateFeaturedDots() {
    [...featuredDotsEl.children].forEach(
      (dot, index) => {
        dot.classList.toggle(
          "active",
          index === featuredPage
        );
      }
    );
  }

  function renderGallery() {
    galleryEl.innerHTML = "";

    const items = (
      activeCategory === "all"
        ? CREATIONS
        : CREATIONS.filter(
            (c) => c.category === activeCategory
          )
    ).slice().reverse();

    if (items.length === 0) {
      galleryEl.innerHTML = `
        <p class="empty-state">
          Nessun pezzo in questa categoria, per ora.
        </p>
      `;

      return;
    }

    items.forEach((item) => {
      const photoCount = item.images
        ? item.images.length
        : 0;

      const cover = coverImage(item);

      const card = document.createElement("article");

      card.className = "card";
      card.dataset.category = item.category;
      card.tabIndex = 0;

      card.setAttribute("role", "button");

      card.setAttribute(
        "aria-label",
        `Apri i dettagli di ${item.title}`
      );

      card.innerHTML = `
        <div class="card-media">

          ${
            cover
              ? `
                <img
                  src="${cover}"
                  alt="${item.title}"
                  loading="lazy"
                />
              `
              : placeholderMedia(item)
          }

          ${
            photoCount > 1
              ? `
                <span class="photo-badge">
                  ${photoCount} foto
                </span>
              `
              : ""
          }

          ${
            item.comingSoon
              ? `
                <span class="photo-badge badge-soon">
                  In arrivo
                </span>
              `
              : ""
          }

        </div>

        <div class="card-body">

          <p class="card-eyebrow">
            ${categoryLabel(item.category)}
          </p>

          <h3 class="card-title">
            ${item.title}
          </h3>

        </div>
      `;

      card.addEventListener("click", () => {
        openLightbox(item);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(item);
        }
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

              observer.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0.15
        }
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
    const hasImages = images.length > 0;

    lightboxPanel.innerHTML = `
      <div class="lightbox-media">

        ${
          hasImages
            ? `
              <img
                src="${images[currentPhotoIndex]}"
                alt="${item.title}"
              />
            `
            : `
              <div
                class="media-placeholder media-placeholder-lg"
                aria-hidden="true"
              >
                <span>
                  ${item.title
                    .split(/\s+/)
                    .filter((w) =>
                      /[A-Za-zÀ-ÿ]/.test(w)
                    )
                    .slice(0, 2)
                    .map((w) =>
                      w[0].toUpperCase()
                    )
                    .join("")}
                </span>
              </div>
            `
        }

        ${
          hasMultiple
            ? `
              <button
                class="lightbox-nav lightbox-prev"
                aria-label="Foto precedente"
              >
                &#8249;
              </button>

              <button
                class="lightbox-nav lightbox-next"
                aria-label="Foto successiva"
              >
                &#8250;
              </button>

              <span class="lightbox-counter">
                ${currentPhotoIndex + 1} / ${images.length}
              </span>
            `
            : ""
        }

      </div>

      <div class="lightbox-info">

        <p class="card-eyebrow">
          ${categoryLabel(item.category)}
        </p>

        <h3
          class="card-title"
          style="font-size:1.7rem;"
        >
          ${item.title}
        </h3>

        ${
          item.comingSoon
            ? `
              <p class="coming-soon-note">
                Questo pezzo è in lavorazione:
                le foto arriveranno presto.
                Scrivimi se vuoi essere avvisato
                quando è pronto.
              </p>
            `
            : ""
        }

        ${
          hasMultiple
            ? `
              <div class="thumb-strip">

                ${images
                  .map(
                    (src, i) => `
                      <button
                        class="thumb ${
                          i === currentPhotoIndex
                            ? "active"
                            : ""
                        }"
                        data-index="${i}"
                      >
                        <img
                          src="${src}"
                          alt="Foto ${
                            i + 1
                          } di ${item.title}"
                        />
                      </button>
                    `
                  )
                  .join("")}

              </div>
            `
            : ""
        }

        <p class="lightbox-contact">

          <span class="lightbox-contact-lead">
            ${CONTACT.productContact}
          </span>

          <br>

          <a href="mailto:${CONTACT.email}">
            EMAIL: ${CONTACT.email}
          </a>

          <br>

          <a
            href="${CONTACT.telegram}"
            target="_blank"
            rel="noopener"
          >
            TELEGRAM: @michelebuccii
          </a>

          <br>

          <a
            href="${CONTACT.vinted}"
            target="_blank"
            rel="noopener"
          >
            VINTED: ${SITE.name}
          </a>

        </p>

      </div>
    `;

    if (hasMultiple) {
      lightboxPanel
        .querySelector(".lightbox-prev")
        .addEventListener(
          "click",
          () => stepPhoto(-1)
        );

      lightboxPanel
        .querySelector(".lightbox-next")
        .addEventListener(
          "click",
          () => stepPhoto(1)
        );

      lightboxPanel
        .querySelectorAll(".thumb")
        .forEach((btn) => {
          btn.addEventListener(
            "click",
            () => {
              currentPhotoIndex =
                Number(btn.dataset.index);

              renderLightbox();
            }
          );
        });
    }
  }

  function stepPhoto(delta) {
    const total =
      currentItem.images.length;

    currentPhotoIndex =
      (currentPhotoIndex + delta + total) %
      total;

    renderLightbox();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");

    document.body.style.overflow = "";

    currentItem = null;
  }

  document
    .getElementById("lightbox-close")
    .addEventListener(
      "click",
      closeLightbox
    );

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) {
      return;
    }

    if (e.key === "Escape") {
      closeLightbox();
    }

    if (
      e.key === "ArrowLeft" &&
      currentItem &&
      currentItem.images &&
      currentItem.images.length > 1
    ) {
      stepPhoto(-1);
    }

    if (
      e.key === "ArrowRight" &&
      currentItem &&
      currentItem.images &&
      currentItem.images.length > 1
    ) {
      stepPhoto(1);
    }
  });

  function renderFooter() {
    document.getElementById(
      "footer-message"
    ).textContent = CONTACT.footerMessage;

    document.getElementById(
      "footer-contacts"
    ).innerHTML = `
      <a
        class="pill-link"
        href="mailto:${CONTACT.email}"
      >
        ${ICONS.mail} Email
      </a>

      <a
        class="pill-link"
        href="${CONTACT.telegram}"
        target="_blank"
        rel="noopener"
      >
        ${ICONS.telegram} Telegram
      </a>

      <a
        class="pill-link"
        href="${CONTACT.vinted}"
        target="_blank"
        rel="noopener"
      >
        ${ICONS.vinted} Vinted
      </a>

      <a
        class="pill-link"
        href="${CONTACT.tiktok}"
        target="_blank"
        rel="noopener"
      >
        ${ICONS.tiktok} TikTok
      </a>
    `;

    const fineEl = document.getElementById("footer-fine");

    if (fineEl) {
      fineEl.innerHTML = `
        © ${new Date().getFullYear()} ${SITE.name}
        &middot; P.IVA ${SITE.piva}
        &middot; <a href="privacy.html">Privacy e Cookie</a>
      `;
    }
  }

  renderFilters();
  renderFeatured();
  renderGallery();
  renderFooter();
})();