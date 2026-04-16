export const herbs = {
  id: 'herbs',
  label: 'Herbs',
  note: 'Main herb run timer with individual patch checklist rows.',
  timers: [
    {
      id: 'farm-herbs',
      name: 'Herb Run',
      wiki: 'https://runescape.wiki/w/Herb_patch',
      note: 'Primary herb timer. Uses your Speedy Growth upgrade setting automatically.',
      cycleMinutes: 20,
      stages: 4,
      durationNote: 'Growth: 80 min base / 60 min with Speedy Growth',
      useHerbSetting: true,
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'run'
    }
  ],
  plots: [
    { id: 'herb-falador', name: 'Falador', wiki: 'https://runescape.wiki/w/Herb_patch' },
    { id: 'herb-catherby', name: 'Catherby', wiki: 'https://runescape.wiki/w/Herb_patch' },
    { id: 'herb-ardougne', name: 'Ardougne', wiki: 'https://runescape.wiki/w/Herb_patch' },
    { id: 'herb-port-phasmatys', name: 'Port Phasmatys', wiki: 'https://runescape.wiki/w/Herb_patch' },
    { id: 'herb-troll-stronghold', name: 'Troll Stronghold', wiki: 'https://runescape.wiki/w/Herb_patch' },
    { id: 'herb-prifddinas', name: 'Prifddinas', wiki: 'https://runescape.wiki/w/Herb_patch' },
    { id: 'herb-wilderness', name: 'Wilderness', wiki: 'https://runescape.wiki/w/Herb_patch' },
    { id: 'herb-garden-of-kharid', name: 'Garden of Kharid', wiki: 'https://runescape.wiki/w/Herb_patch' }
  ]
};

export default herbs;
