import {
  getDefaultTrackerPageMode,
  getTrackerPageMode,
  getTrackerPrimaryNavItems,
  getTrackerViewsPanelGroups,
} from '../../../app/registries/unified-registry.js';
import { GAMES, getSelectedGame } from '../../../core/state/GameContext.js';

function getActiveGame(game = getSelectedGame()) {
  return game === GAMES.OSRS ? GAMES.OSRS : GAMES.RS3;
}

export function getViewsButtonLabel(mode, game = getActiveGame()) {
  const activeGame = getActiveGame(game);
  const modeDefinition = getTrackerPageMode(mode, activeGame)
    || getTrackerPageMode(getDefaultTrackerPageMode(activeGame), activeGame);
  return modeDefinition?.buttonLabel || modeDefinition?.label || 'Overview';
}

export function getViewsPanelGroups(game = getActiveGame()) {
  return getTrackerViewsPanelGroups(getActiveGame(game));
}

export function getPrimaryNavItems(game = getActiveGame()) {
  return getTrackerPrimaryNavItems(getActiveGame(game));
}
