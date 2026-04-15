(function () {
  'use strict';

  function f(id, name, wiki, note, extra) {
    return Object.assign(
      {
        id,
        name,
        wiki,
        note
      },
      extra || {}
    );
  }

  window.FARMING_CONFIG = {
    tasks: [
      f(
        'farm-herbs',
        'Herbs',
        'https://runescape.wiki/w/Herb_patch',
        'Click the right column to start. Uses your herb setting (3-tick or 4-tick) and auto-clears when ready.',
        { cycleMinutes: 20, stages: 4, useHerbSetting: true, alertOnReady: true, autoClearOnReady: true }
      ),
      f(
        'farm-allotments',
        'Allotments',
        'https://runescape.wiki/w/Gardening_training',
        'Typical 40 minute example timer. Click the right column to start.',
        { cycleMinutes: 10, stages: 4, alertOnReady: true, autoClearOnReady: true }
      ),
      f(
        'farm-hops',
        'Hops',
        'https://runescape.wiki/w/Hops',
        'Typical 40 minute example timer. Click the right column to start.',
        { cycleMinutes: 10, stages: 4, alertOnReady: true, autoClearOnReady: true }
      ),
      f(
        'farm-bushes',
        'Bushes',
        'https://runescape.wiki/w/Bush_patch',
        'Longer farming timer. Click the right column to start.',
        { cycleMinutes: 20, stages: 4, alertOnReady: true, autoClearOnReady: true }
      ),
      f(
        'farm-cactus',
        'Cactus',
        'https://runescape.wiki/w/Cactus_patch',
        'Cactus patch reminder timer.',
        { cycleMinutes: 80, stages: 1, alertOnReady: true, autoClearOnReady: true }
      ),
      f(
        'farm-mushrooms',
        'Mushrooms',
        'https://runescape.wiki/w/Mushroom_patch',
        '240 minute example timer.',
        { cycleMinutes: 40, stages: 6, alertOnReady: true, autoClearOnReady: true }
      ),
      f(
        'farm-fruit-trees-low',
        'Fruit Trees (apple to palm)',
        'https://runescape.wiki/w/Fruit_Tree_Patch',
        'Standard fruit tree growth example.',
        { cycleMinutes: 160, stages: 6, alertOnReady: true, autoClearOnReady: true }
      ),
      f(
        'farm-fruit-trees-high',
        'Fruit Trees (ciku+)',
        'https://runescape.wiki/w/Fruit_Tree_Patch',
        'Higher tier fruit tree growth example.',
        { cycleMinutes: 160, stages: 5, alertOnReady: true, autoClearOnReady: true }
      ),
      f(
        'farm-trees',
        'Trees',
        'https://runescape.wiki/w/Tree_patch',
        'Long-form tree patch reminder.',
        { cycleMinutes: 40, stages: 8, alertOnReady: true, autoClearOnReady: true }
      )
    ]
  };
})();