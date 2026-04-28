import { attachTooltip as attachTooltipFeature } from '../../../../primitives/tooltips/tooltip-engine.js';
import { getCustomTimerText, createTimerColumn } from '../columns/index.js';
import { appendSectionBadge, appendWeeklyCollapseButton, hideRowActionsForOverview } from './helpers.js';
import { bindRowOrdering } from './ordering.js';
import { bindPinButton, bindHideButton } from './pin-hide.js';
import { createToggleTaskHandler } from './toggle.js';

export function createBaseRow(sectionKey, task, options = {}) {
  const { isCustom = false, extraClass = '', customStorageId = null, renderNameOnRight = false, context = {} } = options;
  const {
    load, save, getTaskState, cloneRowTemplate, createInlineActions, appendRowText, renderApp, hideTask,
    setTaskCompleted, clearFarmingTimer, startFarmingTimer, startCooldown, getTableId, isCollapsedBlock,
    setCollapsedBlock, isOverviewPanel = false, overviewPinId = null
  } = context;

  const taskId = customStorageId || task.id;
  const row = cloneRowTemplate?.();
  if (!row) return null;
  row.dataset.id = taskId;
  row.dataset.completed = getTaskState(sectionKey, taskId, task);
  if (extraClass) row.classList.add(extraClass);
  if (isCustom) row.classList.add('custom-task-row');
  if (isOverviewPanel) row.classList.add('overview-row');

  const nameCell = row.querySelector('.activity_name');
  const nameLink = nameCell?.querySelector('a');
  const pinBtn = nameCell?.querySelector('.pin-button');
  const hideBtn = nameCell?.querySelector('.hide-button');
  const notesCell = row.querySelector('.activity_notes');
  const statusCell = row.querySelector('.activity_status');
  const desc = row.querySelector('.activity_desc');
  const checkOff = statusCell?.querySelector('.activity_check_off');
  const checkOn = statusCell?.querySelector('.activity_check_on');
  if (!nameCell || !nameLink || !notesCell || !statusCell || !desc || !checkOff || !checkOn) return row;

  if (renderNameOnRight) {
    desc.textContent = '';

    if (sectionKey === 'rs3farming') {
      if (task.wiki) nameLink.href = task.wiki;
      else {
        nameLink.href = '#';
        nameLink.addEventListener('click', (event) => event.preventDefault());
      }
      nameLink.textContent = task.name;
      attachTooltipFeature(nameLink, task);
    } else {
      nameLink.textContent = '';
      nameLink.href = '#';
      nameLink.addEventListener('click', (event) => event.preventDefault());
      const nameLine = document.createElement('span');
      nameLine.className = 'activity_note_line activity_child_name';
      nameLine.textContent = task.name;
      desc.appendChild(nameLine);
    }

    appendRowText(desc, task, sectionKey);
  } else {
    if (task.wiki) nameLink.href = task.wiki;
    else {
      nameLink.href = '#';
      nameLink.addEventListener('click', (event) => event.preventDefault());
    }
    nameLink.textContent = task.name;
    desc.textContent = '';
    appendRowText(desc, task, sectionKey);
    attachTooltipFeature(nameLink, task);
  }

  appendWeeklyCollapseButton(nameCell, task, { isCollapsedBlock, setCollapsedBlock, renderApp, isOverviewPanel });
  if (isOverviewPanel) appendSectionBadge(nameCell, sectionKey);

  const actions = createInlineActions(task, isCustom);
  if (actions && !isOverviewPanel) desc.appendChild(actions);

  bindPinButton(pinBtn, sectionKey, task, { overviewPinId, customStorageId, load, save, renderApp });
  bindHideButton(hideBtn, sectionKey, taskId, task, { isCustom, isOverviewPanel, customStorageId, load, save, hideTask, renderApp });

  const toggleTask = createToggleTaskHandler(sectionKey, taskId, task, {
    load, save, getTaskState, setTaskCompleted, clearFarmingTimer, startFarmingTimer, startCooldown, renderApp
  });
  let customTimerCell = null;
  if (isCustom && !renderNameOnRight) {
    notesCell.classList.add('custom-task-notes');
    statusCell.classList.add('custom-task-status');

    const timerText = getCustomTimerText(taskId, task, load);
    customTimerCell = createTimerColumn(timerText);
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

  return row;
}
