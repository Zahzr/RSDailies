import { getPageMode, getViews, migrateLegacyViewModeToPageMode, setPageMode } from './model.js';
import { positionPanel, renderViewsList } from './view.js';

export function closeFloatingControls(documentRef = document) {
  ['profile-control', 'settings-control', 'views-control'].forEach((id) => {
    const element = documentRef.getElementById(id);
    if (!element) return;
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.dataset.display = 'none';
  });
}

export function setupViewsControl({
  renderApp = () => {},
  documentRef = document,
  windowRef = window,
  closeAllFloatingControls = () => closeFloatingControls(documentRef)
} = {}) {
  migrateLegacyViewModeToPageMode();

  const navbarButton = documentRef.getElementById('views-button');
  const panelButton = documentRef.getElementById('views-button-panel');
  const panel = documentRef.getElementById('views-control');
  const list = documentRef.getElementById('views-list');

  navbarButton?.closest('li')?.setAttribute('style', 'display:none; visibility:hidden;');

  const buttons = [panelButton].filter(Boolean);
  if (!buttons.length || !panel || !list) return;

  function render() {
    renderViewsList(list, getViews(), (mode) => {
      setPageMode(mode);
      closeAllFloatingControls();
      renderApp();
    });
  }

  function openFrom(button) {
    closeAllFloatingControls();
    panel.style.display = 'block';
    panel.style.visibility = 'visible';
    panel.dataset.display = 'block';
    panel.dataset.anchor = button.id || '';
    render();
    positionPanel(panel, button, windowRef);
  }

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();

      const visible = panel.dataset.display === 'block';
      const sameAnchor = (panel.dataset.anchor || '') === (button.id || '');
      if (visible && sameAnchor) {
        closeAllFloatingControls();
        return;
      }

      openFrom(button);
    });
  });

  windowRef.addEventListener('resize', () => {
    if (panel.dataset.display !== 'block') return;
    const anchorId = panel.dataset.anchor || '';
    if (!anchorId) return;
    const anchor = documentRef.getElementById(anchorId);
    if (!anchor) return;
    positionPanel(panel, anchor, windowRef);
  });
}

export { getPageMode, getViews, migrateLegacyViewModeToPageMode, setPageMode };
