import { getSettings } from '../../../features/settings/domain/state.js';
import { TIMER_SECTION_KEY } from '../../../features/timers/domain/timers.js';

export function createRenderAppRunner(renderAppCore, deps) {
  const {
    load, save, getSectionState, getCustomTasks, saveCustomTasks, getCooldowns, getTimers,
    getResolvedSections, getTimerHeaderStatus, hideTask, setTaskCompleted, clearTimer,
    startTimer, startCooldown, isCollapsedBlock, setCollapsedBlock, fetchProfits,
    updateProfileHeaderBridge, updateProfileHeaderFeature, maybeNotifyTaskAlert, bindSectionControls,
    resetSectionView, getPageMode, getOverviewPins
  } = deps;

  function renderApp() {
    renderAppCore({
      load,
      save,
      getSectionState: (sectionKey) => getSectionState(sectionKey),
      getCustomTasks,
      saveCustomTasks,
      cleanupReadyTimers: deps.cleanupReadyTimers,
      cleanupReadyCooldowns: deps.cleanupReadyCooldowns,
      hideTooltip: deps.hideTooltip,
      getTaskState: (sectionKey, taskId, task) => {
        const section = getSectionState(sectionKey);
        const hiddenRows = section.hiddenRows || {};
        const completed = section.completed || {};
        const cooldowns = getCooldowns();
        const timers = getTimers();
        const settings = getSettings();

        if (hiddenRows[taskId]) return 'hide';
        if (task?.cooldownMinutes && cooldowns[taskId]?.readyAt > Date.now()) return 'running';
        if (sectionKey === TIMER_SECTION_KEY && task?.isTimerParent) {
          const active = !!timers[task.id];
          if (!active) return 'idle';
          return timers[task.id]?.readyAt > Date.now() ? 'running' : 'ready';
        }

        const isCompleted = !!completed[taskId];
        if (isCompleted && !settings.showCompletedTasks) return 'hide';
        return isCompleted ? 'true' : 'false';
      },
      getResolvedSections,
      getTimerHeaderStatus,
      hideTask,
      setTaskCompleted,
      clearTimer,
      startTimer,
      startCooldown,
      isCollapsedBlock,
      setCollapsedBlock,
      fetchProfits,
      updateProfileHeader: () => updateProfileHeaderBridge({ updateProfileHeaderFeature, documentRef: document }),
      maybeNotifyTaskAlert,
      bindSectionControls,
      getPageMode,
      getOverviewPins
    });
  }

  return renderApp;
}
