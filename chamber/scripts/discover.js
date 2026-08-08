// discover.js – Abuja Chamber of Commerce
// Imports the 8 discover items from data/discover.mjs (ES module) and
// builds the cards, plus shows a localStorage-based "last visit" message.
// Loaded with <script type="module" src="scripts/discover.js"></script>

import { discoverItems } from '../data/discover.mjs';

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ----- BUILD THE 8 CARDS -----
  const gallery = document.getElementById('discoverGallery');

  if (gallery) {
    gallery.innerHTML = discoverItems
      .map(
        (item, index) => `
      <section class="discover-card" style="grid-area: c${index + 1};">
        <h2>${item.name}</h2>
        <figure>
          <img src="${item.image}" alt="${item.name}" loading="lazy" width="300" height="200">
        </figure>
        <address>${item.address}</address>
        <p>${item.description}</p>
        <button type="button" class="cta-link cta-secondary learn-more-btn">Learn More</button>
      </section>`
      )
      .join('');
  }

  // ----- LAST VISIT MESSAGE (localStorage) -----
  const visitMessageEl = document.getElementById('visitMessage');

  if (visitMessageEl) {
    const now = Date.now();
    const lastVisit = localStorage.getItem('lastVisit');
    let message = '';

    if (!lastVisit) {
      // First time this visitor's browser has stored a visit
      message = 'Welcome! Let us know if you have any questions.';
    } else {
      const msBetween = now - Number(lastVisit);
      const daysBetween = Math.floor(msBetween / (1000 * 60 * 60 * 24));

      if (msBetween < 1000 * 60 * 60 * 24) {
        // Less than a day (24 hours) since the last visit
        message = 'Back so soon! Awesome!';
      } else if (daysBetween === 1) {
        message = 'You last visited 1 day ago.';
      } else {
        message = `You last visited ${daysBetween} days ago.`;
      }
    }

    visitMessageEl.textContent = message;
    localStorage.setItem('lastVisit', now);
  }
});
