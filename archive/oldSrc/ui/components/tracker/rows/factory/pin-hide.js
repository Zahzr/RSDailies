import {
  getOverviewPins as getOverviewPinsFeature,
  saveOverviewPins as saveOverviewPinsFeature,
  getCustomTasks as getCustomTasksFeature,
  saveCustomTasks as saveCustomTasksFeature
} from '../../../../../features/sections/domain/state.js';
import { buildPinId } from './helpers.js';
import { removeRowViaX } from './storage.js';

export function bindPinButton(pinBtn, sectionKey, task, { overviewPinId, customStorageId, load, save, renderApp }) {
  if (!pinBtn) return;
  const pinId = buildPinId(sectionKey, task, { overviewPinId, customStorageId });
  const pins = getOverviewPinsFeature(load);
  const pinned = !!pins[pinId];
  pinBtn.textContent = pinned ? '\u2605' : '\u2606';
  pinBtn.title = pinned ? 'Unpin from Overview' : 'Pin to Overview';
  pinBtn.setAttribute('aria-label', pinBtn.title);
  pinBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const nextPins = { ...getOverviewPinsFeature(load) };
    if (nextPins[pinId]) delete nextPins[pinId];
    else nextPins[pinId] = Date.now();
    saveOverviewPinsFeature(nextPins, save);
    renderApp();
  });
}

export function bindHideButton(hideBtn, sectionKey, taskId, task, { isCustom, isOverviewPanel, customStorageId, load, save, hideTask, renderApp }) {
  if (!hideBtn) return;
  if (isOverviewPanel) {
    hideBtn.style.display = 'none';
    return;
  }

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
      delete completed[task.id]; delete hiddenRows[task.id]; delete removedRows[task.id]; delete notified[task.id];
      save('completed:custom', completed); save('hiddenRows:custom', hiddenRows); save('removedRows:custom', removedRows); save('notified:custom', notified);
      const pins = { ...getOverviewPinsFeature(load) };
      delete pins[`custom::${task.id}`];
      saveOverviewPinsFeature(pins, save);
    } else {
      hideTask(sectionKey, taskId);
      removeRowViaX(sectionKey, taskId, task, { load, save });
      const pins = { ...getOverviewPinsFeature(load) };
      delete pins[buildPinId(sectionKey, task, { customStorageId })];
      saveOverviewPinsFeature(pins, save);
    }
    renderApp();
  });
}
