import { rs3WeeklyTasks } from './tasks/weeklies.tasks.js';

export const rs3WeeklySection = {
  id: 'rs3weekly',
  label: 'Weeklies',
  legacySectionId: 'rs3weekly',
  renderVariant: 'parent-children',
  items: rs3WeeklyTasks,
};

export default rs3WeeklySection;
