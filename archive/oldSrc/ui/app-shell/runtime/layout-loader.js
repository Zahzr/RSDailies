// Import HTML partials as raw strings using Vite's ?raw feature
import navbarHtml from '../html/navbar.html?raw';
import overviewHtml from '../html/overview.html?raw';
import dashboardHtml from '../html/dashboard.html?raw';
import footerHtml from '../html/footer.html?raw';
import customTaskModalHtml from '../html/modals/custom-task.html?raw';
import tokenModalHtml from '../html/modals/token.html?raw';
import rowTemplateHtml from '../../components/tracker/rows/templates/row-sample.html?raw';

/**
 * Loads and injects modular HTML components into the DOM.
 * This allows index.html to remain a clean shell while providing
 * fine-grained control over UI components.
 */
export async function loadLayout() {
  const mounts = {
    'main-nav': navbarHtml,
    'overview-mount': overviewHtml,
    'dashboard-mount': dashboardHtml,
    'main-footer': footerHtml,
    'token-modal': tokenModalHtml,
    'custom-task-modal': customTaskModalHtml,
    'sample_row': rowTemplateHtml
  };

  for (const [id, html] of Object.entries(mounts)) {
    const el = document.getElementById(id);
    if (el) {
      if (id === 'sample_row') {
        el.innerHTML = html;
      } else {
        el.innerHTML = html;
      }
    } else {
      console.warn(`[LayoutLoader] Mount point not found: ${id}`);
    }
  }

  console.log('[LayoutLoader] Components injected successfully.');
}
