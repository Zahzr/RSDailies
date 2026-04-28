import { getTrackerSections } from '../../../app/registries/unified-registry.js';
import { buildSectionPanelHtml } from './section-panel.js';

export function renderAppView(documentRef = document) {
  const dashboardMount = documentRef.getElementById('dashboard-mount');
  if (!dashboardMount) {
    return;
  }

  dashboardMount.innerHTML = getTrackerSections().map(buildSectionPanelHtml).join('\n');
}
