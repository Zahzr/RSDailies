export function createToggleTaskHandler(sectionKey, taskId, task, {
  load,
  save,
  getTaskState,
  setTaskCompleted,
  clearFarmingTimer,
  startFarmingTimer,
  startCooldown,
  renderApp
}) {
  return function toggleTask() {
    const isCompleted = getTaskState(sectionKey, taskId, task);

    if (isCompleted) {
      setTaskCompleted(sectionKey, taskId, false, { load, save });
    } else {
      setTaskCompleted(sectionKey, taskId, true, { load, save });

      if (sectionKey === 'rs3farming') {
        clearFarmingTimer(taskId, { load, save });
        startFarmingTimer(taskId, task, { load, save });
      }

      if (task?.cooldown) {
        startCooldown(taskId, task.cooldown, { load, save });
      }
    }

    renderApp();
  };
}