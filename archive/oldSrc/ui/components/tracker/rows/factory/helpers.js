export function childStorageKey(sectionKey, parentId, childId) {
  return `${sectionKey}::${parentId}::${childId}`;
}

export function buildPinId(sectionKey, task, options = {}) {
  if (options.overviewPinId) return options.overviewPinId;
  if (options.customStorageId?.includes('::')) return options.customStorageId;
  return `${sectionKey}::${task.id}`;
}

export function appendWeeklyCollapseButton(nameCell, task, context = {}) {
  const { isCollapsedBlock, setCollapsedBlock, renderApp, isOverviewPanel = false } = context;
  if (isOverviewPanel) return;
  if (!Array.isArray(task?.children) || task.children.length === 0) return;
  if (!nameCell || !isCollapsedBlock || !setCollapsedBlock || !renderApp) return;

  const blockId = `row-collapse-${task.id}`;
  const collapsed = isCollapsedBlock(blockId);
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-secondary btn-sm mini-collapse-btn';
  btn.textContent = collapsed ? '\u25B6' : '\u25BC';
  btn.title = collapsed ? 'Expand child rows' : 'Collapse child rows';
  btn.setAttribute('aria-label', btn.title);
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setCollapsedBlock(blockId, !isCollapsedBlock(blockId));
    renderApp();
  });
  nameCell.appendChild(btn);
}

export function appendSectionBadge(nameCell, sectionKey) {
  if (!nameCell) return;
  const badge = document.createElement('span');
  badge.className = 'overview-section-badge';
  const labels = {
    custom: 'Custom',
    rs3farming: 'Farming',
    rs3daily: 'Dailies',
    gathering: 'Gathering',
    rs3weekly: 'Weeklies',
    rs3monthly: 'Monthlies'
  };
  badge.textContent = labels[sectionKey] || sectionKey;
  nameCell.appendChild(badge);
}

export function hideRowActionsForOverview(row) {
  row.querySelectorAll('.hide-button, .mini-collapse-btn').forEach((el) => {
    el.style.display = 'none';
  });
}

export function isFarmingChildStorageId(sectionKey, taskId, task) {
  return (
    sectionKey === 'rs3farming' &&
    typeof taskId === 'string' &&
    taskId.startsWith('rs3farming::') &&
    taskId.split('::').length >= 3 &&
    !task?.isTimerParent
  );
}

export function shouldIgnoreToggleClick(event) {
  return !!event.target.closest('a, button, select, option, input, textarea, .pin-button, .hide-button, .delete-button, .mini-collapse-btn');
}
