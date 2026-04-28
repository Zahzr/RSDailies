import { rs3DailyTasks } from './tasks/dailies.tasks.js';

export const rs3DailySection = {
  id: 'rs3daily',
  label: 'Dailies',
  legacySectionId: 'rs3daily',
  renderVariant: 'standard',
  items: rs3DailyTasks,
};

export default rs3DailySection;
