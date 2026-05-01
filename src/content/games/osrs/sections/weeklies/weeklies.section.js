import { osrsWeeklyTasks } from './tasks/weeklies.tasks.js';

export const osrsWeeklySection = {
  id: 'osrsweekly',
  label: 'Weeklies',
  shortLabel: 'Weeklies',
  game: 'osrs',
  displayOrder: 102,
  legacySectionId: 'osrsweekly',
  resetFrequency: 'weekly',
  renderVariant: 'standard',
  containerId: 'osrsweekly-container',
  tableId: 'osrsweekly-table',
  includedInAllMode: true,
  supportsTaskNotifications: false,
  shell: {
    columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
    extraTableClasses: [],
    showAddButton: false,
    showResetButton: true,
    showCountdown: true,
    countdownId: 'countdown-osrsweekly',
  },
  items: osrsWeeklyTasks,
};

export default osrsWeeklySection;
