export function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

// Slug univoco: i prodotti con lo stesso titolo ricevono un suffisso (-2, -3, ...)
// in base all'ordine in cui compaiono nella lista.
export function itemSlug(item, items) {
  const base = slugify(item.title);
  const sameTitle = items.filter((c) => slugify(c.title) === base);
  const position = sameTitle.indexOf(item);
  return position > 0 ? `${base}-${position + 1}` : base;
}
