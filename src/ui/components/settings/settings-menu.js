export const SETTINGS_FIELD_IDS = Object.freeze({
  splitDailyTables: 'setting-split-daily-tables',
  splitWeeklyTables: 'setting-split-weekly-tables',
  showCompletedTasks: 'setting-show-completed',
  herbTicks: 'setting-3tick-herbs',
  growthOffset: 'setting-growth-offset',
  browserNotif: 'setting-browser-notif',
  webhookUrl: 'setting-webhook-url',
  webhookUserId: 'setting-webhook-user-id',
  webhookMessageTemplate: 'setting-webhook-message-template',
  saveButton: 'save-settings-btn',
});

export function getSettingsFieldIds() {
  return SETTINGS_FIELD_IDS;
}
