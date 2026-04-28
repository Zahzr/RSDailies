import { rs3DailySection } from '../sections/dailies/dailies.section.js';
import { rs3WeeklySection } from '../sections/weeklies/weeklies.section.js';
import { rs3MonthlySection } from '../sections/monthlies/monthlies.section.js';

export const rs3AllTasksPage = {
  id: 'all',
  title: 'Tasks',
  game: 'rs3',
  route: '/tracker/tasks',
  layout: 'tracker',
  legacyMode: 'all',
  sections: [rs3DailySection, rs3WeeklySection, rs3MonthlySection],
};

export default rs3AllTasksPage;
