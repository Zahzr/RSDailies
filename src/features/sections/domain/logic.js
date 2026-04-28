import { getSectionState as getSectionStateFeature, saveSectionValue as saveSectionValueFeature, saveFarmingTimers as saveFarmingTimersFeature } from './state.js';
import { nextDailyBoundary as nextDailyBoundaryCore, nextWeeklyBoundary as nextWeeklyBoundaryCore, nextMonthlyBoundary as nextMonthlyBoundaryCore } from '../../../core/time/boundaries.js';
import { maybeBrowserNotify, maybeWebhookNotify } from '../../notifications/domain/bridge.js';
import {
  clearCompletionFor,
  clearGatheringCompletions,
  getSectionTaskIds,
  resetCustomCompletions,
  clearCooldownsForTaskIds
} from './logic/reset-helpers.js';
import { cleanupTaskNotificationsForReset } from '../../notifications/domain/bridge.js';
import { StorageKeyBuilder } from '../../../core/storage/keys-builder.js';
import { getTrackerSections } from '../../../app/registries/unified-registry.js';

export { clearCompletionFor, resetCustomCompletions } from './logic/reset-helpers.js';

function getResettableSectionsForFrequency(frequency) {
  return getTrackerSections()
    .filter((section) => section.resetFrequency === frequency)
    .map((section) => section.id);
}

export function resetSectionView(sectionKey, { load, save, removeKey }) {
  save(StorageKeyBuilder.sectionCompletion(sectionKey), {});
  save(StorageKeyBuilder.sectionHiddenRows(sectionKey), {});
  save(StorageKeyBuilder.sectionRemovedRows(sectionKey), {});
  save(StorageKeyBuilder.sectionOrder(sectionKey), []);
  save(StorageKeyBuilder.sectionSort(sectionKey), 'default');
  save(StorageKeyBuilder.sectionShowHidden(sectionKey), false);
  save(StorageKeyBuilder.sectionHidden(sectionKey), false);
  clearCooldownsForTaskIds(getSectionTaskIds(sectionKey, load), { load, save });
  cleanupTaskNotificationsForReset(sectionKey, { removeKey });
  if (sectionKey === 'rs3farming') saveFarmingTimersFeature({}, save);
  if (sectionKey === 'custom') save('notified:custom', {});
}

export function checkAutoReset({ load, save, removeKey }) {
  const now = Date.now();
  const lastVisit = load(StorageKeyBuilder.lastVisit(), 0);
  let changed = false;
  const prevDaily = nextDailyBoundaryCore(new Date(now - 86400000)).getTime();
  const prevWeekly = nextWeeklyBoundaryCore(new Date(now - 7 * 86400000)).getTime();
  const prevMonthly = nextMonthlyBoundaryCore(new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1))).getTime();

  if (lastVisit < prevDaily) {
    getResettableSectionsForFrequency('daily').forEach((sectionKey) => clearCompletionFor(sectionKey, { load, save, removeKey }));
    clearGatheringCompletions('daily', { load, save, removeKey });
    getResettableSectionsForFrequency('rolling').forEach((sectionKey) => clearCompletionFor(sectionKey, { load, save, removeKey }));
    resetCustomCompletions('daily', { load, save, removeKey });
    maybeBrowserNotify('RSDailies', 'Daily reset happened.');
    maybeWebhookNotify('RSDailies: daily reset happened (UTC).');
    changed = true;
  }
  if (lastVisit < prevWeekly) {
    getResettableSectionsForFrequency('weekly').forEach((sectionKey) => clearCompletionFor(sectionKey, { load, save, removeKey }));
    clearGatheringCompletions('weekly', { load, save, removeKey });
    resetCustomCompletions('weekly', { load, save, removeKey });
    maybeBrowserNotify('RSDailies', 'Weekly reset happened.');
    maybeWebhookNotify('RSDailies: weekly reset happened (UTC).');
    changed = true;
  }
  if (lastVisit < prevMonthly) {
    getResettableSectionsForFrequency('monthly').forEach((sectionKey) => clearCompletionFor(sectionKey, { load, save, removeKey }));
    resetCustomCompletions('monthly', { load, save, removeKey });
    maybeBrowserNotify('RSDailies', 'Monthly reset happened.');
    maybeWebhookNotify('RSDailies: monthly reset happened (UTC).');
    changed = true;
  }

  save(StorageKeyBuilder.lastVisit(), now);
  return changed;
}

export function setTaskCompleted(sectionKey, taskId, completed, { load, save }) {
  const section = getSectionStateFeature(sectionKey, load);
  if (section.hiddenRows[taskId] && !section.completed[taskId]) return;
  if (completed) section.completed[taskId] = true;
  else delete section.completed[taskId];
  saveSectionValueFeature(sectionKey, 'completed', section.completed, save);
}

export function hideTask(sectionKey, taskId, { load, save }) {
  const section = getSectionStateFeature(sectionKey, load);

  section.hiddenRows[taskId] = true;
  delete section.completed[taskId];

  saveSectionValueFeature(sectionKey, 'completed', section.completed, save);
  saveSectionValueFeature(sectionKey, 'hiddenRows', section.hiddenRows, save);

  const order = load(StorageKeyBuilder.sectionOrder(sectionKey), []);
  if (Array.isArray(order)) {
    const filtered = order.filter((id) => id !== taskId);
    save(StorageKeyBuilder.sectionOrder(sectionKey), filtered);
  }

  const removedRows = load(StorageKeyBuilder.sectionRemovedRows(sectionKey), {});
  if (removedRows[taskId]) {
    delete removedRows[taskId];
    save(StorageKeyBuilder.sectionRemovedRows(sectionKey), removedRows);
  }

  if (sectionKey === 'rs3farming') saveFarmingTimersFeature({}, save);
}
