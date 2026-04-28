import { getTrackerSections } from '../../registries/unified-registry.js';

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
  const boundaryResolvers = {
    daily: nextDailyBoundary,
    weekly: nextWeeklyBoundary,
    monthly: nextMonthlyBoundary,
  };

  getTrackerSections().forEach((section) => {
    const countdownId = section.shell?.countdownId;
    const boundaryResolver = boundaryResolvers[section.resetFrequency];

    if (!countdownId || !boundaryResolver) {
      return;
    }

    const value = formatBoundaryCountdown(boundaryResolver(new Date()), formatDurationMs);
    const el = documentRef.getElementById(countdownId);
    if (el) el.textContent = value;
  });
}
