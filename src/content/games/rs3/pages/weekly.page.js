import { rs3WeeklySection } from '../sections/weeklies/weeklies.section.js';

export const rs3WeeklyPage = {
  id: 'rs3weekly',
  title: 'Weeklies',
  game: 'rs3',
  route: '/tracker/weekly',
  layout: 'tracker',
  legacyMode: 'rs3weekly',
  sections: [rs3WeeklySection],
};

export default rs3WeeklyPage;
