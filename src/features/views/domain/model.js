import { loadProfileValue, saveProfileValue } from '../../profiles/domain/store.js';
import {
  getTrackerPageModes,
  getTrackerViews,
  isTrackerPageMode,
  normalizeTrackerPageMode,
} from '../../../app/registries/unified-registry.js';

export const PAGE_MODES = getTrackerPageModes();

function normalizePageMode(mode) {
  return normalizeTrackerPageMode(mode, 'all');
}

export function syncStoredViewModeToPageMode() {
  const current = loadProfileValue('pageMode', null);
  if (typeof current === 'string' && isTrackerPageMode(current)) {
    return current;
  }

  const storedViewMode = loadProfileValue('viewMode', null);
  const migrated = normalizeTrackerPageMode(storedViewMode, 'all');

  saveProfileValue('pageMode', migrated);
  return migrated;
}

export function getPageMode() {
  const mode = loadProfileValue('pageMode', null);
  if (typeof mode === 'string' && isTrackerPageMode(mode)) {
    return mode;
  }

  const storedViewMode = loadProfileValue('viewMode', 'all');
  return normalizeTrackerPageMode(storedViewMode, 'all');
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
  return getTrackerViews();
}
