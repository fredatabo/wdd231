// chamber.js – Abuja Chamber of Commerce
// Shared site-wide behavior only: mobile menu toggle + footer date info.
// Safe to include on every page.

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ----- MOBILE NAV TOGGLE -----
  const hamburger = document.getElementById('hamburger');
  const menuList = document.querySelector('.menu-list');

  if (hamburger && menuList) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      menuList.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !menuList.contains(e.target)) {
        menuList.classList.remove('open');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuList.classList.contains('open')) {
        menuList.classList.remove('open');
      }
    });
  }

  // ----- FOOTER: COPYRIGHT YEAR + LAST MODIFIED DATE (all pages) -----
  const yearEl = document.getElementById('currentyear');
  const modifiedEl = document.getElementById('lastmodified');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  if (modifiedEl) {
    modifiedEl.textContent = document.lastModified;
  }

  console.log('🏛️ Abuja Chamber of Commerce — page loaded.');
});
