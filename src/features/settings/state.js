import { settingsDefaults } from '../../config/settings-defaults.js';
import { loadJson, saveJson } from '../../core/storage/local-store.js';
import { getProfilePrefix } from '../profiles/store.js';

export function getSettings(storage = window.localStorage) {
  return loadJson(`${getProfilePrefix()}settings`, { ...settingsDefaults }, storage);
}

export function saveSettings(settings, storage = window.localStorage) {
  saveJson(`${getProfilePrefix()}settings`, settings, storage);
}

export function normalizeSettings(partial = {}) {
  return {
    splitDailyTables: partial.splitDailyTables !== false,
    splitWeeklyTables: partial.splitWeeklyTables !== false,
    herbTicks: partial.herbTicks === 3 ? 3 : 4,
    growthOffsetMinutes: Number.isFinite(partial.growthOffsetMinutes) ? partial.growthOffsetMinutes : 0,
    browserNotif: !!partial.browserNotif,
    webhookUrl: String(partial.webhookUrl || '').trim(),
    overviewVisible: partial.overviewVisible !== false
  };
}

export function applySettingsToDom(documentRef = document, settings = getSettings()) {
  const splitDaily = documentRef.getElementById('setting-split-daily-tables');
  const splitWeekly = documentRef.getElementById('setting-split-weekly-tables');
  const herbs3 = documentRef.getElementById('setting-3tick-herbs');
  const growthOffset = documentRef.getElementById('setting-growth-offset');
  const browserNotif = documentRef.getElementById('setting-browser-notif');
  const webhook = documentRef.getElementById('setting-webhook-url');

  if (splitDaily) splitDaily.checked = settings.splitDailyTables !== false;
  if (splitWeekly) splitWeekly.checked = settings.splitWeeklyTables !== false;
  if (herbs3) herbs3.checked = settings.herbTicks === 3;
  if (growthOffset) growthOffset.value = String(settings.growthOffsetMinutes || 0);
  if (browserNotif) browserNotif.checked = !!settings.browserNotif;
  if (webhook) webhook.value = settings.webhookUrl || '';
}

export function collectSettingsFromDom(documentRef = document) {
  const growthOffsetRaw = documentRef.getElementById('setting-growth-offset')?.value || '0';
  let growthOffsetMinutes = parseInt(growthOffsetRaw, 10);

  if (!Number.isFinite(growthOffsetMinutes)) growthOffsetMinutes = 0;
  growthOffsetMinutes = Math.max(-60, Math.min(60, growthOffsetMinutes));

  return normalizeSettings({
    splitDailyTables: !!documentRef.getElementById('setting-split-daily-tables')?.checked,
    splitWeeklyTables: !!documentRef.getElementById('setting-split-weekly-tables')?.checked,
    herbTicks: documentRef.getElementById('setting-3tick-herbs')?.checked ? 3 : 4,
    growthOffsetMinutes,
    browserNotif: !!documentRef.getElementById('setting-browser-notif')?.checked,
    webhookUrl: (documentRef.getElementById('setting-webhook-url')?.value || '').trim(),
    overviewVisible: true
  });
}
