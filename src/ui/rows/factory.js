import {
  getOverviewPins as getOverviewPinsFeature,
  saveOverviewPins as saveOverviewPinsFeature,
  getCustomTasks as getCustomTasksFeature,
  saveCustomTasks as saveCustomTasksFeature
} from '../../features/sections/state.js';
import {
  attachTooltip as attachTooltipFeature
} from '../tooltip.js';

let dragRow = null;

function childStorageKey(sectionKey, parentId, childId) {
  return `${sectionKey}::${parentId}::${childId}`;
}

function buildPinId(sectionKey, task, options = {}) {
  if (options.overviewPinId) return options.overviewPinId;
  if (options.customStorageId?.includes('::')) return options.customStorageId;
  return `${sectionKey}::${task.id}`;
}

function appendWeeklyCollapseButton(nameCell, task, context = {}) {
  const {
    isCollapsedBlock,
    setCollapsedBlock,
    renderApp,
    isOverviewPanel = false
  } = context;

  if (isOverviewPanel) return;
  if (!Array.isArray(task?.children) || task.children.length === 0) return;
  if (!nameCell || !isCollapsedBlock || !setCollapsedBlock || !renderApp) return;

  const blockId = `row-collapse-${task.id}`;
  const collapsed = isCollapsedBlock(blockId);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-secondary btn-sm mini-collapse-btn';
  btn.textContent = collapsed ? '\u25B6' : '\u25BC';
  btn.title = collapsed ? 'Expand child rows' : 'Collapse child rows';
  btn.setAttribute('aria-label', btn.title);

  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setCollapsedBlock(blockId, !isCollapsedBlock(blockId));
    renderApp();
  });

  nameCell.appendChild(btn);
}

function appendSectionBadge(nameCell, sectionKey) {
  if (!nameCell) return;

  const badge = document.createElement('span');
  badge.className = 'overview-section-badge';

  switch (sectionKey) {
    case 'custom':
      badge.textContent = 'Custom';
      break;
    case 'rs3farming':
      badge.textContent = 'Farming';
      break;
    case 'rs3daily':
      badge.textContent = 'Dailies';
      break;
    case 'gathering':
      badge.textContent = 'Gathering';
      break;
    case 'rs3weekly':
      badge.textContent = 'Weeklies';
      break;
    case 'rs3monthly':
      badge.textContent = 'Monthlies';
      break;
    default:
      badge.textContent = sectionKey;
      break;
  }

  nameCell.appendChild(badge);
}

function hideRowActionsForOverview(row) {
  row.querySelectorAll('.hide-button').forEach((el) => {
    el.style.display = 'none';
  });

  row.querySelectorAll('.mini-collapse-btn').forEach((el) => {
    el.style.display = 'none';
  });
}

function isFarmingChildStorageId(sectionKey, taskId, task) {
  return (
    sectionKey === 'rs3farming' &&
    typeof taskId === 'string' &&
    taskId.startsWith('rs3farming::') &&
    taskId.split('::').length >= 3 &&
    !task?.isTimerParent
  );
}

function getHiddenRows(sectionKey, load) {
  return { ...(load(`hiddenRows:${sectionKey}`, {}) || {}) };
}

function saveHiddenRows(sectionKey, value, save) {
  save(`hiddenRows:${sectionKey}`, value);
}

function getRemovedRows(sectionKey, load) {
  return { ...(load(`removedRows:${sectionKey}`, {}) || {}) };
}

function saveRemovedRows(sectionKey, value, save) {
  save(`removedRows:${sectionKey}`, value);
}

function hideCompletedRow(sectionKey, taskId, task, { load, save }) {
  const hiddenRows = getHiddenRows(sectionKey, load);
  hiddenRows[taskId] = task?.name || taskId;
  saveHiddenRows(sectionKey, hiddenRows, save);
}

function unhideCompletedRow(sectionKey, taskId, { load, save }) {
  const hiddenRows = getHiddenRows(sectionKey, load);
  delete hiddenRows[taskId];
  saveHiddenRows(sectionKey, hiddenRows, save);
}

function removeRowViaX(sectionKey, taskId, task, { load, save }) {
  const hiddenRows = getHiddenRows(sectionKey, load);
  const removedRows = getRemovedRows(sectionKey, load);

  hiddenRows[taskId] = task?.name || taskId;
  removedRows[taskId] = task?.name || taskId;

  saveHiddenRows(sectionKey, hiddenRows, save);
  saveRemovedRows(sectionKey, removedRows, save);
}

function shouldIgnoreToggleClick(event) {
  return !!event.target.closest('a, button, select, option, input, textarea, .pin-button, .hide-button, .delete-button, .mini-collapse-btn');
}

export function persistOrderFromTable(sectionKey, { getTableId, save }) {
  if (!getTableId || !save) return;

  const table = document.getElementById(getTableId(sectionKey));
  const tbody = table?.querySelector('tbody');
  if (!tbody) return;

  const order = [...tbody.querySelectorAll('tr[data-id]')]
    .map((tr) => tr.dataset.id)
    .filter(Boolean);

  save(`order:${sectionKey}`, order);
}

export function createBaseRow(sectionKey, task, options = {}) {
  const {
    isCustom = false,
    extraClass = '',
    customStorageId = null,
    renderNameOnRight = false,
    context = {}
  } = options;

  const {
    load,
    save,
    getTaskState,
    cloneRowTemplate,
    createInlineActions,
    appendRowText,
    renderApp,
    hideTask,
    setTaskCompleted,
    clearFarmingTimer,
    startFarmingTimer,
    startCooldown,
    getTableId,
    isCollapsedBlock,
    setCollapsedBlock,
    isOverviewPanel = false,
    overviewPinId = null
  } = context;

  const taskId = customStorageId || task.id;
  const row = cloneRowTemplate?.();
  if (!row) return null;

  row.dataset.id = taskId;
  row.dataset.completed = getTaskState(sectionKey, taskId, task);

  if (extraClass) row.classList.add(extraClass);
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

  if (!nameCell || !nameLink || !notesCell || !statusCell || !desc || !checkOff || !checkOn) {
    return row;
  }

  attachTooltipFeature(row, task);
  attachTooltipFeature(notesCell, task);
  attachTooltipFeature(statusCell, task);

  if (renderNameOnRight) {
    nameLink.textContent = '';
    nameLink.href = '#';
    nameLink.addEventListener('click', (event) => event.preventDefault());

    desc.textContent = '';
    const nameLine = document.createElement('span');
    nameLine.className = 'activity_note_line activity_child_name';
    nameLine.textContent = task.name;
    desc.appendChild(nameLine);

    appendRowText(desc, task, sectionKey);
  } else {
    if (task.wiki) {
      nameLink.href = task.wiki;
    } else {
      nameLink.href = '#';
      nameLink.addEventListener('click', (event) => event.preventDefault());
    }

    nameLink.textContent = task.name;
    desc.textContent = '';
    appendRowText(desc, task, sectionKey);
    attachTooltipFeature(nameLink, task);
  }

  appendWeeklyCollapseButton(nameCell, task, {
    isCollapsedBlock,
    setCollapsedBlock,
    renderApp,
    isOverviewPanel
  });

  if (isOverviewPanel) {
    appendSectionBadge(nameCell, sectionKey);
  }

  const actions = createInlineActions(task, isCustom);
  if (actions && !isOverviewPanel) {
    desc.appendChild(actions);
  }

  if (pinBtn) {
    const pinId = buildPinId(sectionKey, task, {
      overviewPinId,
      customStorageId
    });

    const pins = getOverviewPinsFeature(load);
    const pinned = !!pins[pinId];

    pinBtn.textContent = pinned ? '\u2605' : '\u2606';
    pinBtn.title = pinned ? 'Unpin from Overview' : 'Pin to Overview';
    pinBtn.setAttribute('aria-label', pinBtn.title);

    pinBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const nextPins = { ...getOverviewPinsFeature(load) };

      if (nextPins[pinId]) {
        delete nextPins[pinId];
      } else {
        nextPins[pinId] = Date.now();
      }

      saveOverviewPinsFeature(nextPins, save);
      renderApp();
    });
  }

  if (hideBtn) {
    if (isOverviewPanel) {
      hideBtn.style.display = 'none';
    } else {
      hideBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (isCustom) {
          if (!confirm(`Delete custom task "${task.name}"?`)) return;

          const next = getCustomTasksFeature(load).filter((t) => t.id !== task.id);
          saveCustomTasksFeature(next, save);

          const completed = load('completed:custom', {});
          const hiddenRows = load('hiddenRows:custom', {});
          const removedRows = load('removedRows:custom', {});
          const notified = load('notified:custom', {});

          delete completed[task.id];
          delete hiddenRows[task.id];
          delete removedRows[task.id];
          delete notified[task.id];

          save('completed:custom', completed);
          save('hiddenRows:custom', hiddenRows);
          save('removedRows:custom', removedRows);
          save('notified:custom', notified);

          const pins = { ...getOverviewPinsFeature(load) };
          delete pins[`custom::${task.id}`];
          saveOverviewPinsFeature(pins, save);
        } else {
          hideTask(sectionKey, taskId);
          removeRowViaX(sectionKey, taskId, task, { load, save });

          const pins = { ...getOverviewPinsFeature(load) };
          const directPinId = buildPinId(sectionKey, task, {
            customStorageId
          });
          delete pins[directPinId];
          saveOverviewPinsFeature(pins, save);
        }

        renderApp();
      });
    }
  }

  const toggleTask = (event) => {
    event.preventDefault();
    if (shouldIgnoreToggleClick(event)) return;

    const state = getTaskState(sectionKey, taskId, task);
    if (state === 'hide') return;

    if (sectionKey === 'rs3farming' && task?.isTimerParent) {
      if (state === 'running') {
        clearFarmingTimer(task.id);
      } else {
        startFarmingTimer(task);
      }
      renderApp();
      return;
    }

    if (task.cooldownMinutes && !task.isChildRow) {
      if (state === 'running') return;

      if (state === 'true') {
        setTaskCompleted(sectionKey, taskId, false);
        unhideCompletedRow(sectionKey, taskId, { load, save });
        renderApp();
        return;
      }

      startCooldown(taskId, task.cooldownMinutes);
      setTaskCompleted(sectionKey, taskId, true);
      hideCompletedRow(sectionKey, taskId, task, { load, save });
      renderApp();
      return;
    }

    if (isFarmingChildStorageId(sectionKey, taskId, task)) {
      if (state === 'true') {
        setTaskCompleted(sectionKey, taskId, false);
        unhideCompletedRow(sectionKey, taskId, { load, save });
        renderApp();
        return;
      }

      setTaskCompleted(sectionKey, taskId, true);
      hideCompletedRow(sectionKey, taskId, task, { load, save });
      renderApp();
      return;
    }

    if (state === 'true') {
      setTaskCompleted(sectionKey, taskId, false);
      unhideCompletedRow(sectionKey, taskId, { load, save });
      renderApp();
      return;
    }

    setTaskCompleted(sectionKey, taskId, true);
    hideCompletedRow(sectionKey, taskId, task, { load, save });
    renderApp();
  };

  nameCell.addEventListener('click', toggleTask);
  notesCell.addEventListener('click', toggleTask);
  statusCell.addEventListener('click', toggleTask);

  if (!isOverviewPanel) {
    row.addEventListener('dragstart', () => {
      dragRow = row;
      row.classList.add('dragging');
    });

    row.addEventListener('dragend', () => {
      row.classList.remove('dragging');
      dragRow = null;
      persistOrderFromTable(sectionKey, { getTableId, save });
    });

    row.addEventListener('dragover', (event) => {
      event.preventDefault();
      if (!dragRow || dragRow === row) return;

      const tbody = row.parentElement;
      const rect = row.getBoundingClientRect();
      const insertAfter = (event.clientY - rect.top) > rect.height / 2;
      tbody.insertBefore(dragRow, insertAfter ? row.nextSibling : row);
    });
  } else {
    hideRowActionsForOverview(row);
    row.removeAttribute('draggable');
  }

  if (renderNameOnRight) {
    checkOff.style.display = '';
    checkOn.style.display = '';
  }

  return row;
}

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