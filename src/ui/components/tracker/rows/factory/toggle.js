export function createToggleTaskHandler(sectionKey, taskId, task, {
  load,
  save,
  getTaskState,
  setTaskCompleted,
  clearTimer,
  startTimer,
  startCooldown,
  renderApp
}) {
  return function toggleTask() {
    const state = getTaskState(sectionKey, taskId, task);
    const isCompleted = (state === 'true' || state === 'hide');
    const cooldownMinutes = Number.isFinite(task?.cooldownMinutes)
      ? task.cooldownMinutes
      : Number.isFinite(task?.cooldown)
        ? task.cooldown
        : parseInt(task?.cooldownMinutes ?? task?.cooldown, 10);

    if (isCompleted) {
      setTaskCompleted(sectionKey, taskId, false, { load, save });
    } else {
      setTaskCompleted(sectionKey, taskId, true, { load, save });

      if (sectionKey === 'timers') {
        clearTimer(taskId, { load, save });
        startTimer(task, { load, save });
      }

      if (Number.isFinite(cooldownMinutes) && cooldownMinutes > 0) {
        startCooldown(taskId, cooldownMinutes, { load, save });
      }
    }

    renderApp();
  };
}
