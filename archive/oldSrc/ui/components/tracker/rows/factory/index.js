export { persistOrderFromTable } from './ordering.js';
export { createBaseRow } from './base-row.js';
export { childStorageKey } from './helpers.js';

import { createBaseRow } from './base-row.js';
import { childStorageKey } from './helpers.js';

export function createRow(sectionKey, task, options = {}) {
  const { isCustom = false, extraClass = '', context = {} } = options;
  return createBaseRow(sectionKey, task, {
    isCustom,
    extraClass,
    renderNameOnRight: false,
    context
  });
}

export function createRightSideChildRow(sectionKey, task, parentId, options = {}) {
  const { extraClass = '', context = {} } = options;
  return createBaseRow(sectionKey, task, {
    extraClass,
    customStorageId: childStorageKey(sectionKey, parentId, task.id),
    renderNameOnRight: true,
    context
  });
}
