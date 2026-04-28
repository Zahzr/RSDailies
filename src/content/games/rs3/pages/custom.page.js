import { rs3CustomSection } from '../sections/custom/custom.section.js';

export const rs3CustomPage = {
  id: 'custom',
  title: 'Custom Tasks',
  game: 'rs3',
  route: '/tracker/custom',
  layout: 'tracker',
  legacyMode: 'custom',
  sections: [rs3CustomSection],
};

export default rs3CustomPage;
