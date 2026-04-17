export function displayFarmingLabel(label) {
  const parts = label.split('::');
  return parts.length > 1 ? parts[1].replace(/_/g, ' ') : label;
}

export function formatFarmingDurationNote(timerTask, { formatDurationMs }) {
  if (!timerTask?.readyAt) return '';
  const diff = timerTask.readyAt - Date.now();
  if (diff <= 0) return 'READY';
  return `in ${formatDurationMs(diff)}`;
}

export function buildFarmingLocationTask(timerTask, plotTask) {
  if (!timerTask && !plotTask) return null;
  const item = timerTask || plotTask;
  return {
    id: item.id,
    name: displayFarmingLabel(item.id),
    wiki: item.wiki,
    notes: item.notes,
    image: item.image,
    cooldownMinutes: item.cooldownMinutes,
    ...(timerTask || {})
  };
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
  const renderLocations = (timerTask, plots) => {
    plots.forEach((plotTask) => {
      const taskObj = buildFarmingLocationTask(timerTask, plotTask);
      tbody.appendChild(createRightSideChildRow('rs3farming', taskObj, timerTask?.id || 'orphan', { context }));
    });
  };

  const renderHeader = (label, blockId, className, indent = false) => {
    tbody.appendChild(createHeaderRow(label, blockId, {
      className: `farming-header ${className} ${indent ? 'indent-header' : ''}`,
      context
    }));
  };

  const renderTimerBlock = (label, blockId, timerTask, plots, indent = false) => {
    const isCollapsed = isCollapsedBlock(blockId);
    const statusText = timerTask ? getFarmingHeaderStatus(timerTask) : '';
    const durationText = timerTask ? formatFarmingDurationNote(timerTask, { formatDurationMs }) : '';

    tbody.appendChild(createHeaderRow(label, blockId, {
      className: `farming-timer-header ${indent ? 'indent-header' : ''}`,
      rightText: [statusText, durationText].filter(Boolean).join(' - '),
      context
    }));

    if (!isCollapsed) {
      renderLocations(timerTask, plots);
    }
  };

  groups.forEach((group) => {
    const groupId = `farm-group-${group.id}`;
    renderHeader(group.name, groupId, 'farming-group-main');

    if (!isCollapsedBlock(groupId)) {
      group.subgroups.forEach((sub) => {
        const subId = `farm-sub-${group.id}-${sub.id}`;
        if (sub.isTimer) {
          renderTimerBlock(sub.name, subId, sub.timerTask, sub.plots, true);
        } else {
          renderHeader(sub.name, subId, 'farming-group-sub', true);
          if (!isCollapsedBlock(subId)) {
            sub.tasks.forEach((t) => {
              tbody.appendChild(createRow('rs3farming', t, { context }));
            });
          }
        }
      });
    }
  });
}

export function renderGroupedGathering(tbody, tasks, {
  isCollapsedBlock,
  createHeaderRow,
  createRow,
  context
}) {
  const categories = {};
  tasks.forEach((t) => {
    const cat = t.category || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(t);
  });

  Object.entries(categories).forEach(([cat, catTasks]) => {
    const blockId = `gathering-${cat}`;
    tbody.appendChild(createHeaderRow(cat, blockId, { context }));
    if (!isCollapsedBlock(blockId)) {
      catTasks.forEach((t) => tbody.appendChild(createRow('gathering', t, { context })));
    }
  });
}

export function renderWeekliesWithChildren(tbody, tasks, {
  isCollapsedBlock,
  createRow,
  createRightSideChildRow,
  context
}) {
  tasks.forEach((task) => {
    tbody.appendChild(createRow('rs3weekly', task, { context }));
    if (task.children && !isCollapsedBlock(`row-collapse-${task.id}`)) {
      task.children.forEach((child) => {
        tbody.appendChild(createRightSideChildRow('rs3weekly', child, task.id, { context }));
      });
    }
  });
}

export function renderStandardSection(tbody, sectionKey, tasks, {
  createRow,
  context
}) {
  tasks.forEach((t) => tbody.appendChild(createRow(sectionKey, t, { context })));
}
