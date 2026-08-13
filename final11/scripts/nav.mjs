// nav.mjs — ES module. Handles the responsive hamburger nav toggle.
// Imported by every page's entry module.

export function initNav() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menuList');
  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = menu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}
