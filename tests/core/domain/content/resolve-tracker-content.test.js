import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveTrackerPage, resolveTrackerSections } from '../../../../src/core/domain/content/resolve-tracker-content.js';

const pages = [
  {
    id: 'all',
    title: 'Tasks',
    game: 'rs3',
    layout: 'tracker',
    sections: [
      {
        id: 'rs3daily',
        label: 'Dailies',
        renderVariant: 'standard',
        items: [{ id: 'daily-challenge', name: 'Daily Challenge' }],
      },
      {
        id: 'rs3weekly',
        label: 'Weeklies',
        renderVariant: 'parent-children',
        items: [
          {
            id: 'penguins',
            name: 'Penguins',
            childRows: [{ id: 'penguin-1', name: 'Penguin 1', note: 'Original note' }],
          },
        ],
      },
    ],
  },
  {
    id: 'custom',
    title: 'Custom Tasks',
    game: 'rs3',
    layout: 'tracker',
    sections: [
      {
        id: 'custom',
        label: 'Custom Tasks',
        renderVariant: 'standard',
        items: [],
      },
    ],
  },
  {
    id: 'timers',
    title: 'Timers',
    game: 'rs3',
    layout: 'tracker',
    sections: [
      {
        id: 'timers',
        label: 'Timers',
        renderVariant: 'timer-groups',
        groups: [
          {
            id: 'herbs',
            label: 'Herbs',
            timers: [{ id: 'farm-herbs', name: 'Herb Run' }],
            plots: [{ id: 'herb-falador', name: 'Falador' }],
          },
        ],
      },
    ],
  },
];

test('content resolver hydrates custom, weekly, and timer sections', () => {
  const sections = resolveTrackerSections({
    pages,
    getCustomTasks: () => [{ id: 'custom-1', name: 'Custom Task' }],
    getPenguinWeeklyData: () => ({ 'penguin-1': { name: 'Ice Mountain', note: 'Updated note' } }),
  });

  assert.deepEqual(sections.custom, [{ id: 'custom-1', name: 'Custom Task' }]);
  assert.equal(sections.rs3weekly[0].children[0].name, 'Ice Mountain');
  assert.equal(sections.timers[0].subgroups[0].timerTask.id, 'farm-herbs');
});

test('content resolver preserves page section order and resolves page-local items', () => {
  const page = resolveTrackerPage('all', {
    pages,
    getCustomTasks: () => [],
    getPenguinWeeklyData: () => ({ 'penguin-1': { name: 'Varrock', note: 'Weekly route' } }),
  });

  assert.deepEqual(page.sections.map((section) => section.id), ['rs3daily', 'rs3weekly']);
  assert.equal(page.sections[1].resolvedItems[0].children[0].name, 'Varrock');
});

test('content resolver supports blank OSRS workspace sections', () => {
  const osrsPages = [
    {
      id: 'osrsall',
      title: 'Tasks',
      game: 'osrs',
      layout: 'tracker',
      sections: [
        { id: 'osrsdaily', label: 'Dailies', displayOrder: 1, renderVariant: 'standard', items: [] },
        { id: 'osrsweekly', label: 'Weeklies', displayOrder: 2, renderVariant: 'standard', items: [] },
        { id: 'osrsmonthly', label: 'Monthlies', displayOrder: 3, renderVariant: 'standard', items: [] },
      ],
    },
  ];

  const sections = resolveTrackerSections({ pages: osrsPages, game: 'osrs' });
  const page = resolveTrackerPage('osrsall', { pages: osrsPages });

  assert.deepEqual(Object.keys(sections), ['osrsdaily', 'osrsweekly', 'osrsmonthly']);
  assert.deepEqual(page.sections.map((section) => section.id), ['osrsdaily', 'osrsweekly', 'osrsmonthly']);
  assert.deepEqual(page.sections.map((section) => section.resolvedItems), [[], [], []]);
});
