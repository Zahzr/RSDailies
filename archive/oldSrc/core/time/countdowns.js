import { formatMinutesCountdown } from './formatters.js';

export function formatCountdown(targetDate) {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  return formatMinutesCountdown(Math.floor(diff / 60000));
}
