export function startAppLoops({
    updateCountdowns,
    checkAutoReset,
    cleanupReadyTimers,
    cleanupReadyCooldowns,
    startPenguinSync,
    renderApp,
    intervalRef = window.setInterval,
  }) {
    const countdownLoopId = intervalRef(updateCountdowns, 1000);
  
    const maintenanceLoopId = intervalRef(() => {
      const resetChanged = checkAutoReset();
      const timerChanged = cleanupReadyTimers();
      const cooldownChanged = cleanupReadyCooldowns();
  
      if (resetChanged || timerChanged || cooldownChanged) {
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
