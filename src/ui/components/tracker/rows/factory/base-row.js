import { createBaseRowShell } from './base-row.shell.js';
import { populateBaseRowContent } from './base-row.content.js';
import { attachBaseRowBehaviors } from './base-row.behaviors.js';

export function createBaseRow(sectionKey, task, options = {}) {
  const { isCustom = false, extraClass = '', customStorageId = null, renderNameOnRight = false, context = {} } = options;
  const {
    getTaskState,
    cloneRowTemplate,
    isOverviewPanel = false,
    overviewPinId = null,
  } = context;

  const taskId = customStorageId || task.id;
  const rowParts = createBaseRowShell(sectionKey, taskId, getTaskState(sectionKey, taskId, task), {
    cloneRowTemplate,
    isCustom,
    extraClass,
    isOverviewPanel,
  });
  if (!rowParts) return null;

  const { nameCell, nameLink, notesCell, statusCell, desc, checkOff, checkOn, row } = rowParts;
  if (!nameCell || !nameLink || !notesCell || !statusCell || !desc || !checkOff || !checkOn) return row;

  populateBaseRowContent(rowParts, task, {
    renderNameOnRight,
    appendRowText: context.appendRowText,
  });
  attachBaseRowBehaviors(rowParts, task, {
    sectionKey,
    taskId,
    isCustom,
    customStorageId,
    renderNameOnRight,
    context,
    overviewPinId,
  });

  return row;
}
