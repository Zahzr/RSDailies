import { rs3MonthlySection } from '../sections/monthlies/monthlies.section.js';

export const rs3MonthlyPage = {
  id: 'rs3monthly',
  title: 'Monthlies',
  game: 'rs3',
  route: '/tracker/monthly',
  layout: 'tracker',
  legacyMode: 'rs3monthly',
  sections: [rs3MonthlySection],
};

export default rs3MonthlyPage;
