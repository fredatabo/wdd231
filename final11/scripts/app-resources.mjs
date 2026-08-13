// app-resources.mjs — ES module entry point for resources.html (Waypoint 3: Connect)

import { initNav } from './nav.mjs';
import { initFooterMeta } from './footer.mjs';

document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initFooterMeta();
});
