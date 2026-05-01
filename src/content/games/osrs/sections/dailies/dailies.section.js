import { osrsDailyTasks } from './tasks/dailies.tasks.js';

export const osrsDailySection = {
  id: 'osrsdaily',
  label: 'Dailies',
  shortLabel: 'Dailies',
  game: 'osrs',
  displayOrder: 101,
  legacySectionId: 'osrsdaily',
  resetFrequency: 'daily',
  renderVariant: 'standard',
  containerId: 'osrsdaily-container',
  tableId: 'osrsdaily-table',
  includedInAllMode: true,
  supportsTaskNotifications: false,
  shell: {
    columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
    extraTableClasses: [],
    showAddButton: false,
    showResetButton: true,
    showCountdown: true,
    countdownId: 'countdown-osrsdaily',
  },
  items: osrsDailyTasks,
};

export default osrsDailySection;
