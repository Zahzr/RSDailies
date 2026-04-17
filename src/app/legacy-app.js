import { tasksConfig as TASKS_CONFIG } from '../config/tasks/index.js';
import { farmingConfig as FARMING_CONFIG } from '../config/farming/index.js';
import {
  initProfileContext as initProfileContextFeature,
  setProfile as setProfileFeature,
  loadProfiles as loadProfilesFeature,
  saveProfiles as saveProfilesFeature,
  profileKey as profileKeyFeature,
} from '../features/profiles/index.js';
import {
  hideTooltip as hideTooltipFeature,
  attachTooltip as attachTooltipFeature
} from '../ui/tooltip.js';
import {
  buildExportToken as buildExportTokenFeature,
  importProfileToken,
  updateProfileHeader as updateProfileHeaderFeature,
  setupProfileControl as setupProfileControlFeature
} from '../features/profiles/index.js';
import {
  getSettings as getSettingsFeature,
  saveSettings as saveSettingsFeature,
  applySettingsToDom as applySettingsToDomFeature,
  collectSettingsFromDom as collectSettingsFromDomFeature,
  setupSettingsControl as setupSettingsControlFeature
} from '../features/settings/index.js';
import {
  getResolvedSections as getResolvedSectionsFeature,
  getTableId as getTableIdFeature
} from '../features/tasks/index.js';
import {
  migrateLegacyViewModeToPageMode as migrateLegacyViewModeToPageModeFeature,
  getPageMode as getPageModeFeature,
  setPageMode as setPageModeFeature,
  closeFloatingControls as closeFloatingControlsFeature,
  setupViewsControl as setupViewsControlFeature
} from '../features/views/index.js';
import {
  nextDailyBoundary as nextDailyBoundaryCore,
  nextWeeklyBoundary as nextWeeklyBoundaryCore,
  nextMonthlyBoundary as nextMonthlyBoundaryCore
} from '../core/time/boundaries.js';
import { formatCountdown as formatCountdownCore } from '../core/time/countdowns.js';
import {
  startFarmingTimer as startFarmingTimerFeature,
  clearFarmingTimer as clearFarmingTimerFeature,
  getFarmingHeaderStatus,
  cleanupReadyFarmingTimers as cleanupReadyFarmingTimersFeature
} from '../features/farming/timers.js';
import {
  startCooldown as startCooldownFeature,
  cleanupReadyCooldowns as cleanupReadyCooldownsFeature
} from '../features/cooldowns/timers.js';
import {
  maybeBrowserNotify as maybeBrowserNotifyFeature,
  maybeWebhookNotify as maybeWebhookNotifyFeature,
  maybeNotifyTaskAlert as maybeNotifyTaskAlertFeature
} from '../features/notifications/bridge.js';
import {
  checkAutoReset as checkAutoResetFeature,
  resetSectionView as resetSectionViewFeature,
  setTaskCompleted as setTaskCompletedFeature,
  hideTask as hideTaskFeature
} from '../features/sections/logic.js';

// Bridge Imports
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
  getOverviewPins,
} from './core/storage-bridge.js';

import {
  bindSectionControls as bindSectionControlsFeature
} from './ui/controls/sections.js';
import {
  setupProfileControl as setupProfileControlFeatureBridged,
  setupSettingsControl as setupSettingsControlFeatureBridged,
  setupViewsControl as setupViewsControlFeatureBridged,
  closeFloatingControls as closeFloatingControlsFeatureBridged,
  setupGlobalClickCloser as setupGlobalClickCloserFeatureBridged,
  updateProfileHeader as updateProfileHeaderFeatureBridged
} from './ui/controls/floating.js';
import {
  setupImportExport as setupImportExportFeature
} from './ui/import-export/controller.js';
import {
  setupCustomAdd as setupCustomAddFeature
} from './ui/modals/custom-tasks.js';

import { renderApp as renderAppCore } from './ui/render/orchestrator.js';

/* -----------------------------
   Public API / Bridging
 ----------------------------- */

export function migrateLegacyViewModeToPageMode() { migrateLegacyViewModeToPageModeFeature(); }
export function initProfileContext() { initProfileContextFeature(); }

export function updateCountdowns() {
  const ids = {
    'countdown-rs3daily': formatCountdownCore(nextDailyBoundaryCore(new Date())),
    'countdown-rs3weekly': formatCountdownCore(nextWeeklyBoundaryCore(new Date())),
    'countdown-rs3monthly': formatCountdownCore(nextMonthlyBoundaryCore(new Date()))
  };
  Object.entries(ids).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
}

export function applySettingsToDom() {
  applySettingsToDomFeature(document, getSettingsFeature());
}

export function checkAutoReset() {
  return checkAutoResetFeature({ load, save, removeKey });
}

export function renderApp() {
  renderAppCore({
    load, save, getSectionState, getCustomTasks, saveCustomTasks,
    cleanupReadyFarmingTimers: () => cleanupReadyFarmingTimersFeature({ load, save }),
    cleanupReadyCooldowns: () => cleanupReadyCooldownsFeature({ load, save }),
    hideTooltip: () => hideTooltipFeature(document),
    getTaskState: (key, id, task) => {
      const state = getSectionState(key);
      if (state.hiddenRows[id]) return 'hide';
      if (task?.cooldownMinutes && (getCooldowns()[id]?.readyAt > Date.now())) return 'hide';
      if (key === 'rs3farming' && task?.isTimerParent) {
          const running = !!getFarmingTimers()[id];
          return (running && task.vanishOnStart && !state.showHidden) ? 'hide' : (running ? 'running' : 'idle');
      }
      const completed = !!state.completed[id];
      if (completed && task?.reset && !state.showHidden) return 'hide';
      return completed ? 'true' : 'false';
    },
    getResolvedSections: () => getResolvedSectionsFeature({
      tasksConfig: TASKS_CONFIG, farmingConfig: FARMING_CONFIG, getCustomTasks, getPenguinWeeklyData: () => load('penguinWeeklyData', {})
    }),
    getFarmingHeaderStatus: (t) => getFarmingHeaderStatus(t),
    hideTask: (key, id) => hideTaskFeature(key, id, { load, save }),
    setTaskCompleted: (key, id, c) => setTaskCompletedFeature(key, id, c, { load, save }),
    clearFarmingTimer: (id) => clearFarmingTimerFeature(id, { load, save }),
    startFarmingTimer: (t) => startFarmingTimerFeature(t, { load, save }),
    startCooldown: (id, m) => startCooldownFeature(id, m, { load, save }),
    isCollapsedBlock, setCollapsedBlock, fetchProfits, 
    updateProfileHeader: () => updateProfileHeaderFeatureBridged({ updateProfileHeaderFeature }),
    maybeNotifyTaskAlert: (t, k) => maybeNotifyTaskAlertFeature(t, k, { load, save }),
    sectionLabel: (k) => k === 'custom' ? 'Custom Tasks' : (k === 'rs3farming' ? 'Farming Timers' : (k === 'rs3daily' ? 'Dailies' : (k === 'gathering' ? 'Gathering' : (k === 'rs3weekly' ? 'Weeklies' : 'Monthlies')))),
    bindSectionControls, getPageMode: getPageModeFeature, getOverviewPins
  });
}

/* -----------------------------
   Controls Implementation
 ----------------------------- */

function bindSectionControls(sectionKey, opts = { sortable: false }) {
  bindSectionControlsFeature(sectionKey, opts, {
    renderApp, getSectionState, saveSectionValue,
    resetSectionView: (key) => resetSectionViewFeature(key, { load, save, removeKey })
  });
}

export function setupProfileControl() {
  setupProfileControlFeatureBridged({ setupProfileControlFeature, renderApp, closeFloatingControls: () => closeFloatingControlsFeature(document) });
}

export function setupSettingsControl() {
  setupSettingsControlFeatureBridged({ setupSettingsControlFeature, renderApp, closeFloatingControls: () => closeFloatingControlsFeature(document) });
}

export function setupViewsControl() {
  setupViewsControlFeatureBridged({ setupViewsControlFeature, renderApp, closeFloatingControls: () => closeFloatingControlsFeature(document) });
}

export function setupGlobalClickCloser() {
  setupGlobalClickCloserFeatureBridged({ closeFloatingControls: () => closeFloatingControlsFeature(document) });
}

export function setupImportExport() {
  setupImportExportFeature({ buildExportTokenFeature: () => buildExportTokenFeature(localStorage), importProfileToken: (t) => importProfileToken(t, localStorage) });
}

export function setupCustomAdd() {
  setupCustomAddFeature({ getCustomTasks, saveCustomTasks, renderApp });
}

export function setupSectionBindings() {
  ['custom', 'rs3farming', 'rs3daily', 'gathering', 'rs3weekly', 'rs3monthly'].forEach(key => bindSectionControls(key, { sortable: true }));
}

/**
 * Standard initialization sequence for the DailyScape application.
 * Called after the LayoutLoader has prepared the DOM.
 */
export function initAppRoot() {
  initProfileContext();
  migrateLegacyViewModeToPageMode();
  applySettingsToDom();
  checkAutoReset();
  updateCountdowns();

  setupSectionBindings();
  setupProfileControl();
  setupSettingsControl();
  setupViewsControl();
  setupGlobalClickCloser();
  setupImportExport();
  setupCustomAdd();

  renderApp();
}

async function fetchProfits() {
  const nodes = [...document.querySelectorAll('.item_profit[data-item][data-qty]')];
  if (!nodes.length) return;
  const items = [...new Set(nodes.map(n => n.dataset.item).filter(Boolean))];
  try {
    const res = await fetch(`https://runescape.wiki/api.php?action=ask&query=[[Exchange:${items.join('||Exchange:')}]]|?Exchange:Price&format=json&origin=*`);
    const results = (await res.json())?.query?.results || {};
    nodes.forEach(node => {
      const price = results[`Exchange:${node.dataset.item}`]?.printouts?.['Exchange:Price']?.[0]?.num;
      node.textContent = price ? ` ~${Math.round(price * parseInt(node.dataset.qty, 10)).toLocaleString()} gp` : '';
    });
  } catch { nodes.forEach(n => n.textContent = ''); }
}

export { cleanupReadyFarmingTimersFeature as cleanupReadyFarmingTimers, cleanupReadyCooldownsFeature as cleanupReadyCooldowns };
