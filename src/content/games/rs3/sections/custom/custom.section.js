import { rs3CustomTasks } from './tasks/custom.tasks.js';

export const rs3CustomSection = {
  id: 'custom',
  label: 'Custom Tasks',
  legacySectionId: 'custom',
  renderVariant: 'standard',
  items: rs3CustomTasks,
};

export default rs3CustomSection;
