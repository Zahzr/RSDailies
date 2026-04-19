function safeObject(value) {
  return value && typeof value === 'object' ? value : {};
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

/* =========================
   OVERVIEW PIN STATE
========================= */

export function getOverviewPins(load) {
  return safeObject(load('overviewPins', {}));
}

export function saveOverviewPins(nextPins, save) {
  save('overviewPins', safeObject(nextPins));
}

/* =========================
   CUSTOM TASKS
========================= */

export function getCustomTasks(load) {
  return safeArray(load('customTasks', []));
}

export function saveCustomTasks(tasks, save) {
  save('customTasks', safeArray(tasks));
}

/* =========================
   FARMING TIMERS
========================= */

export function getFarmingTimers(load) {
  return safeObject(load('farmingTimers', {}));
}

export function saveFarmingTimers(timers, save) {
  save('farmingTimers', safeObject(timers));
}

/* =========================
   COOLDOWNS
========================= */

export function getCooldowns(load) {
  return safeObject(load('cooldowns', {}));
}

export function saveCooldowns(cooldowns, save) {
  save('cooldowns', safeObject(cooldowns));
}

/* =========================
   COLLAPSED BLOCKS
========================= */

export function getCollapsedBlocks(load) {
  return safeObject(load('collapsedBlocks', {}));
}

export function isCollapsedBlock(blockId, load) {
  const collapsedBlocks = getCollapsedBlocks(load);
  return !!collapsedBlocks[blockId];
}

export function setCollapsedBlock(blockId, collapsed, load, save) {
  const collapsedBlocks = getCollapsedBlocks(load);

  if (collapsed) {
    collapsedBlocks[blockId] = true;
  } else {
    delete collapsedBlocks[blockId];
  }

  save('collapsedBlocks', collapsedBlocks);
}

/* =========================
   SECTION STATE
========================= */

function getSectionKey(sectionKey, key) {
  return `${key}:${sectionKey}`;
}

export function getSectionState(sectionKey, load) {
  return {
    completed: safeObject(load(getSectionKey(sectionKey, 'completed'), {})),
    hiddenRows: safeObject(load(getSectionKey(sectionKey, 'hiddenRows'), {})),
    hidden: !!load(getSectionKey(sectionKey, 'hideSection'), false),
    hideSection: !!load(getSectionKey(sectionKey, 'hideSection'), false),
    showHidden: !!load(getSectionKey(sectionKey, 'showHidden'), false),
    sort: load(getSectionKey(sectionKey, 'sort'), 'default'),
    order: safeArray(load(getSectionKey(sectionKey, 'order'), []))
  };
}

export function saveSectionValue(sectionKey, key, value, save) {
  save(getSectionKey(sectionKey, key), value);
}

export function resetSectionView(sectionKey, save) {
  save(getSectionKey(sectionKey, 'hideSection'), false);
  save(getSectionKey(sectionKey, 'showHidden'), false);
  save(getSectionKey(sectionKey, 'sort'), 'default');
  save(getSectionKey(sectionKey, 'order'), []);
  save(getSectionKey(sectionKey, 'hiddenRows'), {});
}