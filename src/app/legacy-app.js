import { tasksConfig as TASKS_CONFIG } from '../config/tasks/index.js';
import { farmingConfig as FARMING_CONFIG } from '../config/farming/index.js';

import {
  initProfileContext,
  setupProfileControl as setupProfileControlFeature,
  setupProfileImportExport,
  updateProfileHeader
} from '../features/profiles/controller.js';

import {
  getSettings,
  applySettingsToDom as applySettingsToDomFeature,
  setupSettingsControl as setupSettingsControlFeature
} from '../features/settings/controller.js';

import {
  closeFloatingControls,
  setupViewsControl as setupViewsControlFeature
} from '../features/views/controller.js';

import {
  getPageMode,
  migrateLegacyViewModeToPageMode
} from '../features/views/model.js';

import {
  getResolvedSections
} from '../features/tasks/index.js';

import {
  startFarmingTimer,
  clearFarmingTimer,
  cleanupReadyFarmingTimers as cleanupReadyFarmingTimersFeature,
  getFarmingHeaderStatus
} from '../features/farming/timers.js';

import {
  startCooldown,
  cleanupReadyCooldowns as cleanupReadyCooldownsFeature
} from '../features/cooldowns/timers.js';

import {
  maybeNotifyTaskAlert,
  maybeBrowserNotify,
  maybeWebhookNotify
} from '../features/notifications/bridge.js';

import {
  checkAutoReset as checkAutoResetFeature,
  hideTask,
  resetSectionView,
  setTaskCompleted
} from '../features/sections/logic.js';

import {
  load,
  save,
  removeKey,
  saveSectionValue,
  getSectionState,
  isCollapsedBlock,
  setCollapsedBlock,
  getCustomTasks,
  saveCustomTasks,
  getFarmingTimers,
  getCooldowns,
  getOverviewPins
} from './core/storage-bridge.js';

import {
  bindSectionControls
} from './ui/controls/sections.js';

import {
  setupProfileControl as setupProfileControlBridge,
  setupSettingsControl as setupSettingsControlBridge,
  setupViewsControl as setupViewsControlBridge,
  closeFloatingControls as closeFloatingControlsBridge,
  setupGlobalClickCloser as setupGlobalClickCloserBridge,
  updateProfileHeader as updateProfileHeaderBridge
} from './ui/controls/floating.js';

import {
  setupImportExport as setupImportExportFeature
} from './ui/import-export/controller.js';

import {
  setupCustomAdd as setupCustomAddFeature
} from './ui/modals/custom-tasks.js';

import { renderApp as renderAppCore } from './ui/render/orchestrator.js';

import {
  nextDailyBoundary,
  nextWeeklyBoundary,
  nextMonthlyBoundary
} from '../core/time/boundaries.js';

import { formatDurationMs } from '../core/time/formatters.js';

import {
  hideTooltip
} from '../ui/tooltip.js';

function formatBoundaryCountdown(targetMs) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return '00:00:00';
  return formatDurationMs(diff);
}

function getStorageDeps() {
  return { load, save, removeKey };
}

export { initProfileContext, migrateLegacyViewModeToPageMode };

export function applySettingsToDom() {
  applySettingsToDomFeature(document, getSettings());
}

export function checkAutoReset() {
  return checkAutoResetFeature(getStorageDeps());
}

export function cleanupReadyFarmingTimers() {
  return cleanupReadyFarmingTimersFeature({ load, save });
}

export function cleanupReadyCooldowns() {
  return cleanupReadyCooldownsFeature({ load, save });
}

export function updateCountdowns() {
  const ids = {
    'countdown-rs3daily': formatBoundaryCountdown(nextDailyBoundary(new Date())),
    'countdown-rs3weekly': formatBoundaryCountdown(nextWeeklyBoundary(new Date())),
    'countdown-rs3monthly': formatBoundaryCountdown(nextMonthlyBoundary(new Date()))
  };

  Object.entries(ids).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

export function renderApp() {
  renderAppCore({
    load,
    save,
    getSectionState: (sectionKey) => getSectionState(sectionKey, load),
    getCustomTasks: () => getCustomTasks(load),
    saveCustomTasks: (tasks) => saveCustomTasks(tasks, save),
    cleanupReadyFarmingTimers: () => cleanupReadyFarmingTimersFeature({ load, save }),
    cleanupReadyCooldowns: () => cleanupReadyCooldownsFeature({ load, save }),
    hideTooltip: () => hideTooltip(document),
    getTaskState: (sectionKey, taskId, task) => {
      const section = getSectionState(sectionKey, load);
      const hiddenRows = section.hiddenRows || {};
      const completed = section.completed || {};
      const cooldowns = getCooldowns(load);
      const farmingTimers = getFarmingTimers(load);

      if (hiddenRows[taskId]) return 'hide';

      if (task?.cooldownMinutes && cooldowns[taskId]?.readyAt > Date.now()) {
        return 'running';
      }

      if (sectionKey === 'rs3farming' && task?.isTimerParent) {
        const active = !!farmingTimers[task.id];
        if (!active) return 'idle';
        return farmingTimers[task.id]?.readyAt > Date.now() ? 'running' : 'ready';
      }

      return completed[taskId] ? 'true' : 'false';
    },
    getResolvedSections: () =>
      getResolvedSections({
        tasksConfig: TASKS_CONFIG,
        farmingConfig: FARMING_CONFIG,
        getCustomTasks: () => getCustomTasks(load),
        getPenguinWeeklyData: () => load('penguinWeeklyData', {})
      }),
    getFarmingHeaderStatus: (task) => getFarmingHeaderStatus(task, { load }),
    hideTask: (sectionKey, taskId) => hideTask(sectionKey, taskId, { load, save }),
    setTaskCompleted: (sectionKey, taskId, complete) =>
      setTaskCompleted(sectionKey, taskId, complete, { load, save }),
    clearFarmingTimer: (taskId) => clearFarmingTimer(taskId, { load, save }),
    startFarmingTimer: (task) => startFarmingTimer(task, { load, save }),
    startCooldown: (taskId, minutes) => startCooldown(taskId, minutes, { load, save }),
    isCollapsedBlock: (blockId) => isCollapsedBlock(blockId, load),
    setCollapsedBlock: (blockId, collapsed) => setCollapsedBlock(blockId, collapsed, load, save),
    fetchProfits,
    updateProfileHeader: () =>
      updateProfileHeaderBridge({
        updateProfileHeaderFeature: updateProfileHeader,
        documentRef: document
      }),
    maybeNotifyTaskAlert: (task, sectionKey) =>
      maybeNotifyTaskAlert(task, sectionKey, { load, save, maybeBrowserNotify, maybeWebhookNotify }),
    bindSectionControls: (sectionKey, opts) =>
      bindSectionControls(sectionKey, opts, {
        renderApp,
        getSectionState: (key) => getSectionState(key, load),
        saveSectionValue: (key, name, value) => saveSectionValue(key, name, value, save),
        resetSectionView: (key) => resetSectionView(key, { load, save, removeKey })
      }),
    getPageMode,
    getOverviewPins: () => getOverviewPins(load)
  });
}

export function setupSectionBindings() {
  ['custom', 'rs3farming', 'rs3daily', 'gathering', 'rs3weekly', 'rs3monthly'].forEach((sectionKey) => {
    bindSectionControls(sectionKey, { sortable: true }, {
      renderApp,
      getSectionState: (key) => getSectionState(key, load),
      saveSectionValue: (key, name, value) => saveSectionValue(key, name, value, save),
      resetSectionView: (key) => resetSectionView(key, { load, save, removeKey })
    });
  });
}

function setupProfileControlEntry() {
  setupProfileControlBridge({
    setupProfileControlFeature,
    renderApp,
    closeFloatingControls: () =>
      closeFloatingControlsBridge({
        closeFloatingControlsFeature: closeFloatingControls,
        documentRef: document
      }),
    documentRef: document,
    windowRef: window
  });
}

function setupSettingsControlEntry() {
  setupSettingsControlBridge({
    setupSettingsControlFeature,
    renderApp,
    closeFloatingControls: () =>
      closeFloatingControlsBridge({
        closeFloatingControlsFeature: closeFloatingControls,
        documentRef: document
      }),
    documentRef: document
  });
}

function setupViewsControlEntry() {
  setupViewsControlBridge({
    setupViewsControlFeature,
    renderApp,
    closeFloatingControls: () =>
      closeFloatingControlsBridge({
        closeFloatingControlsFeature: closeFloatingControls,
        documentRef: document
      }),
    documentRef: document,
    windowRef: window
  });
}

function setupGlobalClickCloserEntry() {
  setupGlobalClickCloserBridge({
    closeFloatingControls: () =>
      closeFloatingControlsBridge({
        closeFloatingControlsFeature: closeFloatingControls,
        documentRef: document
      }),
    documentRef: document
  });
}

function setupImportExportEntry() {
  setupImportExportFeature({
    documentRef: document,
    onImport: () => window.location.reload()
  });

  setupProfileImportExport({
    documentRef: document,
    onImport: () => window.location.reload(),
    windowRef: window
  });
}

function setupCustomAddEntry() {
  setupCustomAddFeature({
    getCustomTasks: () => getCustomTasks(load),
    saveCustomTasks: (tasks) => saveCustomTasks(tasks, save),
    renderApp,
    bootstrapRef: window.bootstrap,
    documentRef: document
  });
}

export function setupProfileControl() {
  setupProfileControlEntry();
}

export function setupSettingsControl() {
  setupSettingsControlEntry();
}

export function setupViewsControl() {
  setupViewsControlEntry();
}

export function setupGlobalClickCloser() {
  setupGlobalClickCloserEntry();
}

export function setupImportExport() {
  setupImportExportEntry();
}

export function setupCustomAdd() {
  setupCustomAddEntry();
}

export function initAppRoot() {
  initProfileContext();
  migrateLegacyViewModeToPageMode();
  applySettingsToDom();
  checkAutoReset();
  updateCountdowns();

  setupSectionBindings();
  setupProfileControlEntry();
  setupSettingsControlEntry();
  setupViewsControlEntry();
  setupGlobalClickCloserEntry();
  setupImportExportEntry();
  setupCustomAddEntry();

  renderApp();
}

async function fetchProfits() {
  const nodes = [...document.querySelectorAll('.item_profit[data-item][data-qty]')];
  if (!nodes.length) return;

  const items = [...new Set(nodes.map((node) => node.dataset.item).filter(Boolean))];
  if (!items.length) return;

  try {
    const response = await fetch(
      `https://runescape.wiki/api.php?action=ask&query=[[Exchange:${items.join('||Exchange:')}]]|?Exchange:Price&format=json&origin=*`
    );
    const json = await response.json();
    const results = json?.query?.results || {};

    nodes.forEach((node) => {
      const item = node.dataset.item;
      const qty = parseInt(node.dataset.qty || '0', 10);
      const price = results[`Exchange:${item}`]?.printouts?.['Exchange:Price']?.[0]?.num;

      node.textContent = price ? ` ~${Math.round(price * qty).toLocaleString()} gp` : '';
    });
  } catch {
    nodes.forEach((node) => {
      node.textContent = '';
    });
  }
}