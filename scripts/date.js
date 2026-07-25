// date.js — dynamic copyright year + last-modified date

const currentYear = new Date().getFullYear();
document.getElementById('copyrightYear').textContent = currentYear;

document.getElementById('lastModified').textContent =
    `Last updated: ${document.lastModified}`;