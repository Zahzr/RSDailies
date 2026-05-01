import { rs3FarmingTimerGroups } from './tasks/farming/farming.tasks.js';

export const rs3TimersSection = {
  id: 'timers',
  label: 'Timers',
  shortLabel: 'Timers',
  game: 'rs3',
  displayOrder: 1,
  legacySectionId: 'rs3farming',
  resetFrequency: 'rolling',
  renderVariant: 'timer-groups',
  containerId: 'timers-container',
  tableId: 'timers-table',
  includedInAllMode: false,
  supportsTaskNotifications: false,
  shell: {
    columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
    extraTableClasses: [],
    showAddButton: false,
    showResetButton: true,
    showCountdown: false,
  },
  groups: rs3FarmingTimerGroups,
};

export default rs3TimersSection;
