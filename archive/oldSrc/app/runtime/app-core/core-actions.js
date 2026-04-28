export function formatBoundaryCountdown(targetMs, formatDurationMs) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return '00:00:00';
  return formatDurationMs(diff);
}

export function applySettingsToDomBridge(applySettingsToDomFeature, getSettings, documentRef = document) {
  applySettingsToDomFeature(documentRef, getSettings());
}

export function checkAutoResetBridge(checkAutoResetFeature, getStorageDeps) {
  return checkAutoResetFeature(getStorageDeps());
}

export function updateCountdowns(documentRef, { nextDailyBoundary, nextWeeklyBoundary, nextMonthlyBoundary, formatDurationMs }) {
  const ids = {
    'countdown-rs3daily': formatBoundaryCountdown(nextDailyBoundary(new Date()), formatDurationMs),
    'countdown-rs3weekly': formatBoundaryCountdown(nextWeeklyBoundary(new Date()), formatDurationMs),
    'countdown-rs3monthly': formatBoundaryCountdown(nextMonthlyBoundary(new Date()), formatDurationMs)
  };
  Object.entries(ids).forEach(([id, value]) => {
    const el = documentRef.getElementById(id);
    if (el) el.textContent = value;
  });
}
