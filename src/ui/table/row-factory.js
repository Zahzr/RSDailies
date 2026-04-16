import { cloneTemplate } from '../../core/dom/templates.js';
import { resolveCallback } from '../runtime.js';
import { createInlineActions } from './inline-actions.js';
import { attachTooltip } from './tooltip.js';

let dragRow = null;

export function cloneRowTemplate() {
  return cloneTemplate('sample_row');
}

export function appendRowText(desc, task, sectionKey, runtime = {}) {
  if (task.note) {
    const noteLine = document.createElement('span');
    noteLine.className = 'activity_note_line';
    noteLine.textContent = task.note;
    desc.appendChild(noteLine);
  }

  if (false && task.reset && sectionKey !== 'rs3farming' && !task.isChildRow) {
    const getTaskAlertTarget = resolveCallback(runtime, 'getTaskAlertTarget', () => null);
    const formatDateTimeLocal = resolveCallback(runtime, 'formatDateTimeLocal', (value) => String(value));
    const target = getTaskAlertTarget(task);
    const meta = document.createElement('span');
    meta.className = 'activity_note_line';
    meta.textContent = task.alertDaysBeforeReset > 0
      ? `\u26A0 Do before reset: ${formatDateTimeLocal(target)}`
      : `Reset: ${formatDateTimeLocal(target)}`;
    desc.appendChild(meta);
  }

  if (task.profit?.item && task.profit?.qty) {
    const profit = document.createElement('span');
    profit.className = 'item_profit';
    profit.dataset.item = task.profit.item;
    profit.dataset.qty = String(task.profit.qty);
    profit.textContent = '\u2026';
    desc.appendChild(profit);
  }

  if (task.durationNote) {
    const durationLine = document.createElement('span');
    durationLine.className = 'activity_duration_note';
    durationLine.textContent = task.durationNote;
    desc.appendChild(durationLine);
  }

  if (task.locationNote) {
    const locationLine = document.createElement('span');
    locationLine.className = 'activity_location_note';
    locationLine.textContent = task.locationNote;
    desc.appendChild(locationLine);
  }
}

export function persistOrderFromTable(sectionKey, runtime = {}) {
  const getTableId = resolveCallback(runtime, 'getTableId', () => '');
  const save = resolveCallback(runtime, 'save', () => {});
  const table = document.getElementById(getTableId(sectionKey));
  const tbody = table?.querySelector('tbody');
  if (!tbody) return;

  const order = [...tbody.querySelectorAll('tr[data-id]')]
    .map((tr) => tr.dataset.id)
    .filter(Boolean);

  save(`order:${sectionKey}`, order);
}

export function createBaseRow(sectionKey, task, options = {}, runtime = {}) {
  const {
    isCustom = false,
    extraClass = '',
    customStorageId = null,
    renderNameOnRight = false
  } = options;

  const taskId = customStorageId || task.id;
  const getTaskState = resolveCallback(runtime, 'getTaskState', () => 'false');
  const getOverviewPins = resolveCallback(runtime, 'getOverviewPins', () => ({}));
  const saveOverviewPins = resolveCallback(runtime, 'saveOverviewPins', () => {});
  const hideTask = resolveCallback(runtime, 'hideTask', () => {});
  const startCooldown = resolveCallback(runtime, 'startCooldown', () => {});
  const setTaskCompleted = resolveCallback(runtime, 'setTaskCompleted', () => {});
  const startFarmingTimer = resolveCallback(runtime, 'startFarmingTimer', () => {});
  const clearFarmingTimer = resolveCallback(runtime, 'clearFarmingTimer', () => {});
  const renderApp = resolveCallback(runtime, 'renderApp', () => {});
  const getCustomTasks = resolveCallback(runtime, 'getCustomTasks', () => []);
  const saveCustomTasks = resolveCallback(runtime, 'saveCustomTasks', () => {});
  const load = resolveCallback(runtime, 'load', () => null);
  const save = resolveCallback(runtime, 'save', () => {});

  const row = cloneRowTemplate();
  if (!row) return null;

  row.dataset.id = taskId;
  row.dataset.completed = getTaskState(sectionKey, taskId, task);
  if (extraClass) row.classList.add(extraClass);

  const nameCell = row.querySelector('.activity_name');
  const nameLink = nameCell?.querySelector('a');
  const pinBtn = nameCell?.querySelector('.pin-button');
  const hideBtn = nameCell?.querySelector('.hide-button');
  const notesCell = row.querySelector('.activity_notes');
  const statusCell = row.querySelector('.activity_status');
  const desc = row.querySelector('.activity_desc');
  const checkOff = statusCell?.querySelector('.activity_check_off');
  const checkOn = statusCell?.querySelector('.activity_check_on');

  attachTooltip(row, task, runtime);
  attachTooltip(notesCell, task, runtime);
  attachTooltip(statusCell, task, runtime);

  if (renderNameOnRight) {
    if (nameLink) {
      nameLink.textContent = '';
      nameLink.href = '#';
      nameLink.addEventListener('click', (e) => e.preventDefault());
    }

    if (desc) {
      desc.textContent = '';
      const nameLine = document.createElement('span');
      nameLine.className = 'activity_note_line activity_child_name';
      nameLine.textContent = task.name;
      desc.appendChild(nameLine);
      appendRowText(desc, task, sectionKey, runtime);
    }
  } else {
    if (nameLink) {
      if (task.wiki) {
        nameLink.href = task.wiki;
      } else {
        nameLink.href = '#';
        nameLink.addEventListener('click', (e) => e.preventDefault());
      }

      nameLink.textContent = task.name;
      attachTooltip(nameLink, task, runtime);
    }

    if (desc) {
      desc.textContent = '';
      appendRowText(desc, task, sectionKey, runtime);
    }
  }

  const actions = createInlineActions(task, isCustom, runtime);
  if (actions && desc) desc.appendChild(actions);

  if (pinBtn) {
    const pinId = taskId.includes('::') ? taskId : `${sectionKey}::${taskId}`;
    const pins = getOverviewPins();
    const pinned = !!pins[pinId];

    pinBtn.textContent = pinned ? '\u2605' : '\u2606';
    pinBtn.title = pinned ? 'Unpin from Overview' : 'Pin to Overview';
    pinBtn.setAttribute('aria-label', pinBtn.title);

    pinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const nextPins = { ...getOverviewPins() };
      if (nextPins[pinId]) {
        delete nextPins[pinId];
      } else {
        nextPins[pinId] = true;
      }

      saveOverviewPins(nextPins);
      renderApp();
    });
  }

  if (hideBtn) {
    hideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isCustom) {
        const confirmFn = resolveCallback(runtime, 'confirm', (message) => globalThis.confirm?.(message) ?? true);
        if (!confirmFn(`Delete custom task "${task.name}"?`)) return;

        const next = getCustomTasks().filter((entry) => entry.id !== task.id);
        saveCustomTasks(next);

        const completed = load('completed:custom', {}) || {};
        const hiddenRows = load('hiddenRows:custom', {}) || {};
        const notified = load('notified:custom', {}) || {};

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
  }

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

  notesCell?.addEventListener('click', toggleTask);
  statusCell?.addEventListener('click', toggleTask);

  row.addEventListener('dragstart', () => {
    dragRow = row;
    row.classList.add('dragging');
  });

  row.addEventListener('dragend', () => {
    row.classList.remove('dragging');
    dragRow = null;
    persistOrderFromTable(sectionKey, runtime);
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
    if (checkOff) checkOff.style.display = '';
    if (checkOn) checkOn.style.display = '';
  }

  return row;
}

export function createRow(sectionKey, task, isCustom = false, extraClass = '', runtime = {}) {
  return createBaseRow(sectionKey, task, {
    isCustom,
    extraClass,
    renderNameOnRight: false
  }, runtime);
}
