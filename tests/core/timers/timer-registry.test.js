import test from 'node:test';
import assert from 'node:assert/strict';

import { getAllTimerDefinitions, getTimerDefinition, getTimerDefinitionsByCategory, hasTimerDefinition } from '../../../src/core/timers/timer-registry.js';

test('timer registry exposes farming timers', () => {
  const timers = getAllTimerDefinitions();
  assert.ok(timers.length > 0);
  assert.equal(hasTimerDefinition('farm-herbs'), true);
});

test('timer registry returns timer metadata for known ids', () => {
  const herbTimer = getTimerDefinition('farm-herbs');
  assert.ok(herbTimer);
  assert.equal(herbTimer.groupId, 'herbs');
  assert.equal(herbTimer.category, 'farming');
  assert.equal(herbTimer.game, 'rs3');
});

test('timer registry groups timers by category', () => {
  const farmingTimers = getTimerDefinitionsByCategory('farming');
  assert.ok(farmingTimers.some((timer) => timer.id === 'farm-herbs'));
});
