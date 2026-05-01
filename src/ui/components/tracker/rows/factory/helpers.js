import { getTrackerSection } from '../../../../../app/registries/unified-registry.js';
import { StorageKeyBuilder } from '../../../../../core/storage/keys-builder.js';
import { TIMER_SECTION_KEY } from '../../../../../features/timers/domain/timers.js';

export function childStorageKey(sectionKey, parentId, childId) {
  return StorageKeyBuilder.childTaskStorageId(sectionKey, parentId, childId);
}

export function buildPinId(sectionKey, task, options = {}) {
  if (options.overviewPinId) return options.overviewPinId;
  if (options.customStorageId?.includes('::')) return options.customStorageId;
  return StorageKeyBuilder.overviewPinStorageId(sectionKey, task.id);
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
  const actionHost = nameCell.querySelector('.row-actions') || nameCell;
  actionHost.appendChild(btn);
}

export function appendSectionBadge(nameCell, sectionKey) {
  if (!nameCell) return;
  const badge = document.createElement('span');
  badge.className = 'overview-section-badge';
  badge.textContent = getTrackerSection(sectionKey)?.shortLabel || getTrackerSection(sectionKey)?.label || sectionKey;
  nameCell.appendChild(badge);
}

export function hideRowActionsForOverview(row) {
  row.querySelectorAll('.hide-button, .mini-collapse-btn').forEach((el) => {
    el.style.display = 'none';
  });
}

export function syncRowActionLayout(nameCell) {
  if (!nameCell) return;
  const actions = nameCell.querySelector('.row-actions');
  if (!actions) {
    nameCell.style.removeProperty('--row-action-width');
    return;
  }

  const visibleActions = [...actions.children].filter((el) => !el.hidden && el.style.display !== 'none');
  if (visibleActions.length === 0) {
    nameCell.style.setProperty('--row-action-width', '0px');
    return;
  }

  const actionSize = 32;
  const actionGap = 6;
  const actionWidth = (visibleActions.length * actionSize) + ((visibleActions.length - 1) * actionGap);
  nameCell.style.setProperty('--row-action-width', `${actionWidth}px`);
}

export function isFarmingChildStorageId(sectionKey, taskId, task) {
  return (
    sectionKey === TIMER_SECTION_KEY &&
    typeof taskId === 'string' &&
    taskId.startsWith(`${TIMER_SECTION_KEY}::`) &&
    taskId.split('::').length >= 3 &&
    !task?.isTimerParent
  );
}

export function shouldIgnoreToggleClick(event) {
  return !!event.target.closest('a, button, select, option, input, textarea, .pin-button, .hide-button, .delete-button, .mini-collapse-btn');
}
