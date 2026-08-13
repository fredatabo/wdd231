// app-jobs.mjs — ES module entry point for job-listings.html (Waypoint 2: Search)
//
// Fetches live listings from the Remotive public API (no key required)
// once on load, then filters/searches entirely client-side. Remotive's
// own docs ask API users not to poll more than a couple of times a
// day and will block callers who request more than twice a minute —
// see https://github.com/remotive-com/remote-jobs-api — so re-fetching
// on every keystroke or dropdown change would be the wrong move here.

import { initNav } from './nav.mjs';
import { initFooterMeta } from './footer.mjs';
import { buildCardHtml, buildModalHtml } from './jobRender.mjs';
import { getSavedIds, isSaved, toggleSaved } from './savedJobs.mjs';

const API_URL = 'https://remotive.com/api/remote-jobs?limit=150';

const state = {
  allJobs: [],
  status: 'loading' // 'loading' | 'ready' | 'error'
};

document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initFooterMeta();

  const resultsEl = document.getElementById('jobResults');
  const metaEl = document.getElementById('resultsMeta');
  const searchInput = document.getElementById('jobSearch');
  const categorySelect = document.getElementById('jobCategory');
  const savedOnlyCheckbox = document.getElementById('savedOnly');
  const form = document.getElementById('jobFilterForm');
  const resetBtn = document.getElementById('resetFilters');
  const modal = document.getElementById('jobModal');
  const modalBody = document.getElementById('jobModalBody');
  let lastFocusedEl = null;

  loadJobs();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    renderResults();
  });

  let debounceTimer;
  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(renderResults, 200);
  });

  categorySelect.addEventListener('change', renderResults);
  savedOnlyCheckbox.addEventListener('change', renderResults);

  resetBtn.addEventListener('click', function () {
    searchInput.value = '';
    categorySelect.value = '';
    savedOnlyCheckbox.checked = false;
    renderResults();
  });

  // event delegation: one listener handles every card's "save" and
  // "details" buttons, including ones rendered after this point
  resultsEl.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const jobId = Number(btn.dataset.jobId);
    const job = state.allJobs.find(function (j) { return j.id === jobId; });
    if (!job) return;

    if (btn.dataset.action === 'toggle-save') {
      const nowSaved = toggleSaved(jobId);
      btn.setAttribute('aria-pressed', String(nowSaved));
      btn.setAttribute('aria-label', nowSaved ? 'Remove from saved roles' : 'Save this role');
      if (savedOnlyCheckbox.checked) renderResults();
    } else if (btn.dataset.action === 'open-modal') {
      openModal(job, btn);
    }
  });

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-action="close-modal"]') || e.target === modal) {
      closeModal();
    }
  });
  modal.addEventListener('close', function () {
    if (lastFocusedEl) lastFocusedEl.focus();
  });

  function openModal(job, triggerEl) {
    lastFocusedEl = triggerEl;
    modalBody.innerHTML = buildModalHtml(job);
    modal.showModal();
  }

  function closeModal() {
    modal.close();
  }

  async function loadJobs() {
    state.status = 'loading';
    renderResults();

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Remotive responded with ' + response.status);

      const data = await response.json();
      state.allJobs = Array.isArray(data.jobs) ? data.jobs : [];
      state.status = 'ready';

      populateCategories(state.allJobs);
      renderResults();
    } catch (err) {
      console.error('Failed to load jobs:', err);
      state.status = 'error';
      renderResults();
    }
  }

  function populateCategories(jobs) {
    const categories = Array.from(new Set(jobs.map(function (j) { return j.category; })))
      .filter(Boolean)
      .sort(function (a, b) { return a.localeCompare(b); });

    categories.forEach(function (cat) {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });
  }

  function renderResults() {
    if (state.status === 'loading') {
      metaEl.textContent = '';
      resultsEl.innerHTML = '<p class="state-msg">Fetching current listings from Remotive&hellip;</p>';
      return;
    }

    if (state.status === 'error') {
      metaEl.textContent = '';
      resultsEl.innerHTML =
        '<p class="state-msg error">Couldn\'t reach Remotive right now. Check your connection and try again.</p>' +
        '<div style="text-align:center;"><button type="button" class="btn btn-ghost" id="retryLoad">Retry</button></div>';
      const retryBtn = document.getElementById('retryLoad');
      if (retryBtn) retryBtn.addEventListener('click', loadJobs);
      return;
    }

    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const savedOnly = savedOnlyCheckbox.checked;
    const savedIds = getSavedIds();

    const filtered = state.allJobs.filter(function (job) {
      const matchesQuery =
        !query ||
        (job.title && job.title.toLowerCase().includes(query)) ||
        (job.company_name && job.company_name.toLowerCase().includes(query));
      const matchesCategory = !category || job.category === category;
      const matchesSaved = !savedOnly || savedIds.includes(job.id);
      return matchesQuery && matchesCategory && matchesSaved;
    });

    metaEl.textContent = filtered.length + ' open role' + (filtered.length === 1 ? '' : 's') +
      (savedOnly ? ' saved' : query || category ? ' matching your filters' : ' currently listed');

    if (filtered.length === 0) {
      resultsEl.innerHTML = savedOnly
        ? '<p class="state-msg">You haven\'t saved any roles yet. Tap the bookmark icon on a card to keep it here.</p>'
        : '<p class="state-msg">No roles match that search. Try a broader keyword or clear the category filter.</p>';
      return;
    }

    const toRender = filtered.slice(0, 60);
    resultsEl.innerHTML = toRender.map(function (job) {
      return buildCardHtml(job, isSaved(job.id));
    }).join('');
  }
});
