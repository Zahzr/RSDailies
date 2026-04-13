const storage = window.localStorage;

const timeframes = ['rs3daily', 'rs3dailyshops', 'rs3weekly', 'rs3weeklyshops', 'rs3monthly'];
const sectionLayoutStorageKey = 'section-layout';
const splitDailyTablesStorageKey = 'split-daily-tables';
const splitWeeklyTablesStorageKey = 'split-weekly-tables';
var currentProfile = 'default';
var currentLayout = 'default';
var profilePrefix = '';
var dragRow; //global for currently dragged row
var totalDailyProfit = 0; //global for total daily profit, maybe move this
var totalWeeklyProfit = 0; //global for total weekly gathering profit

var rs3daily = {
    "daily-challenge": {task: "Daily Challenge", url: "https://runescape.wiki/w/Challenge_System", short: true, desc: "Get xp"},
    "jack-of-trades": {task: "Jack of Trades", url: "https://runescape.wiki/w/Jack_of_trades_aura/Routines", short: true, desc: "Get xp in a range of skills to get an xp book"},
    "soul-reaper": {task: "Soul Reaper", url: "https://runescape.wiki/w/Soul_Reaper", desc: "Kill assigned bosses"},
    "player-owned-ports": {task: "Player Owned Ports", url: "https://runescape.wiki/w/Player-owned_port", short: true, desc: "Manage your player owned port<br>Buy resources from <a href=\"https://runescape.wiki/w/The_Black_Marketeer\" target=\"_blank\" rel=\"noreferrer noopener\">Black Marketeer</a>"},
    "player-owned-farm": {task: "Player Owned Farm", url: "https://runescape.wiki/w/Player-owned_farm", short: true, desc: "Manage your player owned farm"},
    "crystal-tree-blossom": {task: "Crystal Tree Blossom", url: "https://runescape.wiki/w/Crystal_tree_blossom", short: true, desc: "Collect crystal tree blossom for perfect plus potions"},
    "invention-machine": {task: "Invention Machine", url: "https://runescape.wiki/w/Machines", short: true, desc: "Fill and collect from invention machines"},
    "divine-locations": {task: "Divine Locations", url: "https://runescape.wiki/w/Divine_location", short: true, desc: "Gather resources from divine locations<br>Divine Yews best xp"},
    "archaeology-research": {task: "Archaeology Research", url: "https://runescape.wiki/w/Research", short: true, desc: "Use Chronotes to send out research teams for Arch XP and resources"},
    "nemi-forest": {task: "Nemi Forest", url: "https://runescape.wiki/w/Nemi_Forest", desc: "'NemiForest' FC. See also <a href=\"https://www.reddit.com/r/NemiForest/new/\" target=\"_blank\" rel=\"noreferrer noopener\">Daily Maps</a>"},
    "sinkholes": {task: "Sinkholes", url: "https://runescape.wiki/w/Sinkholes", desc: "Dungeoneering XP lamps and tokens, 2x a day"},
    "goebie-bands": {task: "Goebie Bands", url: "https://runescape.wiki/w/Supply_run", desc: "Supply Run"},
    "menaphos-obelisk": {task: "Menaphos Obelisk/Scarabs", url: "https://runescape.wiki/w/Soul_obelisk_(Menaphos)", desc: "'SoulObby' FC. Gain Menaphos reputation, also from <a href=\"https://runescape.wiki/w/Corrupted_Scarab_(Menaphos)\" target=\"_blank\" rel=\"noreferrer noopener\">corrupted scarabs</a>"},
    "big-chinchompa": {task: "Big Chinchompa", url: "https://runescape.wiki/w/Big_Chinchompa", desc: "Private hunting instances and hunter xp"},
    "fixate": {task: "Fixate Charges", url: "https://runescape.wiki/w/Fixate", desc: "Use x3 fixate charges for guaranteed artefacts e.g. <a href=\"https://runescape.wiki/w/Red_Rum_Relics_III\" target=\"_blank\" rel=\"noreferrer noopener\">Red Rum Relics III</a>"},
    "arc-contracts": {task: "Arc Contracts", url: "https://runescape.wiki/w/Contract", desc: "Complete up to 7 contracts in the Arc for chimes and xp<br>Deplete claimed island"},
    "rapid-growth": {task: "Rapid Growth", url: "https://runescape.wiki/w/Rapid_Growth", desc: "Make plants grow faster up to 2x a day",
        inputs: [
            {id: 555, quantity: 3, shop_price: 0}, //water rune
            {id: 557, quantity: 3, shop_price: 0}, //earth rune
            {id: 561, quantity: 3, shop_price: 0}, //nature rune
            {id: 566, quantity: 3, shop_price: 0}, //soul rune
        ]
    },
    "runesphere": {task: "Runesphere", url: "https://runescape.wiki/w/Runesphere", desc: "Hand in up to 1k rune dust for 25k xp"},
    "book-of-char": {task: "Book of Char", url: "https://runescape.wiki/w/The_Book_of_Char", desc: "Drop logs on the ground and use book for fast firemaking xp"},
};

var rs3dailyshops = {
    "bloodwood-tree": {task: "Bak Bolts", url: "https://runescape.wiki/w/Money_making_guide/Fletching_bakriminel_bolts", desc: "Fletch bakriminel bolts. Every 6H",
        outputs: [
            {id: 24116, quantity: 1500, shop_price: 0}, //bakriminel bolts
        ],
        inputs: [
            {id: 24127, quantity: 1500, shop_price: 200}, //bakriminel bolt tips
        ]
    },
    "miscellania": {task: "Miscellania", url: "https://runescape.wiki/w/Calculator:Other/Miscellania", short: true, desc: "Check approval rating and funds in coffer",
        outputs: [
            {id: 1517, quantity: 892, shop_price: 0}, //maple logs
            {id: 6332, quantity: 223, shop_price: 0}, //mahogany logs
        ],
        inputs: [
            {id: -1, quantity: 1, shop_price: 37500}, //kingdom upkeep
        ]
    },
    "herb-run": {task: "Herb Run", url: "https://runescape.wiki/w/Money_making_guide/Farming_spirit_weed", short: true, desc: "Plant and gather your favorite herbs",
        outputs_max: [
            [
                {id: 48243, quantity: 69, shop_price: 0, inputs: {48201: 7, 43966: 7, 20011: 0.25}}, //Grimy arbuck
                {id: 211, quantity: 69, shop_price: 0, inputs: {5298: 7, 43966: 7, 20011: 0.25}}, //Grimy avantoe
                // {id: 37975, quantity: 110, shop_price: 50000, inputs: {37952: 7, 43966: 7, 20011: 0.25}}, //Grimy bloodweed
                {id: 215, quantity: 69, shop_price: 0, inputs: {5301: 7, 43966: 7, 20011: 0.25}}, //Grimy cadantine
                {id: 217, quantity: 69, shop_price: 0, inputs: {5303: 7, 43966: 7, 20011: 0.25}}, //Grimy dwarf weed
                {id: 21626, quantity: 69, shop_price: 0, inputs: {21621: 7, 43966: 7, 20011: 0.25}}, //Grimy fellstalk
                {id: 199, quantity: 110, shop_price: 0, inputs: {5291: 7, 43966: 7, 20011: 0.25}}, //Grimy guam
                {id: 205, quantity: 110, shop_price: 0, inputs: {5294: 7, 43966: 7, 20011: 0.25}}, //Grimy harralander
                {id: 209, quantity: 69, shop_price: 0, inputs: {5297: 7, 43966: 7, 20011: 0.25}}, //Grimy irit
                {id: 213, quantity: 69, shop_price: 0, inputs: {5299: 7, 43966: 7, 20011: 0.25}}, //Grimy kwuarm
                {id: 2485, quantity: 69, shop_price: 0, inputs: {5302: 7, 43966: 7, 20011: 0.25}}, //Grimy lantadyme
                {id: 201, quantity: 110, shop_price: 0, inputs: {5292: 7, 43966: 7, 20011: 0.25}}, //Grimy marrentill
                {id: 207, quantity: 69, shop_price: 0, inputs: {5295: 7, 43966: 7, 20011: 0.25}}, //Grimy ranarr
                {id: 3051, quantity: 69, shop_price: 0, inputs: {5300: 7, 43966: 7, 20011: 0.25}}, //Grimy snapdragon
                {id: 12174, quantity: 110, shop_price: 0, inputs: {12176: 7, 43966: 7, 20011: 0.25}}, //Grimy spirit weed
                {id: 203, quantity: 110, shop_price: 0, inputs: {5293: 7, 43966: 7, 20011: 0.25}}, //Grimy tarromin
                {id: 3049, quantity: 69, shop_price: 0, inputs: {5296: 7, 43966: 7, 20011: 0.25}}, //Grimy toadflax
                {id: 219, quantity: 69, shop_price: 0, inputs: {5304: 7, 43966: 7, 20011: 0.25}}, //Grimy torstol
                {id: 14836, quantity: 69, shop_price: 0, inputs: {14870: 7, 43966: 7, 20011: 0.25}} //Grimy wergali
            ]
        ]
    },
};

var rs3weekly = {
    "thalmunds-wares": {task: "Thalmund's Wares", url: "https://runescape.wiki/w/Thalmund%27s_Wares", desc: "Merchant in City of Um"},
    "capping-clan-citadel": {task: "Capping Clan Citadel", url: "https://runescape.wiki/w/Clan_Citadel", desc: "Get skill xp, set xp bonus, make clan happy"},
    "charge-anachronia-totems": {task: "Charge Anachronia Totems", url: "https://runescape.wiki/w/Totem", desc: "Recharge totems weekly and optionally swap out"},
    "meg": {task: "Meg", url: "https://runescape.wiki/w/Meg#Meg's_questions", short: true, desc: "XP lamp and coins"},
    "tears-of-guthix": {task: "Tears of Guthix", url: "https://runescape.wiki/w/Tears_of_Guthix", short: true, desc: "Gain xp for lowest level skill"},
    "herby-werby": {task: "Herby Werby", url: "https://runescape.wiki/w/Herby_Werby", desc: "Herb bag and Totem pieces"},
    "big-top-bonanza": {task: "Big Top Bonanza", url: "https://runescape.wiki/w/Balthazar_Beauregard%27s_Big_Top_Bonanza", short: true, desc: "Do circus tricks for xp"},
    "penguin-hide-and-seek": {task: "Penguin Hide and Seek", url: "http://2016.world60pengs.com/", desc: "Find penguins, get xp lamps"},
    "wisps-of-the-grove": {task: "Wisps of the Grove", url: "https://runescape.wiki/w/Wisps_of_the_Grove", desc: "Farming & Hunting XP, Vinny pet"},
    "shattered-worlds": {task: "Shattered Worlds", url: "https://runescape.wiki/w/Shattered_Worlds", desc: "Complete weekly challenges for additional <a href=\"https://runescape.wiki/w/Shattered_Worlds/Rewards\" target=\"_blank\" rel=\"noreferrer noopener\">shattered anima</a>"},
    "familiarisation": {task: "Familiarisation", url: "https://runescape.wiki/w/Familiarisation", desc: "Summoning outfit"},
    "skeletal-horror": {task: "Skeletal horror", url: "https://runescape.wiki/w/Skeletal_horror", desc: "Kill it for an elite or master clue scroll"},
    "aquarium-treasure-chest": {task: "Aquarium Treasure Chest", url: "https://runescape.wiki/w/Treasure_chest_decoration", desc: "Get an elite or master clue scroll"},
    "agoroth": {task: "Agoroth", url: "http://runescape.wiki/w/Agoroth", desc: "2x a week. Black pearl is equivalent to a medium prismatic fallen star's bxp"},
    "broken-home": {task: "Replay Broken Home", url: "http://runescape.wiki/w/Broken_Home/Quick_guide", desc: "No death speed run < 37 minutes, max 1 food for a huge xp lamp"},
    "rush-of-blood": {task: "Rush Of Blood", url: "http://runescape.wiki/w/Rush_of_Blood", desc: "Slayer XP and titles"},
    "water-filtration": {task: "Water Filtration", url:"https://runescape.wiki/w/Water_filtration_system", desc: "Clean out water filtration system at Het's oasis for troves, golden roses etc"},
    "miscellania-weekly": {task: "Miscellania", url: "https://runescape.wiki/w/Calculator:Other/Miscellania", short: true, desc: "Check approval rating and funds in coffer"},
    "invention-machine-weekly": {task: "Invention Machine", url: "https://runescape.wiki/w/Machines", short: true, desc: "Fill and collect from invention machines"},
    "arc-supplies": {task: "Arc Supplies Crate", url: "https://runescape.wiki/w/Rosie_(supplies)", desc: "Get free supplies from Rosie's crate for Arc voyages"},
    "dream-of-iaia-resource": {task: "Dream of Iaia Resources", url: "https://runescape.wiki/w/Dream_of_Iaia", desc: "Convert resources to skilling stations at a rate of 2 resource to 1 xp"},
    "gwd2-bounties": {task: "GWD2 Bounties", url: "https://runescape.wiki/w/Feng,_the_Bounty_Master", desc: "Up to 5 bounties can be stored for GWD2 reputation"},
    "fort-forinthry-bonus-xp": {task: "Fort Forinthry Bonus XP", url: "https://runescape.wiki/w/Town_Hall_(Fort_Forinthry)", desc:"Receive up to 15 small stars worth of bonus xp"},
    "advance-time": {task: "Advance Time", url: "https://runescape.wiki/w/Advance_Time", desc: "Use the Advance Time spell 3 times", short:true},
};

var rs3weeklyshops = {
    "feather-shop-run": {task: "Feather Shop Run", url: "https://runescape.wiki/w/Money_making_guide/Buying_feathers", short: true, desc: 'Normalized for 24 hours',
        outputs: [
            {id: 314, quantity: 42000, shop_price: 6}, //feathers
            {id: 314, quantity: 385000, shop_price: 7.5}, //feather packs 
            {id: 313, quantity: 9000, shop_price: 3}, //fishing bait
        ]
    },
    "meat-packs": {task: "Meat Packs", url: "https://runescape.wiki/w/Money_making_guide/Buying_Meat_from_Oo%27glog", short: true, desc: "Only buy packs",
        outputs: [
            {id: 2132, quantity: 1350, shop_price: 59}, //raw beef packs
            {id: 9978, quantity: 1350, shop_price: 63}, //raw bird meat packs
            {id: 3226, quantity: 450, shop_price: 67}, //raw rabbit packs
        ]
    },
    "vial-of-water-packs": {task: "Vial of Water Packs", url: "https://runescape.wiki/w/Money_making_guide/Buying_vials_of_water", short: true,  desc: 'Normalized for 24 hours. +6 from Sigmund the Merchant',
        outputs: [
            {id: 227, quantity: 35000, shop_price: 10}, //vial of water packs
            {id: 221, quantity: 9000, shop_price: 3}, //eye of newt packs
            {id: 48961, quantity: 900, shop_price: 5}, //bomb vial
        ]
    },
    "yak-hide": {task: "Yak Hide", url: "https://runescape.wiki/w/Money_making_guide/Buying_yak-hide", short: true,
        outputs: [
            {id: 10818, quantity: 3500, shop_price: 50}, //yak-hide packs
        ]
    },
    "bandit-duty-free": {task: "Bandit Duty Free", url: "https://runescape.wiki/w/Money_making_guide/Buying_construction_materials_from_Bandit_Duty_Free", short: true, desc: "Shop in the Wilderness, get skulled by Mr X first, slow resale on some items.",
        outputs: [
            {id: 13278, quantity: 21000, shop_price: 50}, //broad arrowheads
            {id: 37952, quantity: 20, shop_price: 50000}, //bloodweed seeds
            // {id: 29864, quantity: 20, shop_price: 450000}, //algarum thread
            // {id: 8784, quantity: 20, shop_price: 117000}, //gold leaf
            // {id: 28628, quantity: 20, shop_price: 450000}, //stone of binding
            // {id: 8786, quantity: 20, shop_price: 292500}, //marble block
            {id: 227, quantity: 1050, shop_price: 10, label_override: 'Vial of Water Packs'}, //vial of water packs
        ]
    },
    "seaweed-and-pineapples": {task: "Seaweed and Pineapples", url: "https://runescape.wiki/w/Money_making_guide/Buying_seaweed_and_pineapples_from_Arhein", short: true,
        outputs: [
            {id: 401, quantity: 280, shop_price: 2}, //seaweed
            {id: 2114, quantity: 140, shop_price: 2}, //pineapples
        ]
    },
    "bert-sand": {task: "Sand from Bert", url: "https://runescape.wiki/w/Bert", short: true,
        outputs: [
            {id: 1783, quantity: 420, shop_price: 0}, //bucket of sand
        ]
    },
    "dellmonti-pineapples": {task: "Pineapples and Apples from Dell Monti", url: "https://runescape.wiki/w/Dell_Monti", short: true,
        outputs: [
            {id: 2114, quantity: 140, shop_price: 0}, //pineapples
            {id: 1955, quantity: 140, shop_price: 0}, //cooking apples
        ]
    },
    "coeden-logs": {task: "Logs from Coeden", url: "https://runescape.wiki/w/Coeden", desc: "Average of combinations you could receive", short: true,
        outputs: [
            {id: 29556, quantity: 35, shop_price: 0}, //elder logs
            {id: 1513, quantity: 32, shop_price: 0}, //magic logs
            {id: 1515, quantity: 31, shop_price: 0}, //yew logs
        ]
    },
    "lupe": {task: "Soul Supplies", url: "https://runescape.wiki/w/Lupe#Underworld_achievement_rewards", short: true, desc: "Claim free supplies from Lupe's Soul Supplies",
        outputs: [
            {id: 55595, quantity: 20, shop_price: 0}, //regular ghostly ink
            {id: 55596, quantity: 12, shop_price: 0}, //greater ghostly ink
            {id: 55597, quantity: 8, shop_price: 0}, //powerful ghostly ink
        ]
    },
    "feathers-of-ma-at": {task: "Feathers of Ma'at", url: "https://runescape.wiki/w/Money_making_guide/Buying_feathers_of_Ma%27at", short: true, desc: "Weekly stock (7 days)",
        outputs: [
            {id: 40303, quantity: 7000, shop_price: 1500}, //feather of ma'at
        ]
    },
    "broad-arrowheads": {task: "Broad Arrowheads", url: "https://runescape.wiki/w/Money_making_guide/Buying_broad_arrowheads", short: true, desc: "Weekly stock (7 days). Taverly + Any other Slayer Master (e.g. Lumby)",
        outputs: [
            {id: 13278, quantity: 42000, shop_price: 50}, //broad arrowheads
        ]
    },
    "oldman-potato-cactus": {task: "Potato Cactus from Weird Old Man", url: "https://runescape.wiki/w/Weird_Old_Man", short: true, desc: "Weekly stock (7 days)",
        outputs: [
            {id: 3138, quantity: 280, shop_price: 0}, //potato cactus
        ]
    },
    "razmire-planks": {task: "Planks from Razmire", url: "https://runescape.wiki/w/Razmire_Keelgan", desc: "Weekly stock (7 days). 30 noted planks, other items at this shop might not sell quickly", short: true,
        outputs: [
            {id: 960, quantity: 210, shop_price: 0}, //plank
            {id: 8778, quantity: 210, shop_price: 0}, //oak plank
            {id: 8780, quantity: 210, shop_price: 0}, //teak plank
        ]
    },
    "geoffrey-flax": {task: "Flax from Geoffrey", url: "https://runescape.wiki/w/Geoffrey", short: true, desc: "Weekly stock (7 days)",
        outputs: [
            {id: 1779, quantity: 1400, shop_price: 0}, //flax
        ]
    },
    "cromperty-pure-essence": {task: "Pure Essence from Wizard Cromperty", url: "https://runescape.wiki/w/Wizard_Cromperty", short: true, desc: "Weekly stock (7 days)",
        outputs: [
            {id: 7936, quantity: 1050, shop_price: 0}, //pure essence
        ]
    },
    "rune-shop-run": {task: "Rune Shop Run", url: "https://runescape.wiki/w/Money_making_guide/Buying_runes", short: true, desc: "Weekly stock (7 days)",
        outputs: [
            {id: 554, quantity: 52500, shop_price: 17}, //fire rune
            {id: 555, quantity: 52500, shop_price: 17}, //water rune
            {id: 556, quantity: 52500, shop_price: 17}, //air rune
            {id: 557, quantity: 52500, shop_price: 17}, //earth rune
            {id: 558, quantity: 39900, shop_price: 17}, //mind rune
            {id: 559, quantity: 32900, shop_price: 16}, //body rune
            {id: 560, quantity: 13300, shop_price: 310}, //death rune
            {id: 561, quantity: 8400, shop_price: 372}, //nature rune
            {id: 562, quantity: 12600, shop_price: 140}, //chaos rune
            {id: 563, quantity: 4900, shop_price: 378}, //law rune
            {id: 564, quantity: 2800, shop_price: 232}, //cosmic rune
            {id: 565, quantity: 2800, shop_price: 550}, //blood rune
            {id: 566, quantity: 2100, shop_price: 410}, //soul rune
            {id: 9075, quantity: 700, shop_price: 220}, //astral rune
        ]
    },
};

var rs3monthly = {
    "solomon-s-store": {task: "Solomon's Store", url: "https://secure.runescape.com/m=mtxn_rs_shop/index?jptg=ia&jptv=sgs_page#category/FreeItem", short: true, desc: "Free cosmetics, check loyalty points and sales"},
    "giant-oyster": {task: "Giant Oyster", url: "https://runescape.wiki/w/Giant_Oyster", short: true, desc: "Fishing & Farming XP and a free treasure trails chest"},
    "god-statues": {task: "God Statues", url: "https://runescape.wiki/w/God_Statues", desc: "Up to 177k construction and 88k prayer or slayer xp"},
    "effigy-incubator": {task: "Effigy Incubator", url: "https://runescape.wiki/w/Effigy_Incubator", desc: "Get 10+ effigies"},
    "troll-invasion": {task: "Troll Invasion", url: "https://runescape.wiki/w/Troll_Invasion", desc: "Defend all waves for up to 77k xp book and a treasure hunter key"},
    "dream-of-iaia-xp": {task: "Dream of Iaia XP", url: "https://runescape.wiki/w/Dream_of_Iaia", desc: "Use up stored xp in skilling stations"},
};

const isSplitDailyTablesEnabled = function() {
    return (storage.getItem(profilePrefix + splitDailyTablesStorageKey) ?? 'true') !== 'false';
};

const isSplitWeeklyTablesEnabled = function() {
    return (storage.getItem(profilePrefix + splitWeeklyTablesStorageKey) ?? 'false') === 'true';
};

const getSectionLayoutKey = function() {
    let dailyLayoutMode = isSplitDailyTablesEnabled() ? 'split' : 'combined';
    let weeklyLayoutMode = isSplitWeeklyTablesEnabled() ? 'split' : 'combined';
    return profilePrefix + sectionLayoutStorageKey + '-daily-' + dailyLayoutMode + '-weekly-' + weeklyLayoutMode;
};

const getStoredSectionLayout = function() {
    let storedLayout = storage.getItem(getSectionLayoutKey());

    if (!storedLayout) {
        // Preserve existing user row order from older key formats.
        let dailyLayoutMode = isSplitDailyTablesEnabled() ? 'split' : 'combined';
        storedLayout = storage.getItem(profilePrefix + sectionLayoutStorageKey + '-' + dailyLayoutMode);

        if (!storedLayout && isSplitDailyTablesEnabled()) {
            storedLayout = storage.getItem(profilePrefix + sectionLayoutStorageKey);
        }

        if (!!storedLayout) {
            storage.setItem(getSectionLayoutKey(), storedLayout);
        }
    }

    if (!storedLayout) {
        return {};
    }

    try {
        let parsedLayout = JSON.parse(storedLayout);
        return typeof parsedLayout === 'object' && parsedLayout !== null ? parsedLayout : {};
    } catch (e) {
        return {};
    }
};

const saveSectionLayout = function() {
    let sectionLayout = {};

    for (let timeFrame of timeframes) {
        sectionLayout[timeFrame] = [];
    }

    let allRows = document.querySelectorAll('.activity_table tbody tr');

    for (let row of allRows) {
        let layoutTimeframe = row.dataset.timeframe;

        if (!isSplitDailyTablesEnabled() && layoutTimeframe === 'rs3dailyshops') {
            layoutTimeframe = 'rs3daily';
        }

        if (!isSplitWeeklyTablesEnabled() && layoutTimeframe === 'rs3weeklyshops') {
            layoutTimeframe = 'rs3weekly';
        }

        if (sectionLayout[layoutTimeframe] && !sectionLayout[layoutTimeframe].includes(row.dataset.task)) {
            sectionLayout[layoutTimeframe].push(row.dataset.task);
        }
    }

    storage.setItem(getSectionLayoutKey(), JSON.stringify(sectionLayout));
};

const applyStoredSectionLayout = function() {
    let sectionLayout = getStoredSectionLayout();

    for (let timeFrame of timeframes) {
        let sectionOrder = sectionLayout[timeFrame];
        let tbody = document.querySelector('#' + timeFrame + '_table tbody');

        if (!Array.isArray(sectionOrder)) {
            continue;
        }

        for (let taskSlug of sectionOrder) {
            let targetRow = document.querySelector('tr[data-task="' + taskSlug + '"]');

            if (!!targetRow) {
                tbody.appendChild(targetRow);
            }
        }
    }
};

const resetStoredSectionLayout = function(timeFrame) {
    let sectionLayout = getStoredSectionLayout();
    let defaultTasks = Object.keys(window[timeFrame]);

    if (Object.keys(sectionLayout).length === 0) {
        return;
    }

    for (let section of timeframes) {
        if (!Array.isArray(sectionLayout[section])) {
            sectionLayout[section] = [];
        }

        sectionLayout[section] = sectionLayout[section].filter((taskSlug) => !defaultTasks.includes(taskSlug));
    }

    let homeSectionTasks = Array.isArray(sectionLayout[timeFrame]) ? sectionLayout[timeFrame] : [];
    sectionLayout[timeFrame] = [...defaultTasks, ...homeSectionTasks];

    storage.setItem(getSectionLayoutKey(), JSON.stringify(sectionLayout));
};

const clearDragState = function() {
    let clearRows = document.querySelectorAll('.activity_table tbody tr');

    for (let clearRow of clearRows) {
        clearRow.classList.remove('dragover');
    }
};

const updateProfitDisplay = function(timeFrame, delta) {
    let totalProfitElement = document.getElementById(timeFrame + '_totalprofit');

    if (!totalProfitElement) {
        return;
    }

    let totalProfitNumber = parseInt(String(totalProfitElement.textContent).replace(/\D/g, ''), 10) || 0;
    let newProfit = totalProfitNumber + delta;
    totalProfitElement.innerHTML = 'Total Profit: <strong>' + newProfit.toLocaleString() + '</strong><span class="coin">●</span>';
};

const updateDailyProfitDisplay = function(delta) {
    updateProfitDisplay('rs3dailyshops', delta);
    syncCombinedDailyProfitDisplay();
};

const updateWeeklyProfitDisplay = function(delta) {
    updateProfitDisplay('rs3weeklyshops', delta);
    syncCombinedWeeklyProfitDisplay();
};

const syncCombinedDailyProfitDisplay = function() {
    let sourceProfitElement = document.getElementById('rs3dailyshops_totalprofit');
    let targetProfitElement = document.getElementById('rs3daily_totalprofit');

    if (!sourceProfitElement || !targetProfitElement) {
        return;
    }

    if (isSplitDailyTablesEnabled()) {
        targetProfitElement.innerHTML = '';
        return;
    }

    targetProfitElement.innerHTML = sourceProfitElement.innerHTML;
};

const syncCombinedWeeklyProfitDisplay = function() {
    let sourceProfitElement = document.getElementById('rs3weeklyshops_totalprofit');
    let targetProfitElement = document.getElementById('rs3weekly_totalprofit');

    if (!sourceProfitElement || !targetProfitElement) {
        return;
    }

    if (isSplitWeeklyTablesEnabled()) {
        targetProfitElement.innerHTML = '';
        return;
    }

    targetProfitElement.innerHTML = sourceProfitElement.innerHTML;
};

const applyDailySectionMode = function() {
    let dailiesTbody = document.querySelector('#rs3daily_table tbody');
    let gatheringTbody = document.querySelector('#rs3dailyshops_table tbody');

    if (!dailiesTbody || !gatheringTbody) {
        return;
    }

    if (isSplitDailyTablesEnabled()) {
        document.body.classList.remove('combine-daily-sections');

        let gatheringRowsInDaily = dailiesTbody.querySelectorAll('tr[data-timeframe="rs3dailyshops"]');
        for (let row of gatheringRowsInDaily) {
            gatheringTbody.appendChild(row);
        }
    } else {
        document.body.classList.add('combine-daily-sections');

        let gatheringRows = gatheringTbody.querySelectorAll('tr[data-timeframe="rs3dailyshops"]');
        for (let row of gatheringRows) {
            dailiesTbody.appendChild(row);
        }
    }

    syncCombinedDailyProfitDisplay();
};

const applyWeeklySectionMode = function() {
    let weeklyTbody = document.querySelector('#rs3weekly_table tbody');
    let weeklyGatheringTbody = document.querySelector('#rs3weeklyshops_table tbody');

    if (!weeklyTbody || !weeklyGatheringTbody) {
        return;
    }

    if (isSplitWeeklyTablesEnabled()) {
        document.body.classList.remove('combine-weekly-sections');

        let weeklyGatheringRowsInWeekly = weeklyTbody.querySelectorAll('tr[data-timeframe="rs3weeklyshops"]');
        for (let row of weeklyGatheringRowsInWeekly) {
            weeklyGatheringTbody.appendChild(row);
        }
    } else {
        document.body.classList.add('combine-weekly-sections');

        let weeklyGatheringRows = weeklyGatheringTbody.querySelectorAll('tr[data-timeframe="rs3weeklyshops"]');
        for (let row of weeklyGatheringRows) {
            weeklyTbody.appendChild(row);
        }
    }

    syncCombinedWeeklyProfitDisplay();
};

const syncRowActionButton = function(targetRow) {
    if (!targetRow) {
        return;
    }

    let actionButton = targetRow.querySelector('td.activity_name button.hide-button');

    if (!actionButton) {
        return;
    }

    if (targetRow.dataset.completed === 'hide') {
        actionButton.classList.remove('btn-danger');
        actionButton.classList.add('btn-success');
        actionButton.title = 'Show row again';
        actionButton.innerHTML = '+';
    } else {
        actionButton.classList.remove('btn-success');
        actionButton.classList.add('btn-danger');
        actionButton.title = 'Hide row';
        actionButton.innerHTML = '⊘';
    }
};

const restoreHiddenRow = function(targetRow, visualTimeframe) {
    if (!targetRow || targetRow.dataset.completed !== 'hide') {
        return;
    }

    targetRow.dataset.completed = 'false';
    storage.removeItem(profilePrefix + targetRow.dataset.task);

    if (targetRow.dataset.timeframe === 'rs3dailyshops' && targetRow.hasAttribute('data-profit')) {
        updateDailyProfitDisplay(parseInt(targetRow.dataset.profit, 10));
    }
    if (targetRow.dataset.timeframe === 'rs3weeklyshops' && targetRow.hasAttribute('data-profit')) {
        updateWeeklyProfitDisplay(parseInt(targetRow.dataset.profit, 10));
    }

    syncRowActionButton(targetRow);
    saveSectionLayout();
    updateShowHiddenButton(visualTimeframe);
};

const updateShowHiddenButton = function(timeFrame) {
    let showHiddenButton = document.getElementById(timeFrame + '_show_hidden_button');
    let tableContainer = document.querySelector('div.' + timeFrame + '_table');
    let tbody = document.querySelector('#' + timeFrame + '_table tbody');
    let hiddenRows = tbody.querySelectorAll('tr[data-completed="hide"]');
    let hiddenCount = hiddenRows.length;
    let showHidden = tableContainer.dataset.showHidden === 'true';

    if (!showHiddenButton) {
        return;
    }

    if (hiddenCount === 0) {
        tableContainer.dataset.showHidden = 'false';
    }

    showHidden = tableContainer.dataset.showHidden === 'true';

    showHiddenButton.style.display = hiddenCount > 0 ? 'inline-block' : 'none';
    showHiddenButton.title = (showHidden ? 'Hide' : 'Show') + ' hidden rows (' + hiddenCount + ')';
    showHiddenButton.innerHTML = (showHidden ? '-' : '+') + '<span class="expanding_text">' + (showHidden ? 'Hide Hidden' : 'Show Hidden') + ' (' + hiddenCount + ')</span>';
};

const showHiddenButton = function(timeFrame) {
    let showButton = document.getElementById(timeFrame + '_show_hidden_button');
    if (!showButton) {
        return;
    }

    showButton.addEventListener('click', function() {
        let tableContainer = document.querySelector('div.' + timeFrame + '_table');
        tableContainer.dataset.showHidden = tableContainer.dataset.showHidden === 'true' ? 'false' : 'true';
        updateShowHiddenButton(timeFrame);
    });

    updateShowHiddenButton(timeFrame);
};

/**
 * Populate the HTML with data for a timeFrame and attach listeners
 * @param {String} timeFrame
 * @returns
 */
const populateTable = function(timeFrame) {
    let data = window[timeFrame];

    const sampleRow = document.querySelector('#sample_row');
    const table = document.getElementById(timeFrame + '_table');
    if (!sampleRow || !table) {
        return;
    }

    const tbody = table.querySelector('tbody');

    //Hidden table
    let hideTable = storage.getItem(profilePrefix + timeFrame + '-hide') ?? 'false';
    if (hideTable == 'hide') {
        document.querySelector('div.' + timeFrame + '_table').dataset.hide = 'hide';
    }

    //User defined sorting
    let customOrder = storage.getItem(profilePrefix + timeFrame + '-order') ?? 'false';
    if (customOrder !== 'false' && !['asc', 'desc', 'alpha', 'default'].includes(customOrder)) {
        let sortArray = customOrder.split(',');

        data = Object.keys(data).sort(function(a, b) {
            let indexA = sortArray.indexOf(a);
            let indexB = sortArray.indexOf(b);

            if (indexA == -1 && indexB == -1) {
                return 0;
            } else if (indexA == -1) {
                return 1;
            } else if (indexB == -1) {
                return -1
            } else {
                return indexA - indexB;
            }
        }).reduce(
            (obj, key) => {
                obj[key] = data[key];
                return obj;
            },
            {}
        );
    }

    //loop through tasks in timeframe
    for (let taskSlug in data) {
        let rowClone = sampleRow.content.cloneNode(true);
        let newRow = rowClone.querySelector('tr');
        let newRowAnchor = rowClone.querySelector('td.activity_name a');
        let newRowColor = rowClone.querySelector('td.activity_color .activity_desc');

        let taskState = storage.getItem(profilePrefix + taskSlug) ?? 'false';

        newRow.dataset.task=taskSlug;
        newRow.dataset.timeframe = timeFrame;

        if (!!data[taskSlug].url) {
            newRowAnchor.href = data[taskSlug].url;
            newRowAnchor.innerHTML = data[taskSlug].task;

            /**
             * Handle if task has associated items
             * @todo refactor
             */
            if (!!data[taskSlug].outputs || !!data[taskSlug].outputs_max) {
                let totalInputPrice = 0;
                let totalItemProfit = 0;
                let buyItems = [];
                let skipItems = [];

                if (!!data[taskSlug].inputs) {
                    for (let input of data[taskSlug].inputs) {
                        let inputApiData = rsapidata[input.id] ?? {price: 0};
                        totalInputPrice += input.quantity * (input.shop_price ?? parseInt(String(inputApiData.price).replace(/\D/g, ''), 10));
                    }
                }

                if (!!data[taskSlug].outputs_max) {
                    let rowMaxProfit = 0;
                    for (outputMax of data[taskSlug].outputs_max) {
                        let rowMax = calcOutputs(outputMax, totalInputPrice, 'max');
                        totalItemProfit += rowMax.totalItemProfit;
                        if (taskState != 'hide') {
                            if (timeFrame === 'rs3dailyshops') {
                                totalDailyProfit += rowMax.totalDailyProfit;
                            }
                            if (timeFrame === 'rs3weeklyshops') {
                                totalWeeklyProfit += rowMax.totalDailyProfit;
                            }
                        }
                        rowMaxProfit += rowMax.totalDailyProfit
                        buyItems.push(...rowMax.buyItems);
                        skipItems.push(...rowMax.skipItems);
                    }
                    newRow.dataset.profit = rowMaxProfit;
                } else {
                    let rowSum = calcOutputs(data[taskSlug].outputs, totalInputPrice);
                    totalItemProfit += rowSum.totalItemProfit;
                    if (taskState != 'hide') {
                        if (timeFrame === 'rs3dailyshops') {
                            totalDailyProfit += rowSum.totalDailyProfit;
                        }
                        if (timeFrame === 'rs3weeklyshops') {
                            totalWeeklyProfit += rowSum.totalDailyProfit;
                        }
                    }
                    newRow.dataset.profit = rowSum.totalDailyProfit;
                    buyItems.push(...rowSum.buyItems);
                    skipItems.push(...rowSum.skipItems);
                }


                let profitSpan = newRowColor.parentNode.insertBefore(document.createElement('span'), newRowColor);
                profitSpan.classList.add('item_profit');
                profitSpan.innerHTML = '<span class="item_profit_label">Profit: </span><strong>' + totalItemProfit.toLocaleString() + '</strong><span class="coin">●</span>';
                if (!!data[taskSlug].desc) {
                    newRowColor.innerHTML += '<br>' + data[taskSlug].desc;
                }

                for (let item of buyItems) {
                    let itemApiData = rsapidata[item.id] ?? {name: 'Unknown item #' + item.id};
                    let itemInputData = !!item.inputs ? ' data-inputs="' + encodeURIComponent(JSON.stringify(item.inputs)) + '"' : '';

                    newRowColor.innerHTML += '<div class="item_output" data-item_id="' + item.id + '" data-shop_price="' + item.shop_price + '"' + itemInputData + '>'
                                            + '<img class="item_icon" src="/rsdata/images/' + item.id + '.gif">'
                                            + (!!item.label_override ? item.label_override : itemApiData.name) + ' x' + item.quantity.toLocaleString() + ' (' + item.profit.toLocaleString() + ')'
                                            + '</div>';
                }

                if (skipItems.length > 0) {
                    newRowColor.innerHTML += '<br>Skip:<br>'
                    for (let item of skipItems) {
                        let itemApiData = rsapidata[item.id] ?? {name: 'Unknown item #' + item.id};
                        newRowColor.innerHTML += '<div class="item_output" data-item_id="' + item.id + '" data-shop_price="' + item.shop_price + '">'
                                                + '<img class="item_icon" src="/rsdata/images/' + item.id + '.gif">'
                                                + (!!item.label_override ? item.label_override : itemApiData.name) + ' x' + item.quantity.toLocaleString() + ' (' + item.profit.toLocaleString() + ')'
                                                + '</div>';
                    }
                }
            } else if (!!data[taskSlug].inputs) {
                //entries with only inputs and no outputs for display purposes
                newRowColor.innerHTML = data[taskSlug].desc;
                for (let item of data[taskSlug].inputs) {
                    let itemApiData = rsapidata[item.id] ?? {name: 'Unknown item #' + item.id};
                    let itemInputData = !!item.inputs ? ' data-inputs="' + encodeURIComponent(JSON.stringify(item.inputs)) + '"' : '';

                    newRowColor.innerHTML += '<div class="item_output" data-item_id="' + item.id + '" data-shop_price="' + item.shop_price + '"' + itemInputData + '>'
                                            + '<img class="item_icon" src="/rsdata/images/' + item.id + '.gif">'
                                            + (!!item.label_override ? item.label_override : itemApiData.name) + ' x' + item.quantity.toLocaleString()
                                            + '</div>';
                }

            } else if (!!data[taskSlug].desc) {
                newRowColor.innerHTML = data[taskSlug].desc;
            }
        } else {
            newRowAnchor.innerHTML = data[taskSlug].task;
        }

        tbody.appendChild(newRow);
        newRow.dataset.completed = taskState;
        syncRowActionButton(newRow);
    }

    //@todo kludgy double dom manipulation because depends on profit calcs in the html
    if (['asc', 'desc', 'alpha'].includes(customOrder)) {
        table.dataset.sort = customOrder;
        let tableRows = Array.from(tbody.querySelectorAll('tr'));
        tableRows.sort((a, b) => {
            if (customOrder == 'alpha') {
                return a.dataset.task.localeCompare(b.dataset.task)
            } else if (customOrder == 'asc') {
                return a.dataset.profit - b.dataset.profit;
            } else if (customOrder == 'desc') {
                return b.dataset.profit - a.dataset.profit;
            }
        });

        for (let sortedrow of tableRows) {
            tbody.appendChild(sortedrow);
        }
    }

    let tableRows = Array.from(tbody.querySelectorAll('tr'));
    for (let row of tableRows) {
        if (row.dataset.completed == 'hide') {
            tbody.appendChild(row);
        }
    }

    if (timeFrame == 'rs3dailyshops') {
        document.getElementById('rs3dailyshops_totalprofit').innerHTML = 'Total Profit: <strong>' + totalDailyProfit.toLocaleString() + '</strong><span class="coin">●</span>';
        syncCombinedDailyProfitDisplay();
    }
    if (timeFrame == 'rs3weeklyshops') {
        document.getElementById('rs3weeklyshops_totalprofit').innerHTML = 'Total Profit: <strong>' + totalWeeklyProfit.toLocaleString() + '</strong><span class="coin">●</span>';
        syncCombinedWeeklyProfitDisplay();
    }
};

/**
 * Calculates profits for array of items passed in
 * @param {*} outputArray array of objects to calc
 * @param {*} totalInputPrice inputs price to calc profit
 * @param {*} method default is sum, set to `max` as needed
 * @returns Object
 */
const calcOutputs = function(outputArray, totalInputPrice, method='sum') {
    let returnObj = {
        buyItems: [],
        skipItems: [],
        totalItemProfit: 0,
        totalDailyProfit: 0
    };

    for (let item of outputArray) {
        let itemApiData = rsapidata[item.id] ?? {price: 0}

        let itemPrice = String(itemApiData.price).endsWith('k')
            ? parseFloat(String(itemApiData.price).slice(0, -1).replace(/,/g, '')) * 1000
            : parseInt(String(itemApiData.price).replace(/\D/g, ''), 10);

        if (!!item.multiplier) {
            item.quantity *= item.multiplier;
        }

        let itemCost = totalInputPrice > 0 ? totalInputPrice : item.quantity * (item.shop_price ?? parseInt(String(itemApiData.price).replace(/\D/g, ''), 10));
        item.profit = Math.round((item.quantity * itemPrice) - itemCost);

        if (method == 'max') {
            if ((!!item.inputs)) {
                for (let inputkey in item.inputs) {
                    let inputItemData = rsapidata[inputkey] ?? {price: 0};
                    item.profit = Math.round(item.profit - Math.round(item.inputs[inputkey] * inputItemData.price));
                }
            }

            if (returnObj.buyItems.length > 0 && item.profit > returnObj.buyItems[0].profit) {
                returnObj.buyItems[0] = item;
            } else if (returnObj.buyItems.length == 0) {
                returnObj.buyItems.push(item);
            }
        } else {
            if (item.profit > 0) {
                returnObj.buyItems.push(item);
                returnObj.totalItemProfit += item.profit;
                returnObj.totalDailyProfit += item.profit;
            } else {
                returnObj.skipItems.push(item);
            }
        }
    }

    if (method == 'max') {
        returnObj.totalItemProfit += returnObj.buyItems[0].profit;
        returnObj.totalDailyProfit += returnObj.buyItems[0].profit;
    }

    return returnObj;
};

/**
 * Attach event listeners to table cells
 */
const tableEventListeners = function() {
    let rowsColor = document.querySelectorAll('td.activity_color');
    let rowsHide = document.querySelectorAll('td.activity_name button.hide-button');

    for (let colorCell of rowsColor) {
        colorCell.addEventListener('click', function () {
            let thisRow = this.closest('tr');

            // Temporarily shown hidden rows should not be completable.
            if (thisRow.dataset.completed === 'hide') {
                return;
            }

            let thisTimeframe = thisRow.dataset.timeframe;
            let taskSlug = thisRow.dataset.task;
            let newState = (thisRow.dataset.completed === 'true') ? 'false' : 'true'
            thisRow.dataset.completed = newState;

            if (newState === 'true') {
                storage.setItem(profilePrefix + taskSlug, newState);
            } else {
                storage.removeItem(profilePrefix + taskSlug);
            }

            storage.setItem(profilePrefix + thisTimeframe + '-updated', new Date().getTime());
        });

        let descriptionAnchors = colorCell.querySelectorAll('a');
        for (let anchor of descriptionAnchors) {
            anchor.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    for (let rowHide of rowsHide) {
        rowHide.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            let thisTbody = this.closest('tbody');
            let thisVisualTimeframe = this.closest('table').dataset.timeframe;
            let thisRow = this.closest('tr');
            
            if (thisRow.dataset.completed === 'hide') {
                restoreHiddenRow(thisRow, thisVisualTimeframe);
                return;
            }

            let taskSlug = thisRow.dataset.task;
            thisRow.dataset.completed = 'hide';
            storage.setItem(profilePrefix + taskSlug, 'hide');

            if (thisRow.dataset.timeframe === 'rs3dailyshops' && thisRow.hasAttribute('data-profit')) {
                updateDailyProfitDisplay(parseInt(thisRow.dataset.profit, 10) * -1);
            }
            if (thisRow.dataset.timeframe === 'rs3weeklyshops' && thisRow.hasAttribute('data-profit')) {
                updateWeeklyProfitDisplay(parseInt(thisRow.dataset.profit, 10) * -1);
            }

            syncRowActionButton(thisRow);
            thisTbody.appendChild(thisRow);
            saveSectionLayout();
            updateShowHiddenButton(thisVisualTimeframe);
        });
    }
};

/**
 * Handle clicking sort button for a table
 * @param {String} timeFrame
 */
const sortButton = function(timeFrame) {
    const sortButton = document.getElementById(timeFrame + '_sort_button');
    if (!sortButton) {
        return;
    }

    sortButton.addEventListener('click', function(e) {
        const table = document.querySelector('#' + timeFrame + '_table');
        const tbody = table.querySelector('tbody');
        const tableRows = Array.from(tbody.querySelectorAll('tr'));
        let sortstate = table.dataset.sort;

        tableRows.sort((a, b) => {
            if (sortstate == 'alpha') {
                let data = Object.keys(window[timeFrame]);
                table.dataset.sort = 'default';
                storage.removeItem(profilePrefix + timeFrame + '-order');
                return data.indexOf(a.dataset.task) - data.indexOf(b.dataset.task);
            } else if (sortstate == 'asc') {
                table.dataset.sort = 'alpha';
                storage.setItem(profilePrefix + timeFrame + '-order', 'alpha');
                return a.querySelector('td a').innerHTML.localeCompare(b.querySelector('td a').innerHTML);
            } else if (sortstate == 'desc') {
                table.dataset.sort = 'asc';
                storage.setItem(profilePrefix + timeFrame + '-order', 'asc');
                return a.dataset.profit - b.dataset.profit;
            } else {
                table.dataset.sort = 'desc';
                storage.setItem(profilePrefix + timeFrame + '-order', 'desc');
                return b.dataset.profit - a.dataset.profit;
            }
        });

        for (let sortedrow of tableRows) {
            tbody.appendChild(sortedrow);
        }

        saveSectionLayout();
    });
};

/**
 * Attach drag and drop functionality after elements added to DOM
 */
const draggableTable = function() {
    const targetRows = document.querySelectorAll('.activity_table tbody tr');
    const targetBodies = document.querySelectorAll('.activity_table tbody');

    for (let row of targetRows) {
        row.addEventListener('dragstart', function(e) {
            dragRow = this;
        });

        row.addEventListener('dragenter', function(e) {
            this.classList.add('dragover');
        });

        row.addEventListener('dragover', function(e) {
            e.preventDefault();

            let dragOverRow = e.target.closest('tr');

            if (!dragRow || !dragOverRow || dragOverRow === dragRow) {
                return;
            }

            let rowArray = Array.from(dragOverRow.parentNode.querySelectorAll('tr'));

            if (rowArray.indexOf(dragRow) < rowArray.indexOf(dragOverRow)) {
                dragOverRow.after(dragRow);
            } else {
                dragOverRow.before(dragRow);
            }
        });

        row.addEventListener('dragleave', function(e) {
            this.classList.remove('dragover');
        });

        row.addEventListener('dragend', function(e) {
            clearDragState();
            if (!!dragRow) {
                saveSectionLayout();
                dragRow = null;
            }
        });

        row.addEventListener('drop', function(e) {
            if (!dragRow) {
                return false;
            }

            let dropTargetRow = e.target.closest('tr');

            if (!!dropTargetRow && dropTargetRow !== dragRow && dropTargetRow.parentNode === this.parentNode) {
                let rowArray = Array.from(dropTargetRow.parentNode.querySelectorAll('tr'));

                if (rowArray.indexOf(dragRow) < rowArray.indexOf(dropTargetRow)) {
                    dropTargetRow.after(dragRow);
                } else {
                    dropTargetRow.before(dragRow);
                }
            }

            e.stopPropagation();
            e.preventDefault();
            clearDragState();
            saveSectionLayout();
            dragRow = null;

            return false;
        });
    }

    for (let tbody of targetBodies) {
        tbody.addEventListener('dragover', function(e) {
            e.preventDefault();

            if (!dragRow || !!e.target.closest('tr')) {
                return;
            }

            this.appendChild(dragRow);
        });

        tbody.addEventListener('drop', function(e) {
            e.preventDefault();

            if (!dragRow) {
                return false;
            }

            if (!e.target.closest('tr')) {
                this.appendChild(dragRow);
            }

            clearDragState();
            saveSectionLayout();
            dragRow = null;

            return false;
        });
    }
};

/**
 * Takes a timeframe name and clear the associated localstorage and toggle the html data off
 * @param {String} timeFrame
 * @param {Boolean} html change the data on the element or not
 */
const resetTable = function(timeFrame, html) {
    const tableRows = document.querySelectorAll('tr[data-timeframe="' + timeFrame + '"]');

    for (let rowTarget of tableRows) {
        let itemState = storage.getItem(profilePrefix + rowTarget.dataset.task) ?? 'false';
        if (itemState != 'hide') {
            if (html) {
                rowTarget.dataset.completed = false;
            }

            storage.removeItem(profilePrefix + rowTarget.dataset.task);
        }
    }

    storage.removeItem(profilePrefix + timeFrame + '-updated');
};

/**
 * Attach event listener to button for resetting table
 * @param {String} timeFrame
 */
const resettableSection = function(timeFrame) {
    let resetButton = document.querySelector('#' + timeFrame + '_reset_button');
    if (!resetButton) {
        return;
    }

    resetButton.addEventListener('click', function () {
        let timeframesToReset = [timeFrame];
        if (!isSplitDailyTablesEnabled() && timeFrame === 'rs3daily') {
            timeframesToReset.push('rs3dailyshops');
        }
        if (!isSplitWeeklyTablesEnabled() && timeFrame === 'rs3weekly') {
            timeframesToReset.push('rs3weeklyshops');
        }

        for (let resetTimeFrame of timeframesToReset) {
            let data = window[resetTimeFrame];
            let unhideTable = document.querySelector('div.' + resetTimeFrame + '_table');

            if (!!unhideTable) {
                unhideTable.dataset.hide = '';
            }

            storage.removeItem(profilePrefix + resetTimeFrame + '-hide');

            for (let taskSlug in data) {
                let itemState = storage.getItem(profilePrefix + taskSlug) ?? 'false';

                if (itemState == 'hide') {
                    storage.removeItem(profilePrefix + taskSlug);
                }
            }

            storage.removeItem(profilePrefix + resetTimeFrame + '-order');
            resetStoredSectionLayout(resetTimeFrame);
        }

        window.location.reload();
    });
};

/**
 * Attach event listener for hiding/unhiding table
 * @param {String} timeFrame
 */
const hidableSection = function(timeFrame) {
    let hideButton = document.querySelector('#' + timeFrame + '_hide_button');
    if (!hideButton) {
        return;
    }

    hideButton.addEventListener('click', function () {
        let hideTable = document.querySelector('div.' + timeFrame + '_table');
        hideTable.dataset.hide = 'hide';
        storage.setItem(profilePrefix + timeFrame + '-hide', 'hide');
    });

    let unhideTable = function () {
        let hideTable = document.querySelector('div.' + timeFrame + '_table');
        hideTable.dataset.hide = '';
        storage.removeItem(profilePrefix + timeFrame + '-hide');
    };

    let navLink = document.querySelector('#' + timeFrame + '_nav');
    if (!!navLink) {
        navLink.addEventListener('click', unhideTable);
    }

    let unhideButton = document.querySelector('#' + timeFrame + '_unhide_button');
    if (!!unhideButton) {
        unhideButton.addEventListener('click', unhideTable);
    }
};

/**
 * Check if last updated timestamp for a timeframe is less than
 * the last reset for that timeframe if so reset the category
 * @param {String} timeFrame
 * @returns
 */
const checkReset = function(timeFrame) {
    let tableUpdateTime = storage.getItem(profilePrefix + timeFrame + '-updated') ?? 'false';

    if (tableUpdateTime === 'false') {
        return false;
    }

    let updateTime = new Date(parseInt(tableUpdateTime));

    let nextdate = new Date();
    nextdate.setUTCHours(0);
    nextdate.setUTCMinutes(0);
    nextdate.setUTCSeconds(0);

    //check lastupdated < last weekly reset
    if (['rs3weekly', 'rs3weeklyshops'].includes(timeFrame)) {
        let resetday = 3;
        let weekmodifier = (7 - resetday + nextdate.getUTCDay()) % 7;
        nextdate.setUTCDate(nextdate.getUTCDate() - weekmodifier);
    } else if (timeFrame == 'rs3monthly') {
        nextdate.setUTCDate(1);
    }

    if (updateTime.getTime() < nextdate.getTime()) {
        resetTable(timeFrame, true);
    }
};

/**
 * Add a countdown timer until the next reset for a timeframe
 * @param {String} timeFrame
 */
const countDown = function(timeFrame) {
    let countdownTarget = document.getElementById('countdown-' + timeFrame);
    if (!countdownTarget) {
        return;
    }

    let nextdate = new Date();

    if (['rs3weekly', 'rs3weeklyshops'].includes(timeFrame)) {
        let resetday = 3;
        nextdate.setUTCHours(24);
        nextdate.setUTCMinutes(0);
        nextdate.setUTCSeconds(0);
        let weekmodifier = (7 + resetday - nextdate.getUTCDay() ) % 7;
        nextdate.setUTCDate(nextdate.getUTCDate() + weekmodifier);
    } else if (timeFrame == 'rs3monthly') {
        nextdate.setUTCHours(0);
        nextdate.setUTCMinutes(0);
        nextdate.setUTCSeconds(0);
        nextdate.setUTCMonth(nextdate.getUTCMonth() + 1);
        nextdate.setUTCDate(1);
    } else {
        nextdate.setUTCHours(24);
        nextdate.setUTCMinutes(0);
        nextdate.setUTCSeconds(0);
    }

    let nowtime = new Date();
    let remainingtime = (nextdate.getTime() - nowtime.getTime()) / 1000;

    let timeparts = [
        Math.floor(remainingtime / 86400), //d
        Math.floor(remainingtime % 86400 / 3600), //h
        Math.floor(remainingtime % 3600 / 60), //m
        Math.floor(remainingtime % 60) //s
    ];

    countdownTarget.innerHTML = (timeparts[0] > 0 ? (timeparts[0] + 'd ') : '') + (timeparts[1] > 0 ? (timeparts[1] + 'h ') : '') + timeparts[2] + 'm ' + timeparts[3] + 's';
};

/**
 * Calculate the featured dnd of the week
 * @see https://runescape.wiki/w/Template:SofDnD
 */
const dndOfTheWeek = function() {
    const outputElement = document.getElementById('dnd-of-the-week');

    if (!outputElement) {
        return;
    }

    const dndRotation = ['Evil Tree', 'Shooting Star', 'Penguin Hide and Seek', 'Circus'];

    let currentRotation = Math.floor(((Date.now() / 1000) + 86400) / 604800) % 4;

    outputElement.innerHTML = '<br><strong>' + dndRotation[currentRotation] + '</strong>';
}

/**
 * Good enough for now profile system
 * @todo make it better
 */
const profiles = function() {
    let profilesStored= storage.getItem('profiles') ?? 'default';
    let profilesArray = profilesStored.split(',');

    currentProfile = storage.getItem('current-profile') ?? 'default';
    profilePrefix = currentProfile == 'default' ? '' : currentProfile + '-';

    if (profilesArray.length > 1) {
        let profileName = document.getElementById('profile-name');
        profileName.innerHTML = currentProfile;
        profileName.style.display = 'inline-block';
        profileName.style.visibility = 'visible';
    }

    let profilebutton = document.getElementById('profile-button');
    let profileControl = document.getElementById('profile-control');
    let profileForm = profileControl.querySelector('form');
    let profileName = document.getElementById('profileName');
    let profileList = document.getElementById('profile-list');

    //populate list of existing profiles
    for (let profile of profilesArray) {
        let deleteButton = profile !== 'default' ? '<span class="profile-delete btn btn-danger btn-sm active" data-profile="' + profile + '" title="Delete ' + profile + '">⊘</span>' : '';
        if (profile !== currentProfile) {
            profileList.innerHTML += '<li><a href="#" data-profile="' + profile + '">' + profile + '</a>' + deleteButton + '</li>';
        } else {
            profileList.innerHTML += '<li>' + profile + deleteButton + '</li>'
        }
    }

    //Event listener for profile links
    let profileLinks = profileList.querySelectorAll('li a');
    for (let profileLink of profileLinks) {
        profileLink.addEventListener('click', function(e) {
            e.preventDefault();

            let switchProfile = this.dataset.profile;
            storage.setItem('current-profile', switchProfile);
            window.location.reload();
        });
    }

    //Event listener for delete profile button
    let deleteButtons = profileList.querySelectorAll('.profile-delete');
    for (let deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', function(e) {
            e.preventDefault();
            profilesArray = profilesArray.filter(e => e != this.dataset.profile);
            storage.setItem('profiles', profilesArray.join(','));

            if (this.dataset.profile == currentProfile) {
                storage.setItem('current-profile', 'default');
            }

            let prefix = this.dataset.profile == 'default' ? '' : (this.dataset.profile + '-');
            for (const timeFrame of timeframes) {
                let data = window[timeFrame];
                for (let task in data) {
                    storage.removeItem(prefix + task);
                }
                storage.removeItem(prefix + timeFrame + '-order');
                storage.removeItem(prefix + timeFrame + '-updated');
            }
            for (let key of Object.keys(storage)) {
                if (key.startsWith(prefix + sectionLayoutStorageKey)) {
                    storage.removeItem(key);
                }
            }
            storage.removeItem(prefix + splitDailyTablesStorageKey);
            storage.removeItem(prefix + splitWeeklyTablesStorageKey);

            window.location.reload();
        });
    }

    //alpha-numeric profile names only
    profileName.addEventListener('keypress', function(e) {
        if (!/^[A-Za-z0-9]+$/.test(e.key)) {
            e.preventDefault();
            return false;
        }
    });

    //Event listener for the main button hiding/showing control
    profilebutton.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        let display=profileControl.dataset.display;
        if (display == 'none') {
            profileControl.style.display = 'block';
            profileControl.style.visibility = 'visible';
            profileControl.dataset.display = 'block';
        } else {
            profileControl.style.display = 'none';
            profileControl.style.visibility = 'hidden';
            profileControl.dataset.display = 'none';
        }
    });

    // Save data on submit
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let profileNameField = this.querySelector('input#profileName');
        let profileErrorMsg = profileNameField.parentNode.querySelector('.invalid-feedback');

        if (!/^[A-Za-z0-9]+$/.test(profileNameField.value)) {
            profileName.classList.add('is-invalid');
            profileErrorMsg.innerHTML = 'Alpha numeric and no spaces only';
        } else if (profilesArray.includes(profileNameField.value)) {
            profileName.classList.add('is-invalid');
            profileErrorMsg.innerHTML = 'Profile already exists';
        } else {
            profilesArray.push(profileNameField.value);
            storage.setItem('profiles', profilesArray.join(','));
            storage.setItem('current-profile', profileNameField.value);
            window.location.reload();
        }
    });

    profileControl.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    document.addEventListener('click', function(e) {
        profileControl.style.display = 'none';
        profileControl.style.visibility = 'hidden';
        profileControl.dataset.display = 'none';
    });

    document.addEventListener('scroll', function(e) {
        profileControl.style.display = 'none';
        profileControl.style.visibility = 'hidden';
        profileControl.dataset.display = 'none';
    });
};

const settings = function() {
    let settingsButton = document.getElementById('settings-button');
    let settingsControl = document.getElementById('settings-control');
    let splitDailyTablesInput = document.getElementById('setting-split-daily-tables');
    let splitWeeklyTablesInput = document.getElementById('setting-split-weekly-tables');

    if (!settingsButton || !settingsControl || !splitDailyTablesInput || !splitWeeklyTablesInput) {
        return;
    }

    splitDailyTablesInput.checked = isSplitDailyTablesEnabled();
    splitWeeklyTablesInput.checked = isSplitWeeklyTablesEnabled();

    settingsButton.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        let display = settingsControl.dataset.display;
        if (display == 'none') {
            settingsControl.style.display = 'block';
            settingsControl.style.visibility = 'visible';
            settingsControl.dataset.display = 'block';
        } else {
            settingsControl.style.display = 'none';
            settingsControl.style.visibility = 'hidden';
            settingsControl.dataset.display = 'none';
        }
    });

    splitDailyTablesInput.addEventListener('change', function() {
        if (this.checked) {
            storage.removeItem(profilePrefix + splitDailyTablesStorageKey);
        } else {
            storage.setItem(profilePrefix + splitDailyTablesStorageKey, 'false');
        }

        window.location.reload();
    });

    splitWeeklyTablesInput.addEventListener('change', function() {
        if (this.checked) {
            storage.setItem(profilePrefix + splitWeeklyTablesStorageKey, 'true');
        } else {
            storage.removeItem(profilePrefix + splitWeeklyTablesStorageKey);
        }

        window.location.reload();
    });

    settingsControl.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    let hideSettingsControl = function() {
        settingsControl.style.display = 'none';
        settingsControl.style.visibility = 'hidden';
        settingsControl.dataset.display = 'none';
    };

    document.addEventListener('click', hideSettingsControl);
    document.addEventListener('scroll', hideSettingsControl);
};

/**
 * Toggle between full and compact mode
 */
const layouts = function() {
    const layoutButton = document.getElementById('layout-button');
    const layoutGlyph = layoutButton.querySelector('.glyph');
    let currentLayout = storage.getItem('current-layout') ?? 'default';
    if (currentLayout !== 'default') {
        document.body.classList.add('compact');
        layoutButton.innerHTML = '⊞<span class="expanding_text">&nbsp;Full Mode</span>';
    }

    layoutButton.addEventListener('click', function(e) {
        e.preventDefault();

        let setLayout = document.body.classList.contains('compact') ? 'compact' : 'default';

        if (setLayout == 'default') {
            storage.setItem('current-layout', 'compact');
            document.body.classList.add('compact');
            layoutButton.innerHTML = '⊞<span class="expanding_text">&nbsp;Full Mode</span>';
        } else {
            storage.removeItem('current-layout');
            document.body.classList.remove('compact');
            layoutButton.innerHTML = '⊟<span class="expanding_text">&nbsp;Compact Mode</span>';
        }
    });
};

/**
 * Add event listeners for item tooltips
 */
const itemStatsTooltip = function() {
    let items = document.querySelectorAll('div.item_output');
    let tooltip = document.getElementById('tooltip');

    for (let item of items) {
        item.addEventListener('mouseover', function(e) {
            e.preventDefault();
            let itemdata = rsapidata[this.dataset.item_id] ?? {name: "", price: 0};

            item.after(tooltip);

            tooltip.innerHTML = '<img src="/rsdata/images/' + this.dataset.item_id + '.gif" class="item_icon"> ' + itemdata.name + '<br>'
                                + 'GE: ' + itemdata.price.toLocaleString() + '<span class="coin">●</span>' + (parseInt(this.dataset.shop_price) > 0 ? ' Shop: ' + parseInt(this.dataset.shop_price).toLocaleString() + '<span class="coin">●</span>' : '');
            tooltip.innerHTML += '<br>Change: ' + (itemdata.price > itemdata.last ? '+' : '') + (itemdata.last != itemdata.price ? (itemdata.price - itemdata.last).toLocaleString() : '-') + (itemdata.price > itemdata.last ? '<span class="trend_positive">▲</span>' : itemdata.price < itemdata.last ? '<span class="trend_negative">▼</span>' : '<span class="trend_neutral">-</span>');

            if (!!this.dataset.inputs) {
                tooltip.innerHTML += '<br><strong>Inputs</strong>:<br>';

                let inputItems = JSON.parse(decodeURIComponent(this.dataset.inputs));

                for (let itemkey in inputItems) {
                    let inputItemData = rsapidata[itemkey];
                    tooltip.innerHTML += ' <img src="/rsdata/images/' + itemkey + '.gif" class="item_icon"> ' + inputItemData.name + ' x' + inputItems[itemkey] + ' (-' + parseInt(inputItemData.price * inputItems[itemkey]).toLocaleString() + ')<br>';
                }

            }

            tooltip.style.display = 'block';
            tooltip.style.visibility = 'visible';
        });

        item.addEventListener('mouseout', function(e) {
            tooltip.style.display = 'none';
            tooltip.style.visibility = 'hidden';
        });
    }
};

/**
 * Make bootstrap 5 dropdown menus collapse after link is clicked
 * old method of adding `data-toggle="collapse" data-target=".navbar-collapse.show"` to the <li>s was preventing navigation by the same element
 */
const dropdownMenuHelper = function() {
    const navLinks = document.querySelectorAll('.nav-item:not(.dropdown), .dropdown-item');
    const menuToggle = document.getElementById('navbarSupportedContent');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});

    navLinks.forEach( function(l) {
        l.addEventListener('click', function() {
            if (menuToggle.classList.contains('show')) {
                bsCollapse.toggle();
            }
        });
    });
};

const dataUpdatedCheck = function() {
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
           if (xmlhttp.status == 200) {
               console.log(xmlhttp.responseText);
           }
           else if (xmlhttp.status == 400) {
              alert('There was an error 400');
           }
           else {
               alert('something else other than 200 was returned');
           }
        }
    };

    xmlhttp.open("GET", "/rsdata/rsapiupdated.json", true);
    xmlhttp.send();
}

const enableBootstrapTooltips = function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (e) {
        return new bootstrap.Tooltip(e)
    })
}

/**
 * Set up token modal popup with event listeners
 */
const importExportModal = function() {
    let tokenButton = document.getElementById('token-button');
    let tokenOutput = document.getElementById('token-output')
    let tokenInput = document.getElementById('token-input');
    let copyButton = document.getElementById('token-copy');
    let importButton = document.getElementById('token-import');
    
    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(tokenOutput.value);
    });
    
    tokenButton.addEventListener('click', function() {
        tokenOutput.value = generateToken();
    });
    
    tokenInput.addEventListener('focus', function() {
       tokenInput.classList.remove("is-invalid");
    });
    
    importButton.addEventListener('click', function() {
        let inputToken;
        let jsonObject;
        
        try {
            inputToken = atob(tokenInput.value);
            jsonObject = JSON.parse(inputToken);
        } catch {
            tokenInput.classList.add("is-invalid");
            return;
        }
        
        localStorage.clear();
        
        for(let key in jsonObject) {
            storage.setItem(key, jsonObject[key]);
        }

        // Force a reload instead of manipulating the DOM to correctly display the tables
        location.reload();
    });
}

/**
 * Take all the local application storage, turn it in to a JSON payload and Base64 encode it
 */
const generateToken = function() {
    const items = { ...localStorage };
    return btoa(JSON.stringify(items));
}

window.onload = function() {
    enableBootstrapTooltips();    
    profiles();
    settings();
    layouts();

    for (const timeFrame of timeframes) {
        populateTable(timeFrame);
        checkReset(timeFrame);
        resettableSection(timeFrame);
        hidableSection(timeFrame);
        showHiddenButton(timeFrame);
        countDown(timeFrame);
    }

    applyStoredSectionLayout();
    applyDailySectionMode();
    applyWeeklySectionMode();
    draggableTable();
    for (const timeFrame of timeframes) {
        updateShowHiddenButton(timeFrame);
    }

    dropdownMenuHelper();
    tableEventListeners();
    sortButton('rs3dailyshops');
    sortButton('rs3weeklyshops');
    itemStatsTooltip();
    dndOfTheWeek();
    importExportModal();

    setInterval(function() {
        for (const timeFrame of timeframes) {
            checkReset(timeFrame);
            countDown(timeFrame);
        }
    }, 1000);

    setInterval(function() {
        dataUpdatedCheck();
    }, 600000);
};
