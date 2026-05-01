import { osrsMonthlyTasks } from './tasks/monthlies.tasks.js';

export const osrsMonthlySection = {
  id: 'osrsmonthly',
  label: 'Monthlies',
  shortLabel: 'Monthlies',
  game: 'osrs',
  displayOrder: 103,
  legacySectionId: 'osrsmonthly',
  resetFrequency: 'monthly',
  renderVariant: 'standard',
  containerId: 'osrsmonthly-container',
  tableId: 'osrsmonthly-table',
  includedInAllMode: true,
  supportsTaskNotifications: false,
  shell: {
    columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
    extraTableClasses: [],
    showAddButton: false,
    showResetButton: true,
    showCountdown: true,
    countdownId: 'countdown-osrsmonthly',
  },
  items: osrsMonthlyTasks,
};

export default osrsMonthlySection;
