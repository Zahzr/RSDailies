import { loadProfileValue, saveProfileValue } from '../../profiles/domain/store.js';
import {
  getDefaultTrackerPageMode,
  getTrackerPageModes,
  getTrackerViews,
  isTrackerPageMode,
  normalizeTrackerPageMode,
} from '../../../app/registries/unified-registry.js';
import { GAMES, getSelectedGame } from '../../../core/state/GameContext.js';

export const PAGE_MODES = getTrackerPageModes();

function getActiveGame(game = getSelectedGame()) {
  return game === GAMES.OSRS ? GAMES.OSRS : GAMES.RS3;
}

function getGamePageModeKey(game) {
  return `pageMode:${game}`;
}

function getFallbackPageMode(game) {
  return getDefaultTrackerPageMode(game) || 'overview';
}

function normalizePageMode(mode, game) {
  return normalizeTrackerPageMode(mode, getFallbackPageMode(game), game);
}

function getLegacyRs3PageMode() {
  const current = loadProfileValue('pageMode', null);
  if (typeof current === 'string' && isTrackerPageMode(current, GAMES.RS3)) {
    return current;
  }

  const storedViewMode = loadProfileValue('viewMode', null);
  return typeof storedViewMode === 'string' ? storedViewMode : null;
}

export function syncStoredViewModeToPageMode(game = getActiveGame()) {
  const activeGame = getActiveGame(game);
  const key = getGamePageModeKey(activeGame);
  const current = loadProfileValue(key, null);
  if (typeof current === 'string' && isTrackerPageMode(current, activeGame)) {
    return current;
  }

  const sourceMode = activeGame === GAMES.RS3 ? getLegacyRs3PageMode() : null;
  const migrated = normalizePageMode(sourceMode, activeGame);

  saveProfileValue(key, migrated);

  if (activeGame === GAMES.RS3) {
    saveProfileValue('pageMode', migrated);
  }

  return migrated;
}

export function getPageMode(game = getActiveGame()) {
  const activeGame = getActiveGame(game);
  const mode = loadProfileValue(getGamePageModeKey(activeGame), null);
  if (typeof mode === 'string' && isTrackerPageMode(mode, activeGame)) {
    return mode;
  }

  return syncStoredViewModeToPageMode(activeGame);
}

export function setPageMode(mode, game = getActiveGame()) {
  const activeGame = getActiveGame(game);
  const normalized = normalizePageMode(mode, activeGame);

  saveProfileValue(getGamePageModeKey(activeGame), normalized);

  if (activeGame === GAMES.RS3) {
    saveProfileValue('pageMode', normalized);
  }

  try {
    document.dispatchEvent(new CustomEvent('page-mode-sync', { detail: { mode: normalized, game: activeGame } }));
  } catch {
    // noop
  }

  return normalized;
}

export function getViews(game = getActiveGame()) {
  return getTrackerViews(game);
}
