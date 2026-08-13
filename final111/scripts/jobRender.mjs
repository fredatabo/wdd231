// jobRender.mjs — ES module. Pure string/DOM helpers for turning a
// Remotive job object into safe HTML. No fetching or state lives here.

export function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return tmp.textContent || tmp.innerText || '';
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

export function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

export function buildTagsHtml(job) {
  const jobType = job.job_type ? job.job_type.replace(/_/g, ' ') : '';
  return (
    (job.category ? `<span class="job-tag">${escapeHtml(job.category)}</span>` : '') +
    (jobType ? `<span class="job-tag">${escapeHtml(jobType)}</span>` : '') +
    (job.candidate_required_location ? `<span class="job-tag">${escapeHtml(job.candidate_required_location)}</span>` : '') +
    (job.salary ? `<span class="job-tag salary">${escapeHtml(job.salary)}</span>` : '')
  );
}

export function buildCardHtml(job, saved) {
  const description = stripHtml(job.description).slice(0, 160).trim() + '\u2026';
  const logo = job.company_logo || '';

  return `
    <article class="job-card" data-job-id="${job.id}">
      <div class="job-card-top">
        ${logo
          ? `<img class="job-card-logo" src="${escapeAttr(logo)}" alt="" width="46" height="46" loading="lazy" onerror="this.style.display='none'">`
          : ''}
        <button type="button" class="job-card-title-btn" data-action="open-modal" data-job-id="${job.id}">
          <h3 class="job-card-title">${escapeHtml(job.title)}</h3>
          <p class="job-card-company">${escapeHtml(job.company_name)}</p>
        </button>
        <button type="button" class="save-btn" data-action="toggle-save" data-job-id="${job.id}"
                aria-pressed="${saved ? 'true' : 'false'}"
                aria-label="${saved ? 'Remove from saved roles' : 'Save this role'}">
          <i class="fa-solid fa-bookmark" aria-hidden="true"></i>
        </button>
      </div>
      <div class="job-tags">${buildTagsHtml(job)}</div>
      <p class="job-card-desc">${escapeHtml(description)}</p>
      <div class="job-card-actions">
        <button type="button" class="btn btn-ghost" data-action="open-modal" data-job-id="${job.id}">Details</button>
        <a class="btn btn-primary" href="${escapeAttr(job.url)}" target="_blank" rel="noopener">View &amp; Apply</a>
      </div>
    </article>
  `;
}

export function buildModalHtml(job) {
  const jobType = job.job_type ? job.job_type.replace(/_/g, ' ') : '';
  return `
    <div class="modal-header">
      <h2>${escapeHtml(job.title)}</h2>
      <button type="button" class="modal-close" data-action="close-modal" aria-label="Close">&times;</button>
    </div>
    <div class="modal-body">
      <p class="job-card-company">${escapeHtml(job.company_name)}${jobType ? ' &middot; ' + escapeHtml(jobType) : ''}</p>
      <div class="job-tags">${buildTagsHtml(job)}</div>
      <div>${sanitizeDescription(job.description)}</div>
    </div>
    <div class="modal-footer">
      <span class="job-source">via Remotive</span>
      <a class="btn btn-primary" href="${escapeAttr(job.url)}" target="_blank" rel="noopener">View &amp; Apply</a>
    </div>
  `;
}

// The Remotive API returns the job description as a small HTML fragment
// (paragraphs, lists, bold text). We allow only a safe subset of tags
// instead of dumping raw innerHTML from an external source.
function sanitizeDescription(html) {
  const allowed = new Set(['P', 'BR', 'UL', 'OL', 'LI', 'STRONG', 'EM', 'B', 'I', 'H3', 'H4', 'A']);
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';

  (function clean(node) {
    Array.from(node.childNodes).forEach(function (child) {
      if (child.nodeType === 1) {
        if (!allowed.has(child.tagName)) {
          const text = document.createTextNode(child.textContent + ' ');
          node.replaceChild(text, child);
          return;
        }
        // strip all attributes except a safe href on anchors
        Array.from(child.attributes).forEach(function (attr) {
          if (!(child.tagName === 'A' && attr.name === 'href')) {
            child.removeAttribute(attr.name);
          }
        });
        if (child.tagName === 'A') {
          child.setAttribute('target', '_blank');
          child.setAttribute('rel', 'noopener');
        }
        clean(child);
      }
    });
  })(tmp);

  return tmp.innerHTML;
}
