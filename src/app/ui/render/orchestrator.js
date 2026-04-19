import {
  renderStandardSection,
  renderWeekliesWithChildren,
  renderGroupedGathering,
  renderGroupedFarming,
  formatFarmingDurationNote,
  buildFarmingLocationTask
} from '../../../ui/sections/renderers.js';
import {
  renderOverviewPanel,
  applyPageModeVisibility,
  collectOverviewItems
} from '../../../ui/overview/render.js';
import { createHeaderRow } from '../../../ui/rows/headers.js';
import { createRow, createRightSideChildRow } from '../../../ui/rows/factory.js';
import { applyOrderingAndSort } from '../../../ui/table/utils.js';
import { SECTION_CONTAINER_IDS, SECTION_TABLE_IDS } from '../../../core/ids/section-ids.js';
import { formatDurationMs as formatDurationMsCore } from '../../../core/time/formatters.js';
import {
  nextDailyBoundary,
  nextWeeklyBoundary,
  nextMonthlyBoundary
} from '../../../core/time/boundaries.js';

function getSectionElements(sectionKey) {
  const container = document.getElementById(SECTION_CONTAINER_IDS[sectionKey]);
  const table = document.getElementById(SECTION_TABLE_IDS[sectionKey]);
  const tbody = table?.querySelector('tbody') || null;

  return { container, table, tbody };
}

function reorderDashboardSections(sectionKeys) {
  const dashboard = document.getElementById('dashboard-container');
  if (!dashboard) return;

  sectionKeys.forEach((sectionKey) => {
    const container = document.getElementById(SECTION_CONTAINER_IDS[sectionKey]);
    if (container) dashboard.appendChild(container);
  });
}

function setSectionHiddenState(sectionKey, hidden, showHidden = false) {
  const { container, tbody } = getSectionElements(sectionKey);
  if (!container || !tbody) return;

  container.dataset.hide = hidden ? 'hide' : 'show';
  container.dataset.showHidden = showHidden ? 'true' : 'false';
  container.classList.toggle('section-hidden', hidden);

  tbody.style.display = hidden ? 'none' : '';

  const hideBtn = document.getElementById(`${sectionKey}_hide_button`);
  const unhideBtn = document.getElementById(`${sectionKey}_unhide_button`);

  if (hideBtn) hideBtn.style.display = hidden ? 'none' : '';
  if (unhideBtn) unhideBtn.style.display = hidden ? '' : 'none';
}

function setSectionModeVisibility(sectionKey, mode) {
  const { container } = getSectionElements(sectionKey);
  if (!container) return false;

  let shouldShow = false;

  if (mode === 'overview') {
    shouldShow = sectionKey === 'custom';
  } else if (mode === 'all') {
    shouldShow = ['rs3daily', 'rs3weekly', 'rs3monthly'].includes(sectionKey);
  } else if (mode === 'custom') {
    shouldShow = sectionKey === 'custom';
  } else if (mode === 'rs3farming') {
    shouldShow = sectionKey === 'rs3farming';
  } else {
    shouldShow = sectionKey === mode;
  }

  container.style.display = shouldShow ? '' : 'none';
  return shouldShow;
}

function clearAllSectionBodies(sectionKeys) {
  sectionKeys.forEach((key) => {
    const { tbody } = getSectionElements(key);
    if (tbody) tbody.innerHTML = '';
  });
}

function getGroupCountdown(groupName) {
  const lower = String(groupName || '').toLowerCase().trim();

  if (lower === 'general' || lower.includes('daily')) {
    return formatDurationMsCore(nextDailyBoundary(new Date()) - Date.now());
  }

  if (lower.includes('weekly')) {
    return formatDurationMsCore(nextWeeklyBoundary(new Date()) - Date.now());
  }

  if (lower.includes('monthly')) {
    return formatDurationMsCore(nextMonthlyBoundary(new Date()) - Date.now());
  }

  return '';
}

function getLeadingText(row) {
  if (!row) return '';
  const first = row.querySelector('th, td, .activity_name, .activity_desc');
  return String(first?.textContent || '').replace(/\s+/g, ' ').trim();
}

function movePenguinsBlockToBottom() {
  const tbody = document.querySelector(`#${SECTION_TABLE_IDS.rs3weekly} tbody`);
  if (!tbody) return;

  const rows = [...tbody.querySelectorAll('tr')];
  const startIndex = rows.findIndex((row) => getLeadingText(row) === 'Penguins');
  if (startIndex === -1) return;

  const block = [rows[startIndex]];
  let cursor = startIndex + 1;

  while (cursor < rows.length) {
    const row = rows[cursor];
    const text = getLeadingText(row);

    const isPenguinChild =
      row.classList.contains('weekly-child-row') ||
      /^Penguin\s+\d+$/i.test(text) ||
      text === 'Polar Bear';

    if (!isPenguinChild) break;

    block.push(row);
    cursor += 1;
  }

  block.forEach((row) => tbody.appendChild(row));
}

function hideAllSortButtons() {
  document.querySelectorAll('[id$="_sort_button"]').forEach((button) => {
    button.style.display = 'none';
    button.style.visibility = 'hidden';
  });
}

function appendCustomEmptyPlaceholder(tbody) {
  if (!tbody || tbody.children.length > 0) return;

  const row = document.createElement('tr');
  row.className = 'custom-empty-row';

  const cell = document.createElement('td');
  cell.colSpan = 3;
  cell.style.background = '#2f353d';
  cell.style.borderTop = '1px solid #505963';
  cell.style.borderBottom = '1px solid #505963';
  cell.style.borderLeft = '14px solid #000';
  cell.style.borderRight = '14px solid #000';
  cell.style.backgroundClip = 'padding-box';
  cell.style.padding = '1rem';
  cell.style.textAlign = 'center';
  cell.style.color = '#d8dde3';
  cell.style.fontSize = '0.98rem';
  cell.style.borderBottomLeftRadius = '14px';
  cell.style.borderBottomRightRadius = '14px';
  cell.textContent = 'Click the add button to add a custom task!';

  row.appendChild(cell);
  tbody.appendChild(row);
}

function clearSectionEdgeMarkers(sectionKeys) {
  sectionKeys.forEach((key) => {
    const { container } = getSectionElements(key);
    if (!container) return;
    container.classList.remove('last-visible-section');
    container.classList.remove('visible-open-section');
    container.classList.remove('visible-hidden-section');
  });
}

function markVisibleSectionEdges(sectionKeys) {
  clearSectionEdgeMarkers(sectionKeys);

  const visibleContainers = sectionKeys
    .map((key) => getSectionElements(key).container)
    .filter((container) => container && container.style.display !== 'none');

  if (visibleContainers.length === 0) return;

  visibleContainers.forEach((container) => {
    const isHidden = container.dataset.hide === 'hide';
    container.classList.add(isHidden ? 'visible-hidden-section' : 'visible-open-section');
  });

  const lastVisible = visibleContainers[visibleContainers.length - 1];
  lastVisible.classList.add('last-visible-section');
}

export function renderApp(deps) {
  const {
    load,
    save,
    getTaskState,
    getResolvedSections,
    cleanupReadyFarmingTimers,
    cleanupReadyCooldowns,
    hideTooltip,
    getFarmingHeaderStatus,
    hideTask,
    setTaskCompleted,
    clearFarmingTimer,
    startFarmingTimer,
    startCooldown,
    isCollapsedBlock,
    setCollapsedBlock,
    getCustomTasks,
    saveCustomTasks,
    fetchProfits,
    updateProfileHeader,
    maybeNotifyTaskAlert,
    bindSectionControls,
    getPageMode,
    getOverviewPins
  } = deps;

  cleanupReadyFarmingTimers();
  cleanupReadyCooldowns();
  hideTooltip();

  const uiContext = {
    load,
    save,
    getTaskState,
    cloneRowTemplate: () =>
      document.getElementById('sample_row')?.content?.firstElementChild?.cloneNode(true) || null,
    createInlineActions: (task, isCustom) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'activity_inline_actions';

      if (isCustom) {
        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-danger btn-sm inline-danger';
        delBtn.type = 'button';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!confirm(`Delete custom task "${task.name}"?`)) return;

          const next = getCustomTasks().filter((t) => t.id !== task.id);
          saveCustomTasks(next);

          const completed = load('completed:custom', {});
          const hiddenRows = load('hiddenRows:custom', {});
          const removedRows = load('removedRows:custom', {});
          const notified = load('notified:custom', {});

          delete completed[task.id];
          delete hiddenRows[task.id];
          delete removedRows[task.id];
          delete notified[task.id];

          save('completed:custom', completed);
          save('hiddenRows:custom', hiddenRows);
          save('removedRows:custom', removedRows);
          save('notified:custom', notified);

          renderApp(deps);
        });

        wrapper.appendChild(delBtn);
      }

      return wrapper.children.length ? wrapper : null;
    },
    appendRowText: (desc, task) => {
      if (task.note) {
        const span = document.createElement('span');
        span.className = 'activity_note_line';
        span.textContent = task.note;
        desc.appendChild(span);
      }

      if (task.profit?.item && task.profit?.qty) {
        const span = document.createElement('span');
        span.className = 'item_profit';
        span.dataset.item = task.profit.item;
        span.dataset.qty = String(task.profit.qty);
        span.textContent = '\u2026';
        desc.appendChild(span);
      }

      if (task.durationNote) {
        const span = document.createElement('span');
        span.className = 'activity_duration_note';
        span.textContent = task.durationNote;
        desc.appendChild(span);
      }

      if (task.locationNote) {
        const span = document.createElement('span');
        span.className = 'activity_location_note';
        span.textContent = task.locationNote;
        desc.appendChild(span);
      }
    },
    renderApp: () => renderApp(deps),
    hideTask,
    setTaskCompleted,
    clearFarmingTimer,
    startFarmingTimer,
    startCooldown,
    getTableId: (sectionKey) => SECTION_TABLE_IDS[sectionKey],
    isCollapsedBlock,
    setCollapsedBlock,
    getPageMode
  };

  const sections = getResolvedSections();
  const sectionKeys = ['custom', 'rs3farming', 'gathering', 'rs3daily', 'rs3weekly', 'rs3monthly'];
  const mode = getPageMode();

  reorderDashboardSections(sectionKeys);
  applyPageModeVisibility(mode);

  const dashboard = document.getElementById('dashboard-container');
  if (dashboard) {
    dashboard.style.display = '';
  }

  clearAllSectionBodies(sectionKeys);

  sectionKeys.forEach((key) => {
    const { tbody } = getSectionElements(key);
    if (!tbody) return;

    const sectionTasks = key === 'rs3farming' ? sections.rs3farming : sections[key];
    const storedHidden = !!load(`hideSection:${key}`, false);
    const showHidden = !!load(`showHidden:${key}`, false);
    const hidden = storedHidden;
    const visibleByMode = setSectionModeVisibility(key, mode);

    if (!visibleByMode) return;

    setSectionHiddenState(key, hidden, showHidden);

    if (hidden) {
      bindSectionControls(key, { sortable: false });
      return;
    }

    if (!sectionTasks) {
      if (key === 'custom') {
        appendCustomEmptyPlaceholder(tbody);
      }
      bindSectionControls(key, { sortable: false });
      return;
    }

    const sortedTasks = key === 'rs3farming'
      ? []
      : applyOrderingAndSort(
        key,
        Array.isArray(sectionTasks) ? sectionTasks : [],
        { load }
      );

    if (key === 'rs3farming') {
      renderGroupedFarming(tbody, sectionTasks, {
        isCollapsedBlock,
        getFarmingHeaderStatus,
        formatFarmingDurationNote,
        buildFarmingLocationTask,
        createHeaderRow,
        createRow,
        createRightSideChildRow,
        formatDurationMs: formatDurationMsCore,
        context: uiContext
      });
    } else if (key === 'gathering') {
      renderGroupedGathering(tbody, sortedTasks, {
        isCollapsedBlock,
        createHeaderRow,
        createRow,
        context: uiContext,
        getGroupCountdown
      });
    } else if (key === 'rs3weekly') {
      renderWeekliesWithChildren(tbody, sortedTasks, {
        isCollapsedBlock,
        createHeaderRow,
        createRow,
        createRightSideChildRow,
        context: uiContext
      });
    } else {
      renderStandardSection(tbody, key, sortedTasks, {
        createRow,
        context: uiContext
      });
    }

    if (key === 'custom' && tbody.children.length === 0) {
      appendCustomEmptyPlaceholder(tbody);
    }

    bindSectionControls(key, { sortable: false });
  });

  movePenguinsBlockToBottom();
  markVisibleSectionEdges(sectionKeys);

  renderOverviewPanel(sections, {
    getPageMode,
    getOverviewPins,
    load,
    applyPageModeVisibility,
    ensureOverviewLayout: () => document.getElementById('overview-content'),
    collectOverviewItems,
    createRow,
    context: {
      ...uiContext,
      isOverviewPanel: true
    }
  });

  hideAllSortButtons();

  fetchProfits();
  updateProfileHeader();

  ['custom', 'gathering', 'rs3daily', 'rs3weekly', 'rs3monthly'].forEach((key) => {
    const tasks = sections[key];
    if (Array.isArray(tasks)) {
      tasks.forEach((task) => maybeNotifyTaskAlert(task, key));
    }
  });
}