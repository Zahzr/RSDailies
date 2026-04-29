import { getPageMode, syncStoredViewModeToPageMode, setPageMode } from '../model.js';
import { positionPanel } from '../../../../ui/components/views/view-panel.js';
import { getPrimaryNavItems, getViewsButtonLabel, getViewsPanelGroups } from '../../../../ui/components/views/views-menu.js';
import { isPanelOpen, replaceInteractiveElement, setPanelOpenState } from '../../../../core/dom/controls.js';

export function closeFloatingControls(documentRef = document) {
  ['profile-control', 'settings-control', 'views-control'].forEach((id) => {
    const element = documentRef.getElementById(id);
    if (!element) return;
    setPanelOpenState(element, false);
  });
}

function setViewsButtonLabel(button, mode) {
  if (!button) return;
  const textNode = button.querySelector('.expanding_text');
  if (textNode) textNode.innerHTML = `&nbsp;${getViewsButtonLabel(mode)}`;
}

function buildViewsDefinition() {
  return getViewsPanelGroups();
}

function renderViewsList(list, onSelectView) {
  if (!list) return;
  list.innerHTML = '';
  buildViewsDefinition().forEach((group) => {
    const heading = document.createElement('li');
    heading.className = 'profile-row';
    heading.style.fontWeight = '700';
    heading.style.opacity = '0.9';
    heading.style.paddingTop = '6px';
    heading.textContent = group.heading;
    list.appendChild(heading);
    group.items.forEach((view) => {
      const item = document.createElement('li');
      item.className = 'profile-row';
      const link = document.createElement('a');
      link.href = '#';
      link.className = 'profile-link';
      link.textContent = view.label;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        onSelectView?.(view.mode);
      });
      item.appendChild(link);
      list.appendChild(item);
    });
  });
}

function upsertPrimaryNavLinks(documentRef, onSelectMode) {
  const navList = documentRef.querySelector('#navbarSupportedContent .navbar-nav.me-auto');
  if (!navList) return;
  navList.querySelectorAll('[data-primary-page-link="true"]').forEach((node) => node.remove());
  const resourcesItem = navList.querySelector('.nav-item.dropdown');
  const definitions = getPrimaryNavItems();

  definitions.forEach((def) => {
    const li = documentRef.createElement('li');
    li.className = 'nav-item';
    li.dataset.primaryPageLink = 'true';
    const link = documentRef.createElement('a');
    link.className = 'nav-link';
    link.href = '#';
    link.textContent = def.label;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      onSelectMode(def.mode);
    });
    li.appendChild(link);
    if (resourcesItem) navList.insertBefore(li, resourcesItem);
    else navList.appendChild(li);
  });
}

export function setupViewsControl({ renderApp = () => {}, documentRef = document, windowRef = window, closeAllFloatingControls = () => closeFloatingControls(documentRef) } = {}) {
  syncStoredViewModeToPageMode();
  const panelButton = documentRef.getElementById('views-button-panel');
  const panel = documentRef.getElementById('views-control');
  const list = documentRef.getElementById('views-list');
  if (!panelButton || !panel || !list) return;

  const button = replaceInteractiveElement(panelButton);
  const panelTitle = panel.querySelector('strong');
  if (panelTitle && panelTitle.textContent.trim().toLowerCase() === 'views') panelTitle.remove();

  function applyMode(mode) {
    setPageMode(mode);
    setViewsButtonLabel(button, mode);
    setPanelOpenState(panel, false);
    renderApp();
  }

  upsertPrimaryNavLinks(documentRef, applyMode);
  const currentMode = getPageMode();
  setPageMode(currentMode);
  setViewsButtonLabel(button, currentMode);

  function renderList() {
    renderViewsList(list, applyMode);
  }

  function openPanel() {
    closeAllFloatingControls();
    renderList();
    setPanelOpenState(panel, true);
    positionPanel(panel, button, windowRef);
  }

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const visible = isPanelOpen(panel);
    if (visible) {
      setPanelOpenState(panel, false);
    } else {
      openPanel();
    }
  });

  documentRef.addEventListener('page-mode-sync', (event) => {
    const mode = event?.detail?.mode || getPageMode();
    setViewsButtonLabel(button, mode);
    renderList();
  });
}
