import {
  getSectionState as getSectionStateFeature,
  saveSectionValue as saveSectionValueFeature,
  getCustomTasks as getCustomTasksFeature,
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
import { tasksConfig } from '../../config/tasks/index.js';

function clearCooldownsForTaskIds(taskIds, { load, save }) {
  const ids = new Set((Array.isArray(taskIds) ? taskIds : []).filter(Boolean));
  if (ids.size === 0) return false;

  const cooldowns = { ...(load('cooldowns', {}) || {}) };
  let changed = false;

  ids.forEach((taskId) => {
    if (cooldowns[taskId]) {
      delete cooldowns[taskId];
      changed = true;
    }
  });

  if (changed) {
    save('cooldowns', cooldowns);
  }

  return changed;
}

function clearSpecificTaskCompletions(sectionKey, taskIds, { load, save, removeKey }) {
  const ids = new Set((Array.isArray(taskIds) ? taskIds : []).filter(Boolean));
  if (ids.size === 0) return false;

  const completed = { ...(load(`completed:${sectionKey}`, {}) || {}) };
  const hiddenRows = { ...(load(`hiddenRows:${sectionKey}`, {}) || {}) };
  const removedRows = { ...(load(`removedRows:${sectionKey}`, {}) || {}) };

  let changed = false;

  ids.forEach((taskId) => {
    if (completed[taskId]) {
      delete completed[taskId];
      changed = true;
    }

    if (hiddenRows[taskId]) {
      delete hiddenRows[taskId];
      changed = true;
    }

    if (removedRows[taskId]) {
      delete removedRows[taskId];
      changed = true;
    }
  });

  clearCooldownsForTaskIds([...ids], { load, save });

  if (changed) {
    save(`completed:${sectionKey}`, completed);
    save(`hiddenRows:${sectionKey}`, hiddenRows);
    save(`removedRows:${sectionKey}`, removedRows);
    cleanupTaskNotificationsForReset(sectionKey, { removeKey });
  }

  return changed;
}

function clearGatheringCompletions(kind, { load, save, removeKey }) {
  const dailyGathering = Array.isArray(tasksConfig.gathering) ? tasksConfig.gathering : [];
  const weeklyGathering = Array.isArray(tasksConfig.weeklyGathering) ? tasksConfig.weeklyGathering : [];

  const ids = [...dailyGathering, ...weeklyGathering]
    .filter((task) => String(task?.reset || 'daily').toLowerCase() === kind)
    .map((task) => task.id);

  return clearSpecificTaskCompletions('gathering', ids, { load, save, removeKey });
}

export function clearCompletionFor(sectionKey, { load, save, removeKey }) {
  const completed = { ...(load(`completed:${sectionKey}`, {}) || {}) };
  const hiddenRows = { ...(load(`hiddenRows:${sectionKey}`, {}) || {}) };
  const removedRows = { ...(load(`removedRows:${sectionKey}`, {}) || {}) };
  const completedIds = Object.keys(completed);
  const hiddenIds = Object.keys(hiddenRows);
  const removedIds = Object.keys(removedRows);

  let changed = false;

  if (completedIds.length > 0) {
    save(`completed:${sectionKey}`, {});
    changed = true;
  }

  if (hiddenIds.length > 0) {
    save(`hiddenRows:${sectionKey}`, {});
    changed = true;
  }

  if (removedIds.length > 0) {
    save(`removedRows:${sectionKey}`, {});
    changed = true;
  }

  clearCooldownsForTaskIds([...new Set([...completedIds, ...hiddenIds, ...removedIds])], { load, save });

  if (changed) {
    cleanupTaskNotificationsForReset(sectionKey, { removeKey });
  }
}

export function resetCustomCompletions(kind, { load, save, removeKey }) {
  const tasks = getCustomTasksFeature(load);
  const ids = tasks
    .filter((task) => String(task?.reset || 'daily').toLowerCase() === kind)
    .map((task) => task.id);

  return clearSpecificTaskCompletions('custom', ids, { load, save, removeKey });
}

function getSectionTaskIds(sectionKey, load) {
  switch (sectionKey) {
    case 'rs3daily':
      return (Array.isArray(tasksConfig.dailies) ? tasksConfig.dailies : []).map((task) => task.id);
    case 'gathering':
      return [
        ...(Array.isArray(tasksConfig.gathering) ? tasksConfig.gathering : []),
        ...(Array.isArray(tasksConfig.weeklyGathering) ? tasksConfig.weeklyGathering : [])
      ].map((task) => task.id);
    case 'rs3weekly':
      return (Array.isArray(tasksConfig.weeklies) ? tasksConfig.weeklies : [])
        .flatMap((task) => [
          task.id,
          ...(Array.isArray(task.childRows) ? task.childRows.map((child) => child.id) : []),
          ...(Array.isArray(task.children) ? task.children.map((child) => child.id) : [])
        ]);
    case 'rs3monthly':
      return (Array.isArray(tasksConfig.monthlies) ? tasksConfig.monthlies : []).map((task) => task.id);
    case 'custom':
      return getCustomTasksFeature(load).map((task) => task.id);
    default:
      return [];
  }
}

export function resetSectionView(sectionKey, { load, save, removeKey }) {
  save(`completed:${sectionKey}`, {});
  save(`hiddenRows:${sectionKey}`, {});
  save(`removedRows:${sectionKey}`, {});
  save(`order:${sectionKey}`, []);
  save(`sort:${sectionKey}`, 'default');
  save(`showHidden:${sectionKey}`, false);
  save(`hideSection:${sectionKey}`, false);

  clearCooldownsForTaskIds(getSectionTaskIds(sectionKey, load), { load, save });
  cleanupTaskNotificationsForReset(sectionKey, { removeKey });

  if (sectionKey === 'rs3farming') {
    saveFarmingTimersFeature({}, save);
  }

  if (sectionKey === 'custom') {
    save(`notified:custom`, {});
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
    clearCompletionFor('rs3daily', { load, save, removeKey });
    clearGatheringCompletions('daily', { load, save, removeKey });
    clearCompletionFor('rs3farming', { load, save, removeKey });
    resetCustomCompletions('daily', { load, save, removeKey });
    maybeBrowserNotify('RSDailies', 'Daily reset happened.');
    maybeWebhookNotify('RSDailies: daily reset happened (UTC).');
    changed = true;
  }

  if (lastVisit < prevWeekly) {
    clearCompletionFor('rs3weekly', { load, save, removeKey });
    clearGatheringCompletions('weekly', { load, save, removeKey });
    resetCustomCompletions('weekly', { load, save, removeKey });
    maybeBrowserNotify('RSDailies', 'Weekly reset happened.');
    maybeWebhookNotify('RSDailies: weekly reset happened (UTC).');
    changed = true;
  }

  if (lastVisit < prevMonthly) {
    clearCompletionFor('rs3monthly', { load, save, removeKey });
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
  if (section.hiddenRows[taskId] && !section.completed[taskId]) return;

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
    saveFarmingTimersFeature({}, save);
  }
}