import { rs3FarmingSection } from '../sections/farming/farming.section.js';

export const rs3FarmingPage = {
  id: 'rs3farming',
  title: 'Farming',
  game: 'rs3',
  displayOrder: 3,
  route: '/tracker/farming',
  layout: 'tracker',
  aliases: ['farming', 'rs3farming'],
  legacyMode: 'rs3farming',
  buttonLabel: 'Timers',
  navLabel: 'Timers',
  menuGroup: 'Timers',
  includeInViewsPanel: true,
  includeInPrimaryNav: true,
  sections: [rs3FarmingSection],
};

export default rs3FarmingPage;
