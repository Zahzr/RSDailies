export function getTimerMinutes(task) {
  if (Number.isFinite(task?.growthMinutes)) return task.growthMinutes;
  if (Number.isFinite(task?.timerMinutes)) return task.timerMinutes;
  if (Number.isFinite(task?.cooldownMinutes)) return task.cooldownMinutes;

  const parsedGrowth = parseInt(task?.growthMinutes, 10);
  if (Number.isFinite(parsedGrowth) && parsedGrowth > 0) return parsedGrowth;

  const parsedTimer = parseInt(task?.timerMinutes, 10);
  if (Number.isFinite(parsedTimer) && parsedTimer > 0) return parsedTimer;

  const parsedCooldown = parseInt(task?.cooldownMinutes, 10);
  if (Number.isFinite(parsedCooldown) && parsedCooldown > 0) return parsedCooldown;

  const cycleMinutes = Number.isFinite(task?.cycleMinutes)
    ? task.cycleMinutes
    : parseInt(task?.cycleMinutes, 10);
  const stages = Number.isFinite(task?.stages)
    ? task.stages
    : parseInt(task?.stages, 10);

  if (Number.isFinite(cycleMinutes) && cycleMinutes > 0 && Number.isFinite(stages) && stages > 0) {
    return cycleMinutes * stages;
  }

  return 0;
}
