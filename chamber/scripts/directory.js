// directory.js – Abuja Chamber of Commerce
// Loads member data from data/members.json and renders it into the
// directory page, with a grid/list view toggle.

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const memberContainer = document.getElementById('memberContainer');
  const gridBtn = document.getElementById('gridViewBtn');
  const listBtn = document.getElementById('listViewBtn');

  const membershipLabels = { 1: 'Member', 2: 'Silver', 3: 'Gold' };

  async function loadMembers() {
    try {
      const response = await fetch('data/members.json');
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      displayMembers(data.members);
    } catch (error) {
      console.error('Error loading member directory:', error);
      if (memberContainer) {
        memberContainer.innerHTML =
          '<p class="directory-error">Sorry, the member directory could not be loaded right now. Please try again later.</p>';
      }
    }
  }

  function displayMembers(members) {
    if (!memberContainer) return;

    memberContainer.innerHTML = members.map(member => `
      <div class="panel member-panel">
        <span class="member-tier tier-${member.membership}">${membershipLabels[member.membership] || 'Member'}</span>
        <div class="member-body">
          <img
            class="member-image"
            src="images/members/${member.image}"
            alt="${member.name} logo"
            loading="lazy"
            onerror="this.onerror=null; this.src='images/members/placeholder.png';"
          >
          <div class="member-info">
            <h3>${member.name}</h3>
            <p class="member-tagline">${member.tagline}</p>
            <ul class="member-details">
              <li><i class="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:${member.email}">${member.email}</a></li>
              <li><i class="fas fa-phone" aria-hidden="true"></i> <a href="tel:${member.phone}">${member.phone}</a></li>
              <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${member.address}</li>
              <li><i class="fas fa-globe" aria-hidden="true"></i> <a href="${member.url}" target="_blank" rel="noopener">${member.url.replace(/^https?:\/\//, '')}</a></li>
            </ul>
          </div>
        </div>
      </div>
    `).join('');
  }

  function setView(view) {
    if (!memberContainer || !gridBtn || !listBtn) return;

    const isList = view === 'list';
    memberContainer.classList.toggle('list-view', isList);

    listBtn.classList.toggle('toggle-option-active', isList);
    gridBtn.classList.toggle('toggle-option-active', !isList);

    listBtn.setAttribute('aria-pressed', String(isList));
    gridBtn.setAttribute('aria-pressed', String(!isList));
  }

  if (gridBtn && listBtn) {
    gridBtn.addEventListener('click', () => setView('grid'));
    listBtn.addEventListener('click', () => setView('list'));
  }

  loadMembers();
});