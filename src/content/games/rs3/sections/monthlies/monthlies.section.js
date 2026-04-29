import { rs3MonthlyTasks } from './tasks/monthlies.tasks.js';

export const rs3MonthlySection = {
  id: 'rs3monthly',
  label: 'Monthlies',
  shortLabel: 'Monthlies',
  game: 'rs3',
  displayOrder: 5,
  legacySectionId: 'rs3monthly',
  resetFrequency: 'monthly',
  renderVariant: 'standard',
  containerId: 'rs3monthly-container',
  tableId: 'rs3monthly-table',
  includedInAllMode: true,
  supportsTaskNotifications: true,
  shell: {
    columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
    extraTableClasses: [],
    showAddButton: false,
    showResetButton: true,
    showCountdown: true,
    countdownId: 'countdown-rs3monthly',
  },
  items: rs3MonthlyTasks,
};

export default rs3MonthlySection;
