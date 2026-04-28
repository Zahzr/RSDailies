import {
  renderStandardSection,
  renderWeekliesWithChildren,
  renderGroupedGathering,
  renderGroupedFarming,
  formatFarmingDurationNote,
  buildFarmingLocationTask,
} from '../components/tracker/sections/index.js';
import { createHeaderRow } from '../components/headers/index.js';
import { createRow, createRightSideChildRow } from '../components/tracker/rows/index.js';
import { applyOrderingAndSort } from '../components/tracker/tables/utils/table.utils.js';
import { formatDurationMs as formatDurationMsCore } from '../../core/time/formatters.js';
import { nextDailyBoundary, nextWeeklyBoundary, nextMonthlyBoundary } from '../../core/time/boundaries.js';
import { appendCustomEmptyPlaceholder, getGroupCountdown } from '../../app/runtime/render-orchestrator/panel-helpers.js';

export function renderTrackerSection(tbody, sectionDefinition, sectionTasks, deps) {
  const {
    key,
    load,
    uiContext,
    isCollapsedBlock,
    getFarmingHeaderStatus,
  } = deps;

  if (!sectionTasks) {
    if (key === 'custom') {
      appendCustomEmptyPlaceholder(tbody);
    }
    return;
  }

  const sortedTasks = sectionDefinition.renderVariant === 'timer-groups'
    ? []
    : applyOrderingAndSort(key, Array.isArray(sectionTasks) ? sectionTasks : [], { load });

  switch (sectionDefinition.renderVariant) {
    case 'timer-groups':
      renderGroupedFarming(tbody, sectionTasks, {
        isCollapsedBlock,
        getFarmingHeaderStatus,
        formatFarmingDurationNote,
        buildFarmingLocationTask,
        createHeaderRow,
        createRow,
        createRightSideChildRow,
        formatDurationMs: formatDurationMsCore,
        context: uiContext,
      });
      return;

    case 'grouped-sections':
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
      return;

    case 'parent-children':
      renderWeekliesWithChildren(tbody, sortedTasks, {
        isCollapsedBlock,
        createHeaderRow,
        createRow,
        createRightSideChildRow,
        context: uiContext,
      });
      return;

    default:
      renderStandardSection(tbody, key, sortedTasks, { createRow, context: uiContext });
      return;
  }
}
