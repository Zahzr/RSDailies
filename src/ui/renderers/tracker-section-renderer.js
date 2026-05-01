import {
  renderStandardSection,
  renderWeekliesWithChildren,
  renderGroupedGathering,
  renderGroupedTimers,
  formatTimerDurationNote,
  buildTimerLocationTask,
} from '../components/tracker/sections/index.js';
import { createHeaderRow } from '../components/headers/index.js';
import { createRow, createRightSideChildRow } from '../components/tracker/rows/index.js';
import { applyOrderingAndSort } from '../components/tracker/tables/utils/table.utils.js';
import { formatDurationMs as formatDurationMsCore } from '../../core/time/formatters.js';
import { nextDailyBoundary, nextWeeklyBoundary, nextMonthlyBoundary } from '../../core/time/boundaries.js';
import { appendCustomEmptyPlaceholder, getGroupCountdown } from '../../app/runtime/render-orchestrator/panel-helpers.js';
import { getSettings } from '../../features/settings/domain/state.js';

function createRendererContext(sectionDefinition, sectionTasks, deps) {
  const {
    key,
    load,
    uiContext,
    isCollapsedBlock,
    getTimerHeaderStatus,
  } = deps;

  const sortedTasks = sectionDefinition.renderVariant === 'timer-groups'
    ? []
    : applyOrderingAndSort(key, Array.isArray(sectionTasks) ? sectionTasks : [], { load });

  return {
    key,
    load,
    uiContext,
    isCollapsedBlock,
    getTimerHeaderStatus,
    sectionDefinition,
    sectionTasks,
    sortedTasks,
  };
}

function renderTimerGroupsSection(tbody, context) {
  const { sectionTasks, isCollapsedBlock, getTimerHeaderStatus, uiContext } = context;

  renderGroupedTimers(tbody, sectionTasks, {
    isCollapsedBlock,
    getTimerHeaderStatus,
    formatTimerDurationNote,
    buildTimerLocationTask,
    createHeaderRow,
    createRow,
    createRightSideChildRow,
    formatDurationMs: formatDurationMsCore,
    context: { ...uiContext, getSettingsValue: () => getSettings() },
  });
}

function renderGroupedSectionsSection(tbody, context) {
  const { sortedTasks, isCollapsedBlock, uiContext } = context;

  renderGroupedGathering(tbody, sortedTasks, {
    isCollapsedBlock,
    createHeaderRow,
    createRow,
    context: uiContext,
    getGroupCountdown: (groupName) => getGroupCountdown(groupName, {
      formatDurationMsCore,
      nextDailyBoundary,
      nextWeeklyBoundary,
      nextMonthlyBoundary,
    }),
  });
}

function renderParentChildrenSection(tbody, context) {
  const { sortedTasks, isCollapsedBlock, uiContext } = context;

  renderWeekliesWithChildren(tbody, sortedTasks, {
    isCollapsedBlock,
    createHeaderRow,
    createRow,
    createRightSideChildRow,
    context: uiContext,
  });
}

function renderStandardTrackerSection(tbody, context) {
  const { key, sortedTasks, uiContext } = context;

  renderStandardSection(tbody, key, sortedTasks, { createRow, context: uiContext });
}

export const TRACKER_SECTION_RENDERERS = Object.freeze({
  'timer-groups': renderTimerGroupsSection,
  'grouped-sections': renderGroupedSectionsSection,
  'parent-children': renderParentChildrenSection,
  standard: renderStandardTrackerSection,
});

export function renderTrackerSection(tbody, sectionDefinition, sectionTasks, deps) {
  const { key } = deps;

  if (!sectionTasks) {
    if (key === 'custom') {
      appendCustomEmptyPlaceholder(tbody);
    }
    return;
  }

  const rendererContext = createRendererContext(sectionDefinition, sectionTasks, deps);
  const renderSection = TRACKER_SECTION_RENDERERS[sectionDefinition.renderVariant] || TRACKER_SECTION_RENDERERS.standard;
  renderSection(tbody, rendererContext);
}
