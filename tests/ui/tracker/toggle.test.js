import test from 'node:test';
import assert from 'node:assert/strict';

import { createToggleTaskHandler } from '../../../src/ui/components/tracker/rows/factory/toggle.js';

test('toggle handler starts cooldowns from cooldownMinutes', () => {
  let started = null;
  let completedCall = null;

  const toggle = createToggleTaskHandler('custom', 'custom-task-1', { cooldownMinutes: 45 }, {
    load: () => ({}),
    save: () => {},
    getTaskState: () => false,
    setTaskCompleted: (sectionKey, taskId, completed) => {
      completedCall = { sectionKey, taskId, completed };
    },
    clearTimer: () => {},
    startTimer: () => {},
    startCooldown: (taskId, minutes) => {
      started = { taskId, minutes };
    },
    renderApp: () => {},
  });

  toggle();

  assert.deepEqual(completedCall, {
    sectionKey: 'custom',
    taskId: 'custom-task-1',
    completed: true,
  });
  assert.deepEqual(started, {
    taskId: 'custom-task-1',
    minutes: 45,
  });
});
