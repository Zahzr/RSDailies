import { SECTION_CONTAINER_IDS, SECTION_TABLE_IDS } from '../../core/ids/section-ids.js';

export function mergePenguinChildRows(task, weeklyData = {}) {
  if (task.id !== 'penguins' || !Array.isArray(task.childRows)) {
    return task;
  }

  const merged = task.childRows.map((child) => {
    const override = weeklyData[child.id] || {};
    return {
      ...child,
      name: override.name || child.name,
      note: override.note || child.note
    };
  });

  return {
    ...task,
    childRows: merged
  };
}

export function getResolvedSections({
  tasksConfig,
  farmingConfig,
  getCustomTasks,
  getPenguinWeeklyData
}) {
  const cfg = tasksConfig || {};

  const dailies = Array.isArray(cfg.dailies) ? cfg.dailies : [];
  const gatheringDaily = Array.isArray(cfg.gathering) ? cfg.gathering : [];
  const weeklies = Array.isArray(cfg.weeklies) ? cfg.weeklies : [];
  const gatheringWeekly = Array.isArray(cfg.weeklyGathering) ? cfg.weeklyGathering : [];
  const monthlies = Array.isArray(cfg.monthlies) ? cfg.monthlies : [];
  const custom = getCustomTasks();
  const penguinWeeklyData = getPenguinWeeklyData();
  const farmingGroups = Array.isArray(farmingConfig?.groups) ? farmingConfig.groups : [];
  const resolvedWeeklies = weeklies.map((task) => mergePenguinChildRows(task, penguinWeeklyData));

  return {
    custom,
    rs3daily: dailies,
    gathering: gatheringDaily.concat(gatheringWeekly),
    rs3weekly: resolvedWeeklies,
    rs3monthly: monthlies,
    rs3farming: farmingGroups
  };
}

export function getContainerId(sectionKey) {
  return SECTION_CONTAINER_IDS[sectionKey];
}

export function getTableId(sectionKey) {
  return SECTION_TABLE_IDS[sectionKey];
}
