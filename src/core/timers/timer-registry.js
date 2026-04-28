import { farmingConfig } from '../../features/farming/config/index.js';

function buildFarmingTimerEntries() {
  const groups = Array.isArray(farmingConfig?.groups) ? farmingConfig.groups : [];
  const entries = [];

  groups.forEach((group) => {
    const timers = Array.isArray(group?.timers) ? group.timers : [];

    timers.forEach((timer, index) => {
      const timerId = timer?.id || `${group.id}-timer-${index}`;

      entries.push([
        timerId,
        {
          ...timer,
          id: timerId,
          groupId: group.id,
          groupLabel: group.label || group.name || group.id,
          game: 'rs3',
        },
      ]);
    });
  });

  return entries;
}

const TIMER_REGISTRY = new Map(buildFarmingTimerEntries());

export function getTimerDefinition(timerId) {
  return TIMER_REGISTRY.get(timerId) || null;
}

export function hasTimerDefinition(timerId) {
  return TIMER_REGISTRY.has(timerId);
}

export function getAllTimerDefinitions() {
  return Array.from(TIMER_REGISTRY.values());
}

export function getTimerDefinitionsByGroup(groupId) {
  return getAllTimerDefinitions().filter((timer) => timer.groupId === groupId);
}
