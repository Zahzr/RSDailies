import { rs3MonthlyTasks } from './tasks/monthlies.tasks.js';

export const rs3MonthlySection = {
  id: 'rs3monthly',
  label: 'Monthlies',
  legacySectionId: 'rs3monthly',
  renderVariant: 'standard',
  items: rs3MonthlyTasks,
};

export default rs3MonthlySection;
