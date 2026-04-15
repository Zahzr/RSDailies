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
      t('daily-challenge', 'Daily Challenge', 'https://runescape.wiki/w/Challenge_System', 'Get XP and quick progress'),
      t('vis-wax', 'Vis Wax', 'https://runescape.wiki/w/Vis_wax', 'Quick rune combination for wax'),
      t('wicked-hood', 'Wicked Hood Teleports / Essence', 'https://runescape.wiki/w/Wicked_hood', 'Runecrafting utility and daily essence'),
      t('jack-of-trades', 'Jack of Trades', 'https://runescape.wiki/w/Jack_of_trades_aura/Routines', 'Get XP in a range of skills to earn an XP book'),
      t('soul-reaper', 'Soul Reaper', 'https://runescape.wiki/w/Soul_Reaper', 'Kill assigned bosses'),
      t('player-owned-port', 'Player-owned Ports', 'https://runescape.wiki/w/Player-owned_port', 'Manage voyages and the Black Marketeer'),
      t('player-owned-farm', 'Player-owned Farm', 'https://runescape.wiki/w/Player-owned_farm', 'Check animals and manage breeding pens'),
      t('crystal-tree-blossom', 'Crystal Tree Blossom', 'https://runescape.wiki/w/Crystal_tree_blossom', 'Collect blossom for perfect plus potions'),
      t('invention-machines', 'Invention Machines', 'https://runescape.wiki/w/Machines', 'Fill and collect from machines'),
      t('divine-locations', 'Divine Locations', 'https://runescape.wiki/w/Divine_location', 'Gather daily resources from divine locations'),
      t('archaeology-research', 'Archaeology Research', 'https://runescape.wiki/w/Research', 'Send out research teams'),
      t('nemi-forest', 'Nemi Forest', 'https://runescape.wiki/w/Nemi_Forest', 'Daily map and quick rewards'),
      t('sinkholes', 'Sinkholes', 'https://runescape.wiki/w/Sinkholes', 'Dungeoneering XP lamps and tokens (2x/day)'),
      t('goebie-bands', 'Goebie Supply Run', 'https://runescape.wiki/w/Supply_run', 'Daily goebie supply run'),
      t('menaphos-obelisk', 'Menaphos Obelisk / Scarabs', 'https://runescape.wiki/w/Soul_obelisk_(Menaphos)', 'Soul obelisk and Menaphos reputation'),
      t('big-chinchompa', 'Big Chinchompa', 'https://runescape.wiki/w/Big_Chinchompa', 'Hunter D&D rewards'),
      t('fixate', 'Fixate Charges', 'https://runescape.wiki/w/Fixate', 'Use fixate for guaranteed artefacts'),
      t('arc-contracts', 'Arc Contracts', 'https://runescape.wiki/w/Contract', 'Complete up to 7 Arc contracts'),
      t('rapid-growth', 'Rapid Growth', 'https://runescape.wiki/w/Rapid_Growth', 'Use daily growth charges'),
      t('runesphere', 'Runesphere', 'https://runescape.wiki/w/Runesphere', 'Hand in rune dust for XP'),
      t('book-of-char', 'Book of Char', 'https://runescape.wiki/w/The_Book_of_Char', 'Quick Firemaking XP'),
      t('travelling-merchant', 'Travelling Merchant', 'https://runescape.wiki/w/Travelling_Merchant%27s_Shop', 'Check stock if relevant to your routine'),
      t('motherlode-maw', 'Motherlode Maw', 'https://runescape.wiki/w/Motherlode_Maw', 'Claim reward if available'),
      t('wilderness-flash-events', 'Wilderness Flash Events', 'https://runescape.wiki/w/Wilderness_Flash_Events', 'Check active event cycle'),
      t('daily-essence', 'Pure Essence / Rune Shop Touchpoints', 'https://runescape.wiki/w/Runes', 'Optional rune / essence convenience check')
    ],

    gathering: [
      t(
        'bloodwood-tree',
        'Bakriminel Bolts (Bloodwood Tree)',
        'https://runescape.wiki/w/Money_making_guide/Fletching_bakriminel_bolts',
        'Fletch bakriminel bolts',
        { cooldownMinutes: 360 }
      ),
      t('miscellania', 'Miscellania', 'https://runescape.wiki/w/Calculator:Other/Miscellania', 'Check approval rating and coffer'),
      t('sandstone', 'Sandstone / Red Sandstone', 'https://runescape.wiki/w/Red_sandstone', 'Daily sandstone collection'),
      t('battlestaves', 'Zaff Battlestaves', 'https://runescape.wiki/w/Zaff', 'Collect daily battlestaves if unlocked'),
      t('feathers-run', 'Feather / Stock Touchpoints', 'https://runescape.wiki/w/Shop', 'Optional buy-limit or convenience stock'),
      t('broad-arrowheads-daily', 'Broad Arrowheads / Slayer Supplies', 'https://runescape.wiki/w/Broad_arrowheads', 'Optional daily top-up'),
      t('portable-check', 'Portable / Utility Check', 'https://runescape.wiki/w/Portable_skilling_station', 'Optional portable or skilling setup check'),
      t('herb-reminder', 'Herb Run Reminder', 'https://runescape.wiki/w/Farming', 'Use the Farming Timers section below for actual timer tracking')
    ],

    weeklies: [
      t('thalmunds-wares', 'Thalmund\'s Wares', 'https://runescape.wiki/w/Thalmund%27s_Wares', 'Merchant in the City of Um'),
      t('clan-citadel-cap', 'Clan Citadel Cap', 'https://runescape.wiki/w/Clan_Citadel', 'Get skill XP and bonuses'),
      t('anachronia-totems', 'Charge Anachronia Totems', 'https://runescape.wiki/w/Totem', 'Recharge weekly'),
      t('meg', 'Meg', 'https://runescape.wiki/w/Meg#Meg%27s_questions', 'XP lamp and coins'),
      t('tears-of-guthix', 'Tears of Guthix', 'https://runescape.wiki/w/Tears_of_Guthix', 'XP for your lowest skill'),
      t('herby-werby', 'Herby Werby', 'https://runescape.wiki/w/Herby_Werby', 'Herb bag and totem pieces'),
      t('big-top-bonanza', 'Big Top Bonanza', 'https://runescape.wiki/w/Balthazar_Beauregard%27s_Big_Top_Bonanza', 'Circus tricks for XP'),
      t('penguin-hide-and-seek', 'Penguin Hide and Seek', 'http://2016.world60pengs.com/', 'Find penguins for lamps'),
      t('wisps-of-the-grove', 'Wisps of the Grove', 'https://runescape.wiki/w/Wisps_of_the_Grove', 'Farming and Hunter XP'),
      t('shattered-worlds', 'Shattered Worlds', 'https://runescape.wiki/w/Shattered_Worlds', 'Weekly anima and challenge progress'),
      t('familiarisation', 'Familiarisation', 'https://runescape.wiki/w/Familiarisation', 'Summoning outfit progress'),
      t('skeletal-horror', 'Skeletal Horror', 'https://runescape.wiki/w/Skeletal_horror', 'Elite or master clue chance'),
      t('aquarium-treasure-chest', 'Aquarium Treasure Chest', 'https://runescape.wiki/w/Treasure_chest_decoration', 'Weekly clue or utility chest'),
      t('agoroth', 'Agoroth', 'https://runescape.wiki/w/Agoroth', '2x/week black pearl reward'),
      t('broken-home', 'Replay Broken Home', 'https://runescape.wiki/w/Broken_Home/Quick_guide', 'No-death speedrun for XP lamp'),
      t('rush-of-blood', 'Rush of Blood', 'https://runescape.wiki/w/Rush_of_Blood', 'Slayer XP and titles'),
      t('water-filtration', 'Water Filtration', 'https://runescape.wiki/w/Water_filtration_system', 'Het\'s Oasis rewards'),
      t('miscellania-weekly', 'Miscellania Weekly Check', 'https://runescape.wiki/w/Calculator:Other/Miscellania', 'Longer interval coffer check'),
      t('invention-machine-weekly', 'Invention Machines Weekly Check', 'https://runescape.wiki/w/Machines', 'Weekly machine refill sweep'),
      t('arc-supplies', 'Arc Supplies Crate', 'https://runescape.wiki/w/Rosie_(supplies)', 'Free supplies from Rosie'),
      t('dream-of-iaia-resource', 'Dream of Iaia (Resources)', 'https://runescape.wiki/w/Dream_of_Iaia', 'Convert stored resources'),
      t('gwd2-bounties', 'GWD2 Bounties', 'https://runescape.wiki/w/Feng,_the_Bounty_Master', 'Up to 5 stored bounties'),
      t('fort-forinthry-bonus-xp', 'Fort Forinthry Bonus XP', 'https://runescape.wiki/w/Town_Hall_(Fort_Forinthry)', 'Claim weekly bonus XP'),
      t('advance-time', 'Advance Time', 'https://runescape.wiki/w/Advance_Time', 'Cast the spell 3 times'),
      t('merchant-weekly-route', 'Merchant / Utility Weekly Route', 'https://runescape.wiki/w/Travelling_Merchant%27s_Shop', 'Optional weekly route planning')
    ],

    weeklyGathering: [
      t('feather-shop-run', 'Feather Shop Run', 'https://runescape.wiki/w/Money_making_guide/Buying_feathers', 'Weekly stock'),
      t('meat-packs', 'Meat Packs', 'https://runescape.wiki/w/Money_making_guide/Buying_Meat_from_Oo%27glog', 'Buy meat packs only'),
      t('vial-of-water-packs', 'Vial of Water Packs', 'https://runescape.wiki/w/Money_making_guide/Buying_vials_of_water', 'Weekly stock'),
      t('yak-hide', 'Yak Hide', 'https://runescape.wiki/w/Money_making_guide/Buying_yak-hide', 'Weekly stock'),
      t('bandit-duty-free', 'Bandit Duty Free', 'https://runescape.wiki/w/Money_making_guide/Buying_construction_materials_from_Bandit_Duty_Free', 'Wilderness shop'),
      t('seaweed-and-pineapples', 'Seaweed and Pineapples', 'https://runescape.wiki/w/Money_making_guide/Buying_seaweed_and_pineapples_from_Arhein', 'Weekly stock'),
      t('bert-sand', 'Sand from Bert', 'https://runescape.wiki/w/Bert', 'Weekly stock'),
      t('dellmonti-pineapples', 'Dell Monti Fruit', 'https://runescape.wiki/w/Dell_Monti', 'Weekly stock'),
      t('coeden-logs', 'Logs from Coeden', 'https://runescape.wiki/w/Coeden', 'Weekly stock'),
      t('lupe', 'Soul Supplies', 'https://runescape.wiki/w/Lupe#Underworld_achievement_rewards', 'Lupe weekly supplies'),
      t('feathers-of-maat', 'Feathers of Ma\'at', 'https://runescape.wiki/w/Money_making_guide/Buying_feathers_of_Ma%27at', 'Weekly stock'),
      t('broad-arrowheads', 'Broad Arrowheads', 'https://runescape.wiki/w/Money_making_guide/Buying_broad_arrowheads', 'Weekly stock'),
      t('potato-cactus', 'Potato Cactus', 'https://runescape.wiki/w/Weird_Old_Man', 'Weird Old Man stock'),
      t('razmire-planks', 'Planks (Razmire)', 'https://runescape.wiki/w/Razmire_Keelgan', 'Weekly plank stock'),
      t('geoffrey-flax', 'Flax (Geoffrey)', 'https://runescape.wiki/w/Geoffrey', 'Weekly flax stock'),
      t('cromperty-pure-essence', 'Pure Essence (Wizard Cromperty)', 'https://runescape.wiki/w/Wizard_Cromperty', 'Weekly stock'),
      t('rune-shop-run', 'Rune Shop Run', 'https://runescape.wiki/w/Money_making_guide/Buying_runes', 'Weekly shop sweep')
    ],

    monthlies: [
      t('solomons-store', 'Solomon\'s Store', 'https://secure.runescape.com/m=mtxn_rs_shop/index?jptg=ia&jptv=sgs_page#category/FreeItem', 'Free cosmetics and loyalty checks'),
      t('giant-oyster', 'Giant Oyster', 'https://runescape.wiki/w/Giant_Oyster', 'Fishing and Farming XP, clue chest'),
      t('god-statues', 'God Statues', 'https://runescape.wiki/w/God_Statues', 'Construction and Prayer/Slayer XP'),
      t('effigy-incubator', 'Effigy Incubator', 'https://runescape.wiki/w/Effigy_Incubator', 'Monthly effigy run'),
      t('troll-invasion', 'Troll Invasion', 'https://runescape.wiki/w/Troll_Invasion', 'XP book and reward'),
      t('dream-of-iaia-xp', 'Dream of Iaia (XP)', 'https://runescape.wiki/w/Dream_of_Iaia', 'Use stored XP in stations'),
      t('monthly-dnd-check', 'Monthly D&D Sweep', 'https://runescape.wiki/w/Distractions_and_Diversions', 'Check monthly-limited activities'),
      t('premier-benefits-check', 'Premier / Monthly Benefit Check', 'https://runescape.wiki/w/Premier_Club', 'Optional membership perk sweep')
    ]
  };
})();