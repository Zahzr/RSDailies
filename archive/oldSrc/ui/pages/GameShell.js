import { GAMES, getSelectedGame, setSelectedGame, subscribeToGameChanges } from '../../core/state/GameContext.js';

function ensureOsrsEmptyState(documentRef) {
  let panel = documentRef.getElementById('osrs-empty-state');
  if (panel) return panel;

  panel = documentRef.createElement('div');
  panel.id = 'osrs-empty-state';
  panel.className = 'container-xl osrs-empty-state';
  panel.innerHTML = `<div class="alert alert-dark border-secondary text-center" role="status"><h2 class="h4 mb-2">Old School RuneScape</h2><p class="mb-0">The OSRS shell is active. Add OSRS task configuration files under <code>src/data/osrs</code> and the tracker shell can render them without changing RS3 logic.</p></div>`;

  const dashboard = documentRef.getElementById('dashboard-container');
  dashboard?.parentNode?.insertBefore(panel, dashboard);
  return panel;
}

function ensureGameSelectionPage(documentRef) {
  let page = documentRef.getElementById('game-selection-page');
  if (page) return page;

  page = documentRef.createElement('main');
  page.id = 'game-selection-page';
  page.className = 'container-xl game-selection-page';
  page.innerHTML = `
    <section class="game-selection-card" aria-labelledby="game-selection-title">
      <img class="game-selection-logo" src="/RSDailies/img/dailyscapebig.png" alt="RSDailies">
      <h1 id="game-selection-title">Choose Your Dailyscape</h1>
      <p>Select a game mode to open the matching tracker workspace.</p>
      <div class="game-selection-actions">
        <button type="button" class="btn btn-primary btn-lg primitive-btn" data-game-choice="rs3">RuneScape 3</button>
        <button type="button" class="btn btn-secondary btn-lg primitive-btn" data-game-choice="osrs">Old School RuneScape</button>
      </div>
    </section>`;

  const overview = documentRef.getElementById('overview-mount');
  overview?.parentNode?.insertBefore(page, overview);
  return page;
}

function createGameButtons(documentRef) {
  if (documentRef.getElementById('game-switcher-control')) return;

  const navRight = documentRef.querySelector('.nav-right');
  if (!navRight) return;

  const li = documentRef.createElement('li');
  li.id = 'game-switcher-control';
  li.className = 'nav-item d-flex align-items-center gap-2 me-2';
  li.innerHTML = `<button type="button" class="btn btn-secondary btn-sm primitive-btn" data-game-choice="rs3">RS3</button><button type="button" class="btn btn-secondary btn-sm primitive-btn" data-game-choice="osrs">OSRS</button>`;
  navRight.insertBefore(li, navRight.firstChild);
}

function bindGameChoices(documentRef) {
  documentRef.querySelectorAll('[data-game-choice]').forEach((button) => {
    if (button.dataset.choiceBound === 'true') return;
    button.dataset.choiceBound = 'true';
    button.addEventListener('click', () => setSelectedGame(button.dataset.gameChoice));
  });
}

function renderGame(documentRef) {
  const game = getSelectedGame();
  const hasGame = game === GAMES.RS3 || game === GAMES.OSRS;
  const isOsrs = game === GAMES.OSRS;

  const dashboard = documentRef.getElementById('dashboard-container');
  const overview = documentRef.getElementById('overview-mount');
  const selection = ensureGameSelectionPage(documentRef);
  const osrsPanel = ensureOsrsEmptyState(documentRef);
  const switcher = documentRef.getElementById('game-switcher-control');

  selection.hidden = hasGame;
  if (dashboard) dashboard.hidden = !hasGame || isOsrs;
  if (overview) overview.hidden = !hasGame || isOsrs;
  osrsPanel.hidden = !hasGame || !isOsrs;
  if (switcher) switcher.hidden = !hasGame;

  documentRef.querySelectorAll('[data-game-choice]').forEach((button) => {
    const active = button.dataset.gameChoice === game;
    button.classList.toggle('btn-primary', active);
    button.classList.toggle('btn-secondary', !active);
    button.setAttribute('aria-pressed', String(active));
  });
}

export function setupGameShell(documentRef = document) {
  ensureGameSelectionPage(documentRef);
  createGameButtons(documentRef);
  bindGameChoices(documentRef);
  renderGame(documentRef);
  return subscribeToGameChanges(() => renderGame(documentRef));
}
