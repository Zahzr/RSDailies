import { loadContentPages } from './load-content.js';

function mergePenguinChildRows(task, weeklyData = {}) {
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
      note: override.note || child.note,
    };
  });

  return {
    ...task,
    children: mergedChildren,
  };
}

function normalizeTaskItems(items, sectionId, penguinWeeklyData) {
  if (!Array.isArray(items)) {
    return [];
  }

  if (sectionId !== 'rs3weekly') {
    return items;
  }

  return items.map((task) => mergePenguinChildRows(task, penguinWeeklyData));
}

function normalizeFarmingTimer(timer, group, index) {
  const timerId = timer?.id || `${group.id}-timer-${index}`;

  return {
    ...timer,
    id: timerId,
    isTimerParent: true,
    vanishOnStart: timer?.vanishOnStart ?? true,
    plots: Array.isArray(timer?.plots) ? timer.plots : [],
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
        id: plot.id,
      })),
    },
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
          id: plot.id,
        })),
      };
    })
    : [];

  return {
    id: group.id,
    name: group.label || group.name || group.id,
    note: group.note || '',
    subgroups: [...timerSubgroups, ...normalizeStandalonePlots(group)],
  };
}

function normalizeFarmingGroups(groups) {
  return Array.isArray(groups) ? groups.map(normalizeFarmingGroup) : [];
}

function resolveSectionItems(section, deps) {
  if (section.id === 'custom') {
    return deps.getCustomTasks();
  }

  if (Array.isArray(section.groups)) {
    return normalizeFarmingGroups(section.groups);
  }

  return normalizeTaskItems(section.items, section.id, deps.getPenguinWeeklyData());
}

function buildCanonicalSectionDefinitions(pages) {
  const sections = new Map();

  pages.forEach((page) => {
    (page.sections || []).forEach((section) => {
      const current = sections.get(section.id);
      const nextScore = page.id === section.id ? 2 : 1;
      const currentScore = current?.score || 0;

      if (!current || nextScore > currentScore) {
        sections.set(section.id, { score: nextScore, section });
      }
    });
  });

  return Array.from(sections.values()).map((entry) => entry.section);
}

export function resolveTrackerSections({
  pages = loadContentPages(),
  getCustomTasks = () => [],
  getPenguinWeeklyData = () => ({}),
} = {}) {
  const deps = { getCustomTasks, getPenguinWeeklyData };

  return buildCanonicalSectionDefinitions(pages).reduce((sections, section) => {
    sections[section.id] = resolveSectionItems(section, deps);
    return sections;
  }, {});
}

export function resolveTrackerPage(pageId, {
  pages = loadContentPages(),
  getCustomTasks = () => [],
  getPenguinWeeklyData = () => ({}),
} = {}) {
  const page = pages.find((entry) => entry.id === pageId);
  if (!page) {
    return null;
  }

  const deps = { getCustomTasks, getPenguinWeeklyData };

  return {
    ...page,
    sections: (page.sections || []).map((section) => ({
      ...section,
      resolvedItems: resolveSectionItems(section, deps),
    })),
  };
}
