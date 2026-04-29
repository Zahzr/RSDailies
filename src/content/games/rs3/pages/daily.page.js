import { rs3DailySection } from '../sections/dailies/dailies.section.js';

export const rs3DailyPage = {
  id: 'rs3daily',
  title: 'Dailies',
  game: 'rs3',
  displayOrder: 4,
  route: '/tracker/daily',
  layout: 'tracker',
  aliases: ['daily', 'dailies', 'rs3daily'],
  legacyMode: 'rs3daily',
  buttonLabel: 'Tasks',
  navLabel: 'Dailies',
  menuGroup: 'Tasks',
  includeInViewsPanel: false,
  includeInPrimaryNav: false,
  sections: [rs3DailySection],
};

export default rs3DailyPage;
