import {
  getTrackerPageMode,
  getTrackerPrimaryNavItems,
  getTrackerViewsPanelGroups,
} from '../../../app/registries/unified-registry.js';

export function getViewsButtonLabel(mode) {
  const modeDefinition = getTrackerPageMode(mode);
  return modeDefinition?.buttonLabel || modeDefinition?.label || 'Overview';
}

export function getViewsPanelGroups() {
  return getTrackerViewsPanelGroups();
}

export function getPrimaryNavItems() {
  return getTrackerPrimaryNavItems();
}
