import { formatDurationMs } from '../../../core/time/formatters.js';
import { getTimerMinutes } from './timer-math.js';

function getNow() {
  return Date.now();
}

function getFarmingTimers(load) {
  const value = load('farmingTimers', {});
  return value && typeof value === 'object' ? value : {};
}

function saveFarmingTimers(nextTimers, save) {
  save('farmingTimers', nextTimers);
}

function cloneTimers(load) {
  return { ...getFarmingTimers(load) };
}

function clearChildProgressForTimer(taskId, { load, save }) {
  if (!taskId) return false;

  const prefix = `rs3farming::${taskId}::`;
  const completed = { ...(load('completed:rs3farming', {}) || {}) };
  const hiddenRows = { ...(load('hiddenRows:rs3farming', {}) || {}) };

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
    save('completed:rs3farming', completed);
    save('hiddenRows:rs3farming', hiddenRows);
  }

  return changed;
}

export function startFarmingTimer(task, { load, save }) {
  if (!task?.id) return false;

  const minutes = getTimerMinutes(task);
  if (!minutes || minutes < 1) return false;

  clearChildProgressForTimer(task.id, { load, save });

  const startedAt = getNow();
  const readyAt = startedAt + minutes * 60 * 1000;

  const timers = cloneTimers(load);
  timers[task.id] = {
    id: task.id,
    name: task.name || '',
    startedAt,
    readyAt,
    growthMinutes: minutes
  };

  saveFarmingTimers(timers, save);
  return true;
}

export function clearFarmingTimer(taskId, { load, save }) {
  if (!taskId) return false;

  const timers = cloneTimers(load);
  const hadTimer = !!timers[taskId];

  if (hadTimer) {
    delete timers[taskId];
    saveFarmingTimers(timers, save);
  }

  const clearedChildren = clearChildProgressForTimer(taskId, { load, save });
  return hadTimer || clearedChildren;
}

export function cleanupReadyFarmingTimers({ load, save }) {
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
    saveFarmingTimers(timers, save);
  }

  return changed;
}

export function getFarmingHeaderStatus(task, { load }) {
  if (!task?.id) {
    return {
      state: 'idle',
      note: task?.note || ''
    };
  }

  const timers = getFarmingTimers(load);
  const entry = timers[task.id];

  if (!entry) {
    return {
      state: 'idle',
      note: task?.note || ''
    };
  }

  const remaining = entry.readyAt - getNow();

  if (remaining <= 0) {
    return {
      state: 'ready',
      note: 'Ready now'
    };
  }

  return {
    state: 'running',
    note: `Ready in ${formatDurationMs(remaining)}`
  };
}
