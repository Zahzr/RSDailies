// Import HTML partials as raw strings using Vite's ?raw feature
import navbarHtml from '../../index/components/navbar.html?raw';
import overviewHtml from '../../index/components/overview.html?raw';
import dashboardHtml from '../../index/components/dashboard.html?raw';
import footerHtml from '../../index/components/footer.html?raw';
import customTaskModalHtml from '../../index/components/modals/custom-task.html?raw';
import tokenModalHtml from '../../index/components/modals/token.html?raw';
import rowTemplateHtml from '../../index/templates/row-sample.html?raw';

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
