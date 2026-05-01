import { formatDurationMs } from '../../../core/time/formatters.js';
import { StorageKeyBuilder } from '../../../core/storage/keys-builder.js';
import { getSettings } from '../../settings/domain/state.js';
import { getTimerMinutes } from './timer-math.js';

export const TIMER_SECTION_KEY = 'timers';
export const LEGACY_TIMER_SECTION_KEY = 'rs3farming';

function getNow() {
  return Date.now();
}

export function isTimerSectionKey(sectionKey) {
  return sectionKey === TIMER_SECTION_KEY || sectionKey === LEGACY_TIMER_SECTION_KEY;
}

export function getTimerChildStorageId(taskId, childId) {
  return StorageKeyBuilder.childTaskStorageId(TIMER_SECTION_KEY, taskId, childId);
}

export function getTimers(load) {
  const value = load(StorageKeyBuilder.timers(), {});
  return value && typeof value === 'object' ? value : {};
}

export function saveTimers(nextTimers, save) {
  save(StorageKeyBuilder.timers(), nextTimers);
}

function cloneTimers(load) {
  return { ...getTimers(load) };
}

function clearChildProgressForTimer(taskId, { load, save }) {
  if (!taskId) return false;

  const prefix = `${TIMER_SECTION_KEY}::${taskId}::`;
  const completed = { ...(load(StorageKeyBuilder.sectionCompletion(TIMER_SECTION_KEY), {}) || {}) };
  const hiddenRows = { ...(load(StorageKeyBuilder.sectionHiddenRows(TIMER_SECTION_KEY), {}) || {}) };

  let changed = false;

  Object.keys(completed).forEach((key) => {
    if (key.startsWith(prefix)) {
      delete completed[key];
      changed = true;
    }
  });

  Object.keys(hiddenRows).forEach((key) => {
    if (key.startsWith(prefix)) {
      delete hiddenRows[key];
      changed = true;
    }
  });

  if (changed) {
    save(StorageKeyBuilder.sectionCompletion(TIMER_SECTION_KEY), completed);
    save(StorageKeyBuilder.sectionHiddenRows(TIMER_SECTION_KEY), hiddenRows);
  }

  return changed;
}

export function startTimer(task, { load, save, getSettingsValue = getSettings }) {
  if (!task?.id) return false;

  const minutes = getTimerMinutes(task, getSettingsValue());
  if (!minutes || minutes < 1) return false;

  clearChildProgressForTimer(task.id, { load, save });

  const startedAt = getNow();
  const readyAt = startedAt + (minutes * 60 * 1000);

  const timers = cloneTimers(load);
  timers[task.id] = {
    id: task.id,
    name: task.name || '',
    timerCategory: task.timerCategory || 'default',
    startedAt,
    readyAt,
    growthMinutes: minutes,
  };

  saveTimers(timers, save);
  return true;
}

export function clearTimer(taskId, { load, save }) {
  if (!taskId) return false;

  const timers = cloneTimers(load);
  const hadTimer = !!timers[taskId];

  if (hadTimer) {
    delete timers[taskId];
    saveTimers(timers, save);
  }

  const clearedChildren = clearChildProgressForTimer(taskId, { load, save });
  return hadTimer || clearedChildren;
}

export function cleanupReadyTimers({ load, save }) {
  const timers = cloneTimers(load);
  const now = getNow();
  let changed = false;

  Object.keys(timers).forEach((taskId) => {
    const entry = timers[taskId];

    if (!entry || !Number.isFinite(entry.readyAt)) {
      delete timers[taskId];
      clearChildProgressForTimer(taskId, { load, save });
      changed = true;
      return;
    }

    if (entry.readyAt <= now) {
      delete timers[taskId];
      clearChildProgressForTimer(taskId, { load, save });
      changed = true;
    }
  });

  if (changed) {
    saveTimers(timers, save);
  }

  return changed;
}

export function getTimerHeaderStatus(task, { load }) {
  if (!task?.id) {
    return { state: 'idle', note: task?.note || '' };
  }

  const timers = getTimers(load);
  const entry = timers[task.id];

  if (!entry) {
    return { state: 'idle', note: task?.note || '' };
  }

  const remaining = entry.readyAt - getNow();

  if (remaining <= 0) {
    return { state: 'ready', note: 'Ready now' };
  }

  return {
    state: 'running',
    note: `Ready in ${formatDurationMs(remaining)}`,
  };
}
