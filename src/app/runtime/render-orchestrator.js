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
import { GAMES, getSelectedGame } from '../../core/state/GameContext.js';

export function renderApp(deps) {
  const {
    load,
    getTaskState,
    getResolvedSections,
    cleanupReadyTimers,
    cleanupReadyCooldowns,
    hideTooltip,
    getTimerHeaderStatus,
    bindSectionControls,
    getPageMode,
    getOverviewPins,
    fetchProfits,
    updateProfileHeader,
    maybeNotifyTaskAlert
  } = deps;

  cleanupReadyTimers();
  cleanupReadyCooldowns();
  hideTooltip();

  const game = getSelectedGame() === GAMES.OSRS ? GAMES.OSRS : GAMES.RS3;
  const uiContext = createUiContext(deps, () => renderApp(deps));
  const sections = getResolvedSections(game);
  const sectionDefinitions = getTrackerSections(game);
  const allSectionDefinitions = getTrackerSections();
  const sectionKeys = allSectionDefinitions.map((section) => section.id);
  const mode = getPageMode(game);
  const visibleSectionIds = new Set(getTrackerPageSectionIds(mode, game));

  reorderDashboardSections(sectionKeys);
  applyPageModeVisibility(mode);

  const dashboard = document.getElementById('dashboard-container');
  if (dashboard) dashboard.style.display = '';

  clearAllSectionBodies(sectionKeys);

  allSectionDefinitions.forEach((sectionDefinition) => {
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
      getTimerHeaderStatus,
    });

    if (key === 'custom' && tbody.children.length === 0) appendCustomEmptyPlaceholder(tbody);
    bindSectionControls(key, { sortable: false });
  });

  movePenguinsBlockToBottom();
  markVisibleSectionEdges(sectionKeys);

  renderOverviewPanel(sections, {
    getPageMode: () => getPageMode(game),
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
