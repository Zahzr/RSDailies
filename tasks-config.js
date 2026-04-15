// =============================================================================
// tasks-config.js
// Task content for RSDailies. Keep logic in dailyscape.js.
// =============================================================================
/* global window */

(function () {
  'use strict';

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
        note: cleanNote(note),
      },
      extra || {}
    );
  }

  window.TASKS_CONFIG = {
    dailies: [
      t('daily-challenge', 'Daily Challenge', 'https://runescape.wiki/w/Challenge_System', 'Get XP'),
      t(
        'jack-of-trades',
        'Jack of Trades',
        'https://runescape.wiki/w/Jack_of_trades_aura/Routines',
        'Get XP in a range of skills to get an XP book'
      ),
      t('soul-reaper', 'Soul Reaper', 'https://runescape.wiki/w/Soul_Reaper', 'Kill assigned bosses'),
      t(
        'player-owned-ports',
        'Player-owned Port',
        'https://runescape.wiki/w/Player-owned_port',
        "Manage your port. Buy resources from the Black Marketeer."
      ),
      t('player-owned-farm', 'Player-owned Farm', 'https://runescape.wiki/w/Player-owned_farm', 'Manage your farm'),
      t(
        'crystal-tree-blossom',
        'Crystal Tree Blossom',
        'https://runescape.wiki/w/Crystal_tree_blossom',
        'Collect blossom for perfect plus potions'
      ),
      t(
        'invention-machine',
        'Invention Machines',
        'https://runescape.wiki/w/Machines',
        'Fill and collect from invention machines'
      ),
      t(
        'divine-locations',
        'Divine Locations',
        'https://runescape.wiki/w/Divine_location',
        'Gather resources from divine locations'
      ),
      t(
        'archaeology-research',
        'Archaeology Research',
        'https://runescape.wiki/w/Research',
        'Send out research teams for XP and resources'
      ),
      t(
        'nemi-forest',
        'Nemi Forest',
        'https://runescape.wiki/w/Nemi_Forest',
        "NemiForest FC. Daily maps are posted on Reddit."
      ),
      t('sinkholes', 'Sinkholes', 'https://runescape.wiki/w/Sinkholes', 'Dungeoneering XP lamps and tokens (2x/day)'),
      t('goebie-bands', 'Goebie Bands', 'https://runescape.wiki/w/Supply_run', 'Supply Run'),
      t(
        'menaphos-obelisk',
        'Menaphos Obelisk / Scarabs',
        'https://runescape.wiki/w/Soul_obelisk_(Menaphos)',
        'SoulObby FC. Menaphos reputation'
      ),
      t(
        'big-chinchompa',
        'Big Chinchompa',
        'https://runescape.wiki/w/Big_Chinchompa',
        'Private hunting instances and Hunter XP'
      ),
      t(
        'fixate',
        'Fixate Charges',
        'https://runescape.wiki/w/Fixate',
        'Use fixate charges for guaranteed artefacts'
      ),
      t('arc-contracts', 'Arc Contracts', 'https://runescape.wiki/w/Contract', 'Complete up to 7 Arc contracts'),
      t(
        'rapid-growth',
        'Rapid Growth',
        'https://runescape.wiki/w/Rapid_Growth',
        'Make plants grow faster (up to 2x/day)'
      ),
      t('runesphere', 'Runesphere', 'https://runescape.wiki/w/Runesphere', 'Hand in rune dust for XP'),
      t(
        'book-of-char',
        'Book of Char',
        'https://runescape.wiki/w/The_Book_of_Char',
        'Fast Firemaking XP (drop logs and use the book)'
      ),
    ],

    gathering: [
      t(
        'bloodwood-tree',
        'Bakriminel Bolts (Bloodwood Tree)',
        'https://runescape.wiki/w/Money_making_guide/Fletching_bakriminel_bolts',
        'Fletch bakriminel bolts (every ~6 hours)',
        { cooldownMinutes: 360 }
      ),
      t(
        'miscellania',
        'Miscellania',
        'https://runescape.wiki/w/Calculator:Other/Miscellania',
        'Check approval rating and funds in coffer'
      ),
      t(
        'herb-run',
        'Herb Run',
        'https://runescape.wiki/w/Farming',
        'Timer aligns to RS3 farming growth ticks (20-minute cycles).',
        { timer: 'herb' }
      ),
    ],

    weeklies: [
      t('thalmunds-wares', "Thalmund's Wares", "https://runescape.wiki/w/Thalmund%27s_Wares", 'Merchant in the City of Um'),
      t('capping-clan-citadel', 'Clan Citadel Cap', 'https://runescape.wiki/w/Clan_Citadel', 'Get skill XP and bonuses'),
      t('charge-anachronia-totems', 'Charge Anachronia Totems', 'https://runescape.wiki/w/Totem', 'Recharge weekly'),
      t('meg', 'Meg', "https://runescape.wiki/w/Meg#Meg's_questions", 'XP lamp and coins'),
      t('tears-of-guthix', 'Tears of Guthix', 'https://runescape.wiki/w/Tears_of_Guthix', 'XP for your lowest skill'),
      t('herby-werby', 'Herby Werby', 'https://runescape.wiki/w/Herby_Werby', 'Herb bag and totem pieces'),
      t(
        'big-top-bonanza',
        'Big Top Bonanza',
        "https://runescape.wiki/w/Balthazar_Beauregard%27s_Big_Top_Bonanza",
        'Circus tricks for XP'
      ),
      t('penguin-hide-and-seek', 'Penguin Hide and Seek', 'http://2016.world60pengs.com/', 'Find penguins for lamps'),
      t('wisps-of-the-grove', 'Wisps of the Grove', 'https://runescape.wiki/w/Wisps_of_the_Grove', 'Farming and Hunter XP'),
      t(
        'shattered-worlds',
        'Shattered Worlds',
        'https://runescape.wiki/w/Shattered_Worlds',
        'Complete weekly challenges for shattered anima'
      ),
      t('familiarisation', 'Familiarisation', 'https://runescape.wiki/w/Familiarisation', 'Summoning outfit progress'),
      t('skeletal-horror', 'Skeletal Horror', 'https://runescape.wiki/w/Skeletal_horror', 'Elite or master clue chance'),
      t(
        'aquarium-treasure-chest',
        'Aquarium Treasure Chest',
        'https://runescape.wiki/w/Treasure_chest_decoration',
        'Elite or master clue chance'
      ),
      t('agoroth', 'Agoroth', 'http://runescape.wiki/w/Agoroth', '2x/week; black pearl bxp reward'),
      t(
        'broken-home',
        'Replay Broken Home',
        'http://runescape.wiki/w/Broken_Home/Quick_guide',
        'No-death speedrun for a huge XP lamp'
      ),
      t('rush-of-blood', 'Rush of Blood', 'http://runescape.wiki/w/Rush_of_Blood', 'Slayer XP and titles'),
      t(
        'water-filtration',
        'Water Filtration',
        'https://runescape.wiki/w/Water_filtration_system',
        "Het's Oasis troves, golden roses, etc."
      ),
      t('miscellania-weekly', 'Miscellania', 'https://runescape.wiki/w/Calculator:Other/Miscellania', 'Check approval rating and coffer'),
      t('invention-machine-weekly', 'Invention Machines', 'https://runescape.wiki/w/Machines', 'Fill and collect from machines'),
      t('arc-supplies', 'Arc Supplies Crate', 'https://runescape.wiki/w/Rosie_(supplies)', "Free supplies from Rosie's crate"),
      t('dream-of-iaia-resource', 'Dream of Iaia (Resources)', 'https://runescape.wiki/w/Dream_of_Iaia', 'Convert resources to XP'),
      t('gwd2-bounties', 'GWD2 Bounties', 'https://runescape.wiki/w/Feng,_the_Bounty_Master', 'Up to 5 stored bounties'),
      t(
        'fort-forinthry-bonus-xp',
        'Fort Forinthry Bonus XP',
        'https://runescape.wiki/w/Town_Hall_(Fort_Forinthry)',
        'Up to 15 small stars worth of bonus XP'
      ),
      t('advance-time', 'Advance Time', 'https://runescape.wiki/w/Advance_Time', 'Cast the spell 3 times'),
    ],

    weeklyGathering: [
      t('feather-shop-run', 'Feather Shop Run', 'https://runescape.wiki/w/Money_making_guide/Buying_feathers', 'Weekly stock (normalized)'),
      t('meat-packs', 'Meat Packs', "https://runescape.wiki/w/Money_making_guide/Buying_Meat_from_Oo%27glog", 'Only buy packs'),
      t('vial-of-water-packs', 'Vial of Water Packs', 'https://runescape.wiki/w/Money_making_guide/Buying_vials_of_water', 'Weekly stock (normalized)'),
      t('yak-hide', 'Yak Hide', 'https://runescape.wiki/w/Money_making_guide/Buying_yak-hide', 'Weekly stock'),
      t(
        'bandit-duty-free',
        'Bandit Duty Free',
        'https://runescape.wiki/w/Money_making_guide/Buying_construction_materials_from_Bandit_Duty_Free',
        'Wilderness shop; some items slow resale'
      ),
      t(
        'seaweed-and-pineapples',
        'Seaweed and Pineapples',
        'https://runescape.wiki/w/Money_making_guide/Buying_seaweed_and_pineapples_from_Arhein',
        'Weekly stock'
      ),
      t('bert-sand', 'Sand from Bert', 'https://runescape.wiki/w/Bert', 'Weekly stock'),
      t('dellmonti-pineapples', 'Dell Monti Fruit', 'https://runescape.wiki/w/Dell_Monti', 'Weekly stock'),
      t('coeden-logs', 'Logs from Coeden', 'https://runescape.wiki/w/Coeden', 'Average of possible combinations'),
      t('lupe', 'Soul Supplies', 'https://runescape.wiki/w/Lupe#Underworld_achievement_rewards', "Lupe's Soul Supplies"),
      t('feathers-of-ma-at', "Feathers of Ma'at", "https://runescape.wiki/w/Money_making_guide/Buying_feathers_of_Ma%27at", 'Weekly stock'),
      t('broad-arrowheads', 'Broad Arrowheads', 'https://runescape.wiki/w/Money_making_guide/Buying_broad_arrowheads', 'Weekly stock'),
      t('oldman-potato-cactus', 'Potato Cactus (Weird Old Man)', 'https://runescape.wiki/w/Weird_Old_Man', 'Weekly stock'),
      t('razmire-planks', 'Planks (Razmire)', 'https://runescape.wiki/w/Razmire_Keelgan', 'Weekly stock (noted planks)'),
      t('geoffrey-flax', 'Flax (Geoffrey)', 'https://runescape.wiki/w/Geoffrey', 'Weekly stock'),
      t(
        'cromperty-pure-essence',
        'Pure Essence (Wizard Cromperty)',
        'https://runescape.wiki/w/Wizard_Cromperty',
        'Weekly stock'
      ),
      t('rune-shop-run', 'Rune Shop Run', 'https://runescape.wiki/w/Money_making_guide/Buying_runes', 'Weekly stock'),
    ],

    monthlies: [
      t(
        'solomon-s-store',
        "Solomon's Store",
        'https://secure.runescape.com/m=mtxn_rs_shop/index?jptg=ia&jptv=sgs_page#category/FreeItem',
        'Free cosmetics; check loyalty points and sales'
      ),
      t('giant-oyster', 'Giant Oyster', 'https://runescape.wiki/w/Giant_Oyster', 'Fishing and Farming XP; clue chest'),
      t('god-statues', 'God Statues', 'https://runescape.wiki/w/God_Statues', 'Construction and Prayer/Slayer XP'),
      t('effigy-incubator', 'Effigy Incubator', 'https://runescape.wiki/w/Effigy_Incubator', 'Get 10+ effigies'),
      t('troll-invasion', 'Troll Invasion', 'https://runescape.wiki/w/Troll_Invasion', 'Defend all waves for XP book + key'),
      t('dream-of-iaia-xp', 'Dream of Iaia (XP)', 'https://runescape.wiki/w/Dream_of_Iaia', 'Use stored XP in stations'),
    ],
  };
})();

