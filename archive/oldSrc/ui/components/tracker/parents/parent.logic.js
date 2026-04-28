import { PARENT_SECTION_DEFAULTS } from './parent.constants.js';

export function getParentSections(config) {
  const key = PARENT_SECTION_DEFAULTS.sectionsKey;
  return Array.isArray(config?.[key]) ? config[key] : [];
}
