import { appendRows, markLastVisibleRow, centeredHeaderLabel, finalizeSubgroupBlock } from './common.js';
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
  const normalRows = [];

  tasks.forEach((task) => {
    if (task.id === 'penguins') {
      penguinTask = task;
      return;
    }

    const row = createRow('rs3weekly', task, { context });
    if (row) normalRows.push(row);

    if (!Array.isArray(task.children) || task.children.length === 0) return;

    const blockId = `row-collapse-${task.id}`;
    if (isCollapsedBlock(blockId)) return;

    const childRows = [];
    task.children.forEach((child) => {
      const childRow = createRightSideChildRow('rs3weekly', child, task.id, {
        extraClass: 'weekly-child-row',
        context
      });
      if (childRow) childRows.push(childRow);
    });

    markLastVisibleRow(childRows);
    normalRows.push(...childRows);
  });

  appendRows(tbody, normalRows);

  if (!penguinTask || !Array.isArray(penguinTask.children) || penguinTask.children.length === 0) return;

  const blockId = `row-collapse-${penguinTask.id}`;
  const collapsed = isCollapsedBlock(blockId);
  const restoreOptions = buildRestoreEntries(
    'rs3weekly',
    penguinTask.children.map((child) => child.id),
    context
  );

  const penguinRows = [];
  if (!collapsed) {
    penguinTask.children.forEach((child) => {
      const childRow = createRow(
        'rs3weekly',
        { ...child, wiki: child.wiki || penguinTask.wiki || '' },
        { extraClass: 'weekly-child-row', context }
      );
      if (childRow) penguinRows.push(childRow);
    });
  }

  const headerRow = createHeaderRow(centeredHeaderLabel(penguinTask.name), blockId, {
    className: 'farming-subgroup-row farming-subheader-row weekly-subgroup-row',
    onResetClick: () => resetTaskList('rs3weekly', penguinTask.children, context),
    restoreOptions,
    onRestoreSelect: (taskId) => restoreHiddenRow('rs3weekly', taskId, context),
    context
  });

  finalizeSubgroupBlock(headerRow, penguinRows, { collapsed });
  tbody.appendChild(headerRow);
  if (collapsed) return;
  appendRows(tbody, penguinRows);
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

  [...grouped.entries()].forEach(([groupName, groupTasks], index, allGroups) => {
    const blockId = `group-collapse-gathering-${groupName}`;
    const collapsed = isCollapsedBlock(blockId);
    const restoreOptions = buildRestoreEntries(
      'gathering',
      groupTasks.map((task) => task.id),
      context
    );

    const rows = [];
    if (!collapsed) {
      groupTasks.forEach((task) => {
        const row = createRow('gathering', task, { context });
        if (row) rows.push(row);
      });
    }

    const headerRow = createHeaderRow(centeredHeaderLabel(groupName), blockId, {
      className: 'gathering-group-row farming-subheader-row gathering-subgroup-row',
      rightText: getGroupCountdown?.(groupName) || '',
      onResetClick: () => {
        resetTaskList('gathering', groupTasks, context);
      },
      restoreOptions,
      onRestoreSelect: (taskId) => restoreHiddenRow('gathering', taskId, context),
      context
    });

    finalizeSubgroupBlock(headerRow, rows, { collapsed });
    tbody.appendChild(headerRow);
    if (collapsed) return;
    appendRows(tbody, rows);
  });
}
