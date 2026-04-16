import { resolveCallback } from '../runtime.js';
import { createBaseRow } from './row-factory.js';

function defaultChildStorageKey(sectionKey, parentId, childId) {
  return `${sectionKey}::${parentId}::${childId}`;
}

export function createRightSideChildRow(sectionKey, task, parentId, extraClass = '', runtime = {}) {
  const childStorageKey = resolveCallback(runtime, 'childStorageKey', defaultChildStorageKey);

  return createBaseRow(sectionKey, task, {
    extraClass,
    customStorageId: childStorageKey(sectionKey, parentId, task.id),
    renderNameOnRight: true
  }, runtime);
}
