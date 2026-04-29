import { rs3WeeklyTasks } from './tasks/weeklies.tasks.js';

export const rs3WeeklySection = {
  id: 'rs3weekly',
  label: 'Weeklies',
  shortLabel: 'Weeklies',
  game: 'rs3',
  displayOrder: 4,
  legacySectionId: 'rs3weekly',
  resetFrequency: 'weekly',
  renderVariant: 'parent-children',
  containerId: 'rs3weekly-container',
  tableId: 'rs3weekly-table',
  includedInAllMode: true,
  supportsTaskNotifications: true,
  shell: {
    columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
    extraTableClasses: [],
    showAddButton: false,
    showResetButton: true,
    showCountdown: true,
    countdownId: 'countdown-rs3weekly',
  },
  items: rs3WeeklyTasks,
};

export default rs3WeeklySection;
