function centeredHeaderLabel(text) {
  return `<span style="display:block;width:100%;text-align:center;">${text}</span>`;
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

function resetTaskList(sectionKey, tasks, context) {
  tasks.forEach((task) => {
    context.setTaskCompleted?.(sectionKey, task.id, false);
  });
  context.renderApp?.();
}

function getHiddenRowsForSection(sectionKey, context) {
  return { ...((context.load?.(`hiddenRows:${sectionKey}`, {})) || {}) };
}

function setHiddenRowsForSection(sectionKey, nextHiddenRows, context) {
  context.save?.(`hiddenRows:${sectionKey}`, nextHiddenRows);
}

function buildRestoreEntries(sectionKey, taskIds, context) {
  const hiddenRows = getHiddenRowsForSection(sectionKey, context);

  return taskIds
    .filter((taskId) => hiddenRows[taskId])
    .map((taskId) => ({
      value: taskId,
      label: typeof hiddenRows[taskId] === 'string' ? hiddenRows[taskId] : taskId
    }));
}

function restoreHiddenRow(sectionKey, taskId, context) {
  const nextHiddenRows = getHiddenRowsForSection(sectionKey, context);
  delete nextHiddenRows[taskId];
  setHiddenRowsForSection(sectionKey, nextHiddenRows, context);
  context.renderApp?.();
}

export function renderStandardSection(tbody, sectionKey, tasks, {
  createRow,
  context
}) {
  if (!tbody) return;

  tasks.forEach((task) => {
    const row = createRow(sectionKey, task, {
      isCustom: sectionKey === 'custom',
      context
    });

    if (row) tbody.appendChild(row);
  });
}

export function renderWeekliesWithChildren(tbody, tasks, {
  isCollapsedBlock,
  createHeaderRow,
  createRow,
  createRightSideChildRow,
  context
}) {
  if (!tbody) return;

  tasks.forEach((task) => {
    if (task.id === 'penguins' && Array.isArray(task.children) && task.children.length > 0) {
      const blockId = `row-collapse-${task.id}`;
      const restoreOptions = buildRestoreEntries(
        'rs3weekly',
        task.children.map((child) => child.id),
        context
      );

      const headerRow = createHeaderRow(
        centeredHeaderLabel(task.name),
        blockId,
        {
          className: 'farming-subgroup-row farming-subheader-row',
          onResetClick: () => {
            resetTaskList('rs3weekly', task.children, context);
          },
          restoreOptions,
          onRestoreSelect: (taskId) => restoreHiddenRow('rs3weekly', taskId, context),
          context
        }
      );

      tbody.appendChild(headerRow);

      if (isCollapsedBlock(blockId)) return;

      task.children.forEach((child) => {
        const childRow = createRow('rs3weekly', {
          ...child,
          wiki: child.wiki || task.wiki || ''
        }, {
          extraClass: 'weekly-child-row',
          context
        });

        if (childRow) tbody.appendChild(childRow);
      });

      return;
    }

    const row = createRow('rs3weekly', task, { context });
    if (row) tbody.appendChild(row);

    if (!Array.isArray(task.children) || task.children.length === 0) return;

    const blockId = `row-collapse-${task.id}`;
    if (isCollapsedBlock(blockId)) return;

    task.children.forEach((child) => {
      const childRow = createRightSideChildRow('rs3weekly', child, task.id, {
        extraClass: 'weekly-child-row',
        context
      });
      if (childRow) tbody.appendChild(childRow);
    });
  });
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
      const groupName = task.group || (task.reset === 'weekly' ? 'Weekly Gathering' : 'General');
      if (!grouped.has(groupName)) grouped.set(groupName, []);
      grouped.get(groupName).push(task);
    });

  [...grouped.entries()].forEach(([groupName, groupTasks]) => {
    const blockId = `group-collapse-gathering-${groupName}`;
    const restoreOptions = buildRestoreEntries(
      'gathering',
      groupTasks.map((task) => task.id),
      context
    );

    const headerRow = createHeaderRow(
      centeredHeaderLabel(groupName),
      blockId,
      {
        className: 'gathering-group-row farming-subheader-row',
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

    if (isCollapsedBlock(blockId)) return;

    groupTasks.forEach((task) => {
      const row = createRow('gathering', task, { context });
      if (row) tbody.appendChild(row);
    });
  });
}

function renderTimerPlotsUnderGroupHeader(tbody, group, timerSubgroup, {
  isCollapsedBlock,
  buildFarmingLocationTask,
  createHeaderRow,
  createRightSideChildRow,
  formatFarmingDurationNote,
  formatDurationMs,
  context
}) {
  const timerTask = timerSubgroup.timerTask;
  const groupBlockId = `group-collapse-rs3farming-${group.id}`;
  const durationNote = formatFarmingDurationNote(timerTask, { formatDurationMs });
  const plotIds = (Array.isArray(timerSubgroup.plots) ? timerSubgroup.plots : [])
    .map((plot) => `rs3farming::${timerTask.id}::${plot.id}`);
  const restoreOptions = buildRestoreEntries('rs3farming', plotIds, context);

  const groupHeader = createHeaderRow(
    centeredHeaderLabel(group.name),
    groupBlockId,
    {
      className: 'farming-group-row farming-subheader-row',
      onResetClick: () => {
        context.clearFarmingTimer?.(timerTask.id);
        context.renderApp?.();
      },
      restoreOptions,
      onRestoreSelect: (taskId) => restoreHiddenRow('rs3farming', taskId, context),
      context
    }
  );

  tbody.appendChild(groupHeader);

  if (isCollapsedBlock(groupBlockId)) return;

  const plots = Array.isArray(timerSubgroup.plots) ? timerSubgroup.plots : [];
  plots.forEach((plot) => {
    const childTask = buildFarmingLocationTask(plot, timerTask, durationNote);

    const childRow = createRightSideChildRow(
      'rs3farming',
      childTask,
      timerTask.id,
      {
        extraClass: 'farming-child-row',
        context
      }
    );

    if (childRow) tbody.appendChild(childRow);
  });
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
    const timerSubgroups = subgroups.filter((subgroup) => subgroup.isTimer && subgroup.timerTask);
    const nonTimerSubgroups = subgroups.filter((subgroup) => !subgroup.isTimer);

    if (timerSubgroups.length === 1 && nonTimerSubgroups.length === 0) {
      renderTimerPlotsUnderGroupHeader(tbody, group, timerSubgroups[0], {
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
    const groupHeader = createHeaderRow(
      centeredHeaderLabel(group.name),
      groupBlockId,
      {
        className: 'farming-group-row',
        context
      }
    );

    tbody.appendChild(groupHeader);

    if (isCollapsedBlock(groupBlockId)) return;

    subgroups.forEach((subgroup) => {
      if (subgroup.isTimer && subgroup.timerTask) {
        const timerTask = subgroup.timerTask;
        const childBlockId = `row-collapse-${timerTask.id}`;
        const plotIds = (Array.isArray(subgroup.plots) ? subgroup.plots : [])
          .map((plot) => `rs3farming::${timerTask.id}::${plot.id}`);
        const restoreOptions = buildRestoreEntries('rs3farming', plotIds, context);

        const subgroupHeader = createHeaderRow(
          centeredHeaderLabel(subgroup.name),
          childBlockId,
          {
            className: 'farming-subgroup-row farming-subheader-row',
            onResetClick: () => {
              context.clearFarmingTimer?.(timerTask.id);
              context.renderApp?.();
            },
            restoreOptions,
            onRestoreSelect: (taskId) => restoreHiddenRow('rs3farming', taskId, context),
            context
          }
        );

        tbody.appendChild(subgroupHeader);

        if (isCollapsedBlock(childBlockId)) return;

        const durationNote = formatFarmingDurationNote(timerTask, { formatDurationMs });
        const plots = Array.isArray(subgroup.plots) ? subgroup.plots : [];

        plots.forEach((plot) => {
          const childTask = buildFarmingLocationTask(plot, timerTask, durationNote);

          const childRow = createRightSideChildRow(
            'rs3farming',
            childTask,
            timerTask.id,
            {
              extraClass: 'farming-child-row',
              context
            }
          );

          if (childRow) tbody.appendChild(childRow);
        });

        return;
      }

      if (Array.isArray(subgroup.tasks) && subgroup.tasks.length > 0) {
        const subgroupBlockId = `row-collapse-${subgroup.id}`;
        const restoreOptions = buildRestoreEntries(
          'rs3farming',
          subgroup.tasks.map((task) => task.id),
          context
        );

        const subgroupHeader = createHeaderRow(
          centeredHeaderLabel(subgroup.name),
          subgroupBlockId,
          {
            className: 'farming-subgroup-row farming-subheader-row',
            onResetClick: () => {
              resetTaskList('rs3farming', subgroup.tasks, context);
            },
            restoreOptions,
            onRestoreSelect: (taskId) => restoreHiddenRow('rs3farming', taskId, context),
            context
          }
        );

        tbody.appendChild(subgroupHeader);

        if (isCollapsedBlock(subgroupBlockId)) return;

        subgroup.tasks.forEach((task) => {
          const row = createRow('rs3farming', task, { context });
          if (row) tbody.appendChild(row);
        });
      }
    });
  });
}