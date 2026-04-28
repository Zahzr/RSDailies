import { tasksConfig as TASKS_CONFIG } from '../../../features/tasks/config/index.js';
import { farmingConfig as FARMING_CONFIG } from '../../../features/farming/config/index.js';
import { initProfileContext, setupProfileControl as setupProfileControlFeature, setupProfileImportExport, updateProfileHeader } from '../../../features/profiles/domain/controller.js';
import { getSettings, applySettingsToDom as applySettingsToDomFeature, setupSettingsControl as setupSettingsControlFeature } from '../../../features/settings/domain/controller.js';
import { closeFloatingControls, setupViewsControl as setupViewsControlFeature } from '../../../features/views/domain/controller.js';
import { getPageMode, syncStoredViewModeToPageMode } from '../../../features/views/domain/model.js';
import { getResolvedSections } from '../../../features/tasks/index.js';
import { startFarmingTimer, clearFarmingTimer, cleanupReadyFarmingTimers as cleanupReadyFarmingTimersFeature, getFarmingHeaderStatus } from '../../../features/farming/domain/timers.js';
import { startCooldown, cleanupReadyCooldowns as cleanupReadyCooldownsFeature } from '../../../features/cooldowns/domain/timers.js';
import { maybeNotifyTaskAlert, maybeBrowserNotify, maybeWebhookNotify } from '../../../features/notifications/domain/bridge.js';
import { syncPenguinWeeklyData } from '../../../features/penguins/index.js';
import { checkAutoReset as checkAutoResetFeature, hideTask, resetSectionView, setTaskCompleted } from '../../../features/sections/domain/logic.js';
import { bindSectionControls } from '../../../ui/components/tracker/sections/controls/section-controls-bindings.js';
import { setupImportExport as setupImportExportFeature } from '../../../ui/components/import-export/index.js';
import { setupCustomAdd as setupCustomAddFeature } from '../../../ui/components/custom-tasks/modal/custom-task-controller.js';
import { nextDailyBoundary, nextWeeklyBoundary, nextMonthlyBoundary } from '../../../core/time/boundaries.js';
import { formatDurationMs } from '../../../core/time/formatters.js';
import { hideTooltip } from '../../../ui/primitives/tooltips/tooltip-engine.js';
import { load, save, removeKey, saveSectionValue, getSectionState, isCollapsedBlock, setCollapsedBlock, getCustomTasks, saveCustomTasks, getFarmingTimers, getCooldowns, getOverviewPins } from '../storage-bridge.js';
import { setupProfileControl as setupProfileControlBridge, setupSettingsControl as setupSettingsControlBridge, setupViewsControl as setupViewsControlBridge, closeFloatingControls as closeFloatingControlsBridge, setupGlobalClickCloser as setupGlobalClickCloserBridge, updateProfileHeader as updateProfileHeaderBridge } from '../floating-controls.js';
import { renderApp as renderAppCore } from '../render-orchestrator.js';
import { setupFeatureControls } from './setup-controls.js';
import { fetchProfits } from './fetch-profits.js';
import { createRenderAppRunner } from './render-deps.js';
import { runAppInitialization } from './init-app-root.js';
import { applySettingsToDomBridge, checkAutoResetBridge, updateCountdowns as updateCountdownsBridge } from './core-actions.js';

const getStorageDeps = () => ({ load, save, removeKey });
export { initProfileContext, syncStoredViewModeToPageMode };
export const applySettingsToDom = () => applySettingsToDomBridge(applySettingsToDomFeature, getSettings, document);
export const checkAutoReset = () => checkAutoResetBridge(checkAutoResetFeature, getStorageDeps);
export const updateCountdowns = () => updateCountdownsBridge(document, { nextDailyBoundary, nextWeeklyBoundary, nextMonthlyBoundary, formatDurationMs });
export const cleanupReadyFarmingTimers = () => cleanupReadyFarmingTimersFeature({ load, save });
export const cleanupReadyCooldowns = () => cleanupReadyCooldownsFeature({ load, save });

const renderApp = createRenderAppRunner(renderAppCore, {
  load, save,
  getSectionState: (sectionKey) => getSectionState(sectionKey, load),
  getCustomTasks: () => getCustomTasks(load),
  saveCustomTasks: (tasks) => saveCustomTasks(tasks, save),
  getCooldowns: () => getCooldowns(load),
  getFarmingTimers: () => getFarmingTimers(load),
  cleanupReadyFarmingTimers: () => cleanupReadyFarmingTimersFeature({ load, save }),
  cleanupReadyCooldowns: () => cleanupReadyCooldownsFeature({ load, save }),
  hideTooltip: () => hideTooltip(document),
  getResolvedSections: () => getResolvedSections({ tasksConfig: TASKS_CONFIG, farmingConfig: FARMING_CONFIG, getCustomTasks: () => getCustomTasks(load), getPenguinWeeklyData: () => load('penguinWeeklyData', {}) }),
  getFarmingHeaderStatus: (task) => getFarmingHeaderStatus(task, { load }),
  hideTask: (sectionKey, taskId) => hideTask(sectionKey, taskId, { load, save }),
  setTaskCompleted: (sectionKey, taskId, complete) => setTaskCompleted(sectionKey, taskId, complete, { load, save }),
  clearFarmingTimer: (taskId) => clearFarmingTimer(taskId, { load, save }),
  startFarmingTimer: (task) => startFarmingTimer(task, { load, save }),
  startCooldown: (taskId, minutes) => startCooldown(taskId, minutes, { load, save }),
  isCollapsedBlock: (blockId) => isCollapsedBlock(blockId, load),
  setCollapsedBlock: (blockId, collapsed) => setCollapsedBlock(blockId, collapsed, load, save),
  fetchProfits,
  updateProfileHeaderBridge,
  updateProfileHeaderFeature: updateProfileHeader,
  maybeNotifyTaskAlert: (task, sectionKey) => maybeNotifyTaskAlert(task, sectionKey, { load, save, maybeBrowserNotify, maybeWebhookNotify }),
  bindSectionControls: (sectionKey, opts) => bindSectionControls(sectionKey, opts, { renderApp, getSectionState: (key) => getSectionState(key, load), saveSectionValue: (key, name, value) => saveSectionValue(key, name, value, save), resetSectionView: (key) => resetSectionView(key, { load, save, removeKey }) }),
  getPageMode,
  getOverviewPins: () => getOverviewPins(load)
});
export { renderApp };

export function setupSectionBindings() {
  ['custom', 'rs3farming', 'rs3daily', 'gathering', 'rs3weekly', 'rs3monthly'].forEach((sectionKey) => bindSectionControls(sectionKey, { sortable: true }, { renderApp, getSectionState: (key) => getSectionState(key, load), saveSectionValue: (key, name, value) => saveSectionValue(key, name, value, save), resetSectionView: (key) => resetSectionView(key, { load, save, removeKey }) }));
}

const controlEntries = setupFeatureControls({
  setupProfileControlBridge, setupProfileControlFeature, setupSettingsControlBridge, setupSettingsControlFeature,
  setupViewsControlBridge, setupViewsControlFeature, closeFloatingControlsBridge, closeFloatingControls,
  setupGlobalClickCloserBridge, setupImportExportFeature, setupProfileImportExport, setupCustomAddFeature,
  renderApp, getCustomTasks: () => getCustomTasks(load), saveCustomTasks: (tasks) => saveCustomTasks(tasks, save),
  documentRef: document, windowRef: window
});

export const setupProfileControl = () => controlEntries.setupProfile();
export const setupSettingsControl = () => controlEntries.setupSettings();
export const setupViewsControl = () => controlEntries.setupViews();
export const setupGlobalClickCloser = () => controlEntries.setupCloser();
export const setupImportExport = () => controlEntries.setupImportExport();
export const setupCustomAdd = () => controlEntries.setupCustomAdd();
export const initAppRoot = () => runAppInitialization({ initProfileContext, syncStoredViewModeToPageMode, applySettingsToDom, checkAutoReset, updateCountdowns, setupSectionBindings, controlEntries, renderApp });
export const startPenguinSync = () => syncPenguinWeeklyData({ load, save, renderApp });
