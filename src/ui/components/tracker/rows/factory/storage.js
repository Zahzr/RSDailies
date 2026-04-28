import { StorageKeyBuilder } from '../../../../../core/storage/keys-builder.js';

export function getHiddenRows(sectionKey, load) {
  return { ...(load(StorageKeyBuilder.sectionHiddenRows(sectionKey), {}) || {}) };
}

export function saveHiddenRows(sectionKey, value, save) {
  save(StorageKeyBuilder.sectionHiddenRows(sectionKey), value);
}

export function getRemovedRows(sectionKey, load) {
  return { ...(load(StorageKeyBuilder.sectionRemovedRows(sectionKey), {}) || {}) };
}

export function saveRemovedRows(sectionKey, value, save) {
  save(StorageKeyBuilder.sectionRemovedRows(sectionKey), value);
}

export function hideCompletedRow(sectionKey, taskId, task, { load, save }) {
  const hiddenRows = getHiddenRows(sectionKey, load);
  hiddenRows[taskId] = task?.name || taskId;
  saveHiddenRows(sectionKey, hiddenRows, save);
}

export function unhideCompletedRow(sectionKey, taskId, { load, save }) {
  const hiddenRows = getHiddenRows(sectionKey, load);
  delete hiddenRows[taskId];
  saveHiddenRows(sectionKey, hiddenRows, save);
}

export function removeRowViaX(sectionKey, taskId, task, { load, save }) {
  const hiddenRows = getHiddenRows(sectionKey, load);
  const removedRows = getRemovedRows(sectionKey, load);
  hiddenRows[taskId] = task?.name || taskId;
  removedRows[taskId] = task?.name || taskId;
  saveHiddenRows(sectionKey, hiddenRows, save);
  saveRemovedRows(sectionKey, removedRows, save);
}
