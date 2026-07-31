// join.js – Abuja Chamber of Commerce
// Handles join page functionality: timestamp, modals, card animations

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ----- SET TIMESTAMP HIDDEN FIELD -----
  const tsInput = document.getElementById('timestamp');
  if (tsInput) {
    tsInput.value = new Date().toISOString();
  }

  // ----- MODAL FUNCTIONALITY -----
  const modalLinks = document.querySelectorAll('.card-link[data-modal]');
  const modals = document.querySelectorAll('.modal');
  const closeBtns = document.querySelectorAll('.modal-close');

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      // Trap focus inside modal
      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) {
        focusable[0].focus();
      }
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // Return focus to the link that opened it
      const trigger = document.querySelector(
        `[data-modal="${modal.id}"]`
      );
      if (trigger) {
        trigger.focus();
      }
    }
  }

  // Open modal on link click
  modalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('data-modal');
      if (target) {
        openModal(target);
      }
    });
  });

  // Close modal on X button click
  closeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    });
  });

  // Close modal when clicking outside content
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.style.display === 'block') {
          closeModal(modal);
        }
      });
    }
  });

  // ----- CARD ANIMATIONS ON LOAD -----
  const cards = document.querySelectorAll('.animated-card');
  cards.forEach((card, index) => {
    // Set initial state (will be overridden by CSS transition)
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    // Stagger the animation
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + (index * 150));
  });

  console.log('🏛️ Join page initialized.');
});