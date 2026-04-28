import {
  appendRows,
  buildFarmingLocationTask,
  centeredHeaderLabel,
  collectFarmingGroupTaskIds,
  finalizeSubgroupBlock,
  formatFarmingDurationNote,
  getRenderableHeaderStatus,
  makeFarmingChildStorageId,
  markLastVisibleRow
} from './common.js';
import {
  buildRestoreEntries,
  clearCompletedEntries,
  getHiddenRowsForSection,
  getRemovedRowsForSection,
  resetTaskList,
  restoreHiddenRow,
  setHiddenRowsForSection,
  setRemovedRowsForSection
} from './storage.js';

function resetFarmingRows(taskIds, context, timerIds = []) {
  clearCompletedEntries('rs3farming', taskIds, context);

  const hiddenRows = getHiddenRowsForSection('rs3farming', context);
  const removedRows = getRemovedRowsForSection('rs3farming', context);

  taskIds.forEach((taskId) => {
    delete hiddenRows[taskId];
    delete removedRows[taskId];
  });

  timerIds.forEach((timerId) => context.clearFarmingTimer?.(timerId));

  setHiddenRowsForSection('rs3farming', hiddenRows, context);
  setRemovedRowsForSection('rs3farming', removedRows, context);
  context.renderApp?.();
}

function buildTimerPlotRows(timerTask, subgroup, createRightSideChildRow, formatDurationMs, statusNote, context) {
  const durationNote = formatFarmingDurationNote(timerTask, { formatDurationMs });
  const plots = Array.isArray(subgroup.plots) ? subgroup.plots : [];
  const rows = [];

  plots.forEach((plot) => {
    const childTask = buildFarmingLocationTask(plot, timerTask, { durationNote, statusNote });
    const childRow = createRightSideChildRow('rs3farming', childTask, timerTask.id, {
      extraClass: 'farming-child-row',
      context
    });
    if (childRow) rows.push(childRow);
  });

  return rows;
}

function renderFarmingSingleTimerGroup(tbody, group, subgroup, deps) {
  const {
    isCollapsedBlock,
    getFarmingHeaderStatus,
    createHeaderRow,
    createRightSideChildRow,
    formatDurationMs,
    context
  } = deps;

  const timerTask = subgroup.timerTask;
  const blockId = `group-collapse-rs3farming-${group.id}-${timerTask.id}`;
  const collapsed = isCollapsedBlock(blockId);
  const plotIds = (Array.isArray(subgroup.plots) ? subgroup.plots : [])
    .map((plot) => makeFarmingChildStorageId(timerTask.id, plot.id));
  const restoreOptions = buildRestoreEntries('rs3farming', plotIds, context);
  const headerStatus = getFarmingHeaderStatus?.(timerTask) || { note: '', state: 'idle' };

  const plotRows = collapsed
    ? []
    : buildTimerPlotRows(
      timerTask,
      subgroup,
      createRightSideChildRow,
      formatDurationMs,
      getRenderableHeaderStatus(headerStatus),
      context
    );

  const headerRow = createHeaderRow(centeredHeaderLabel(group.name), blockId, {
    className: 'farming-group-row farming-parent-row',
    rightText: getRenderableHeaderStatus(headerStatus),
    onResetClick: () => resetFarmingRows(plotIds, context, [timerTask.id]),
    restoreOptions,
    onRestoreSelect: (taskId) => restoreHiddenRow('rs3farming', taskId, context),
    context
  });

  finalizeSubgroupBlock(headerRow, plotRows, { collapsed });
  tbody.appendChild(headerRow);
  if (!collapsed) appendRows(tbody, plotRows);
}

export function renderGroupedFarming(tbody, groups, deps) {
  const {
    isCollapsedBlock,
    getFarmingHeaderStatus,
    createHeaderRow,
    createRow,
    createRightSideChildRow,
    formatDurationMs,
    context
  } = deps;
  if (!tbody) return;

  groups.forEach((group, groupIndex, allGroups) => {
    const subgroups = Array.isArray(group.subgroups) ? group.subgroups : [];

    if (subgroups.length === 1 && subgroups[0]?.isTimer && subgroups[0]?.timerTask) {
      renderFarmingSingleTimerGroup(tbody, group, subgroups[0], deps);
      return;
    }

    const groupBlockId = `group-collapse-rs3farming-parent-${group.id}`;
    const groupCollapsed = isCollapsedBlock(groupBlockId);
    const groupTaskIds = collectFarmingGroupTaskIds(group);
    const groupRestoreOptions = buildRestoreEntries('rs3farming', groupTaskIds, context);

    const groupRows = [];

    subgroups.forEach((subgroup, subgroupIndex) => {
      if (subgroup.isTimer && subgroup.timerTask) {
        const timerTask = subgroup.timerTask;
        const blockId = `group-collapse-rs3farming-${group.id}-${timerTask.id}`;
        const collapsed = isCollapsedBlock(blockId);
        const plotIds = (Array.isArray(subgroup.plots) ? subgroup.plots : [])
          .map((plot) => makeFarmingChildStorageId(timerTask.id, plot.id));
        const restoreOptions = buildRestoreEntries('rs3farming', plotIds, context);
        const headerStatus = getFarmingHeaderStatus?.(timerTask) || { note: '', state: 'idle' };
        const plotRows = collapsed
          ? []
          : buildTimerPlotRows(
            timerTask,
            subgroup,
            createRightSideChildRow,
            formatDurationMs,
            getRenderableHeaderStatus(headerStatus),
            context
          );

        const subgroupHeader = createHeaderRow(centeredHeaderLabel(subgroup.name), blockId, {
          className: 'farming-subgroup-row farming-subheader-row farming-timer-subgroup-row',
          rightText: getRenderableHeaderStatus(headerStatus),
          onResetClick: () => resetFarmingRows(plotIds, context, [timerTask.id]),
          restoreOptions,
          onRestoreSelect: (taskId) => restoreHiddenRow('rs3farming', taskId, context),
          context
        });

        finalizeSubgroupBlock(subgroupHeader, plotRows, { collapsed });
        groupRows.push(subgroupHeader, ...plotRows);
        return;
      }

      if (Array.isArray(subgroup.tasks) && subgroup.tasks.length > 0) {
        const blockId = `group-collapse-rs3farming-${group.id}-${subgroup.id}`;
        const collapsed = isCollapsedBlock(blockId);
        const taskIds = subgroup.tasks.map((task) => task.id);
        const restoreOptions = buildRestoreEntries('rs3farming', taskIds, context);
        const rows = [];
        if (!collapsed) {
          subgroup.tasks.forEach((task) => {
            const row = createRow('rs3farming', task, { context });
            if (row) rows.push(row);
          });
        }

        const subgroupHeader = createHeaderRow(centeredHeaderLabel(subgroup.name), blockId, {
          className: 'farming-subgroup-row farming-subheader-row farming-plain-subgroup-row',
          onResetClick: () => resetTaskList('rs3farming', subgroup.tasks, context),
          restoreOptions,
          onRestoreSelect: (taskId) => restoreHiddenRow('rs3farming', taskId, context),
          context
        });

        finalizeSubgroupBlock(subgroupHeader, rows, { collapsed });
        groupRows.push(subgroupHeader, ...rows);
      }
    });

    const groupHeader = createHeaderRow(centeredHeaderLabel(group.name), groupBlockId, {
      className: 'farming-group-row farming-parent-row',
      onResetClick: () => {
        const timerIds = subgroups
          .filter((subgroup) => subgroup?.isTimer && subgroup?.timerTask?.id)
          .map((subgroup) => subgroup.timerTask.id);
        resetFarmingRows(groupTaskIds, context, timerIds);
      },
      restoreOptions: groupRestoreOptions,
      onRestoreSelect: (taskId) => restoreHiddenRow('rs3farming', taskId, context),
      context
    });

    finalizeSubgroupBlock(groupHeader, groupRows, { collapsed: groupCollapsed });
    tbody.appendChild(groupHeader);
    if (!groupCollapsed) appendRows(tbody, groupRows);
  });
}
