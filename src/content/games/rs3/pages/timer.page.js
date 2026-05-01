import { rs3TimersSection } from '../sections/timers/timers.section.js';

export const rs3TimerPage = {
  id: 'timers',
  title: 'Timers',
  game: 'rs3',
  displayOrder: 3,
  route: '/tracker/timers',
  layout: 'tracker',
  aliases: ['timers', 'rs3timers', 'farming', 'rs3farming'],
  legacyMode: 'rs3farming',
  buttonLabel: 'Timers',
  navLabel: 'Timers',
  menuGroup: 'Timers',
  includeInViewsPanel: true,
  includeInPrimaryNav: true,
  primaryNavDropdownLabel: 'Timers',
  primaryNavItemLabel: 'Farming',
  sections: [rs3TimersSection],
};

export default rs3TimerPage;
