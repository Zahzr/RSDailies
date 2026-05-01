import { osrsWeeklySection } from '../sections/weeklies/weeklies.section.js';

export const osrsWeeklyPage = {
  id: 'osrsweekly',
  title: 'Weeklies',
  game: 'osrs',
  displayOrder: 103,
  route: '/tracker/osrs/weekly',
  layout: 'tracker',
  aliases: ['weekly', 'weeklies', 'osrsweekly'],
  legacyMode: 'osrsweekly',
  buttonLabel: 'Tasks',
  navLabel: 'Weeklies',
  menuGroup: 'Tasks',
  includeInViewsPanel: false,
  includeInPrimaryNav: false,
  sections: [osrsWeeklySection],
};

export default osrsWeeklyPage;
