// spotlights.js – Abuja Chamber of Commerce
// Loads member data from data/members.json, filters to Gold (3) and
// Silver (2) members only, randomly picks 2-3 of them, and displays
// their spotlight cards. Runs a fresh random pick on every page load.

document.addEventListener('DOMContentLoaded', function () {
  const spotlightContainer = document.getElementById('spotlightContainer');
  if (!spotlightContainer) return;

  loadSpotlights(spotlightContainer);
});

const MEMBERSHIP_LABELS = { 2: 'Silver Member', 3: 'Gold Member' };

async function loadSpotlights(container) {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();

    const eligible = data.members.filter(
      member => member.membership === 2 || member.membership === 3
    );

    const chosen = pickRandomMembers(eligible, 2, 3);
    displaySpotlights(chosen, container);
  } catch (error) {
    console.error('Error loading member spotlights:', error);
    container.innerHTML =
      '<p class="directory-error">Member spotlights are unavailable right now.</p>';
  }
}

// Fisher-Yates style shuffle, then take a random count between min and max
function pickRandomMembers(pool, min, max) {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const upperBound = Math.min(max, shuffled.length);
  const lowerBound = Math.min(min, shuffled.length);
  const count = lowerBound === upperBound
    ? lowerBound
    : Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;

  return shuffled.slice(0, count);
}

function displaySpotlights(members, container) {
  container.innerHTML = members.map(member => `
    <div class="panel spotlight-feature">
      <span class="member-tier tier-${member.membership}">${MEMBERSHIP_LABELS[member.membership]}</span>
      <img
        class="spotlight-logo-img"
        src="images/${member.image}"
        alt="${member.name} logo"
        loading="lazy"
        onerror="this.onerror=null; this.src='images/placeholder.png';"
      >
      <h3>${member.name}</h3>
      <p class="member-tagline">${member.tagline}</p>
      <ul class="member-details">
        <li><i class="fas fa-phone" aria-hidden="true"></i> <a href="tel:${member.phone}">${member.phone}</a></li>
        <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${member.address}</li>
        <li><i class="fas fa-globe" aria-hidden="true"></i> <a href="${member.url}" target="_blank" rel="noopener">${member.url.replace(/^https?:\/\//, '')}</a></li>
      </ul>
    </div>
  `).join('');
}
