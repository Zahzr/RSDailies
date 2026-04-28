function cleanNote(text) {
  if (!text) return '';
  return String(text)
    .replace(/<br\s*\/?>/gi, ' - ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function t(id, name, wiki, note, extra) {
  return Object.assign(
    {
      id,
      name,
      wiki,
      note: cleanNote(note)
    },
    extra || {}
  );
}

export const gathering = [
  t(
    'bloodwood-tree',
    'Bakriminel Bolts (Bloodwood Tree)',
    'https://runescape.wiki/w/Money_making_guide/Fletching_bakriminel_bolts',
    'Fletch bakriminel bolts roughly every 6 hours.',
    { cooldownMinutes: 360 }
  ),
  t('miscellania', 'Miscellania', 'https://runescape.wiki/w/Calculator:Other/Miscellania', 'Check approval rating and funds in coffer'),
  t('zaff-battlestaves', 'Zaff Battlestaves', 'https://runescape.wiki/w/Zaff', 'Collect daily battlestaves if unlocked'),
  t('bert-sand-daily', 'Bert Sand', 'https://runescape.wiki/w/Bert', 'Collect daily sand if part of your route'),
  t('meat-shop-check', 'Meat / Utility Shop Check', 'https://runescape.wiki/w/Shop', 'Optional gathering-related shop pass'),
  t('rune-shop-touchpoint', 'Rune / Essence Shop Touchpoint', 'https://runescape.wiki/w/Runes', 'Optional rune or essence stock pass'),
  t('herb-run-reminder', 'Herb Run', 'https://runescape.wiki/w/Farming', 'Use the Farming section for the actual timer tracking')
].map((task) => Object.assign({ reset: 'daily', alertDaysBeforeReset: 0 }, task));

export default gathering;
