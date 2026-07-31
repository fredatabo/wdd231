// join.js – Abuja Chamber of Commerce
// Handles: hidden timestamp field + membership level dialogs on join.html

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ----- HIDDEN TIMESTAMP FIELD -----
  // Records the exact date/time the form was loaded by the user.
  const timestampField = document.getElementById('timestamp');
  if (timestampField) {
    timestampField.value = new Date().toString();
  }

  // ----- MEMBERSHIP LEVEL DIALOGS -----
  document.querySelectorAll('.level-card-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const dialog = document.getElementById(link.getAttribute('data-dialog'));
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    });
  });

  document.querySelectorAll('.level-dialog').forEach(function (dialog) {
    const closeBtn = dialog.querySelector('[data-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        dialog.close();
      });
    }

    // Close when clicking the backdrop (click target is the <dialog> itself,
    // never the inner content, when it lands outside the visible box)
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) {
        dialog.close();
      }
    });
  });
});