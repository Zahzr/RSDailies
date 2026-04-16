export const allotments = {
  id: 'allotments',
  label: 'Allotments',
  note: 'Allotment run timer with patch checklist rows.',
  timers: [
    {
      id: 'farm-allotments',
      name: 'Allotment Run',
      wiki: 'https://runescape.wiki/w/Allotment_patch',
      note: 'Typical allotment growth timer.',
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
    { id: 'allotment-falador', name: 'Falador', wiki: 'https://runescape.wiki/w/Allotment_patch' },
    { id: 'allotment-catherby', name: 'Catherby', wiki: 'https://runescape.wiki/w/Allotment_patch' },
    { id: 'allotment-ardougne', name: 'Ardougne', wiki: 'https://runescape.wiki/w/Allotment_patch' },
    { id: 'allotment-port-phasmatys', name: 'Port Phasmatys', wiki: 'https://runescape.wiki/w/Allotment_patch' },
    {
      id: 'allotment-havenhythe',
      name: 'Havenhythe',
      wiki: 'https://runescape.wiki/w/Allotment_patch',
      locationNote: 'Havenhythe allotment patch.'
    }
  ]
};

export default allotments;
