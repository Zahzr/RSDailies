import { cleanupTaskNotificationsForReset } from '../../../notifications/domain/bridge.js';
import { getCustomTasks as getCustomTasksFeature } from '../state.js';
import { StorageKeyBuilder } from '../../../../core/storage/keys-builder.js';
import { getContentSectionTaskIds, getContentSectionTaskIdsByCadence } from '../../../../core/domain/content/content-selectors.js';

export function clearCooldownsForTaskIds(taskIds, { load, save }) {
  const ids = new Set((Array.isArray(taskIds) ? taskIds : []).filter(Boolean));
  if (ids.size === 0) return false;
  const cooldowns = { ...(load(StorageKeyBuilder.cooldowns(), {}) || {}) };
  let changed = false;
  ids.forEach((taskId) => {
    if (cooldowns[taskId]) {
      delete cooldowns[taskId];
      changed = true;
    }
  });
  if (changed) save(StorageKeyBuilder.cooldowns(), cooldowns);
  return changed;
}

export function clearSpecificTaskCompletions(sectionKey, taskIds, { load, save, removeKey }) {
  const ids = new Set((Array.isArray(taskIds) ? taskIds : []).filter(Boolean));
  if (ids.size === 0) return false;
  const completed = { ...(load(StorageKeyBuilder.sectionCompletion(sectionKey), {}) || {}) };
  const hiddenRows = { ...(load(StorageKeyBuilder.sectionHiddenRows(sectionKey), {}) || {}) };
  const removedRows = { ...(load(StorageKeyBuilder.sectionRemovedRows(sectionKey), {}) || {}) };
  let changed = false;

  ids.forEach((taskId) => {
    if (completed[taskId]) { delete completed[taskId]; changed = true; }
    if (hiddenRows[taskId]) { delete hiddenRows[taskId]; changed = true; }
    if (removedRows[taskId]) { delete removedRows[taskId]; changed = true; }
  });

  clearCooldownsForTaskIds([...ids], { load, save });
  if (changed) {
    save(StorageKeyBuilder.sectionCompletion(sectionKey), completed);
    save(StorageKeyBuilder.sectionHiddenRows(sectionKey), hiddenRows);
    save(StorageKeyBuilder.sectionRemovedRows(sectionKey), removedRows);
    cleanupTaskNotificationsForReset(sectionKey, { removeKey });
  }
  return changed;
}

export function clearGatheringCompletions(kind, { load, save, removeKey }) {
  const ids = getContentSectionTaskIdsByCadence('gathering', kind);
  return clearSpecificTaskCompletions('gathering', ids, { load, save, removeKey });
}

export function clearCompletionFor(sectionKey, { load, save, removeKey }) {
  const completed = { ...(load(StorageKeyBuilder.sectionCompletion(sectionKey), {}) || {}) };
  const hiddenRows = { ...(load(StorageKeyBuilder.sectionHiddenRows(sectionKey), {}) || {}) };
  const removedRows = { ...(load(StorageKeyBuilder.sectionRemovedRows(sectionKey), {}) || {}) };
  const completedIds = Object.keys(completed);
  const hiddenIds = Object.keys(hiddenRows);
  const removedIds = Object.keys(removedRows);
  let changed = false;

  if (completedIds.length > 0) { save(StorageKeyBuilder.sectionCompletion(sectionKey), {}); changed = true; }
  if (hiddenIds.length > 0) { save(StorageKeyBuilder.sectionHiddenRows(sectionKey), {}); changed = true; }
  if (removedIds.length > 0) { save(StorageKeyBuilder.sectionRemovedRows(sectionKey), {}); changed = true; }
  clearCooldownsForTaskIds([...new Set([...completedIds, ...hiddenIds, ...removedIds])], { load, save });
  if (changed) cleanupTaskNotificationsForReset(sectionKey, { removeKey });
}

export function resetCustomCompletions(kind, { load, save, removeKey }) {
  const tasks = getCustomTasksFeature(load);
  const ids = tasks.filter((task) => String(task?.reset || 'daily').toLowerCase() === kind).map((task) => task.id);
  return clearSpecificTaskCompletions('custom', ids, { load, save, removeKey });
}

export function getSectionTaskIds(sectionKey, load) {
  return getContentSectionTaskIds(sectionKey, {
    customTasks: sectionKey === 'custom' ? getCustomTasksFeature(load) : [],
  });
}
