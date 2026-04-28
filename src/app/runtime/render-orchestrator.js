import {
  renderOverviewPanel,
  applyPageModeVisibility,
  collectOverviewItems
} from '../../ui/components/overview/index.js';
import { createRow } from '../../ui/components/tracker/rows/index.js';
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
  hideAllSortButtons,
  movePenguinsBlockToBottom
} from './render-orchestrator/panel-helpers.js';
import { getTrackerPageSectionIds, getTrackerSections } from '../registries/unified-registry.js';
import { renderTrackerSection } from '../../ui/renderers/tracker-section-renderer.js';
import { StorageKeyBuilder } from '../../core/storage/keys-builder.js';

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
  const sectionDefinitions = getTrackerSections();
  const sectionKeys = sectionDefinitions.map((section) => section.id);
  const mode = getPageMode();
  const visibleSectionIds = new Set(getTrackerPageSectionIds(mode));

  reorderDashboardSections(sectionKeys);
  applyPageModeVisibility(mode);

  const dashboard = document.getElementById('dashboard-container');
  if (dashboard) dashboard.style.display = '';

  clearAllSectionBodies(sectionKeys);

  sectionDefinitions.forEach((sectionDefinition) => {
    const key = sectionDefinition.id;
    const { tbody } = getSectionElements(key);
    if (!tbody) return;

    const sectionTasks = sections[key];
    const hidden = !!load(StorageKeyBuilder.sectionHidden(key), false);
    const showHidden = !!load(StorageKeyBuilder.sectionShowHidden(key), false);
    const visibleByMode = setSectionModeVisibility(key, visibleSectionIds);
    if (!visibleByMode) return;

    setSectionHiddenState(key, hidden, showHidden);
    if (hidden) {
      bindSectionControls(key, { sortable: false });
      return;
    }

    renderTrackerSection(tbody, sectionDefinition, sectionTasks, {
      key,
      load,
      uiContext,
      isCollapsedBlock: deps.isCollapsedBlock,
      getFarmingHeaderStatus,
    });

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

  sectionDefinitions
    .filter((section) => section.supportsTaskNotifications)
    .forEach((section) => {
      const key = section.id;
      const tasks = sections[key];
      if (Array.isArray(tasks)) tasks.forEach((task) => maybeNotifyTaskAlert(task, key));
    });
}
