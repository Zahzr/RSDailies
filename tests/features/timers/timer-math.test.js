import test from 'node:test';
import assert from 'node:assert/strict';

import { getTimerMinutes } from '../../../src/features/timers/domain/timer-math.js';

test('timer math preserves base farming duration without speedy growth', () => {
  assert.equal(
    getTimerMinutes(
      { timerCategory: 'farming', useHerbSetting: true, cycleMinutes: 20, stages: 4 },
      { herbTicks: 4, growthOffsetMinutes: 0 }
    ),
    80
  );
});

test('timer math applies speedy growth for farming timers', () => {
  assert.equal(
    getTimerMinutes(
      { timerCategory: 'farming', useHerbSetting: true, cycleMinutes: 20, stages: 4 },
      { herbTicks: 3, growthOffsetMinutes: 20 }
    ),
    60
  );
});
