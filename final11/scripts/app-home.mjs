// app-home.mjs — ES module entry point for index.html (Waypoint 1: Prep)

import { initNav } from './nav.mjs';
import { initFooterMeta } from './footer.mjs';

document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initFooterMeta();
});
