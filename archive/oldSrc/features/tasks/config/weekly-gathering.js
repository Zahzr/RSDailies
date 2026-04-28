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

export const weeklyGathering = [
  t('feather-shop-run', 'Feather Shop Run', 'https://runescape.wiki/w/Money_making_guide/Buying_feathers', 'Weekly stock'),
  t('meat-packs', 'Meat Packs', 'https://runescape.wiki/w/Money_making_guide/Buying_Meat_from_Oo%27glog', 'Only buy packs'),
  t('vial-of-water-packs', 'Vial of Water Packs', 'https://runescape.wiki/w/Money_making_guide/Buying_vials_of_water', 'Weekly stock'),
  t('yak-hide', 'Yak Hide', 'https://runescape.wiki/w/Money_making_guide/Buying_yak-hide', 'Weekly stock'),
  t('bandit-duty-free', 'Bandit Duty Free', 'https://runescape.wiki/w/Money_making_guide/Buying_construction_materials_from_Bandit_Duty_Free', 'Wilderness shop'),
  t('seaweed-and-pineapples', 'Seaweed and Pineapples', 'https://runescape.wiki/w/Money_making_guide/Buying_seaweed_and_pineapples_from_Arhein', 'Weekly stock'),
  t('bert-sand', 'Sand from Bert', 'https://runescape.wiki/w/Bert', 'Weekly stock'),
  t('dellmonti-pineapples', 'Dell Monti Fruit', 'https://runescape.wiki/w/Dell_Monti', 'Weekly stock'),
  t('coeden-logs', 'Logs from Coeden', 'https://runescape.wiki/w/Coeden', 'Weekly stock'),
  t('lupe', 'Soul Supplies', 'https://runescape.wiki/w/Lupe#Underworld_achievement_rewards', 'Lupe weekly supplies'),
  t('feathers-of-maat', "Feathers of Ma'at", 'https://runescape.wiki/w/Money_making_guide/Buying_feathers_of_Ma%27at', 'Weekly stock'),
  t('broad-arrowheads', 'Broad Arrowheads', 'https://runescape.wiki/w/Money_making_guide/Buying_broad_arrowheads', 'Weekly stock'),
  t('potato-cactus', 'Potato Cactus', 'https://runescape.wiki/w/Weird_Old_Man', 'Weird Old Man stock'),
  t('razmire-planks', 'Planks (Razmire)', 'https://runescape.wiki/w/Razmire_Keelgan', 'Weekly stock'),
  t('geoffrey-flax', 'Flax (Geoffrey)', 'https://runescape.wiki/w/Geoffrey', 'Weekly flax stock'),
  t('cromperty-pure-essence', 'Pure Essence (Wizard Cromperty)', 'https://runescape.wiki/w/Wizard_Cromperty', 'Weekly stock'),
  t('rune-shop-run', 'Rune Shop Run', 'https://runescape.wiki/w/Money_making_guide/Buying_runes', 'Weekly shop sweep')
].map((task) => Object.assign({ reset: 'weekly', alertDaysBeforeReset: 0 }, task));

export default weeklyGathering;
