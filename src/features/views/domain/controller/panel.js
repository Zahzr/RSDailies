import { getPageMode, syncStoredViewModeToPageMode, setPageMode } from '../model.js';
import { positionPanel } from '../../../../ui/components/views/view-panel.js';
import { getPrimaryNavItems, getViewsButtonLabel, getViewsPanelGroups } from '../../../../ui/components/views/views-menu.js';
import { replaceInteractiveElement, setPanelOpenState } from '../../../../core/dom/controls.js';
import { bindFloatingPanelTrigger } from '../../../../core/dom/panel-controls.js';
import { GAMES, getSelectedGame, subscribeToGameChanges } from '../../../../core/state/GameContext.js';

export function closeFloatingControls(documentRef = document) {
  ['profile-control', 'settings-control', 'views-control'].forEach((id) => {
    const element = documentRef.getElementById(id);
    if (!element) return;
    setPanelOpenState(element, false);
  });
}

function getActiveGame(game = getSelectedGame()) {
  return game === GAMES.OSRS ? GAMES.OSRS : GAMES.RS3;
}

function setViewsButtonLabel(button, mode, game) {
  if (!button) return;
  const textNode = button.querySelector('.expanding_text');
  if (textNode) textNode.innerHTML = `&nbsp;${getViewsButtonLabel(mode, game)}`;
}

function buildViewsDefinition(game) {
  return getViewsPanelGroups(game);
}

function renderViewsList(list, onSelectView, game) {
  if (!list) return;
  list.innerHTML = '';
  buildViewsDefinition(game).forEach((group) => {
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

function createPrimaryNavDropdown(documentRef, definition, onSelectMode) {
  const li = documentRef.createElement('li');
  li.className = 'nav-item dropdown';
  li.dataset.primaryPageLink = 'true';

  const toggle = documentRef.createElement('a');
  toggle.className = 'nav-link dropdown-toggle';
  toggle.href = '#';
  toggle.role = 'button';
  toggle.textContent = definition.label;

  const menu = documentRef.createElement('ul');
  menu.className = 'dropdown-menu';

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    const nextOpen = !li.classList.contains('show');
    li.classList.toggle('show', nextOpen);
    menu.classList.toggle('show', nextOpen);
  });

  definition.items.forEach((itemDefinition) => {
    const item = documentRef.createElement('li');
    const link = documentRef.createElement('a');
    link.className = 'dropdown-item';
    link.href = '#';
    link.textContent = itemDefinition.label;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      li.classList.remove('show');
      menu.classList.remove('show');
      onSelectMode(itemDefinition.mode);
    });
    item.appendChild(link);
    menu.appendChild(item);
  });

  li.appendChild(toggle);
  li.appendChild(menu);
  return li;
}

function upsertPrimaryNavLinks(documentRef, onSelectMode, game) {
  const navList = documentRef.querySelector('#navbarSupportedContent .navbar-nav.me-auto');
  if (!navList) return;
  navList.querySelectorAll('[data-primary-page-link="true"]').forEach((node) => node.remove());
  const resourcesItem = navList.querySelector('.nav-item.dropdown');
  const definitions = getPrimaryNavItems(game);

  definitions.forEach((def) => {
    const li = def.type === 'dropdown'
      ? createPrimaryNavDropdown(documentRef, def, onSelectMode)
      : (() => {
        const linkItem = documentRef.createElement('li');
        linkItem.className = 'nav-item';
        linkItem.dataset.primaryPageLink = 'true';
        const link = documentRef.createElement('a');
        link.className = 'nav-link';
        link.href = '#';
        link.textContent = def.label;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          onSelectMode(def.mode);
        });
        linkItem.appendChild(link);
        return linkItem;
      })();
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
    const game = getActiveGame();
    setPageMode(mode, game);
    setViewsButtonLabel(button, mode, game);
    setPanelOpenState(panel, false);
    renderApp();
  }

  const initialGame = getActiveGame();
  upsertPrimaryNavLinks(documentRef, applyMode, initialGame);
  const currentMode = getPageMode(initialGame);
  setPageMode(currentMode, initialGame);
  setViewsButtonLabel(button, currentMode, initialGame);

  function renderList(game = getActiveGame()) {
    renderViewsList(list, applyMode, game);
  }

  function openPanel() {
    closeAllFloatingControls();
    renderList();
    setPanelOpenState(panel, true);
    positionPanel(panel, button, windowRef);
  }

  bindFloatingPanelTrigger({
    button,
    panel,
    closePanels: closeAllFloatingControls,
    onOpen: () => {
      openPanel();
    },
  });

  documentRef.addEventListener('page-mode-sync', (event) => {
    const game = event?.detail?.game || getActiveGame();
    const mode = event?.detail?.mode || getPageMode(game);
    setViewsButtonLabel(button, mode, game);
    renderList();
  });

  subscribeToGameChanges((game) => {
    const activeGame = getActiveGame(game);
    const nextMode = syncStoredViewModeToPageMode(activeGame);
    setPageMode(nextMode, activeGame);
    upsertPrimaryNavLinks(documentRef, applyMode, activeGame);
    renderList(activeGame);
    setViewsButtonLabel(button, nextMode, activeGame);
    renderApp();
  });
}
