import { SECTION_CONTAINER_IDS, SECTION_TABLE_IDS } from '../../core/ids/section-ids.js';

export function mergePenguinChildRows(task, weeklyData = {}) {
  const sourceChildren = Array.isArray(task.childRows)
    ? task.childRows
    : Array.isArray(task.children)
      ? task.children
      : null;

  if (task.id !== 'penguins' || !sourceChildren) {
    return task;
  }

  const mergedChildren = sourceChildren.map((child) => {
    const override = weeklyData[child.id] || {};
    return {
      ...child,
      name: override.name || child.name,
      note: override.note || child.note
    };
  });

  return {
    ...task,
    children: mergedChildren
  };
}

function normalizeFarmingTimer(timer, group, index) {
  const timerId = timer?.id || `${group.id}-timer-${index}`;

  return {
    ...timer,
    id: timerId,
    isTimerParent: true,
    vanishOnStart: timer?.vanishOnStart ?? true,
    plots: Array.isArray(timer?.plots) ? timer.plots : []
  };
}

function normalizeStandalonePlots(group) {
  if (!Array.isArray(group?.plots) || group.plots.length === 0) {
    return [];
  }

  if (Array.isArray(group?.timers) && group.timers.length > 0) {
    return [];
  }

  return [
    {
      id: `${group.id}-plots`,
      name: group.label || group.name || group.id,
      isTimer: false,
      tasks: group.plots.map((plot) => ({
        ...plot,
        id: plot.id
      }))
    }
  ];
}

function normalizeFarmingGroup(group) {
  const timerSubgroups = Array.isArray(group?.timers)
    ? group.timers.map((timer, index) => {
      const timerTask = normalizeFarmingTimer(timer, group, index);
      const plots = Array.isArray(timer?.plots)
        ? timer.plots
        : Array.isArray(group?.plots)
          ? group.plots
          : [];

      return {
        id: timerTask.id,
        name: timerTask.name || group.label || group.name || group.id,
        isTimer: true,
        timerTask,
        plots: plots.map((plot) => ({
          ...plot,
          id: plot.id
        }))
      };
    })
    : [];

  const nonTimerSubgroups = normalizeStandalonePlots(group);

  return {
    id: group.id,
    name: group.label || group.name || group.id,
    note: group.note || '',
    subgroups: [...timerSubgroups, ...nonTimerSubgroups]
  };
}

function normalizeFarmingGroups(farmingConfig) {
  const groups = Array.isArray(farmingConfig?.groups) ? farmingConfig.groups : [];
  return groups.map(normalizeFarmingGroup);
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
  const resolvedWeeklies = weeklies.map((task) => mergePenguinChildRows(task, penguinWeeklyData));
  const resolvedFarmingGroups = normalizeFarmingGroups(farmingConfig);

  return {
    custom,
    rs3daily: dailies,
    gathering: gatheringDaily.concat(gatheringWeekly),
    rs3weekly: resolvedWeeklies,
    rs3monthly: monthlies,
    rs3farming: resolvedFarmingGroups
  };
}

export function getContainerId(sectionKey) {
  return SECTION_CONTAINER_IDS[sectionKey];
}

export function getTableId(sectionKey) {
  return SECTION_TABLE_IDS[sectionKey];
}