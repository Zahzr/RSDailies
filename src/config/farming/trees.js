export const trees = {
  id: 'trees',
  label: 'Trees',
  note: 'Tree timers broken into compact child groups.',
  timers: [
    {
      id: 'farm-regular-trees',
      name: 'Regular Trees',
      wiki: 'https://runescape.wiki/w/Tree_patch',
      note: 'Regular tree growth timer.',
      cycleMinutes: 40,
      stages: 8,
      durationNote: 'Growth: 320 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'growth',
      plots: [
        { id: 'tree-lumbridge', name: 'Lumbridge', wiki: 'https://runescape.wiki/w/Tree_patch' },
        { id: 'tree-falador', name: 'Falador', wiki: 'https://runescape.wiki/w/Tree_patch' },
        { id: 'tree-taverley', name: 'Taverley', wiki: 'https://runescape.wiki/w/Tree_patch' },
        { id: 'tree-varrock', name: 'Varrock', wiki: 'https://runescape.wiki/w/Tree_patch' },
        { id: 'tree-gnome-stronghold', name: 'Gnome Stronghold', wiki: 'https://runescape.wiki/w/Tree_patch' }
      ]
    },
    {
      id: 'farm-fruit-trees',
      name: 'Fruit Trees',
      wiki: 'https://runescape.wiki/w/Fruit_Tree_Patch',
      note: 'Fruit tree growth timer.',
      cycleMinutes: 160,
      stages: 6,
      durationNote: 'Growth: 960 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'growth',
      plots: [
        { id: 'fruit-gnome-stronghold', name: 'Gnome Stronghold', wiki: 'https://runescape.wiki/w/Fruit_Tree_Patch' },
        { id: 'fruit-gnome-village', name: 'Tree Gnome Village', wiki: 'https://runescape.wiki/w/Fruit_Tree_Patch' },
        { id: 'fruit-catherby', name: 'Catherby', wiki: 'https://runescape.wiki/w/Fruit_Tree_Patch' },
        { id: 'fruit-herblore-habitat', name: 'Herblore Habitat', wiki: 'https://runescape.wiki/w/Fruit_Tree_Patch' },
        { id: 'fruit-lletya', name: 'Lletya', wiki: 'https://runescape.wiki/w/Fruit_Tree_Patch' },
        { id: 'fruit-meilyr', name: 'Meilyr', wiki: 'https://runescape.wiki/w/Fruit_Tree_Patch' }
      ]
    },
    {
      id: 'farm-spirit-tree',
      name: 'Spirit Tree',
      wiki: 'https://runescape.wiki/w/Spirit_tree_patch',
      note: 'Spirit tree growth timer.',
      cycleMinutes: 40,
      stages: 8,
      durationNote: 'Growth: 320 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'growth',
      plots: [
        { id: 'spirit-port-sarim', name: 'Port Sarim', wiki: 'https://runescape.wiki/w/Spirit_tree_patch' },
        { id: 'spirit-etceteria', name: 'Etceteria', wiki: 'https://runescape.wiki/w/Spirit_tree_patch' },
        { id: 'spirit-brimhaven', name: 'Brimhaven', wiki: 'https://runescape.wiki/w/Spirit_tree_patch' },
        { id: 'spirit-miscellania', name: 'Miscellania', wiki: 'https://runescape.wiki/w/Spirit_tree_patch' }
      ]
    },
    {
      id: 'farm-calquat',
      name: 'Calquat',
      wiki: 'https://runescape.wiki/w/Calquat_patch',
      note: 'Calquat growth reminder.',
      cycleMinutes: 160,
      stages: 6,
      durationNote: 'Growth: 960 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'growth',
      plots: [{ id: 'calquat-brimhaven', name: 'Brimhaven', wiki: 'https://runescape.wiki/w/Calquat_patch' }]
    },
    {
      id: 'farm-elder-tree',
      name: 'Elder Tree',
      wiki: 'https://runescape.wiki/w/Elder_tree_patch',
      note: 'Long elder tree growth reminder.',
      cycleMinutes: 320,
      stages: 7,
      durationNote: 'Growth: 2240 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'growth',
      plots: [
        { id: 'elder-gnome-stronghold', name: 'Gnome Stronghold', wiki: 'https://runescape.wiki/w/Elder_tree_patch' },
        { id: 'elder-falador', name: 'Falador', wiki: 'https://runescape.wiki/w/Elder_tree_patch' }
      ]
    }
  ],
  plots: []
};

export default trees;
