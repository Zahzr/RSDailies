import { rs3GatheringSection } from '../sections/gathering/gathering.section.js';

export const rs3GatheringPage = {
  id: 'gathering',
  title: 'Gathering',
  game: 'rs3',
  displayOrder: 5,
  route: '/tracker/gathering',
  layout: 'tracker',
  aliases: ['gathering'],
  legacyMode: 'gathering',
  buttonLabel: 'Gathering',
  navLabel: 'Gathering',
  menuGroup: 'Gathering',
  includeInViewsPanel: true,
  includeInPrimaryNav: true,
  sections: [rs3GatheringSection],
};

export default rs3GatheringPage;
