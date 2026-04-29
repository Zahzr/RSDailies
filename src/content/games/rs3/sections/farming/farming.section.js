import { rs3FarmingGroups } from './groups/farming.groups.js';

export const rs3FarmingSection = {
  id: 'rs3farming',
  label: 'Farming',
  shortLabel: 'Farming',
  game: 'rs3',
  displayOrder: 1,
  legacySectionId: 'rs3farming',
  resetFrequency: 'rolling',
  renderVariant: 'timer-groups',
  containerId: 'rs3farming-container',
  tableId: 'rs3farming-table',
  includedInAllMode: false,
  supportsTaskNotifications: false,
  shell: {
    columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
    extraTableClasses: [],
    showAddButton: false,
    showResetButton: true,
    showCountdown: false,
  },
  groups: rs3FarmingGroups,
};

export default rs3FarmingSection;
