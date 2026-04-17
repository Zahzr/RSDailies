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
import {
  createHeaderRow
} from '../../../ui/rows/headers.js';
import {
  createRow,
  createRightSideChildRow
} from '../../../ui/rows/factory.js';
import {
  getContainerId,
  getTableId,
  applyOrderingAndSort
} from '../../../ui/table/utils.js';
import { formatDurationMs as formatDurationMsCore } from '../../../core/time/formatters.js';

/**
 * App Orchestrator
 * High-level rendering logic and DOM population.
 */

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
    sectionLabel,
    bindSectionControls,
    getPageMode,
    getOverviewPins
  } = deps;

  // 1. Maintenance
  cleanupReadyFarmingTimers();
  cleanupReadyCooldowns();
  hideTooltip();

  // 2. Build UI Context for components
  const uiContext = {
    load,
    save,
    getTaskState,
    cloneRowTemplate: () => document.getElementById('sample_row').content.firstElementChild.cloneNode(true),
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
          const notified = load('notified:custom', {});
          delete completed[task.id];
          delete hiddenRows[task.id];
          delete notified[task.id];
          save('completed:custom', completed);
          save('hiddenRows:custom', hiddenRows);
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
    getTableId,
    isCollapsedBlock,
    setCollapsedBlock
  };

  const sections = getResolvedSections();
  const dashboardBody = document.querySelector('#dashboard-container .row');

  // 3. Render Sections (Dailies / Weeklies / Farming / etc.)
  if (dashboardBody) {
    dashboardBody.innerHTML = '';
    const sectionKeys = ['custom', 'rs3farming', 'rs3daily', 'gathering', 'rs3weekly', 'rs3monthly'];

    sectionKeys.forEach((key) => {
      const sectionTasks = (key === 'rs3farming') ? sections.rs3farming : sections[key];
      if (!sectionTasks) return;

      const sortedTasks = (key === 'rs3farming') ? [] : applyOrderingAndSort(key, Array.isArray(sectionTasks) ? sectionTasks : [], { load });
      const containerId = getContainerId(key);

      const card = document.createElement('div');
      card.className = 'col-12 col-xl-6 mb-4';
      card.id = containerId;
      if (load(`hideSection:${key}`, false)) card.style.display = 'none';

      const cardInner = document.createElement('div');
      cardInner.className = 'card rs3-card';
      cardInner.innerHTML = `<div class="card-header"><h5 class="mb-0">${sectionLabel(key)}</h5></div>`;

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body p-0';
      const table = document.createElement('table');
      table.id = getTableId(key);
      table.className = 'table table-dark table-hover rs3-table mb-0';
      const tbody = document.createElement('tbody');

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
          context: uiContext
        });
      } else if (key === 'rs3weekly') {
        renderWeekliesWithChildren(tbody, sortedTasks, {
          isCollapsedBlock,
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

      table.appendChild(tbody);
      cardBody.appendChild(table);
      cardInner.appendChild(cardBody);
      card.appendChild(cardInner);
      dashboardBody.appendChild(card);
      bindSectionControls(key, { sortable: true });
    });
  }

  // 4. Render Overview Panel
  renderOverviewPanel(sections, {
    getPageMode,
    getOverviewPins,
    load,
    applyPageModeVisibility,
    ensureOverviewLayout: () => document.getElementById('overview-content'),
    collectOverviewItems,
    createRow,
    context: uiContext
  });

  // 5. Post-render updates
  fetchProfits();
  updateProfileHeader();

  const sectionKeysForNotify = ['custom', 'rs3daily', 'gathering', 'rs3weekly', 'rs3monthly'];
  sectionKeysForNotify.forEach((key) => {
    const tasks = sections[key];
    if (Array.isArray(tasks)) {
      tasks.forEach((task) => maybeNotifyTaskAlert(task, key));
    }
  });
}
