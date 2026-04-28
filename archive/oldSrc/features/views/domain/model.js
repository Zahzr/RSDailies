import { loadProfileValue, saveProfileValue } from '../../profiles/domain/store.js';

export const PAGE_MODES = [
  'overview',
  'all',
  'custom',
  'rs3farming',
  'rs3daily',
  'gathering',
  'rs3weekly',
  'rs3monthly'
];

function normalizePageMode(mode) {
  return PAGE_MODES.includes(mode) ? mode : 'all';
}

function mapStoredViewMode(mode) {
  switch (mode) {
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

export function syncStoredViewModeToPageMode() {
  const current = loadProfileValue('pageMode', null);
  if (typeof current === 'string' && PAGE_MODES.includes(current)) {
    return current;
  }

  const storedViewMode = loadProfileValue('viewMode', null);
  const migrated = mapStoredViewMode(storedViewMode);

  saveProfileValue('pageMode', migrated);
  return migrated;
}

export function getPageMode() {
  const mode = loadProfileValue('pageMode', null);
  if (typeof mode === 'string' && PAGE_MODES.includes(mode)) {
    return mode;
  }

  const storedViewMode = loadProfileValue('viewMode', 'all');
  return mapStoredViewMode(storedViewMode);
}

export function setPageMode(mode) {
  const normalized = normalizePageMode(mode);
  saveProfileValue('pageMode', normalized);

  try {
    document.dispatchEvent(new CustomEvent('page-mode-sync', { detail: { mode: normalized } }));
  } catch {
    // noop
  }

  return normalized;
}

export function getViews() {
  return [
    { mode: 'overview', label: 'Overview' },
    { mode: 'all', label: 'All' },
    { mode: 'custom', label: 'Custom Tasks' },
    { mode: 'rs3farming', label: 'Farming' },
    { mode: 'rs3daily', label: 'Dailies' },
    { mode: 'gathering', label: 'Gathering' },
    { mode: 'rs3weekly', label: 'Weeklies' },
    { mode: 'rs3monthly', label: 'Monthlies' }
  ];
}