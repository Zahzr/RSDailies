export function formatMinutesCountdown(totalMinutes) {
  const safeMinutes = Math.max(0, totalMinutes);

  if (safeMinutes < 60) {
    return `${safeMinutes}`;
  }

  const days = Math.floor(safeMinutes / 1440);
  const hours = Math.floor((safeMinutes % 1440) / 60);
  const minutes = safeMinutes % 60;

  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatDurationMs(milliseconds) {
  const clamped = Math.max(0, milliseconds);
  return formatMinutesCountdown(Math.floor(clamped / 60000));
}

export function formatDateTimeLocal(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}
