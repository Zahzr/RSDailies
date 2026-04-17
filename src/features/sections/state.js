export function getSectionState(sectionKey, loadValue) {
  return {
    completed: loadValue(`completed:${sectionKey}`, {}),
    hiddenRows: loadValue(`hiddenRows:${sectionKey}`, {}),
    order: loadValue(`order:${sectionKey}`, []),
    sort: loadValue(`sort:${sectionKey}`, 'default'),
    hideSection: loadValue(`hideSection:${sectionKey}`, false),
    showHidden: loadValue(`showHidden:${sectionKey}`, false),
  };
}

export function getCollapsedBlocks(loadValue) {
  return loadValue('collapsedBlocks', {});
}

export function setCollapsedBlock(blockId, collapsed, loadValue, saveValue) {
  const blocks = getCollapsedBlocks(loadValue);

  if (collapsed) {
    blocks[blockId] = true;
  } else {
    delete blocks[blockId];
  }

  saveValue('collapsedBlocks', blocks);
}

export function isCollapsedBlock(blockId, loadValue) {
  const blocks = getCollapsedBlocks(loadValue);
  return !!blocks[blockId];
}

export function getCustomTasks(loadValue) {
  return loadValue('customTasks', []);
}

export function saveCustomTasks(tasks, saveValue) {
  saveValue('customTasks', tasks);
}

export function getFarmingTimers(loadValue) {
  return loadValue('farmingTimers', {});
}

export function saveFarmingTimers(timers, saveValue) {
  saveValue('farmingTimers', timers);
}

export function getCooldowns(loadValue) {
  return loadValue('cooldowns', {});
}

export function saveCooldowns(data, saveValue) {
  saveValue('cooldowns', data);
}

export function getOverviewPins(loadValue) {
  return loadValue('overviewPins', {});
}

export function saveOverviewPins(pins, saveValue) {
  saveValue('overviewPins', pins);
}

export function saveSectionValue(sectionKey, field, value, saveValue) {
  saveValue(`${field}:${sectionKey}`, value);
}