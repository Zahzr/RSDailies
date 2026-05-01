import {
  appendRows,
  buildTimerLocationTask,
  centeredHeaderLabel,
  collectTimerGroupTaskIds,
  finalizeSubgroupBlock,
  formatTimerDurationNote,
  getRenderableHeaderStatus,
  makeTimerChildStorageId,
} from './common.js';
import {
  buildRestoreEntries,
  clearCompletedEntries,
  getHiddenRowsForSection,
  getRemovedRowsForSection,
  resetTaskList,
  restoreHiddenRow,
  setHiddenRowsForSection,
  setRemovedRowsForSection,
} from './storage.js';

const TIMER_SECTION_KEY = 'timers';

function resetTimerRows(taskIds, context, timerIds = []) {
  clearCompletedEntries(TIMER_SECTION_KEY, taskIds, context);

  const hiddenRows = getHiddenRowsForSection(TIMER_SECTION_KEY, context);
  const removedRows = getRemovedRowsForSection(TIMER_SECTION_KEY, context);

  taskIds.forEach((taskId) => {
    delete hiddenRows[taskId];
    delete removedRows[taskId];
  });

  timerIds.forEach((timerId) => context.clearTimer?.(timerId));

  setHiddenRowsForSection(TIMER_SECTION_KEY, hiddenRows, context);
  setRemovedRowsForSection(TIMER_SECTION_KEY, removedRows, context);
  context.renderApp?.();
}

function buildTimerPlotRows(timerTask, subgroup, createRightSideChildRow, formatDurationMs, statusNote, context) {
  const durationNote = formatTimerDurationNote(timerTask, {
    formatDurationMs,
    getSettingsValue: context.getSettingsValue,
  });
  const plots = Array.isArray(subgroup.plots) ? subgroup.plots : [];
  const rows = [];

  plots.forEach((plot) => {
    const childTask = buildTimerLocationTask(plot, timerTask, { durationNote, statusNote });
    const childRow = createRightSideChildRow(TIMER_SECTION_KEY, childTask, timerTask.id, {
      extraClass: 'farming-child-row',
      context,
    });
    if (childRow) rows.push(childRow);
  });

  return rows;
}

function renderSingleTimerGroup(tbody, group, subgroup, deps) {
  const {
    isCollapsedBlock,
    getTimerHeaderStatus,
    createHeaderRow,
    createRightSideChildRow,
    formatDurationMs,
    context,
  } = deps;

  const timerTask = subgroup.timerTask;
  const blockId = `group-collapse-timers-${group.id}-${timerTask.id}`;
  const collapsed = isCollapsedBlock(blockId);
  const plotIds = (Array.isArray(subgroup.plots) ? subgroup.plots : [])
    .map((plot) => makeTimerChildStorageId(timerTask.id, plot.id));
  const restoreOptions = buildRestoreEntries(TIMER_SECTION_KEY, plotIds, context);
  const headerStatus = getTimerHeaderStatus?.(timerTask) || { note: '', state: 'idle' };

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
    onResetClick: () => resetTimerRows(plotIds, context, [timerTask.id]),
    restoreOptions,
    onRestoreSelect: (taskId) => restoreHiddenRow(TIMER_SECTION_KEY, taskId, context),
    context,
  });

  finalizeSubgroupBlock(headerRow, plotRows, { collapsed });
  tbody.appendChild(headerRow);
  if (!collapsed) appendRows(tbody, plotRows);
}

export function renderGroupedTimers(tbody, groups, deps) {
  const {
    isCollapsedBlock,
    getTimerHeaderStatus,
    createHeaderRow,
    createRow,
    createRightSideChildRow,
    formatDurationMs,
    context,
  } = deps;
  if (!tbody) return;

  groups.forEach((group, groupIndex, allGroups) => {
    const subgroups = Array.isArray(group.subgroups) ? group.subgroups : [];

    if (subgroups.length === 1 && subgroups[0]?.isTimer && subgroups[0]?.timerTask) {
      renderSingleTimerGroup(tbody, group, subgroups[0], deps);
      return;
    }

    const groupBlockId = `group-collapse-timers-parent-${group.id}`;
    const groupCollapsed = isCollapsedBlock(groupBlockId);
    const groupTaskIds = collectTimerGroupTaskIds(group);
    const groupRestoreOptions = buildRestoreEntries(TIMER_SECTION_KEY, groupTaskIds, context);

    const groupRows = [];

    subgroups.forEach((subgroup, subgroupIndex) => {
      if (subgroup.isTimer && subgroup.timerTask) {
        const timerTask = subgroup.timerTask;
        const blockId = `group-collapse-timers-${group.id}-${timerTask.id}`;
        const collapsed = isCollapsedBlock(blockId);
        const plotIds = (Array.isArray(subgroup.plots) ? subgroup.plots : [])
          .map((plot) => makeTimerChildStorageId(timerTask.id, plot.id));
        const restoreOptions = buildRestoreEntries(TIMER_SECTION_KEY, plotIds, context);
        const headerStatus = getTimerHeaderStatus?.(timerTask) || { note: '', state: 'idle' };
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
          onResetClick: () => resetTimerRows(plotIds, context, [timerTask.id]),
          restoreOptions,
          onRestoreSelect: (taskId) => restoreHiddenRow(TIMER_SECTION_KEY, taskId, context),
          context,
        });

        const isLastSubgroup = groupIndex === allGroups.length - 1 && subgroupIndex === subgroups.length - 1;
        finalizeSubgroupBlock(subgroupHeader, plotRows, { collapsed, skipEdgeClasses: !isLastSubgroup });
        groupRows.push(subgroupHeader, ...plotRows);
        return;
      }

      if (Array.isArray(subgroup.tasks) && subgroup.tasks.length > 0) {
        const blockId = `group-collapse-timers-${group.id}-${subgroup.id}`;
        const collapsed = isCollapsedBlock(blockId);
        const taskIds = subgroup.tasks.map((task) => task.id);
        const restoreOptions = buildRestoreEntries(TIMER_SECTION_KEY, taskIds, context);
        const rows = [];
        if (!collapsed) {
          subgroup.tasks.forEach((task) => {
            const row = createRow(TIMER_SECTION_KEY, task, { context });
            if (row) rows.push(row);
          });
        }

        const subgroupHeader = createHeaderRow(centeredHeaderLabel(subgroup.name), blockId, {
          className: 'farming-subgroup-row farming-subheader-row farming-plain-subgroup-row',
          onResetClick: () => resetTaskList(TIMER_SECTION_KEY, subgroup.tasks, context),
          restoreOptions,
          onRestoreSelect: (taskId) => restoreHiddenRow(TIMER_SECTION_KEY, taskId, context),
          context,
        });

        const isLastSubgroup = groupIndex === allGroups.length - 1 && subgroupIndex === subgroups.length - 1;
        finalizeSubgroupBlock(subgroupHeader, rows, { collapsed, skipEdgeClasses: !isLastSubgroup });
        groupRows.push(subgroupHeader, ...rows);
      }
    });

    const groupHeader = createHeaderRow(centeredHeaderLabel(group.name), groupBlockId, {
      className: 'farming-group-row farming-parent-row',
      onResetClick: () => {
        const timerIds = subgroups
          .filter((subgroup) => subgroup?.isTimer && subgroup?.timerTask?.id)
          .map((subgroup) => subgroup.timerTask.id);
        resetTimerRows(groupTaskIds, context, timerIds);
      },
      restoreOptions: groupRestoreOptions,
      onRestoreSelect: (taskId) => restoreHiddenRow(TIMER_SECTION_KEY, taskId, context),
      context,
    });

    finalizeSubgroupBlock(groupHeader, groupRows, { collapsed: groupCollapsed });
    tbody.appendChild(groupHeader);
    if (!groupCollapsed) appendRows(tbody, groupRows);
  });
}
