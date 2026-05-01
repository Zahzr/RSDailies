import { osrsMonthlySection } from '../sections/monthlies/monthlies.section.js';

export const osrsMonthlyPage = {
  id: 'osrsmonthly',
  title: 'Monthlies',
  game: 'osrs',
  displayOrder: 104,
  route: '/tracker/osrs/monthly',
  layout: 'tracker',
  aliases: ['monthly', 'monthlies', 'osrsmonthly'],
  legacyMode: 'osrsmonthly',
  buttonLabel: 'Tasks',
  navLabel: 'Monthlies',
  menuGroup: 'Tasks',
  includeInViewsPanel: false,
  includeInPrimaryNav: false,
  sections: [osrsMonthlySection],
};

export default osrsMonthlyPage;
