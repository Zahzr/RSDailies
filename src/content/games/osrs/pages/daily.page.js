import { osrsDailySection } from '../sections/dailies/dailies.section.js';

export const osrsDailyPage = {
  id: 'osrsdaily',
  title: 'Dailies',
  game: 'osrs',
  displayOrder: 102,
  route: '/tracker/osrs/daily',
  layout: 'tracker',
  aliases: ['daily', 'dailies', 'osrsdaily'],
  legacyMode: 'osrsdaily',
  buttonLabel: 'Tasks',
  navLabel: 'Dailies',
  menuGroup: 'Tasks',
  includeInViewsPanel: false,
  includeInPrimaryNav: false,
  sections: [osrsDailySection],
};

export default osrsDailyPage;
