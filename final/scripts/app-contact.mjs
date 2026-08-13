// app-contact.mjs — ES module entry point for contact.html.
// The form itself submits natively (method="get" action="thankyou.html"),
// so it still works with JavaScript disabled. This module just wires up
// the shared nav/footer behavior.

import { initNav } from './nav.mjs';
import { initFooterMeta } from './footer.mjs';

document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initFooterMeta();
});
