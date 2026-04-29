import { rs3WeeklySection } from '../sections/weeklies/weeklies.section.js';

export const rs3WeeklyPage = {
  id: 'rs3weekly',
  title: 'Weeklies',
  game: 'rs3',
  displayOrder: 6,
  route: '/tracker/weekly',
  layout: 'tracker',
  aliases: ['weekly', 'weeklies', 'rs3weekly'],
  legacyMode: 'rs3weekly',
  buttonLabel: 'Tasks',
  navLabel: 'Weeklies',
  menuGroup: 'Tasks',
  includeInViewsPanel: false,
  includeInPrimaryNav: false,
  sections: [rs3WeeklySection],
};

export default rs3WeeklyPage;
