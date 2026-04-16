export const specialty = {
  id: 'specialty',
  label: 'Specialty',
  note: 'Specialty farming timers with compact location checklists.',
  timers: [
    {
      id: 'farm-bushes',
      name: 'Bushes',
      wiki: 'https://runescape.wiki/w/Bush_patch',
      note: 'Bush patch timer.',
      cycleMinutes: 20,
      stages: 4,
      durationNote: 'Growth: 80 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'growth',
      plots: [
        { id: 'bush-rimmington', name: 'Rimmington', wiki: 'https://runescape.wiki/w/Bush_patch' },
        { id: 'bush-ardougne', name: 'Ardougne', wiki: 'https://runescape.wiki/w/Bush_patch' },
        { id: 'bush-etceteria', name: 'Etceteria', wiki: 'https://runescape.wiki/w/Bush_patch' },
        { id: 'bush-farming-guild', name: 'Farming Guild / Manor Farm area', wiki: 'https://runescape.wiki/w/Bush_patch' }
      ]
    },
    {
      id: 'farm-cactus',
      name: 'Cactus',
      wiki: 'https://runescape.wiki/w/Cactus_patch',
      note: 'Cactus patch reminder timer.',
      cycleMinutes: 80,
      stages: 1,
      durationNote: 'Growth: 80 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'harvest',
      plots: [
        { id: 'cactus-al-kharid', name: 'Al Kharid', wiki: 'https://runescape.wiki/w/Cactus_patch' },
        { id: 'cactus-menaphos', name: 'Menaphos', wiki: 'https://runescape.wiki/w/Cactus_patch' }
      ]
    },
    {
      id: 'farm-mushrooms',
      name: 'Mushrooms',
      wiki: 'https://runescape.wiki/w/Mushroom_patch',
      note: 'Mushroom patch timer.',
      cycleMinutes: 40,
      stages: 6,
      durationNote: 'Growth: 240 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'growth',
      plots: [{ id: 'mushroom-canifis', name: 'Canifis', wiki: 'https://runescape.wiki/w/Mushroom_patch' }]
    },
    {
      id: 'farm-belladonna',
      name: 'Belladonna',
      wiki: 'https://runescape.wiki/w/Belladonna_patch',
      note: 'Belladonna patch timer.',
      cycleMinutes: 20,
      stages: 4,
      durationNote: 'Growth: 80 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'growth',
      plots: [{ id: 'belladonna-draynor', name: 'Draynor Manor', wiki: 'https://runescape.wiki/w/Belladonna_patch' }]
    },
    {
      id: 'farm-celastrus',
      name: 'Celastrus',
      wiki: 'https://runescape.wiki/w/Celastrus_patch',
      note: 'Celastrus patch growth reminder.',
      cycleMinutes: 80,
      stages: 6,
      durationNote: 'Growth: 480 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'growth',
      plots: [{ id: 'celastrus-anachronia', name: 'Anachronia', wiki: 'https://runescape.wiki/w/Celastrus_patch' }]
    },
    {
      id: 'farm-redwood',
      name: 'Redwood',
      wiki: 'https://runescape.wiki/w/Redwood_tree_patch',
      note: 'Redwood growth reminder.',
      cycleMinutes: 320,
      stages: 7,
      durationNote: 'Growth: 2240 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'growth',
      plots: [{ id: 'redwood-farming-guild', name: 'Farming Guild / Manor Farm area', wiki: 'https://runescape.wiki/w/Redwood_tree_patch' }]
    },
    {
      id: 'farm-crystal-tree',
      name: 'Crystal Tree',
      wiki: 'https://runescape.wiki/w/Crystal_tree',
      note: 'Crystal tree re-check reminder.',
      cycleMinutes: 240,
      stages: 1,
      durationNote: 'Growth: 240 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'harvest',
      plots: [{ id: 'crystal-prifddinas', name: 'Prifddinas', wiki: 'https://runescape.wiki/w/Crystal_tree' }]
    },
    {
      id: 'farm-anima-patch',
      name: 'Anima Patch',
      wiki: 'https://runescape.wiki/w/Anima_patch',
      note: 'Anima patch timer.',
      cycleMinutes: 20,
      stages: 4,
      durationNote: 'Growth: 80 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'growth',
      plots: [{ id: 'anima-anachronia', name: 'Anachronia', wiki: 'https://runescape.wiki/w/Anima_patch' }]
    },
    {
      id: 'farm-bloodweed',
      name: 'Bloodweed',
      wiki: 'https://runescape.wiki/w/Bloodweed_patch',
      note: 'Bloodweed patch timer.',
      cycleMinutes: 20,
      stages: 4,
      durationNote: 'Growth: 80 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'growth',
      plots: [{ id: 'bloodweed-wilderness', name: 'Wilderness', wiki: 'https://runescape.wiki/w/Bloodweed_patch' }]
    }
  ],
  plots: []
};

export default specialty;
