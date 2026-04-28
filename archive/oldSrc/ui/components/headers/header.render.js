import { createTableSectionHeader } from './types/table-section-header.js';

export function createHeaderRow(label, blockId, options = {}) {
  return createTableSectionHeader(label, blockId, options);
}
