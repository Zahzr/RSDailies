import { rs3CustomTasks } from './tasks/custom.tasks.js';

export const rs3CustomSection = {
  id: 'custom',
  label: 'Custom Tasks',
  shortLabel: 'Custom',
  game: 'rs3',
  displayOrder: 0,
  legacySectionId: 'custom',
  resetFrequency: 'never',
  renderVariant: 'standard',
  containerId: 'custom-container',
  tableId: 'custom-table',
  includedInAllMode: false,
  supportsTaskNotifications: true,
  shell: {
    columns: ['activity_col_name', 'activity_col_timer', 'activity_col_notes', 'activity_col_status'],
    extraTableClasses: ['custom-task-table'],
    showAddButton: true,
    showResetButton: false,
    showCountdown: false,
  },
  items: rs3CustomTasks,
};

export default rs3CustomSection;
