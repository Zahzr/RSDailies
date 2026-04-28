import { rs3FarmingSection } from '../sections/farming/farming.section.js';

export const rs3FarmingPage = {
  id: 'rs3farming',
  title: 'Farming',
  game: 'rs3',
  route: '/tracker/farming',
  layout: 'tracker',
  legacyMode: 'rs3farming',
  sections: [rs3FarmingSection],
};

export default rs3FarmingPage;
