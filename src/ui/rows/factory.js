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
    startCooldown
  } = context;

  const taskId = customStorageId || task.id;
  const row = cloneRowTemplate();
  row.dataset.id = taskId;
  row.dataset.completed = getTaskState(sectionKey, taskId, task);

  if (extraClass) row.classList.add(extraClass);

  const nameCell = row.querySelector('.activity_name');
  const nameLink = nameCell.querySelector('a');
  const pinBtn = nameCell.querySelector('.pin-button');
  const hideBtn = nameCell.querySelector('.hide-button');
  const notesCell = row.querySelector('.activity_notes');
  const statusCell = row.querySelector('.activity_status');
  const desc = row.querySelector('.activity_desc');
  const checkOff = statusCell.querySelector('.activity_check_off');
  const checkOn = statusCell.querySelector('.activity_check_on');

  attachTooltipFeature(row, task);
  attachTooltipFeature(notesCell, task);
  attachTooltipFeature(statusCell, task);

  if (renderNameOnRight) {
    nameLink.textContent = '';
    nameLink.href = '#';
    nameLink.addEventListener('click', (e) => e.preventDefault());

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
      nameLink.addEventListener('click', (e) => e.preventDefault());
    }

    nameLink.textContent = task.name;
    desc.textContent = '';
    appendRowText(desc, task, sectionKey);
    attachTooltipFeature(nameLink, task);
  }

  const actions = createInlineActions(task, isCustom);
  if (actions) desc.appendChild(actions);

  if (pinBtn) {
    const pinId = taskId.includes('::') ? taskId : `${sectionKey}::${taskId}`;
    const pins = getOverviewPinsFeature(load);
    const pinned = !!pins[pinId];

    pinBtn.textContent = pinned ? '\u2605' : '\u2606';
    pinBtn.title = pinned ? 'Unpin from Overview' : 'Pin to Overview';
    pinBtn.setAttribute('aria-label', pinBtn.title);

    pinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const nextPins = { ...getOverviewPinsFeature(load) };
      if (nextPins[pinId]) {
        delete nextPins[pinId];
      } else {
        nextPins[pinId] = true;
      }

      saveOverviewPinsFeature(nextPins, save);
      renderApp();
    });
  }

  hideBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCustom) {
      if (!confirm(`Delete custom task "${task.name}"?`)) return;

      const next = getCustomTasksFeature(load).filter((t) => t.id !== task.id);
      saveCustomTasksFeature(next, save);

      const completed = load('completed:custom', {});
      const hiddenRows = load('hiddenRows:custom', {});
      const notified = load('notified:custom', {});

      delete completed[task.id];
      delete hiddenRows[task.id];
      delete notified[task.id];

      save('completed:custom', completed);
      save('hiddenRows:custom', hiddenRows);
      save('notified:custom', notified);
    } else {
      hideTask(sectionKey, taskId);
    }

    renderApp();
  });

  const toggleTask = (e) => {
    e.preventDefault();

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
      if (state === 'true' || state === 'hide') return;
      startCooldown(taskId, task.cooldownMinutes);
      setTaskCompleted(sectionKey, taskId, true);
      renderApp();
      return;
    }

    setTaskCompleted(sectionKey, taskId, state !== 'true');
    renderApp();
  };

  notesCell.addEventListener('click', toggleTask);
  statusCell.addEventListener('click', toggleTask);

  row.addEventListener('dragstart', () => {
    dragRow = row;
    row.classList.add('dragging');
  });

  row.addEventListener('dragend', () => {
    row.classList.remove('dragging');
    dragRow = null;
    persistOrderFromTable(sectionKey, { getTableId, save });
  });

  row.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!dragRow || dragRow === row) return;

    const tbody = row.parentElement;
    const rect = row.getBoundingClientRect();
    const insertAfter = (e.clientY - rect.top) > rect.height / 2;
    tbody.insertBefore(dragRow, insertAfter ? row.nextSibling : row);
  });

  if (renderNameOnRight) {
    checkOff.style.display = '';
    checkOn.style.display = '';
  }

  return row;
}

export function persistOrderFromTable(sectionKey, { getTableId, save }) {
  const table = document.getElementById(getTableId(sectionKey));
  const tbody = table?.querySelector('tbody');
  if (!tbody) return;

  const order = [...tbody.querySelectorAll('tr[data-id]')]
    .map((tr) => tr.dataset.id)
    .filter(Boolean);

  save(`order:${sectionKey}`, order);
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
