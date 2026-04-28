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

export const weeklies = [
  t('thalmunds-wares', "Thalmund's Wares", 'https://runescape.wiki/w/Thalmund%27s_Wares', 'Merchant in the City of Um'),
  t('clan-citadel-cap', 'Clan Citadel Cap', 'https://runescape.wiki/w/Clan_Citadel', 'Get skill XP and bonuses'),
  t('anachronia-totems', 'Charge Anachronia Totems', 'https://runescape.wiki/w/Totem', 'Recharge weekly'),
  t('meg', 'Meg', 'https://runescape.wiki/w/Meg#Meg%27s_questions', 'XP lamp and coins'),
  t('tears-of-guthix', 'Tears of Guthix', 'https://runescape.wiki/w/Tears_of_Guthix', 'XP for your lowest skill'),
  t(
    'herby-werby',
    'Herby Werby',
    'https://runescape.wiki/w/Herby_Werby',
    'Herb bag and totem pieces. Commonly worth doing late for higher-level XP scaling.',
    { alertDaysBeforeReset: 1 }
  ),
  t('big-top-bonanza', 'Big Top Bonanza', 'https://runescape.wiki/w/Balthazar_Beauregard%27s_Big_Top_Bonanza', 'Circus tricks for XP'),
  t(
    'penguins',
    'Penguins',
    'https://jq.world60pengs.com',
    'Weekly penguin route with compact child checklist rows. Child notes should display inline in the next JS pass.',
    {
      alertDaysBeforeReset: 0,
      childRows: [
        {
          id: 'penguin-1',
          name: 'Penguin 1',
          note: '1-point or 2-point location row. Replace label/location weekly if you want manual upkeep.'
        },
        {
          id: 'penguin-2',
          name: 'Penguin 2',
          note: 'Use note text for area, disguise, hint, or route guidance.'
        },
        {
          id: 'penguin-3',
          name: 'Penguin 3',
          note: 'Compact child row intended for mark-off and inline guidance.'
        },
        {
          id: 'penguin-4',
          name: 'Penguin 4',
          note: 'Store current weekly location or route clue here.'
        },
        {
          id: 'penguin-5',
          name: 'Penguin 5',
          note: 'Store current weekly location or route clue here.'
        },
        {
          id: 'penguin-6',
          name: 'Penguin 6',
          note: 'Store current weekly location or route clue here.'
        },
        {
          id: 'penguin-7',
          name: 'Penguin 7',
          note: 'Store current weekly location or route clue here.'
        },
        {
          id: 'penguin-8',
          name: 'Penguin 8',
          note: 'Store current weekly location or route clue here.'
        },
        {
          id: 'penguin-9',
          name: 'Penguin 9',
          note: 'Store current weekly location or route clue here.'
        },
        {
          id: 'penguin-10',
          name: 'Penguin 10',
          note: 'Store current weekly location or route clue here.'
        },
        {
          id: 'penguin-11',
          name: 'Penguin 11',
          note: 'Store current weekly location or route clue here.'
        },
        {
          id: 'penguin-12',
          name: 'Penguin 12',
          note: 'Shadow Realm / ghost penguin can be tracked here if you want all 12 in one parent block.'
        },
        {
          id: 'penguin-polar-bear',
          name: 'Polar Bear',
          note: 'Weekly well location helper row.'
        }
      ]
    }
  ),
  t('wisps-of-the-grove', 'Wisps of the Grove', 'https://runescape.wiki/w/Wisps_of_the_Grove', 'Farming and Hunter XP'),
  t('shattered-worlds', 'Shattered Worlds', 'https://runescape.wiki/w/Shattered_Worlds', 'Weekly anima and challenge progress'),
  t('familiarisation', 'Familiarisation', 'https://runescape.wiki/w/Familiarisation', 'Summoning outfit progress'),
  t('skeletal-horror', 'Skeletal Horror', 'https://runescape.wiki/w/Skeletal_horror', 'Elite or master clue chance'),
  t('aquarium-treasure-chest', 'Aquarium Treasure Chest', 'https://runescape.wiki/w/Treasure_chest_decoration', 'Weekly clue or utility chest'),
  t('agoroth', 'Agoroth', 'https://runescape.wiki/w/Agoroth', '2x/week black pearl reward'),
  t('broken-home', 'Replay Broken Home', 'https://runescape.wiki/w/Broken_Home/Quick_guide', 'No-death speedrun for XP lamp'),
  t('rush-of-blood', 'Rush of Blood', 'https://runescape.wiki/w/Rush_of_Blood', 'Slayer XP and titles'),
  t('water-filtration', 'Water Filtration', 'https://runescape.wiki/w/Water_filtration_system', "Het's Oasis rewards"),
  t('miscellania-weekly', 'Miscellania Weekly Check', 'https://runescape.wiki/w/Calculator:Other/Miscellania', 'Longer interval coffer check'),
  t('invention-machine-weekly', 'Invention Machines Weekly Check', 'https://runescape.wiki/w/Machines', 'Weekly machine refill sweep'),
  t('arc-supplies', 'Arc Supplies Crate', 'https://runescape.wiki/w/Rosie_(supplies)', 'Free supplies from Rosie'),
  t('dream-of-iaia-resource', 'Dream of Iaia (Resources)', 'https://runescape.wiki/w/Dream_of_Iaia', 'Convert stored resources'),
  t('gwd2-bounties', 'GWD2 Bounties', 'https://runescape.wiki/w/Feng,_the_Bounty_Master', 'Up to 5 stored bounties'),
  t('fort-forinthry-bonus-xp', 'Fort Forinthry Bonus XP', 'https://runescape.wiki/w/Town_Hall_(Fort_Forinthry)', 'Claim weekly bonus XP'),
  t('advance-time', 'Advance Time', 'https://runescape.wiki/w/Advance_Time', 'Cast the spell 3 times')
].map((task) => Object.assign({ reset: 'weekly', alertDaysBeforeReset: 0 }, task));

export default weeklies;
