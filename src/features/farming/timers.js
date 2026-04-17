import { getSettings as getSettingsFeature } from '../settings/index.js';
import {
  getFarmingTimers as getFarmingTimersFeature,
  saveFarmingTimers as saveFarmingTimersFeature
} from '../sections/state.js';
import { formatDurationMs as formatDurationMsCore } from '../../core/time/formatters.js';

/**
 * Common state accessors (usually injected via profile loaders in legacy code)
 * For this modular version, we assume the feature state is managed by the profile store.
 */
function getFarmingTimers(load) {
  return getFarmingTimersFeature(load);
}

function saveFarmingTimers(timers, save) {
  saveFarmingTimersFeature(timers, save);
}

/**
 * Core calculation logic for farming cycles.
 * @param {number} nowMs 
 * @param {number} cycleMinutes 
 * @param {number} stages 
 * @param {number} offsetMinutes 
 */
export function computeReadyAtMs(nowMs, cycleMinutes, stages, offsetMinutes = 0) {
  const cycleMs = Math.max(1, cycleMinutes) * 60000;
  const offsetMs = (offsetMinutes || 0) * 60000;
  const anchorMs = Date.UTC(1970, 0, 1, 0, 0, 0, 0) + offsetMs;
  const elapsed = nowMs - anchorMs;
  const steps = Math.floor(elapsed / cycleMs);
  const currentStart = anchorMs + steps * cycleMs;
  const nextStart = currentStart <= nowMs ? currentStart + cycleMs : currentStart;
  return nextStart + Math.max(0, (stages || 1) - 1) * cycleMs;
}

export function startFarmingTimer(task, { load, save }) {
  const timers = getFarmingTimers(load);
  const settings = getSettingsFeature();

  const herbTicks = settings.herbTicks === 3 ? 3 : 4;
  const stages = task.useHerbSetting ? herbTicks : (task.stages || 1);
  const cycleMinutes = task.cycleMinutes || 20;
  const offset = settings.growthOffsetMinutes || 0;

  const startedAt = Date.now();
  const readyAt = computeReadyAtMs(startedAt, cycleMinutes, stages, offset);

  timers[task.id] = {
    id: task.id,
    name: task.name,
    startedAt,
    readyAt,
    cycleMinutes,
    stages,
    alerted: false
  };

  saveFarmingTimers(timers, save);
}

export function clearFarmingTimer(taskId, { load, save }) {
  const timers = getFarmingTimers(load);
  delete timers[taskId];
  saveFarmingTimers(timers, save);
}

export function cleanupReadyFarmingTimers({ load, save }) {
  const timers = getFarmingTimers(load);
  let timersChanged = false;

  Object.values(timers).forEach((timer) => {
    if (!timer) return;
    if (timer.readyAt > Date.now()) return;

    delete timers[timer.id];
    timersChanged = true;
  });

  if (timersChanged) saveFarmingTimers(timers, save);
  return timersChanged;
}

export function getFarmingHeaderStatus(task, { load }) {
  const timers = getFarmingTimers(load);
  const running = timers[task.id];
  return running ? `Ready in ${formatDurationMsCore(running.readyAt - Date.now())}` : 'Start timer';
}
