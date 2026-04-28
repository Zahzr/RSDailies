import { formatDurationMs } from '../../../core/time/formatters.js';

function getCooldowns(load) {
  const value = load('cooldowns', {});
  return value && typeof value === 'object' ? value : {};
}

function saveCooldowns(data, save) {
  save('cooldowns', data);
}

function cloneCooldowns(load) {
  return { ...getCooldowns(load) };
}

function getSectionState(sectionKey, load) {
  return {
    completed: load(`completed:${sectionKey}`, {}),
    hiddenRows: load(`hiddenRows:${sectionKey}`, {}),
    order: load(`order:${sectionKey}`, []),
    sort: load(`sort:${sectionKey}`, 'default'),
    hideSection: load(`hideSection:${sectionKey}`, false),
    showHidden: load(`showHidden:${sectionKey}`, false)
  };
}

function saveSectionValue(sectionKey, key, value, save) {
  save(`${key}:${sectionKey}`, value);
}

function restoreTaskInSection(sectionKey, taskId, { load, save }) {
  const section = getSectionState(sectionKey, load);
  const completed = { ...(section.completed || {}) };
  const hiddenRows = { ...(section.hiddenRows || {}) };

  let changed = false;

  if (completed[taskId]) {
    delete completed[taskId];
    changed = true;
  }

  if (hiddenRows[taskId]) {
    delete hiddenRows[taskId];
    changed = true;
  }

  if (changed) {
    saveSectionValue(sectionKey, 'completed', completed, save);
    saveSectionValue(sectionKey, 'hiddenRows', hiddenRows, save);
  }

  return changed;
}

export function startCooldown(taskId, minutes, { load, save }) {
  if (!taskId) return false;

  const durationMinutes = Math.max(1, Math.floor(Number(minutes) || 0));
  const cooldowns = cloneCooldowns(load);

  cooldowns[taskId] = {
    readyAt: Date.now() + durationMinutes * 60000,
    minutes: durationMinutes
  };

  saveCooldowns(cooldowns, save);
  return true;
}

export function clearCooldown(taskId, { load, save }) {
  if (!taskId) return false;

  const cooldowns = cloneCooldowns(load);
  if (!cooldowns[taskId]) return false;

  delete cooldowns[taskId];
  saveCooldowns(cooldowns, save);
  return true;
}

export function getCooldownStatus(taskId, { load }) {
  const cooldowns = getCooldowns(load);
  const state = cooldowns[taskId];

  if (!state || !state.readyAt) {
    return {
      state: 'idle',
      note: ''
    };
  }

  const remaining = state.readyAt - Date.now();

  if (remaining <= 0) {
    return {
      state: 'ready',
      note: 'Ready now'
    };
  }

  return {
    state: 'running',
    note: `Ready in ${formatDurationMs(remaining)}`
  };
}

export function cleanupReadyCooldowns({ load, save }) {
  const cooldowns = cloneCooldowns(load);
  const sections = ['custom', 'rs3daily', 'gathering', 'rs3weekly', 'rs3monthly'];
  let changed = false;

  Object.entries(cooldowns).forEach(([taskId, state]) => {
    if (!state || !state.readyAt || state.readyAt > Date.now()) return;

    delete cooldowns[taskId];
    changed = true;

    sections.forEach((sectionKey) => {
      restoreTaskInSection(sectionKey, taskId, { load, save });
    });
  });

  if (changed) {
    saveCooldowns(cooldowns, save);
  }

  return changed;
}