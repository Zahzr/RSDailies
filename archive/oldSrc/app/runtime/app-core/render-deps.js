export function createRenderAppRunner(renderAppCore, deps) {
  const {
    load, save, getSectionState, getCustomTasks, saveCustomTasks, getCooldowns, getFarmingTimers,
    getResolvedSections, getFarmingHeaderStatus, hideTask, setTaskCompleted, clearFarmingTimer,
    startFarmingTimer, startCooldown, isCollapsedBlock, setCollapsedBlock, fetchProfits,
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
      cleanupReadyFarmingTimers: deps.cleanupReadyFarmingTimers,
      cleanupReadyCooldowns: deps.cleanupReadyCooldowns,
      hideTooltip: deps.hideTooltip,
      getTaskState: (sectionKey, taskId, task) => {
        const section = getSectionState(sectionKey);
        const hiddenRows = section.hiddenRows || {};
        const completed = section.completed || {};
        const cooldowns = getCooldowns();
        const farmingTimers = getFarmingTimers();
        if (hiddenRows[taskId]) return 'hide';
        if (task?.cooldownMinutes && cooldowns[taskId]?.readyAt > Date.now()) return 'running';
        if (sectionKey === 'rs3farming' && task?.isTimerParent) {
          const active = !!farmingTimers[task.id];
          if (!active) return 'idle';
          return farmingTimers[task.id]?.readyAt > Date.now() ? 'running' : 'ready';
        }
        return completed[taskId] ? 'true' : 'false';
      },
      getResolvedSections,
      getFarmingHeaderStatus,
      hideTask,
      setTaskCompleted,
      clearFarmingTimer,
      startFarmingTimer,
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
