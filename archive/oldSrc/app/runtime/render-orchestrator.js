import {
  renderStandardSection,
  renderWeekliesWithChildren,
  renderGroupedGathering,
  renderGroupedFarming,
  formatFarmingDurationNote,
  buildFarmingLocationTask
} from '../../ui/components/tracker/sections/index.js';
import {
  renderOverviewPanel,
  applyPageModeVisibility,
  collectOverviewItems
} from '../../ui/components/overview/index.js';
import { createHeaderRow } from '../../ui/components/headers/index.js';
import { createRow, createRightSideChildRow } from '../../ui/components/tracker/rows/index.js';
import { applyOrderingAndSort } from '../../ui/components/tracker/tables/utils/table.utils.js';
import { formatDurationMs as formatDurationMsCore } from '../../core/time/formatters.js';
import { nextDailyBoundary, nextWeeklyBoundary, nextMonthlyBoundary } from '../../core/time/boundaries.js';
import {
  clearAllSectionBodies,
  getSectionElements,
  markVisibleSectionEdges,
  reorderDashboardSections,
  setSectionHiddenState,
  setSectionModeVisibility
} from './render-orchestrator/section-helpers.js';
import { createUiContext } from './render-orchestrator/overview-ui-context.js';
import {
  appendCustomEmptyPlaceholder,
  getGroupCountdown,
  hideAllSortButtons,
  movePenguinsBlockToBottom
} from './render-orchestrator/panel-helpers.js';

export function renderApp(deps) {
  const {
    load,
    getTaskState,
    getResolvedSections,
    cleanupReadyFarmingTimers,
    cleanupReadyCooldowns,
    hideTooltip,
    getFarmingHeaderStatus,
    bindSectionControls,
    getPageMode,
    getOverviewPins,
    fetchProfits,
    updateProfileHeader,
    maybeNotifyTaskAlert
  } = deps;

  cleanupReadyFarmingTimers();
  cleanupReadyCooldowns();
  hideTooltip();

  const uiContext = createUiContext(deps, () => renderApp(deps));
  const sections = getResolvedSections();
  const sectionKeys = ['custom', 'rs3farming', 'gathering', 'rs3daily', 'rs3weekly', 'rs3monthly'];
  const mode = getPageMode();

  reorderDashboardSections(sectionKeys);
  applyPageModeVisibility(mode);

  const dashboard = document.getElementById('dashboard-container');
  if (dashboard) dashboard.style.display = '';

  clearAllSectionBodies(sectionKeys);

  sectionKeys.forEach((key) => {
    const { tbody } = getSectionElements(key);
    if (!tbody) return;

    const sectionTasks = key === 'rs3farming' ? sections.rs3farming : sections[key];
    const hidden = !!load(`hideSection:${key}`, false);
    const showHidden = !!load(`showHidden:${key}`, false);
    const visibleByMode = setSectionModeVisibility(key, mode);
    if (!visibleByMode) return;

    setSectionHiddenState(key, hidden, showHidden);
    if (hidden) {
      bindSectionControls(key, { sortable: false });
      return;
    }

    if (!sectionTasks) {
      if (key === 'custom') appendCustomEmptyPlaceholder(tbody);
      bindSectionControls(key, { sortable: false });
      return;
    }

    const sortedTasks = key === 'rs3farming'
      ? []
      : applyOrderingAndSort(key, Array.isArray(sectionTasks) ? sectionTasks : [], { load });

    if (key === 'rs3farming') {
      renderGroupedFarming(tbody, sectionTasks, {
        isCollapsedBlock: deps.isCollapsedBlock,
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
        isCollapsedBlock: deps.isCollapsedBlock,
        createHeaderRow,
        createRow,
        context: uiContext,
        getGroupCountdown: (groupName) => getGroupCountdown(groupName, {
          formatDurationMsCore,
          nextDailyBoundary,
          nextWeeklyBoundary,
          nextMonthlyBoundary
        })
      });
    } else if (key === 'rs3weekly') {
      renderWeekliesWithChildren(tbody, sortedTasks, {
        isCollapsedBlock: deps.isCollapsedBlock,
        createHeaderRow,
        createRow,
        createRightSideChildRow,
        context: uiContext
      });
    } else {
      renderStandardSection(tbody, key, sortedTasks, { createRow, context: uiContext });
    }

    if (key === 'custom' && tbody.children.length === 0) appendCustomEmptyPlaceholder(tbody);
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
    context: { ...uiContext, isOverviewPanel: true }
  });

  hideAllSortButtons();
  fetchProfits();
  updateProfileHeader();

  ['custom', 'gathering', 'rs3daily', 'rs3weekly', 'rs3monthly'].forEach((key) => {
    const tasks = sections[key];
    if (Array.isArray(tasks)) tasks.forEach((task) => maybeNotifyTaskAlert(task, key));
  });
}
