// footer.mjs — ES module. Fills in the footer's copyright year and
// last-modified date. Imported by every page's entry module.

export function initFooterMeta() {
  const yearEl = document.getElementById('currentyear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const modEl = document.getElementById('lastmodified');
  if (modEl) modEl.textContent = document.lastModified;
}
