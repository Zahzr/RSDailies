function buildSectionValueKey(sectionKey, key) {
  return `${key}:${sectionKey}`;
}

export const StorageKeyBuilder = Object.freeze({
  schemaVersion() {
    return 'schemaVersion';
  },

  lastVisit() {
    return 'lastVisit';
  },

  overviewPins() {
    return 'overviewPins';
  },

  customTasks() {
    return 'customTasks';
  },

  timers() {
    return 'timers';
  },

  cooldowns() {
    return 'cooldowns';
  },

  collapsedBlocks() {
    return 'collapsedBlocks';
  },

  sectionValue(sectionKey, key) {
    return buildSectionValueKey(sectionKey, key);
  },

  sectionCompletion(sectionKey) {
    return buildSectionValueKey(sectionKey, 'completed');
  },

  sectionHiddenRows(sectionKey) {
    return buildSectionValueKey(sectionKey, 'hiddenRows');
  },

  sectionSort(sectionKey) {
    return buildSectionValueKey(sectionKey, 'sort');
  },

  sectionOrder(sectionKey) {
    return buildSectionValueKey(sectionKey, 'order');
  },

  sectionRemovedRows(sectionKey) {
    return buildSectionValueKey(sectionKey, 'removedRows');
  },

  sectionHidden(sectionKey) {
    return buildSectionValueKey(sectionKey, 'hideSection');
  },

  sectionShowHidden(sectionKey) {
    return buildSectionValueKey(sectionKey, 'showHidden');
  },

  childTaskStorageId(sectionKey, parentId, childId) {
    return `${sectionKey}::${parentId}::${childId}`;
  },

  overviewPinStorageId(sectionKey, taskId) {
    return `${sectionKey}::${taskId}`;
  },
});

export function getSectionStorageKeys(sectionKey) {
  return {
    completion: StorageKeyBuilder.sectionCompletion(sectionKey),
    hiddenRows: StorageKeyBuilder.sectionHiddenRows(sectionKey),
    removedRows: StorageKeyBuilder.sectionRemovedRows(sectionKey),
    hidden: StorageKeyBuilder.sectionHidden(sectionKey),
    showHidden: StorageKeyBuilder.sectionShowHidden(sectionKey),
    sort: StorageKeyBuilder.sectionSort(sectionKey),
    order: StorageKeyBuilder.sectionOrder(sectionKey),
  };
}
