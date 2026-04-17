import {
  getSectionState as getSectionStateFeature,
  saveSectionValue as saveSectionValueFeature,
  getCustomTasks as getCustomTasksFeature,
  saveCustomTasks as saveCustomTasksFeature,
  getFarmingTimers as getFarmingTimersFeature,
  saveFarmingTimers as saveFarmingTimersFeature
} from './state.js';
import {
  nextDailyBoundary as nextDailyBoundaryCore,
  nextWeeklyBoundary as nextWeeklyBoundaryCore,
  nextMonthlyBoundary as nextMonthlyBoundaryCore
} from '../../core/time/boundaries.js';
import {
  maybeBrowserNotify,
  maybeWebhookNotify,
  cleanupTaskNotificationsForReset
} from '../notifications/bridge.js';

export function clearCompletionFor(sectionKey, { save, removeKey }) {
  save(`completed:${sectionKey}`, {});
  cleanupTaskNotificationsForReset(sectionKey, { removeKey });
}

export function resetCustomCompletions(kind, { load, save, removeKey }) {
  const tasks = getCustomTasksFeature(load);
  const completed = load('completed:custom', {});
  let changed = false;

  tasks.forEach((task) => {
    const resetKind = String(task.reset || 'daily').toLowerCase();
    if (resetKind === kind && completed[task.id]) {
      delete completed[task.id];
      changed = true;
    }
  });

  if (changed) save('completed:custom', completed);
  cleanupTaskNotificationsForReset('custom', { removeKey });
}

export function resetSectionView(sectionKey, { load, save, removeKey }) {
  removeKey(`hiddenRows:${sectionKey}`);
  removeKey(`order:${sectionKey}`);
  removeKey(`sort:${sectionKey}`);
  removeKey(`showHidden:${sectionKey}`);
  removeKey(`hideSection:${sectionKey}`);

  if (sectionKey === 'rs3farming') {
    saveFarmingTimersFeature({}, save);
  }
}

export function checkAutoReset({ load, save, removeKey }) {
  const now = Date.now();
  const lastVisit = load('lastVisit', 0);
  let changed = false;

  const prevDaily = nextDailyBoundaryCore(new Date(now - 86400000)).getTime();
  const prevWeekly = nextWeeklyBoundaryCore(new Date(now - 7 * 86400000)).getTime();
  const prevMonthly = nextMonthlyBoundaryCore(
    new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1))
  ).getTime();

  if (lastVisit < prevDaily) {
    clearCompletionFor('rs3daily', { save, removeKey });
    clearCompletionFor('gathering', { save, removeKey });
    clearCompletionFor('rs3farming', { save, removeKey });
    resetCustomCompletions('daily', { load, save, removeKey });
    maybeBrowserNotify('RSDailies', 'Daily reset happened.');
    maybeWebhookNotify('RSDailies: daily reset happened (UTC).');
    changed = true;
  }

  if (lastVisit < prevWeekly) {
    clearCompletionFor('rs3weekly', { save, removeKey });
    clearCompletionFor('gathering', { save, removeKey });
    resetCustomCompletions('weekly', { load, save, removeKey });
    maybeBrowserNotify('RSDailies', 'Weekly reset happened.');
    maybeWebhookNotify('RSDailies: weekly reset happened (UTC).');
    changed = true;
  }

  if (lastVisit < prevMonthly) {
    clearCompletionFor('rs3monthly', { save, removeKey });
    resetCustomCompletions('monthly', { load, save, removeKey });
    maybeBrowserNotify('RSDailies', 'Monthly reset happened.');
    maybeWebhookNotify('RSDailies: monthly reset happened (UTC).');
    changed = true;
  }

  save('lastVisit', now);
  return changed;
}

export function setTaskCompleted(sectionKey, taskId, completed, { load, save }) {
  const section = getSectionStateFeature(sectionKey, load);
  if (section.hiddenRows[taskId]) return;

  if (completed) {
    section.completed[taskId] = true;
  } else {
    delete section.completed[taskId];
  }

  saveSectionValueFeature(sectionKey, 'completed', section.completed, save);
}

export function hideTask(sectionKey, taskId, { load, save }) {
  const section = getSectionStateFeature(sectionKey, load);
  section.hiddenRows[taskId] = true;
  delete section.completed[taskId];

  saveSectionValueFeature(sectionKey, 'completed', section.completed, save);
  saveSectionValueFeature(sectionKey, 'hiddenRows', section.hiddenRows, save);

  if (sectionKey === 'rs3farming') {
    const timers = getFarmingTimersFeature(load);
    delete timers[taskId];
    saveFarmingTimersFeature(timers, save);
  }
}
