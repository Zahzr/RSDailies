import { getAllTimerDefinitions } from '../../src/core/timers/timer-registry.js';

const failures = [];
const seen = new Set();

for (const timer of getAllTimerDefinitions()) {
  if (!timer?.id || typeof timer.id !== 'string') {
    failures.push('Timer missing string id.');
    continue;
  }

  if (seen.has(timer.id)) {
    failures.push(`Duplicate timer id: ${timer.id}`);
  }
  seen.add(timer.id);

  if (!timer.name || typeof timer.name !== 'string') {
    failures.push(`Timer "${timer.id}" missing name.`);
  }

  if (timer.cycleMinutes != null && (!Number.isFinite(timer.cycleMinutes) || timer.cycleMinutes <= 0)) {
    failures.push(`Timer "${timer.id}" has invalid cycleMinutes.`);
  }

  if (timer.groupId == null || typeof timer.groupId !== 'string') {
    failures.push(`Timer "${timer.id}" missing groupId.`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Timer audit passed for ${getAllTimerDefinitions().length} timer definitions.`);
