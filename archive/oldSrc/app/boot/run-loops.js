export function startAppLoops({
    updateCountdowns,
    checkAutoReset,
    cleanupReadyFarmingTimers,
    cleanupReadyCooldowns,
    startPenguinSync,
    renderApp,
    intervalRef = window.setInterval,
  }) {
    const countdownLoopId = intervalRef(updateCountdowns, 1000);
  
    const maintenanceLoopId = intervalRef(() => {
      const resetChanged = checkAutoReset();
      const farmingChanged = cleanupReadyFarmingTimers();
      const cooldownChanged = cleanupReadyCooldowns();
  
      if (resetChanged || farmingChanged || cooldownChanged) {
        renderApp();
      }
    }, 1000);

    const penguinLoopId = intervalRef(() => {
      startPenguinSync?.();
    }, 15 * 60 * 1000);
  
    return {
      countdownLoopId,
      maintenanceLoopId,
      penguinLoopId,
    };
  }
