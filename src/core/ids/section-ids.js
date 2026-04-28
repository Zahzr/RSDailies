import { getTrackerSectionIdMaps } from '../../app/registries/unified-registry.js';

const { containerIds, tableIds } = getTrackerSectionIdMaps();

export const SECTION_CONTAINER_IDS = containerIds;
export const SECTION_TABLE_IDS = tableIds;
