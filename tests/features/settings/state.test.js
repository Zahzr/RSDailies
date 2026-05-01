import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeSettings } from '../../../src/features/settings/domain/state.js';

test('settings normalize hide completed tasks by default', () => {
  const settings = normalizeSettings({});

  assert.equal(settings.showCompletedTasks, false);
});

test('settings normalize preserves an explicit show completed preference', () => {
  const settings = normalizeSettings({ showCompletedTasks: true });

  assert.equal(settings.showCompletedTasks, true);
});
