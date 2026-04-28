import { cleanupTaskNotificationsForReset } from '../../../notifications/domain/bridge.js';
import { tasksConfig } from '../../../tasks/config/index.js';
import { getCustomTasks as getCustomTasksFeature } from '../state.js';

export function clearCooldownsForTaskIds(taskIds, { load, save }) {
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
  if (changed) save('cooldowns', cooldowns);
  return changed;
}

export function clearSpecificTaskCompletions(sectionKey, taskIds, { load, save, removeKey }) {
  const ids = new Set((Array.isArray(taskIds) ? taskIds : []).filter(Boolean));
  if (ids.size === 0) return false;
  const completed = { ...(load(`completed:${sectionKey}`, {}) || {}) };
  const hiddenRows = { ...(load(`hiddenRows:${sectionKey}`, {}) || {}) };
  const removedRows = { ...(load(`removedRows:${sectionKey}`, {}) || {}) };
  let changed = false;

  ids.forEach((taskId) => {
    if (completed[taskId]) { delete completed[taskId]; changed = true; }
    if (hiddenRows[taskId]) { delete hiddenRows[taskId]; changed = true; }
    if (removedRows[taskId]) { delete removedRows[taskId]; changed = true; }
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

export function clearGatheringCompletions(kind, { load, save, removeKey }) {
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

  if (completedIds.length > 0) { save(`completed:${sectionKey}`, {}); changed = true; }
  if (hiddenIds.length > 0) { save(`hiddenRows:${sectionKey}`, {}); changed = true; }
  if (removedIds.length > 0) { save(`removedRows:${sectionKey}`, {}); changed = true; }
  clearCooldownsForTaskIds([...new Set([...completedIds, ...hiddenIds, ...removedIds])], { load, save });
  if (changed) cleanupTaskNotificationsForReset(sectionKey, { removeKey });
}

export function resetCustomCompletions(kind, { load, save, removeKey }) {
  const tasks = getCustomTasksFeature(load);
  const ids = tasks.filter((task) => String(task?.reset || 'daily').toLowerCase() === kind).map((task) => task.id);
  return clearSpecificTaskCompletions('custom', ids, { load, save, removeKey });
}

export function getSectionTaskIds(sectionKey, load) {
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
        .flatMap((task) => [task.id, ...(Array.isArray(task.childRows) ? task.childRows.map((child) => child.id) : []), ...(Array.isArray(task.children) ? task.children.map((child) => child.id) : [])]);
    case 'rs3monthly':
      return (Array.isArray(tasksConfig.monthlies) ? tasksConfig.monthlies : []).map((task) => task.id);
    case 'custom':
      return getCustomTasksFeature(load).map((task) => task.id);
    default:
      return [];
  }
}
