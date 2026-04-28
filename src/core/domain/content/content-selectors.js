import { loadContentPages } from './load-content.js';

function getCanonicalSectionsById(pages = loadContentPages()) {
  const sections = new Map();

  pages.forEach((page) => {
    (page.sections || []).forEach((section) => {
      const current = sections.get(section.id);
      const score = page.id === section.id ? 2 : 1;

      if (!current || score > current.score) {
        sections.set(section.id, { score, section });
      }
    });
  });

  return new Map(
    Array.from(sections.entries()).map(([sectionId, entry]) => [sectionId, entry.section])
  );
}

function flattenTaskIds(tasks = []) {
  return tasks.flatMap((task) => {
    const childRows = Array.isArray(task.childRows) ? task.childRows.map((child) => child.id) : [];
    const children = Array.isArray(task.children) ? task.children.map((child) => child.id) : [];
    return [task.id, ...childRows, ...children].filter(Boolean);
  });
}

function flattenGroupTaskIds(sectionId, groups = []) {
  return groups.flatMap((group) => {
    const timers = Array.isArray(group.timers) ? group.timers : [];
    const plots = Array.isArray(group.plots) ? group.plots : [];

    const timerChildIds = timers.flatMap((timer) =>
      plots.map((plot) => `${sectionId}::${timer.id}::${plot.id}`)
    );

    const plotIdsWithoutTimers = timers.length === 0 ? plots.map((plot) => plot.id) : [];
    return [...timerChildIds, ...plotIdsWithoutTimers].filter(Boolean);
  });
}

export function getContentSectionDefinition(sectionId, { pages = loadContentPages() } = {}) {
  return getCanonicalSectionsById(pages).get(sectionId) || null;
}

export function getContentSectionTaskIds(sectionId, { pages = loadContentPages(), customTasks = [] } = {}) {
  if (sectionId === 'custom') {
    return customTasks.map((task) => task.id).filter(Boolean);
  }

  const section = getContentSectionDefinition(sectionId, { pages });
  if (!section) {
    return [];
  }

  if (Array.isArray(section.items)) {
    return flattenTaskIds(section.items);
  }

  if (Array.isArray(section.groups)) {
    return flattenGroupTaskIds(sectionId, section.groups);
  }

  return [];
}

export function getContentSectionTaskIdsByCadence(sectionId, cadence, { pages = loadContentPages() } = {}) {
  const normalizedCadence = String(cadence || '').toLowerCase();
  const section = getContentSectionDefinition(sectionId, { pages });

  if (!section || !Array.isArray(section.items)) {
    return [];
  }

  return section.items
    .filter((task) => String(task?.reset || 'daily').toLowerCase() === normalizedCadence)
    .map((task) => task.id)
    .filter(Boolean);
}
