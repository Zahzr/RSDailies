function centeredHeaderLabel(text) {
  return `<span style="display:block;width:100%;text-align:center;">${text}</span>`;
}

function getRenderableHeaderStatus(status) {
  if (!status || typeof status !== 'object') return '';
  if (status.state === 'running' || status.state === 'ready') {
    return status.note || '';
  }
  return '';
}

export function formatFarmingDurationNote(task, { formatDurationMs }) {
  if (!task?.growthMinutes) return '';
  const ms = task.growthMinutes * 60 * 1000;
  return `Growth time: ${formatDurationMs(ms)}`;
}

export function buildFarmingLocationTask(plot, timerTask, durationNote) {
  return {
    ...plot,
    note: plot.note || plot.location || '',
    locationNote: plot.location || '',
    durationNote,
    wiki: plot.wiki || timerTask?.wiki || '',
    isChildRow: true
  };
}

function getHiddenRowsForSection(sectionKey, context) {
  return { ...((context.load?.(`hiddenRows:${sectionKey}`, {})) || {}) };
}

function getRemovedRowsForSection(sectionKey, context) {
  return { ...((context.load?.(`removedRows:${sectionKey}`, {})) || {}) };
}

function setHiddenRowsForSection(sectionKey, nextHiddenRows, context) {
  context.save?.(`hiddenRows:${sectionKey}`, nextHiddenRows);
}

function setRemovedRowsForSection(sectionKey, nextRemovedRows, context) {
  context.save?.(`removedRows:${sectionKey}`, nextRemovedRows);
}

function clearCompletedEntries(sectionKey, taskIds, context) {
  const ids = new Set((Array.isArray(taskIds) ? taskIds : []).filter(Boolean));
  const completed = { ...((context.load?.(`completed:${sectionKey}`, {})) || {}) };
  let changed = false;

  ids.forEach((taskId) => {
    if (completed[taskId]) {
      delete completed[taskId];
      changed = true;
    }
  });

  if (changed) {
    context.save?.(`completed:${sectionKey}`, completed);
  }
}

function resetTaskList(sectionKey, tasks, context) {
  const taskIds = (Array.isArray(tasks) ? tasks : []).map((task) => task.id).filter(Boolean);

  clearCompletedEntries(sectionKey, taskIds, context);

  const hiddenRows = getHiddenRowsForSection(sectionKey, context);
  const removedRows = getRemovedRowsForSection(sectionKey, context);

  let changedHidden = false;
  let changedRemoved = false;

  taskIds.forEach((taskId) => {
    if (hiddenRows[taskId]) {
      delete hiddenRows[taskId];
      changedHidden = true;
    }
    if (removedRows[taskId]) {
      delete removedRows[taskId];
      changedRemoved = true;
    }
  });

  if (changedHidden) {
    setHiddenRowsForSection(sectionKey, hiddenRows, context);
  }

  if (changedRemoved) {
    setRemovedRowsForSection(sectionKey, removedRows, context);
  }

  context.renderApp?.();
}

function buildRestoreEntries(sectionKey, taskIds, context) {
  const hiddenRows = getHiddenRowsForSection(sectionKey, context);
  const removedRows = getRemovedRowsForSection(sectionKey, context);
  const seen = new Set();

  return taskIds
    .filter((taskId) => hiddenRows[taskId] || removedRows[taskId])
    .filter((taskId) => {
      if (seen.has(taskId)) return false;
      seen.add(taskId);
      return true;
    })
    .map((taskId) => ({
      value: taskId,
      label:
        typeof removedRows[taskId] === 'string'
          ? removedRows[taskId]
          : typeof hiddenRows[taskId] === 'string'
            ? hiddenRows[taskId]
            : taskId
    }));
}

function restoreHiddenRow(sectionKey, taskId, context) {
  const nextHiddenRows = getHiddenRowsForSection(sectionKey, context);
  const nextRemovedRows = getRemovedRowsForSection(sectionKey, context);
  const completed = { ...((context.load?.(`completed:${sectionKey}`, {})) || {}) };

  delete nextHiddenRows[taskId];
  delete nextRemovedRows[taskId];
  delete completed[taskId];

  setHiddenRowsForSection(sectionKey, nextHiddenRows, context);
  setRemovedRowsForSection(sectionKey, nextRemovedRows, context);
  context.save?.(`completed:${sectionKey}`, completed);
  context.renderApp?.();
}

function markLastRow(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return;
  const last = rows[rows.length - 1];
  if (last) last.classList.add('subsection-end-row');
}

function appendRows(tbody, rows) {
  rows.forEach((row) => {
    if (row) tbody.appendChild(row);
  });
}

export function renderStandardSection(tbody, sectionKey, tasks, {
  createRow,
  context
}) {
  if (!tbody) return;

  const rows = [];
  tasks.forEach((task) => {
    const row = createRow(sectionKey, task, {
      isCustom: sectionKey === 'custom',
      context
    });
    if (row) rows.push(row);
  });

  markLastRow(rows);
  appendRows(tbody, rows);
}

export function renderWeekliesWithChildren(tbody, tasks, {
  isCollapsedBlock,
  createHeaderRow,
  createRow,
  createRightSideChildRow,
  context
}) {
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

    task.children.forEach((child, idx, arr) => {
      const childRow = createRightSideChildRow('rs3weekly', child, task.id, {
        extraClass: `weekly-child-row ${idx === arr.length - 1 ? 'subsection-end-row' : ''}`,
        context
      });
      if (childRow) normalRows.push(childRow);
    });
  });

  appendRows(tbody, normalRows);

  if (!penguinTask || !Array.isArray(penguinTask.children) || penguinTask.children.length === 0) {
    return;
  }

  const blockId = `row-collapse-${penguinTask.id}`;
  const collapsed = isCollapsedBlock(blockId);
  const restoreOptions = buildRestoreEntries(
    'rs3weekly',
    penguinTask.children.map((child) => child.id),
    context
  );

  const headerRow = createHeaderRow(
    centeredHeaderLabel(penguinTask.name),
    blockId,
    {
      className: `farming-subgroup-row farming-subheader-row weekly-subgroup-row ${collapsed ? 'collapsed-subgroup-row subgroup-last-row' : ''}`,
      onResetClick: () => {
        resetTaskList('rs3weekly', penguinTask.children, context);
      },
      restoreOptions,
      onRestoreSelect: (taskId) => restoreHiddenRow('rs3weekly', taskId, context),
      context
    }
  );

  tbody.appendChild(headerRow);

  if (collapsed) return;

  const penguinRows = [];
  penguinTask.children.forEach((child, idx, arr) => {
    const childRow = createRow('rs3weekly', {
      ...child,
      wiki: child.wiki || penguinTask.wiki || ''
    }, {
      extraClass: `weekly-child-row ${idx === arr.length - 1 ? 'subsection-end-row' : ''}`,
      context
    });

    if (childRow) penguinRows.push(childRow);
  });

  appendRows(tbody, penguinRows);
}

export function renderGroupedGathering(tbody, tasks, {
  isCollapsedBlock,
  createHeaderRow,
  createRow,
  context,
  getGroupCountdown
}) {
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

    const headerRow = createHeaderRow(
      centeredHeaderLabel(groupName),
      blockId,
      {
        className: `gathering-group-row farming-subheader-row gathering-subgroup-row ${collapsed || index === allGroups.length - 1 ? 'subgroup-last-row' : ''
          } ${collapsed ? 'collapsed-subgroup-row' : ''}`,
        rightText: getGroupCountdown?.(groupName) || '',
        onResetClick: () => {
          resetTaskList('gathering', groupTasks, context);
        },
        restoreOptions,
        onRestoreSelect: (taskId) => restoreHiddenRow('gathering', taskId, context),
        context
      }
    );

    tbody.appendChild(headerRow);

    if (collapsed) return;

    const rows = [];
    groupTasks.forEach((task, idx) => {
      const row = createRow('gathering', task, { context });
      if (row) {
        if (idx === groupTasks.length - 1) row.classList.add('subsection-end-row');
        rows.push(row);
      }
    });

    appendRows(tbody, rows);
  });
}

function renderFarmingTimerGroupAsSingleHeader(tbody, group, subgroup, subgroupIndex, subgroups, helpers) {
  const {
    isCollapsedBlock,
    getFarmingHeaderStatus,
    formatFarmingDurationNote,
    buildFarmingLocationTask,
    createHeaderRow,
    createRightSideChildRow,
    formatDurationMs,
    context
  } = helpers;

  const timerTask = subgroup.timerTask;
  const childBlockId = `group-collapse-rs3farming-${group.id}`;
  const collapsed = isCollapsedBlock(childBlockId);
  const plotIds = (Array.isArray(subgroup.plots) ? subgroup.plots : [])
    .map((plot) => `rs3farming::${timerTask.id}::${plot.id}`);
  const restoreOptions = buildRestoreEntries('rs3farming', plotIds, context);
  const headerStatus = getFarmingHeaderStatus?.(timerTask) || { note: '', state: 'idle' };

  const groupHeader = createHeaderRow(
    centeredHeaderLabel(group.name),
    childBlockId,
    {
      className: `farming-group-row farming-parent-row ${collapsed || subgroupIndex === subgroups.length - 1 ? 'subgroup-last-row' : ''
        } ${collapsed ? 'collapsed-subgroup-row' : ''}`,
      rightText: getRenderableHeaderStatus(headerStatus),
      onResetClick: () => {
        context.clearFarmingTimer?.(timerTask.id);
        clearCompletedEntries('rs3farming', plotIds, context);

        const hiddenRows = getHiddenRowsForSection('rs3farming', context);
        const removedRows = getRemovedRowsForSection('rs3farming', context);

        plotIds.forEach((taskId) => {
          delete hiddenRows[taskId];
          delete removedRows[taskId];
        });

        setHiddenRowsForSection('rs3farming', hiddenRows, context);
        setRemovedRowsForSection('rs3farming', removedRows, context);
        context.renderApp?.();
      },
      restoreOptions,
      onRestoreSelect: (taskId) => restoreHiddenRow('rs3farming', taskId, context),
      context
    }
  );

  tbody.appendChild(groupHeader);

  if (collapsed) return;

  const durationNote = formatFarmingDurationNote(timerTask, { formatDurationMs });
  const plots = Array.isArray(subgroup.plots) ? subgroup.plots : [];
  const rows = [];

  plots.forEach((plot, idx) => {
    const childTask = buildFarmingLocationTask(plot, timerTask, durationNote);

    const childRow = createRightSideChildRow(
      'rs3farming',
      childTask,
      timerTask.id,
      {
        extraClass: `farming-child-row ${idx === plots.length - 1 ? 'subsection-end-row' : ''}`,
        context
      }
    );

    if (childRow) rows.push(childRow);
  });

  appendRows(tbody, rows);
}

export function renderGroupedFarming(tbody, groups, {
  isCollapsedBlock,
  getFarmingHeaderStatus,
  formatFarmingDurationNote,
  buildFarmingLocationTask,
  createHeaderRow,
  createRow,
  createRightSideChildRow,
  formatDurationMs,
  context
}) {
  if (!tbody) return;

  groups.forEach((group) => {
    const subgroups = Array.isArray(group.subgroups) ? group.subgroups : [];

    if (
      subgroups.length === 1 &&
      subgroups[0]?.isTimer &&
      subgroups[0]?.timerTask
    ) {
      renderFarmingTimerGroupAsSingleHeader(tbody, group, subgroups[0], 0, subgroups, {
        isCollapsedBlock,
        getFarmingHeaderStatus,
        formatFarmingDurationNote,
        buildFarmingLocationTask,
        createHeaderRow,
        createRightSideChildRow,
        formatDurationMs,
        context
      });
      return;
    }

    const groupBlockId = `group-collapse-rs3farming-${group.id}`;
    const groupCollapsed = isCollapsedBlock(groupBlockId);

    const groupHeader = createHeaderRow(
      centeredHeaderLabel(group.name),
      groupBlockId,
      {
        className: `farming-group-row farming-parent-row ${groupCollapsed ? 'collapsed-subgroup-row' : ''}`,
        context
      }
    );

    tbody.appendChild(groupHeader);

    if (groupCollapsed) return;

    subgroups.forEach((subgroup, subgroupIndex) => {
      if (subgroup.isTimer && subgroup.timerTask) {
        const timerTask = subgroup.timerTask;
        const childBlockId = `row-collapse-${timerTask.id}`;
        const collapsed = isCollapsedBlock(childBlockId);
        const plotIds = (Array.isArray(subgroup.plots) ? subgroup.plots : [])
          .map((plot) => `rs3farming::${timerTask.id}::${plot.id}`);
        const restoreOptions = buildRestoreEntries('rs3farming', plotIds, context);
        const headerStatus = getFarmingHeaderStatus?.(timerTask) || { note: '', state: 'idle' };

        const subgroupHeader = createHeaderRow(
          centeredHeaderLabel(subgroup.name),
          childBlockId,
          {
            className: `farming-subgroup-row farming-subheader-row farming-timer-subgroup-row ${collapsed || subgroupIndex === subgroups.length - 1 ? 'subgroup-last-row' : ''
              } ${collapsed ? 'collapsed-subgroup-row' : ''}`,
            rightText: getRenderableHeaderStatus(headerStatus),
            onResetClick: () => {
              context.clearFarmingTimer?.(timerTask.id);
              clearCompletedEntries('rs3farming', plotIds, context);

              const hiddenRows = getHiddenRowsForSection('rs3farming', context);
              const removedRows = getRemovedRowsForSection('rs3farming', context);

              plotIds.forEach((taskId) => {
                delete hiddenRows[taskId];
                delete removedRows[taskId];
              });

              setHiddenRowsForSection('rs3farming', hiddenRows, context);
              setRemovedRowsForSection('rs3farming', removedRows, context);
              context.renderApp?.();
            },
            restoreOptions,
            onRestoreSelect: (taskId) => restoreHiddenRow('rs3farming', taskId, context),
            context
          }
        );

        tbody.appendChild(subgroupHeader);

        if (collapsed) return;

        const durationNote = formatFarmingDurationNote(timerTask, { formatDurationMs });
        const plots = Array.isArray(subgroup.plots) ? subgroup.plots : [];
        const rows = [];

        plots.forEach((plot, idx) => {
          const childTask = buildFarmingLocationTask(plot, timerTask, durationNote);

          const childRow = createRightSideChildRow(
            'rs3farming',
            childTask,
            timerTask.id,
            {
              extraClass: `farming-child-row ${idx === plots.length - 1 ? 'subsection-end-row' : ''}`,
              context
            }
          );

          if (childRow) rows.push(childRow);
        });

        appendRows(tbody, rows);
        return;
      }

      if (Array.isArray(subgroup.tasks) && subgroup.tasks.length > 0) {
        const subgroupBlockId = `row-collapse-${subgroup.id}`;
        const collapsed = isCollapsedBlock(subgroupBlockId);
        const restoreOptions = buildRestoreEntries(
          'rs3farming',
          subgroup.tasks.map((task) => task.id),
          context
        );

        const subgroupHeader = createHeaderRow(
          centeredHeaderLabel(subgroup.name),
          subgroupBlockId,
          {
            className: `farming-subgroup-row farming-subheader-row farming-plain-subgroup-row ${collapsed || subgroupIndex === subgroups.length - 1 ? 'subgroup-last-row' : ''
              } ${collapsed ? 'collapsed-subgroup-row' : ''}`,
            onResetClick: () => {
              resetTaskList('rs3farming', subgroup.tasks, context);
            },
            restoreOptions,
            onRestoreSelect: (taskId) => restoreHiddenRow('rs3farming', taskId, context),
            context
          }
        );

        tbody.appendChild(subgroupHeader);

        if (collapsed) return;

        const rows = [];
        subgroup.tasks.forEach((task, idx) => {
          const row = createRow('rs3farming', task, { context });
          if (row) {
            if (idx === subgroup.tasks.length - 1) row.classList.add('subsection-end-row');
            rows.push(row);
          }
        });

        appendRows(tbody, rows);
      }
    });
  });
}