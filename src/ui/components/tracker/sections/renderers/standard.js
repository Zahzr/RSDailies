import { appendRows, markLastVisibleRow, centeredHeaderLabel } from './common.js';
import { renderUnifiedSection } from './section-engine.js';
import {
  buildRestoreEntries,
  resetTaskList,
  restoreHiddenRow
} from './storage.js';

export function renderStandardSection(tbody, sectionKey, tasks, { createRow, context }) {
  if (!tbody) return;

  const rows = [];
  tasks.forEach((task) => {
    const row = createRow(sectionKey, task, {
      isCustom: sectionKey === 'custom',
      context
    });
    if (row) rows.push(row);
  });

  markLastVisibleRow(rows);
  appendRows(tbody, rows);
}

export function renderWeekliesWithChildren(
  tbody,
  tasks,
  { isCollapsedBlock, createHeaderRow, createRow, createRightSideChildRow, context }
) {
  if (!tbody) return;

  let penguinTask = null;
  const normalTasks = [];

  tasks.forEach((task) => {
    if (task.id === 'penguins') {
      penguinTask = task;
      return;
    }
    normalTasks.push(task);
  });

  const blocks = [
    {
      id: 'weekly-standard',
      kind: 'rows',
      tasks: normalTasks
    }
  ];

  if (penguinTask && Array.isArray(penguinTask.children) && penguinTask.children.length > 0) {
    const blockId = `row-collapse-${penguinTask.id}`;
    const restoreOptions = buildRestoreEntries(
      'rs3weekly',
      penguinTask.children.map((child) => child.id),
      context
    );

    blocks.push({
      id: blockId,
      kind: 'subgroup',
      title: centeredHeaderLabel(penguinTask.name),
      tasks: penguinTask.children.map((child) => ({ ...child, wiki: child.wiki || penguinTask.wiki || '' })),
      headerMode: 'attached',
      onResetClick: () => resetTaskList('rs3weekly', penguinTask.children, context),
      restoreOptions,
      onRestoreSelect: (taskId) => restoreHiddenRow('rs3weekly', taskId, context)
    });
  }

  renderUnifiedSection(tbody, blocks, {
    sectionKey: 'rs3weekly',
    createRow,
    createHeaderRow,
    isCollapsedBlock,
    context
  });
}

export function renderGroupedGathering(
  tbody,
  tasks,
  { isCollapsedBlock, createHeaderRow, createRow, context, getGroupCountdown }
) {
  if (!tbody) return;

  const grouped = new Map();

  tasks
    .filter((task) => task.id !== 'herb-run-reminder')
    .forEach((task) => {
      const groupName = task.group || (task.reset === 'weekly' ? 'Weekly' : 'General');
      if (!grouped.has(groupName)) grouped.set(groupName, []);
      grouped.get(groupName).push(task);
    });

  const blocks = [...grouped.entries()].map(([groupName, groupTasks]) => {
    const blockId = `group-collapse-gathering-${groupName}`;
    const restoreOptions = buildRestoreEntries(
      'gathering',
      groupTasks.map((task) => task.id),
      context
    );

    return {
      id: blockId,
      kind: 'subgroup',
      title: centeredHeaderLabel(groupName),
      tasks: groupTasks,
      headerMode: 'default',
      rightText: getGroupCountdown?.(groupName) || '',
      onResetClick: () => resetTaskList('gathering', groupTasks, context),
      restoreOptions,
      onRestoreSelect: (taskId) => restoreHiddenRow('gathering', taskId, context)
    };
  });

  renderUnifiedSection(tbody, blocks, {
    sectionKey: 'gathering',
    createRow,
    createHeaderRow,
    isCollapsedBlock,
    context
  });
}
