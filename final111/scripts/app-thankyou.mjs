// app-thankyou.mjs — ES module entry point for thankyou.html.
// Reads the query string produced by contact.html's native GET
// submission and renders it as a summary table.

import { initNav } from './nav.mjs';
import { initFooterMeta } from './footer.mjs';

const FIELD_LABELS = {
  name: 'Name',
  email: 'Email',
  reason: 'Reason for reaching out',
  contactMethod: 'Preferred contact method',
  jobAlerts: 'Weekly job alert emails',
  message: 'Message'
};

document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initFooterMeta();

  const summaryEl = document.getElementById('submissionSummary');
  const params = new URLSearchParams(window.location.search);

  if (!summaryEl) return;

  if ([...params].length === 0) {
    summaryEl.innerHTML = '<p class="state-msg">No submission found. <a href="contact.html">Go back to the form</a>.</p>';
    return;
  }

  const rows = Object.keys(FIELD_LABELS)
    .filter(function (key) { return params.has(key); })
    .map(function (key) {
      let value = params.get(key);
      if (key === 'jobAlerts') value = value === 'on' ? 'Yes' : 'No';
      return `<tr><th scope="row">${FIELD_LABELS[key]}</th><td>${escapeHtml(value)}</td></tr>`;
    })
    .join('');

  summaryEl.innerHTML = `<table class="summary-table"><tbody>${rows}</tbody></table>`;
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}
