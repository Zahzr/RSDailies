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
    const cooldownMinutes = Number.isFinite(task?.cooldownMinutes)
      ? task.cooldownMinutes
      : Number.isFinite(task?.cooldown)
        ? task.cooldown
        : parseInt(task?.cooldownMinutes ?? task?.cooldown, 10);

    if (isCompleted) {
      setTaskCompleted(sectionKey, taskId, false, { load, save });
    } else {
      setTaskCompleted(sectionKey, taskId, true, { load, save });

      if (sectionKey === 'rs3farming') {
        clearFarmingTimer(taskId, { load, save });
        startFarmingTimer(taskId, task, { load, save });
      }

      if (Number.isFinite(cooldownMinutes) && cooldownMinutes > 0) {
        startCooldown(taskId, cooldownMinutes, { load, save });
      }
    }

    renderApp();
  };
}
