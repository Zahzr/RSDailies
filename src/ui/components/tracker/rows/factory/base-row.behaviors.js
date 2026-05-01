import { getCustomTimerText, createTimerColumn } from '../columns/index.js';
import { appendSectionBadge, appendWeeklyCollapseButton, hideRowActionsForOverview, syncRowActionLayout } from './helpers.js';
import { bindRowOrdering } from './ordering.js';
import { bindPinButton, bindHideButton } from './pin-hide.js';
import { createToggleTaskHandler } from './toggle.js';

export function attachBaseRowBehaviors(rowParts, task, options = {}) {
  const {
    sectionKey,
    taskId,
    isCustom = false,
    customStorageId = null,
    renderNameOnRight = false,
    context = {},
    overviewPinId = null,
  } = options;
  const {
    load,
    save,
    getTaskState,
    createInlineActions,
    renderApp,
    hideTask,
    setTaskCompleted,
    clearTimer,
    startTimer,
    startCooldown,
    getTableId,
    isCollapsedBlock,
    setCollapsedBlock,
    isOverviewPanel = false,
  } = context;
  const {
    row,
    nameCell,
    pinBtn,
    hideBtn,
    notesCell,
    statusCell,
    desc,
    checkOff,
    checkOn,
  } = rowParts;

  appendWeeklyCollapseButton(nameCell, task, { isCollapsedBlock, setCollapsedBlock, renderApp, isOverviewPanel });
  if (isOverviewPanel) appendSectionBadge(nameCell, sectionKey);

  const actions = createInlineActions(task, isCustom);
  if (actions && !isOverviewPanel) desc.appendChild(actions);

  bindPinButton(pinBtn, sectionKey, task, { overviewPinId, customStorageId, load, save, renderApp });
  bindHideButton(hideBtn, sectionKey, taskId, task, { isCustom, isOverviewPanel, customStorageId, load, save, hideTask, renderApp });

  const toggleTask = createToggleTaskHandler(sectionKey, taskId, task, {
    load,
    save,
    getTaskState,
    setTaskCompleted,
    clearTimer,
    startTimer,
    startCooldown,
    renderApp,
  });

  if (isCustom && !renderNameOnRight) {
    notesCell.classList.add('custom-task-notes');
    statusCell.classList.add('custom-task-status');

    const timerText = getCustomTimerText(taskId, task, load);
    const customTimerCell = createTimerColumn(timerText);
    row.insertBefore(customTimerCell, notesCell);
    customTimerCell.addEventListener('click', toggleTask);
  }

  notesCell.addEventListener('click', toggleTask);
  statusCell.addEventListener('click', toggleTask);

  if (!isOverviewPanel) bindRowOrdering(row, sectionKey, { getTableId, save });
  else {
    hideRowActionsForOverview(row);
    row.removeAttribute('draggable');
  }

  if (renderNameOnRight) {
    checkOff.style.display = '';
    checkOn.style.display = '';
  }

  syncRowActionLayout(nameCell);
}
