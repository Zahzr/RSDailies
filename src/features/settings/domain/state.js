import { settingsDefaults } from '../config/settings-defaults.js';
import { loadJson, saveJson } from '../../../core/storage/local-store.js';
import { getProfilePrefix } from '../../profiles/domain/store.js';
import { getSettingsFieldIds } from '../../../ui/components/settings/settings-menu.js';

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
    showCompletedTasks: partial.showCompletedTasks === true,
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
  const fieldIds = getSettingsFieldIds();
  const splitDaily = documentRef.getElementById(fieldIds.splitDailyTables);
  const splitWeekly = documentRef.getElementById(fieldIds.splitWeeklyTables);
  const showCompleted = documentRef.getElementById(fieldIds.showCompletedTasks);
  const herbs3 = documentRef.getElementById(fieldIds.herbTicks);
  const growthOffset = documentRef.getElementById(fieldIds.growthOffset);
  const browserNotif = documentRef.getElementById(fieldIds.browserNotif);
  const webhook = documentRef.getElementById(fieldIds.webhookUrl);
  const webhookUserId = documentRef.getElementById(fieldIds.webhookUserId);
  const webhookTemplate = documentRef.getElementById(fieldIds.webhookMessageTemplate);

  if (splitDaily) splitDaily.checked = settings.splitDailyTables !== false;
  if (splitWeekly) splitWeekly.checked = settings.splitWeeklyTables !== false;
  if (showCompleted) showCompleted.checked = settings.showCompletedTasks === true;
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
  const fieldIds = getSettingsFieldIds();
  const herbTicks = documentRef.getElementById(fieldIds.herbTicks)?.checked ? 3 : 4;

  return normalizeSettings({
    splitDailyTables: !!documentRef.getElementById(fieldIds.splitDailyTables)?.checked,
    splitWeeklyTables: !!documentRef.getElementById(fieldIds.splitWeeklyTables)?.checked,
    showCompletedTasks: !!documentRef.getElementById(fieldIds.showCompletedTasks)?.checked,
    herbTicks,
    browserNotif: !!documentRef.getElementById(fieldIds.browserNotif)?.checked,
    webhookUrl: (documentRef.getElementById(fieldIds.webhookUrl)?.value || '').trim(),
    webhookUserId: (documentRef.getElementById(fieldIds.webhookUserId)?.value || '').trim(),
    webhookMessageTemplate: (documentRef.getElementById(fieldIds.webhookMessageTemplate)?.value || '').trim(),
    overviewVisible: true
  });
}
