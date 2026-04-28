import { settingsDefaults } from '../config/settings-defaults.js';
import { loadJson, saveJson } from '../../../core/storage/local-store.js';
import { getProfilePrefix } from '../../profiles/domain/store.js';

function deriveGrowthOffsetMinutes(herbTicks) {
  return herbTicks === 3 ? 20 : 0;
}

function normalizeWebhookUrl(value) {
  return String(value || '').trim();
}

function normalizeWebhookUserId(value) {
  return String(value || '').trim().replace(/[^\d]/g, '');
}

function normalizeWebhookTemplate(value) {
  const trimmed = String(value || '').trim();
  return trimmed || 'RSDailies: {task} is due.';
}

export function normalizeSettings(partial = {}) {
  const herbTicks = partial.herbTicks === 3 ? 3 : 4;
  const webhookUrl = normalizeWebhookUrl(partial.webhookUrl);
  const webhookUserId = webhookUrl ? normalizeWebhookUserId(partial.webhookUserId) : '';
  const webhookMessageTemplate = normalizeWebhookTemplate(partial.webhookMessageTemplate);

  return {
    splitDailyTables: partial.splitDailyTables !== false,
    splitWeeklyTables: partial.splitWeeklyTables !== false,
    herbTicks,
    growthOffsetMinutes: deriveGrowthOffsetMinutes(herbTicks),
    browserNotif: !!partial.browserNotif,
    webhookUrl,
    webhookUserId,
    webhookMessageTemplate,
    overviewVisible: partial.overviewVisible !== false
  };
}

export function getSettings(storage = window.localStorage) {
  const stored = loadJson(
    `${getProfilePrefix()}settings`,
    {
      ...settingsDefaults,
      webhookUserId: '',
      webhookMessageTemplate: 'RSDailies: {task} is due.'
    },
    storage
  );

  return normalizeSettings(stored);
}

export function saveSettings(settings, storage = window.localStorage) {
  saveJson(`${getProfilePrefix()}settings`, normalizeSettings(settings), storage);
}

export function applySettingsToDom(documentRef = document, settings = getSettings()) {
  const splitDaily = documentRef.getElementById('setting-split-daily-tables');
  const splitWeekly = documentRef.getElementById('setting-split-weekly-tables');
  const herbs3 = documentRef.getElementById('setting-3tick-herbs');
  const growthOffset = documentRef.getElementById('setting-growth-offset');
  const browserNotif = documentRef.getElementById('setting-browser-notif');
  const webhook = documentRef.getElementById('setting-webhook-url');
  const webhookUserId = documentRef.getElementById('setting-webhook-user-id');
  const webhookTemplate = documentRef.getElementById('setting-webhook-message-template');

  if (splitDaily) splitDaily.checked = settings.splitDailyTables !== false;
  if (splitWeekly) splitWeekly.checked = settings.splitWeeklyTables !== false;
  if (herbs3) herbs3.checked = settings.herbTicks === 3;
  if (browserNotif) browserNotif.checked = !!settings.browserNotif;
  if (webhook) webhook.value = settings.webhookUrl || '';
  if (webhookUserId) webhookUserId.value = settings.webhookUserId || '';
  if (webhookTemplate) webhookTemplate.value = settings.webhookMessageTemplate || 'RSDailies: {task} is due.';

  if (growthOffset) {
    growthOffset.value = String(settings.growthOffsetMinutes || 0);

    const settingsBlock = growthOffset.closest('.settings-block');
    if (settingsBlock) {
      settingsBlock.style.display = 'none';
      settingsBlock.style.visibility = 'hidden';
    }
  }
}

export function collectSettingsFromDom(documentRef = document) {
  const herbTicks = documentRef.getElementById('setting-3tick-herbs')?.checked ? 3 : 4;

  return normalizeSettings({
    splitDailyTables: !!documentRef.getElementById('setting-split-daily-tables')?.checked,
    splitWeeklyTables: !!documentRef.getElementById('setting-split-weekly-tables')?.checked,
    herbTicks,
    browserNotif: !!documentRef.getElementById('setting-browser-notif')?.checked,
    webhookUrl: (documentRef.getElementById('setting-webhook-url')?.value || '').trim(),
    webhookUserId: (documentRef.getElementById('setting-webhook-user-id')?.value || '').trim(),
    webhookMessageTemplate: (documentRef.getElementById('setting-webhook-message-template')?.value || '').trim(),
    overviewVisible: true
  });
}