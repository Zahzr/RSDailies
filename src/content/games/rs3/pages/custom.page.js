import { rs3CustomSection } from '../sections/custom/custom.section.js';

export const rs3CustomPage = {
  id: 'custom',
  title: 'Custom Tasks',
  game: 'rs3',
  displayOrder: 2,
  route: '/tracker/custom',
  layout: 'tracker',
  aliases: ['custom'],
  legacyMode: 'custom',
  buttonLabel: 'Overview',
  navLabel: 'Custom Tasks',
  menuGroup: 'Tasks',
  includeInViewsPanel: false,
  includeInPrimaryNav: false,
  sections: [rs3CustomSection],
};

export default rs3CustomPage;
