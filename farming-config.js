// =============================================================================
// farming-config.js
// Farming timers configuration for RSDailies.
//
// This file is intended to be the only place you edit when adding/updating
// farming-related timers. App logic lives in dailyscape.js.
//
// Data notes:
// - Herb growth cycles: Herb patch page (80 minutes = 4x20m cycles; upgrades reduce cycles)
// - Allotment growth time example: Gardening training page (40 minutes = 4x10m cycles)
// - Mushroom patch: 240 minutes = 6x40m cycles
// - Fruit tree patches: 16 hours = 6x160m phases; higher level fruit trees ~13.5h = 5x160m phases
// =============================================================================
/* global window */

(function () {
  'use strict';

  window.FARMING_CONFIG = {
    timers: [
      {
        id: 'herbs',
        name: 'Herbs (growth)',
        cycleMinutes: 20,
        stages: 4,
        variants: [
          { id: 'standard', name: 'Standard (80m - 4x20)', stages: 4 },
          { id: 'speedy', name: 'Speedy Growth (60m - 3x20)', stages: 3 },
          { id: 'sunburst', name: 'Sunburst bracelet (40m - 2x20)', stages: 2 },
        ],
        sourceUrl: 'https://runescape.wiki/w/Herb_patch',
      },
      {
        id: 'allotments',
        name: 'Allotments (example)',
        cycleMinutes: 10,
        stages: 4,
        variants: [{ id: 'base', name: 'Typical (40m - 4x10)', stages: 4 }],
        sourceUrl: 'https://runescape.wiki/w/Gardening_training',
      },
      {
        id: 'hops',
        name: 'Hops (example)',
        cycleMinutes: 10,
        stages: 4,
        variants: [{ id: 'base', name: 'Typical (40m - 4x10)', stages: 4 }],
        sourceUrl: 'https://runescape.wiki/w/Hops',
      },
      {
        id: 'mushrooms',
        name: 'Mushrooms',
        cycleMinutes: 40,
        stages: 6,
        variants: [{ id: 'base', name: '240m - 6x40', stages: 6 }],
        sourceUrl: 'https://runescape.wiki/w/Mushroom_patch',
      },
      {
        id: 'fruit-trees-low',
        name: 'Fruit trees (apple to palm)',
        cycleMinutes: 160,
        stages: 6,
        variants: [{ id: 'base', name: '16h - 6x160', stages: 6 }],
        sourceUrl: 'https://runescape.wiki/w/Fruit_Tree_Patch',
      },
      {
        id: 'fruit-trees-high',
        name: 'Fruit trees (ciku+)',
        cycleMinutes: 160,
        stages: 5,
        variants: [{ id: 'base', name: '~13.5h - 5x160', stages: 5 }],
        sourceUrl: 'https://runescape.wiki/w/Fruit_Tree_Patch',
      },
    ],
  };
})();

