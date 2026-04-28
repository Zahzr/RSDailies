import { buildCustomTask, isValidOptionalUrl } from './builders.js';

export function promptAddCustomTask(deps) {
  const { getCustomTasks, saveCustomTasks, renderApp } = deps;
  const name = prompt('Task name:');
  if (!name || !name.trim()) return;

  const note = prompt('Task note (optional):') || '';
  const wiki = prompt('Wiki / URL (optional):') || '';
  const reset = (prompt('Reset type? daily / weekly / monthly / timer', 'daily') || 'daily').trim().toLowerCase();
  const alertRaw = reset === 'timer' ? '0' : (prompt('Alert how many days before reset? (0 for same day)', '0') || '0');
  const timerRaw = reset === 'timer' ? (prompt('Timer repeat interval in minutes?', '60') || '60') : '60';

  if (!isValidOptionalUrl(wiki)) {
    alert('Please enter a valid URL starting with http:// or https://');
    return;
  }

  const task = buildCustomTask({
    rawName: name.trim(),
    rawNote: note.trim(),
    rawWiki: wiki.trim(),
    rawReset: reset,
    rawAlertDaysBeforeReset: alertRaw,
    rawTimerMinutes: timerRaw
  });

  const existing = Array.isArray(getCustomTasks()) ? getCustomTasks() : [];
  saveCustomTasks([...existing, task]);
  renderApp();
}
