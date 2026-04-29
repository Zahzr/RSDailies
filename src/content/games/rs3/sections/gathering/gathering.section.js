import { rs3DailyGatheringTasks } from './tasks/daily-gathering.tasks.js';
import { rs3WeeklyGatheringTasks } from './tasks/weekly-gathering.tasks.js';

export const rs3GatheringSection = {
  id: 'gathering',
  label: 'Gathering',
  shortLabel: 'Gathering',
  game: 'rs3',
  displayOrder: 2,
  legacySectionId: 'gathering',
  resetFrequency: 'mixed',
  renderVariant: 'grouped-sections',
  containerId: 'gathering-container',
  tableId: 'gathering-table',
  includedInAllMode: false,
  supportsTaskNotifications: true,
  shell: {
    columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
    extraTableClasses: [],
    showAddButton: false,
    showResetButton: true,
    showCountdown: false,
  },
  items: [...rs3DailyGatheringTasks, ...rs3WeeklyGatheringTasks],
};

export default rs3GatheringSection;
