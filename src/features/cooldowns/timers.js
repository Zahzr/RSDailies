import {
  getCooldowns as getCooldownsFeature,
  saveCooldowns as saveCooldownsFeature,
  getSectionState as getSectionStateFeature,
  saveSectionValue as saveSectionValueFeature
} from '../sections/state.js';

function getCooldowns(load) {
  return getCooldownsFeature(load);
}

function saveCooldowns(data, save) {
  saveCooldownsFeature(data, save);
}

export function startCooldown(taskId, minutes, { load, save }) {
  const cooldowns = getCooldowns(load);
  const durationMinutes = Math.max(1, Math.floor(minutes));
  
  cooldowns[taskId] = {
    readyAt: Date.now() + durationMinutes * 60000,
    minutes: durationMinutes
  };
  
  saveCooldowns(cooldowns, save);
}

export function cleanupReadyCooldowns({ load, save }) {
  const cooldowns = getCooldowns(load);
  const sections = ['custom', 'rs3daily', 'gathering', 'rs3weekly', 'rs3monthly'];
  let changed = false;

  Object.entries(cooldowns).forEach(([taskId, state]) => {
    if (!state || state.readyAt > Date.now()) return;

    delete cooldowns[taskId];
    changed = true;

    // Side effect: remove completion if cooldown expires
    sections.forEach((sectionKey) => {
      const section = getSectionStateFeature(sectionKey, load);
      if (section.completed[taskId]) {
        delete section.completed[taskId];
        saveSectionValueFeature(sectionKey, 'completed', section.completed, save);
      }
    });
  });

  if (changed) saveCooldowns(cooldowns, save);
  return changed;
}
