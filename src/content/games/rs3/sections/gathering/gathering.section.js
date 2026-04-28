import { rs3DailyGatheringTasks } from './tasks/daily-gathering.tasks.js';
import { rs3WeeklyGatheringTasks } from './tasks/weekly-gathering.tasks.js';

export const rs3GatheringSection = {
  id: 'gathering',
  label: 'Gathering',
  legacySectionId: 'gathering',
  renderVariant: 'grouped-sections',
  items: [...rs3DailyGatheringTasks, ...rs3WeeklyGatheringTasks],
};

export default rs3GatheringSection;
