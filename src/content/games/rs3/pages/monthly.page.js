import { rs3MonthlySection } from '../sections/monthlies/monthlies.section.js';

export const rs3MonthlyPage = {
  id: 'rs3monthly',
  title: 'Monthlies',
  game: 'rs3',
  displayOrder: 7,
  route: '/tracker/monthly',
  layout: 'tracker',
  aliases: ['monthly', 'monthlies', 'rs3monthly'],
  legacyMode: 'rs3monthly',
  buttonLabel: 'Tasks',
  navLabel: 'Monthlies',
  menuGroup: 'Tasks',
  includeInViewsPanel: false,
  includeInPrimaryNav: false,
  sections: [rs3MonthlySection],
};

export default rs3MonthlyPage;
