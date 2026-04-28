import { calculateGoldValue, formatGold } from '../../../../../core/calculators/GoldCalc.js';
import { formatDurationMs } from '../../../../../core/time/formatters.js';
import { COLUMN_TYPES } from './column.constants.js';

function normalizeMinutes(value) {
  const numeric = Number.isFinite(value) ? value : parseInt(value, 10);
  return Number.isFinite(numeric) ? numeric : null;
}

export function getCustomTimerText(taskId, task, load) {
  const cooldownMinutes = normalizeMinutes(task?.cooldownMinutes);
  if (!Number.isFinite(cooldownMinutes) || cooldownMinutes < 1) return '';

  const cooldowns = load?.('cooldowns', {}) || {};
  const active = cooldowns?.[taskId];
  if (active?.readyAt && active.readyAt > Date.now()) {
    return formatDurationMs(active.readyAt - Date.now());
  }

  return formatDurationMs(cooldownMinutes * 60 * 1000);
}

export function getGoldColumnValue(price, qty = 1) {
  const value = calculateGoldValue(price, qty);
  return {
    value,
    text: formatGold(value)
  };
}

export function getColumnValue(type, payload = {}) {
  switch (type) {
    case COLUMN_TYPES.TIMER:
      return getCustomTimerText(payload.taskId, payload.task, payload.load);
    case COLUMN_TYPES.GOLD:
      return getGoldColumnValue(payload.price, payload.qty);
    default:
      return payload.value ?? '';
  }
}
