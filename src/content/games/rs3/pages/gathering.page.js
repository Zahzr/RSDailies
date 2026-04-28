import { rs3GatheringSection } from '../sections/gathering/gathering.section.js';

export const rs3GatheringPage = {
  id: 'gathering',
  title: 'Gathering',
  game: 'rs3',
  route: '/tracker/gathering',
  layout: 'tracker',
  legacyMode: 'gathering',
  sections: [rs3GatheringSection],
};

export default rs3GatheringPage;
