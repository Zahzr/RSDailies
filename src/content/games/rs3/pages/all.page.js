import { rs3DailySection } from '../sections/dailies/dailies.section.js';
import { rs3WeeklySection } from '../sections/weeklies/weeklies.section.js';
import { rs3MonthlySection } from '../sections/monthlies/monthlies.section.js';

export const rs3AllTasksPage = {
  id: 'all',
  title: 'Tasks',
  game: 'rs3',
  displayOrder: 1,
  route: '/tracker/tasks',
  layout: 'tracker',
  aliases: ['all'],
  legacyMode: 'all',
  buttonLabel: 'Tasks',
  navLabel: 'Tasks',
  menuGroup: 'Tasks',
  includeInViewsPanel: true,
  includeInPrimaryNav: true,
  sections: [rs3DailySection, rs3WeeklySection, rs3MonthlySection],
};

export default rs3AllTasksPage;
