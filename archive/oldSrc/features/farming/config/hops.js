export const hops = {
  id: 'hops',
  label: 'Hops',
  note: 'Hop run timer with patch checklist rows.',
  timers: [
    {
      id: 'farm-hops',
      name: 'Hop Run',
      wiki: 'https://runescape.wiki/w/Hops_patch',
      note: 'Typical hops growth timer.',
      cycleMinutes: 10,
      stages: 4,
      durationNote: 'Growth: 40 minutes',
      alertOnReady: true,
      autoClearOnReady: false,
      vanishOnStart: true,
      timerKind: 'run'
    }
  ],
  plots: [
    { id: 'hops-yanille', name: 'Yanille', wiki: 'https://runescape.wiki/w/Hops_patch' },
    { id: 'hops-lumbridge', name: 'Lumbridge', wiki: 'https://runescape.wiki/w/Hops_patch' },
    { id: 'hops-seers', name: "Seers' Village", wiki: 'https://runescape.wiki/w/Hops_patch' },
    { id: 'hops-entrana', name: 'Entrana', wiki: 'https://runescape.wiki/w/Hops_patch' }
  ]
};

export default hops;
