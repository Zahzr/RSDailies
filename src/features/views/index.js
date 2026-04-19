const PAGE_MODE_KEY = 'pageMode';
const LEGACY_VIEW_MODE_KEY = 'viewMode';

const VALID_PAGE_MODES = new Set([
  'all',
  'overview',
  'custom',
  'rs3farming',
  'rs3daily',
  'gathering',
  'rs3weekly',
  'rs3monthly'
]);

function normalizePageMode(mode) {
  if (VALID_PAGE_MODES.has(mode)) return mode;
  return 'all';
}

function legacyToPageMode(legacyMode) {
  switch (legacyMode) {
    case 'overview':
      return 'overview';
    case 'custom':
      return 'custom';
    case 'farming':
    case 'rs3farming':
      return 'rs3farming';
    case 'daily':
    case 'dailies':
    case 'rs3daily':
      return 'rs3daily';
    case 'gathering':
      return 'gathering';
    case 'weekly':
    case 'weeklies':
    case 'rs3weekly':
      return 'rs3weekly';
    case 'monthly':
    case 'monthlies':
    case 'rs3monthly':
      return 'rs3monthly';
    case 'all':
    default:
      return 'all';
  }
}

export function migrateLegacyViewModeToPageMode({
  localStorageRef = window.localStorage
} = {}) {
  const current = localStorageRef.getItem(PAGE_MODE_KEY);
  if (VALID_PAGE_MODES.has(current)) return current;

  const legacy = localStorageRef.getItem(LEGACY_VIEW_MODE_KEY);
  const migrated = legacyToPageMode(legacy);

  localStorageRef.setItem(PAGE_MODE_KEY, migrated);
  return migrated;
}

export function getPageMode({
  localStorageRef = window.localStorage
} = {}) {
  const current = localStorageRef.getItem(PAGE_MODE_KEY);
  return normalizePageMode(current);
}

export function setPageMode(mode, {
  localStorageRef = window.localStorage
} = {}) {
  const normalized = normalizePageMode(mode);
  localStorageRef.setItem(PAGE_MODE_KEY, normalized);
  return normalized;
}

export function closeFloatingControls(documentRef = document) {
  const ids = ['profile-control', 'settings-control', 'views-control'];

  ids.forEach((id) => {
    const el = documentRef.getElementById(id);
    if (!el) return;

    el.style.display = 'none';
    el.style.visibility = 'hidden';
    el.dataset.display = 'none';
  });
}

function setExpandedLabelText(documentRef, mode) {
  const label = documentRef.getElementById('view-mode-label');
  if (!label) return;

  switch (mode) {
    case 'overview':
      label.textContent = 'Overview';
      break;
    case 'custom':
      label.textContent = 'Custom';
      break;
    case 'rs3farming':
      label.textContent = 'Farming';
      break;
    case 'rs3daily':
      label.textContent = 'Dailies';
      break;
    case 'gathering':
      label.textContent = 'Gathering';
      break;
    case 'rs3weekly':
      label.textContent = 'Weeklies';
      break;
    case 'rs3monthly':
      label.textContent = 'Monthlies';
      break;
    case 'all':
    default:
      label.textContent = 'All';
      break;
  }
}

function ensureViewsControlMarkup(documentRef) {
  const host = documentRef.getElementById('views-control');
  if (!host) return null;

  host.innerHTML = `
    <strong>Views</strong>
    <div class="views-control-buttons">
      <button type="button" class="btn btn-sm btn-primary" data-view-mode="all">All</button>
      <button type="button" class="btn btn-sm btn-primary" data-view-mode="overview">Overview</button>
      <button type="button" class="btn btn-sm btn-primary" data-view-mode="custom">Custom</button>
      <button type="button" class="btn btn-sm btn-primary" data-view-mode="rs3farming">Farming</button>
      <button type="button" class="btn btn-sm btn-primary" data-view-mode="rs3daily">Dailies</button>
      <button type="button" class="btn btn-sm btn-primary" data-view-mode="gathering">Gathering</button>
      <button type="button" class="btn btn-sm btn-primary" data-view-mode="rs3weekly">Weeklies</button>
      <button type="button" class="btn btn-sm btn-primary" data-view-mode="rs3monthly">Monthlies</button>
    </div>
  `;

  return host;
}

function updateViewsControlButtons(documentRef, mode) {
  const host = documentRef.getElementById('views-control');
  if (!host) return;

  host.querySelectorAll('[data-view-mode]').forEach((button) => {
    const active = button.dataset.viewMode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

export function setupViewsControl({
  renderApp,
  closeFloatingControls,
  documentRef = document,
  localStorageRef = window.localStorage
}) {
  const button = documentRef.getElementById('view-button') || documentRef.getElementById('views-button');
  const host = ensureViewsControlMarkup(documentRef);

  if (!button || !host) return;

  const clonedButton = button.cloneNode(true);
  button.replaceWith(clonedButton);

  const clonedHost = host.cloneNode(true);
  host.replaceWith(clonedHost);

  const rebuiltHost = ensureViewsControlMarkup(documentRef);
  const currentMode = getPageMode({ localStorageRef });

  setExpandedLabelText(documentRef, currentMode);
  updateViewsControlButtons(documentRef, currentMode);

  clonedButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = rebuiltHost.dataset.display === 'block';

    closeFloatingControls();

    if (isOpen) {
      rebuiltHost.style.display = 'none';
      rebuiltHost.style.visibility = 'hidden';
      rebuiltHost.dataset.display = 'none';
    } else {
      rebuiltHost.style.display = 'block';
      rebuiltHost.style.visibility = 'visible';
      rebuiltHost.dataset.display = 'block';
    }
  });

  rebuiltHost.querySelectorAll('[data-view-mode]').forEach((modeButton) => {
    modeButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const mode = modeButton.dataset.viewMode;
      const nextMode = setPageMode(mode, { localStorageRef });

      setExpandedLabelText(documentRef, nextMode);
      updateViewsControlButtons(documentRef, nextMode);

      rebuiltHost.style.display = 'none';
      rebuiltHost.style.visibility = 'hidden';
      rebuiltHost.dataset.display = 'none';

      renderApp();
    });
  });

  documentRef.addEventListener('page-mode-sync', () => {
    const mode = getPageMode({ localStorageRef });
    setExpandedLabelText(documentRef, mode);
    updateViewsControlButtons(documentRef, mode);
  });
}