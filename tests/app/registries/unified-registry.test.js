import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getDefaultTrackerPageMode,
  getTrackerPrimaryNavItems,
  getTrackerSection,
  getTrackerSectionIds,
  getTrackerViews,
  isTrackerPageMode,
  normalizeTrackerPageMode,
} from '../../../src/app/registries/unified-registry.js';

test('tracker registry exposes the expected global section ids and game-specific subsets', () => {
  assert.deepEqual(getTrackerSectionIds(), [
    'custom',
    'timers',
    'gathering',
    'rs3daily',
    'rs3weekly',
    'rs3monthly',
    'osrsdaily',
    'osrsweekly',
    'osrsmonthly',
  ]);

  assert.deepEqual(getTrackerSectionIds('osrs'), ['osrsdaily', 'osrsweekly', 'osrsmonthly']);
});

test('tracker registry exposes section metadata', () => {
  const daily = getTrackerSection('rs3daily');
  assert.equal(daily.label, 'Dailies');
  assert.equal(daily.renderVariant, 'standard');
  assert.equal(daily.containerId, 'rs3daily-container');
});

test('tracker page mode normalization is game-aware', () => {
  assert.equal(isTrackerPageMode('gathering', 'rs3'), true);
  assert.equal(normalizeTrackerPageMode('daily', 'all', 'rs3'), 'rs3daily');
  assert.equal(normalizeTrackerPageMode('weeklies', 'all', 'rs3'), 'rs3weekly');
  assert.equal(normalizeTrackerPageMode('rs3farming', 'all', 'rs3'), 'timers');
  assert.equal(normalizeTrackerPageMode('daily', 'osrsall', 'osrs'), 'osrsdaily');
  assert.equal(normalizeTrackerPageMode('weeklies', 'osrsall', 'osrs'), 'osrsweekly');
  assert.equal(normalizeTrackerPageMode('unknown', null, 'osrs'), 'osrsall');
  assert.equal(getDefaultTrackerPageMode('osrs'), 'osrsall');
});

test('tracker views stay aligned with the canonical page modes per game', () => {
  const rs3Modes = getTrackerViews('rs3').map((view) => view.mode);
  assert.deepEqual(rs3Modes, [
    'overview',
    'all',
    'custom',
    'timers',
    'rs3daily',
    'gathering',
    'rs3weekly',
    'rs3monthly',
  ]);

  const osrsModes = getTrackerViews('osrs').map((view) => view.mode);
  assert.deepEqual(osrsModes, [
    'osrs-overview',
    'osrsall',
    'osrsdaily',
    'osrsweekly',
    'osrsmonthly',
  ]);

  assert.deepEqual(getTrackerPrimaryNavItems('osrs'), [{ type: 'link', mode: 'osrsall', label: 'Tasks' }]);
});

test('tracker primary nav exposes timers as a dropdown platform', () => {
  assert.deepEqual(getTrackerPrimaryNavItems('rs3'), [
    { type: 'link', mode: 'all', label: 'Tasks' },
    { type: 'dropdown', label: 'Timers', items: [{ mode: 'timers', label: 'Farming' }] },
    { type: 'link', mode: 'gathering', label: 'Gathering' },
  ]);
});
