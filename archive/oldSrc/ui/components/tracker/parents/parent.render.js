import { getParentSections } from './parent.logic.js';

export function renderParentSections(config, renderSection) {
  const sections = getParentSections(config);
  if (typeof renderSection !== 'function') return sections;
  return sections.map((section, index) => renderSection(section, index));
}
