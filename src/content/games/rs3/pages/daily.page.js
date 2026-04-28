import { rs3DailySection } from '../sections/dailies/dailies.section.js';

export const rs3DailyPage = {
  id: 'rs3daily',
  title: 'Dailies',
  game: 'rs3',
  route: '/tracker/daily',
  layout: 'tracker',
  legacyMode: 'rs3daily',
  sections: [rs3DailySection],
};

export default rs3DailyPage;
