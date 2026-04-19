function pad2(value) {
  return String(Math.max(0, value)).padStart(2, '0');
}

export function formatDurationMs(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
  }

  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}

export function formatMinutesAsDuration(minutes) {
  const totalMinutes = Number.isFinite(minutes) ? minutes : parseInt(minutes, 10) || 0;
  return formatDurationMs(totalMinutes * 60 * 1000);
}

export function formatSecondsAsDuration(seconds) {
  const totalSeconds = Number.isFinite(seconds) ? seconds : parseInt(seconds, 10) || 0;
  return formatDurationMs(totalSeconds * 1000);
}