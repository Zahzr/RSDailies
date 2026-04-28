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

export const monthlies = [
  t('solomons-store', "Solomon's Store", 'https://secure.runescape.com/m=mtxn_rs_shop/index?jptg=ia&jptv=sgs_page#category/FreeItem', 'Free cosmetics and loyalty checks'),
  t('giant-oyster', 'Giant Oyster', 'https://runescape.wiki/w/Giant_Oyster', 'Fishing and Farming XP, clue chest'),
  t(
    'god-statues',
    'God Statues',
    'https://runescape.wiki/w/God_Statues',
    'Construction and Prayer / Slayer XP. Often worth doing near the end of the month.',
    { alertDaysBeforeReset: 1 }
  ),
  t('effigy-incubator', 'Effigy Incubator', 'https://runescape.wiki/w/Effigy_Incubator', 'Monthly effigy run'),
  t('troll-invasion', 'Troll Invasion', 'https://runescape.wiki/w/Troll_Invasion', 'XP book and reward'),
  t('dream-of-iaia-xp', 'Dream of Iaia (XP)', 'https://runescape.wiki/w/Dream_of_Iaia', 'Use stored XP in stations'),
  t('monthly-dnd-check', 'Monthly D&D Sweep', 'https://runescape.wiki/w/Distractions_and_Diversions', 'Check monthly-limited activities')
].map((task) => Object.assign({ reset: 'monthly', alertDaysBeforeReset: 0 }, task));

export default monthlies;
