import { rs3FarmingGroups } from './groups/farming.groups.js';

export const rs3FarmingSection = {
  id: 'rs3farming',
  label: 'Farming',
  legacySectionId: 'rs3farming',
  renderVariant: 'timer-groups',
  groups: rs3FarmingGroups,
};

export default rs3FarmingSection;
