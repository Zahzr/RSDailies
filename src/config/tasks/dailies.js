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

export const dailies = [
  t('daily-challenge', 'Daily Challenge', 'https://runescape.wiki/w/Challenge_System', 'Get XP and daily progress'),
  t('vis-wax', 'Vis Wax', 'https://runescape.wiki/w/Vis_wax', 'Use the rune combination for daily vis wax'),
  t('wicked-hood', 'Wicked Hood', 'https://runescape.wiki/w/Wicked_hood', 'Claim daily pure essence / rune utility'),
  t('jack-of-trades', 'Jack of Trades', 'https://runescape.wiki/w/Jack_of_trades_aura/Routines', 'Get XP in a range of skills to earn an XP book'),
  t('soul-reaper', 'Soul Reaper', 'https://runescape.wiki/w/Soul_Reaper', 'Kill assigned bosses'),
  t('player-owned-port', 'Player-owned Ports', 'https://runescape.wiki/w/Player-owned_port', 'Manage your port. Buy resources from the Black Marketeer.'),
  t('player-owned-farm', 'Player-owned Farm', 'https://runescape.wiki/w/Player-owned_farm', 'Manage your farm'),
  t('crystal-tree-blossom', 'Crystal Tree Blossom', 'https://runescape.wiki/w/Crystal_tree_blossom', 'Collect blossom for perfect plus potions'),
  t('invention-machines', 'Invention Machines', 'https://runescape.wiki/w/Machines', 'Fill and collect from machines'),
  t('divine-locations', 'Divine Locations', 'https://runescape.wiki/w/Divine_location', 'Gather resources from divine locations'),
  t('archaeology-research', 'Archaeology Research', 'https://runescape.wiki/w/Research', 'Send out research teams for XP and resources'),
  t('nemi-forest', 'Nemi Forest', 'https://runescape.wiki/w/Nemi_Forest', 'Daily map route and rewards'),
  t('sinkholes', 'Sinkholes', 'https://runescape.wiki/w/Sinkholes', 'Dungeoneering XP lamps and tokens (2x/day)'),
  t('goebie-bands', 'Goebie Supply Run', 'https://runescape.wiki/w/Supply_run', 'Daily goebie run'),
  t('menaphos-obelisk', 'Menaphos Obelisk / Scarabs', 'https://runescape.wiki/w/Soul_obelisk_(Menaphos)', 'Soul obelisk and Menaphos reputation'),
  t('big-chinchompa', 'Big Chinchompa', 'https://runescape.wiki/w/Big_Chinchompa', 'Hunter D&D rewards'),
  t('fixate', 'Fixate Charges', 'https://runescape.wiki/w/Fixate', 'Use fixate charges for guaranteed artefacts'),
  t('arc-contracts', 'Arc Contracts', 'https://runescape.wiki/w/Contract', 'Complete up to 7 Arc contracts'),
  t('rapid-growth', 'Rapid Growth', 'https://runescape.wiki/w/Rapid_Growth', 'Use daily growth charges'),
  t('runesphere', 'Runesphere', 'https://runescape.wiki/w/Runesphere', 'Hand in rune dust for XP'),
  t('book-of-char', 'Book of Char', 'https://runescape.wiki/w/The_Book_of_Char', 'Fast Firemaking XP'),
  t('travelling-merchant', 'Travelling Merchant', 'https://runescape.wiki/w/Travelling_Merchant%27s_Shop', 'Check stock if it matters to your route'),
  t('motherlode-maw', 'Motherlode Maw', 'https://runescape.wiki/w/Motherlode_Maw', 'Claim maw reward if available'),
  t('wildy-flash-events', 'Wilderness Flash Events', 'https://runescape.wiki/w/Wilderness_Flash_Events', 'Check event timing / utility'),
  t('sandstone-red-sandstone', 'Sandstone / Red Sandstone', 'https://runescape.wiki/w/Red_sandstone', 'Daily sandstone collection')
].map((task) => Object.assign({ reset: 'daily', alertDaysBeforeReset: 0 }, task));

export default dailies;
