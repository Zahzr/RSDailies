(function () {
  'use strict';

  function row(id, name, wiki, note, extra) {
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

  function plot(id, name, wiki, extra) {
    return Object.assign(
      {
        id,
        name,
        wiki
      },
      extra || {}
    );
  }

  window.FARMING_CONFIG = {
    groups: [
      {
        id: 'herbs',
        label: 'Herbs',
        note: 'Main herb run timers and herb patch plot checklist rows.',
        timers: [
          row(
            'farm-herbs-standard',
            'Herb Run',
            'https://runescape.wiki/w/Herb_patch',
            'Main herb timer. Uses your herb setting automatically.',
            {
              category: 'herbs',
              cycleMinutes: 20,
              stages: 4,
              useHerbSetting: true,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'run'
            }
          )
        ],
        plots: [
          plot('herb-falador', 'Falador', 'https://runescape.wiki/w/Herb_patch'),
          plot('herb-catherby', 'Catherby', 'https://runescape.wiki/w/Herb_patch'),
          plot('herb-ardougne', 'Ardougne', 'https://runescape.wiki/w/Herb_patch'),
          plot('herb-port-phasmatys', 'Port Phasmatys', 'https://runescape.wiki/w/Herb_patch'),
          plot('herb-troll-stronghold', 'Troll Stronghold', 'https://runescape.wiki/w/Herb_patch'),
          plot('herb-prifddinas', 'Prifddinas', 'https://runescape.wiki/w/Herb_patch'),
          plot('herb-wilderness', 'Wilderness', 'https://runescape.wiki/w/Herb_patch'),
          plot('herb-garden-of-kharid', 'Garden of Kharid', 'https://runescape.wiki/w/Herb_patch')
        ]
      },

      {
        id: 'allotments',
        label: 'Allotments',
        note: 'Allotment-related timers and plot checklist rows.',
        timers: [
          row(
            'farm-allotments',
            'Allotment Run',
            'https://runescape.wiki/w/Allotment_patch',
            'Typical allotment growth timer.',
            {
              category: 'allotments',
              cycleMinutes: 10,
              stages: 4,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'run'
            }
          )
        ],
        plots: [
          plot('allotment-falador', 'Falador', 'https://runescape.wiki/w/Allotment_patch'),
          plot('allotment-catherby', 'Catherby', 'https://runescape.wiki/w/Allotment_patch'),
          plot('allotment-ardougne', 'Ardougne', 'https://runescape.wiki/w/Allotment_patch'),
          plot('allotment-port-phasmatys', 'Port Phasmatys', 'https://runescape.wiki/w/Allotment_patch')
        ]
      },

      {
        id: 'hops',
        label: 'Hops',
        note: 'Hops timer and hop patch checklist rows.',
        timers: [
          row(
            'farm-hops',
            'Hops Run',
            'https://runescape.wiki/w/Hops_patch',
            'Typical hops growth timer.',
            {
              category: 'hops',
              cycleMinutes: 10,
              stages: 4,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'run'
            }
          )
        ],
        plots: [
          plot('hops-yanille', 'Yanille', 'https://runescape.wiki/w/Hops_patch'),
          plot('hops-lumbridge', 'Lumbridge', 'https://runescape.wiki/w/Hops_patch'),
          plot('hops-seers', 'Seers\' Village', 'https://runescape.wiki/w/Hops_patch'),
          plot('hops-entrana', 'Entrana', 'https://runescape.wiki/w/Hops_patch')
        ]
      },

      {
        id: 'trees',
        label: 'Trees',
        note: 'Tree and fruit tree timers.',
        timers: [
          row(
            'farm-regular-trees',
            'Regular Trees',
            'https://runescape.wiki/w/Tree_patch',
            'Tree patch growth timer.',
            {
              category: 'trees',
              cycleMinutes: 40,
              stages: 8,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          ),
          row(
            'farm-fruit-trees-standard',
            'Fruit Trees (standard)',
            'https://runescape.wiki/w/Fruit_Tree_Patch',
            'Standard fruit tree growth timer.',
            {
              category: 'trees',
              cycleMinutes: 160,
              stages: 6,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          ),
          row(
            'farm-fruit-trees-high',
            'Fruit Trees (higher tier)',
            'https://runescape.wiki/w/Fruit_Tree_Patch',
            'Higher-tier fruit tree growth timer.',
            {
              category: 'trees',
              cycleMinutes: 160,
              stages: 5,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          ),
          row(
            'farm-spirit-tree',
            'Spirit Tree',
            'https://runescape.wiki/w/Spirit_tree_patch',
            'Spirit tree growth timer.',
            {
              category: 'trees',
              cycleMinutes: 40,
              stages: 8,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          ),
          row(
            'farm-calquat',
            'Calquat',
            'https://runescape.wiki/w/Calquat_patch',
            'Calquat growth reminder.',
            {
              category: 'trees',
              cycleMinutes: 160,
              stages: 6,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          ),
          row(
            'farm-elder-tree',
            'Elder Tree',
            'https://runescape.wiki/w/Elder_tree_patch',
            'Long elder tree growth reminder.',
            {
              category: 'trees',
              cycleMinutes: 320,
              stages: 7,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          )
        ]
      },

      {
        id: 'specialty',
        label: 'Specialty',
        note: 'Special farming patches and harvest reminders.',
        timers: [
          row(
            'farm-bushes',
            'Bushes',
            'https://runescape.wiki/w/Bush_patch',
            'Bush patch timer.',
            {
              category: 'specialty',
              cycleMinutes: 20,
              stages: 4,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          ),
          row(
            'farm-cactus',
            'Cactus',
            'https://runescape.wiki/w/Cactus_patch',
            'Cactus patch reminder timer.',
            {
              category: 'specialty',
              cycleMinutes: 80,
              stages: 1,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'harvest'
            }
          ),
          row(
            'farm-potato-cactus-pick',
            'Potato Cactus Pick',
            'https://runescape.wiki/w/Potato_cactus',
            'Re-check reminder for cactus harvest.',
            {
              category: 'specialty',
              cycleMinutes: 80,
              stages: 1,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'harvest'
            }
          ),
          row(
            'farm-poison-ivy-berries',
            'Poison Ivy Berries',
            'https://runescape.wiki/w/Poison_ivy_berries',
            'Re-harvest reminder for poison ivy berries.',
            {
              category: 'specialty',
              cycleMinutes: 80,
              stages: 1,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'harvest'
            }
          ),
          row(
            'farm-mushrooms',
            'Mushrooms',
            'https://runescape.wiki/w/Mushroom_patch',
            'Mushroom patch timer.',
            {
              category: 'specialty',
              cycleMinutes: 40,
              stages: 6,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          ),
          row(
            'farm-belladonna',
            'Belladonna',
            'https://runescape.wiki/w/Belladonna_patch',
            'Belladonna patch timer.',
            {
              category: 'specialty',
              cycleMinutes: 20,
              stages: 4,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          ),
          row(
            'farm-celastrus',
            'Celastrus',
            'https://runescape.wiki/w/Celastrus_patch',
            'Celastrus patch growth reminder.',
            {
              category: 'specialty',
              cycleMinutes: 80,
              stages: 6,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          ),
          row(
            'farm-redwood',
            'Redwood',
            'https://runescape.wiki/w/Redwood_tree_patch',
            'Redwood growth reminder.',
            {
              category: 'specialty',
              cycleMinutes: 320,
              stages: 7,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          ),
          row(
            'farm-crystal-tree',
            'Crystal Tree',
            'https://runescape.wiki/w/Crystal_tree',
            'Crystal tree re-check reminder.',
            {
              category: 'specialty',
              cycleMinutes: 240,
              stages: 1,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'harvest'
            }
          ),
          row(
            'farm-anima-patch',
            'Anima Patch',
            'https://runescape.wiki/w/Anima_patch',
            'Anima patch timer.',
            {
              category: 'specialty',
              cycleMinutes: 20,
              stages: 4,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          ),
          row(
            'farm-bloodweed',
            'Bloodweed',
            'https://runescape.wiki/w/Bloodweed_patch',
            'Bloodweed patch timer.',
            {
              category: 'specialty',
              cycleMinutes: 20,
              stages: 4,
              alertOnReady: true,
              autoClearOnReady: false,
              vanishOnStart: true,
              timerKind: 'growth'
            }
          )
        ]
      }
    ]
  };

  window.FARMING_CONFIG.tasks = window.FARMING_CONFIG.groups.flatMap(group => {
    const timerRows = (group.timers || []).map(task => ({
      ...task,
      groupId: group.id,
      groupLabel: group.label,
      rowType: 'timer'
    }));

    const plotRows = (group.plots || []).map(task => ({
      ...task,
      groupId: group.id,
      groupLabel: group.label,
      rowType: 'plot',
      reset: 'daily',
      alertDaysBeforeReset: 0
    }));

    return [...timerRows, ...plotRows];
  });
})();