import { loadProfileValue, saveProfileValue } from '../profiles/store.js';

export const PAGE_MODES = ['overview', 'all', 'custom', 'rs3farming', 'rs3daily', 'gathering', 'rs3weekly', 'rs3monthly'];

export function migrateLegacyViewModeToPageMode() {
  const existing = loadProfileValue('pageMode', null);
  if (typeof existing === 'string' && PAGE_MODES.includes(existing)) return;

  const legacy = loadProfileValue('viewMode', null);
  saveProfileValue('pageMode', legacy === 'overview' ? 'overview' : 'all');
}

export function getPageMode() {
  const mode = loadProfileValue('pageMode', null);
  if (typeof mode === 'string' && PAGE_MODES.includes(mode)) return mode;

  const legacy = loadProfileValue('viewMode', 'all');
  return legacy === 'overview' ? 'overview' : 'all';
}

export function setPageMode(mode) {
  saveProfileValue('pageMode', PAGE_MODES.includes(mode) ? mode : 'all');
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
