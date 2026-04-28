import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getTrackerSection,
  getTrackerSectionIds,
  getTrackerViews,
  isTrackerPageMode,
  normalizeTrackerPageMode,
} from '../../../src/app/registries/unified-registry.js';

test('tracker registry exposes the expected section ids', () => {
  assert.deepEqual(getTrackerSectionIds(), [
    'custom',
    'rs3farming',
    'gathering',
    'rs3daily',
    'rs3weekly',
    'rs3monthly',
  ]);
});

test('tracker registry exposes section metadata', () => {
  const daily = getTrackerSection('rs3daily');
  assert.equal(daily.label, 'Dailies');
  assert.equal(daily.renderVariant, 'standard');
  assert.equal(daily.containerId, 'rs3daily-container');
});

test('tracker page mode normalization preserves current aliases', () => {
  assert.equal(isTrackerPageMode('gathering'), true);
  assert.equal(normalizeTrackerPageMode('daily'), 'rs3daily');
  assert.equal(normalizeTrackerPageMode('weeklies'), 'rs3weekly');
  assert.equal(normalizeTrackerPageMode('unknown'), 'all');
});

test('tracker views stay aligned with the canonical page modes', () => {
  const modes = getTrackerViews().map((view) => view.mode);
  assert.deepEqual(modes, [
    'overview',
    'all',
    'custom',
    'rs3farming',
    'rs3daily',
    'gathering',
    'rs3weekly',
    'rs3monthly',
  ]);
});
