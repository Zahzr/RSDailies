import { getSettings as getSettingsFeature } from '../../settings/domain/state.js';
import {
  nextDailyBoundary as nextDailyBoundaryCore,
  nextWeeklyBoundary as nextWeeklyBoundaryCore,
  nextMonthlyBoundary as nextMonthlyBoundaryCore
} from '../../../core/time/boundaries.js';

export function maybeBrowserNotify(title, body) {
  const settings = getSettingsFeature();
  if (!settings.browserNotif) return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, { body });
  } catch {
    // noop
  }
}

function applyWebhookTemplate(template, taskName) {
  const safeTemplate = String(template || 'RSDailies: {task} is due.');
  const safeTaskName = String(taskName || 'Task');
  return safeTemplate.replace(/\{task\}/g, safeTaskName);
}

function buildWebhookContent(taskName) {
  const settings = getSettingsFeature();
  if (!settings.webhookUrl) return '';

  const baseMessage = applyWebhookTemplate(settings.webhookMessageTemplate, taskName);
  const mention = settings.webhookUserId ? `<@${settings.webhookUserId}> ` : '';

  return `${mention}${baseMessage}`.trim();
}

export async function maybeWebhookNotify(taskName) {
  const settings = getSettingsFeature();
  if (!settings.webhookUrl) return;

  const content = buildWebhookContent(taskName);
  if (!content) return;

  try {
    await fetch(settings.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  } catch {
    // noop
  }
}

export function getTaskAlertConfig(task) {
  const days = Number.isFinite(task?.alertDaysBeforeReset)
    ? Math.max(0, task.alertDaysBeforeReset)
    : 0;

  return { alertDaysBeforeReset: days };
}

export function getTaskNextReset(task) {
  const reset = String(task?.reset || '').toLowerCase();
  if (reset === 'weekly') return nextWeeklyBoundaryCore();
  if (reset === 'monthly') return nextMonthlyBoundaryCore();
  return nextDailyBoundaryCore();
}

export function getTaskAlertTarget(task) {
  const nextReset = getTaskNextReset(task);
  const { alertDaysBeforeReset } = getTaskAlertConfig(task);
  return new Date(nextReset.getTime() - alertDaysBeforeReset * 86400000);
}

export function maybeNotifyTaskAlert(task, sectionKey, { load, save }) {
  if (!task?.reset) return;

  const target = getTaskAlertTarget(task);
  if (Date.now() < target.getTime()) return;

  const notified = load(`notified:${sectionKey}`, {});
  const stamp = target.toISOString();

  if (notified[task.id] === stamp) return;

  maybeBrowserNotify('RSDailies', `${task.name} is due.`);
  maybeWebhookNotify(task.name);

  notified[task.id] = stamp;
  save(`notified:${sectionKey}`, notified);
}

export function cleanupTaskNotificationsForReset(sectionKey, { removeKey }) {
  removeKey(`notified:${sectionKey}`);
}