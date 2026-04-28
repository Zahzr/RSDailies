import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getContentSectionDefinition,
  getContentSectionTaskIds,
  getContentSectionTaskIdsByCadence,
} from '../../../../src/core/domain/content/content-selectors.js';
import rs3AllTasksPage from '../../../../src/content/games/rs3/pages/all.page.js';
import rs3GatheringPage from '../../../../src/content/games/rs3/pages/gathering.page.js';
import rs3WeeklyPage from '../../../../src/content/games/rs3/pages/weekly.page.js';

const pages = [rs3AllTasksPage, rs3GatheringPage, rs3WeeklyPage];

test('content selectors resolve canonical section definitions', () => {
  const section = getContentSectionDefinition('rs3weekly', { pages });
  assert.equal(section?.id, 'rs3weekly');
  assert.equal(section?.renderVariant, 'parent-children');
});

test('content selectors flatten section task ids including weekly children', () => {
  const ids = getContentSectionTaskIds('rs3weekly', { pages });

  assert.ok(ids.includes('penguins'));
  assert.ok(ids.includes('penguin-1'));
  assert.ok(ids.includes('penguin-polar-bear'));
});

test('content selectors filter gathering tasks by cadence', () => {
  const dailyIds = getContentSectionTaskIdsByCadence('gathering', 'daily', { pages });
  const weeklyIds = getContentSectionTaskIdsByCadence('gathering', 'weekly', { pages });

  assert.ok(dailyIds.includes('bloodwood-tree'));
  assert.ok(!dailyIds.includes('feather-shop-run'));
  assert.ok(weeklyIds.includes('feather-shop-run'));
});
