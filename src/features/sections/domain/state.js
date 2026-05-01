import { createTaskStateManager } from '../../../core/state/task-state-manager.js';
import { StorageKeyBuilder } from '../../../core/storage/keys-builder.js';

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
  return safeObject(load(StorageKeyBuilder.overviewPins(), {}));
}

export function saveOverviewPins(nextPins, save) {
  save(StorageKeyBuilder.overviewPins(), safeObject(nextPins));
}

/* =========================
   CUSTOM TASKS
========================= */

export function getCustomTasks(load) {
  return safeArray(load(StorageKeyBuilder.customTasks(), []));
}

export function saveCustomTasks(tasks, save) {
  save(StorageKeyBuilder.customTasks(), safeArray(tasks));
}

/* =========================
   TIMERS
========================= */

export function getTimers(load) {
  return safeObject(load(StorageKeyBuilder.timers(), {}));
}

export function saveTimers(timers, save) {
  save(StorageKeyBuilder.timers(), safeObject(timers));
}

/* =========================
   COOLDOWNS
========================= */

export function getCooldowns(load) {
  return safeObject(load(StorageKeyBuilder.cooldowns(), {}));
}

export function saveCooldowns(cooldowns, save) {
  save(StorageKeyBuilder.cooldowns(), safeObject(cooldowns));
}

/* =========================
   COLLAPSED BLOCKS
========================= */

export function getCollapsedBlocks(load) {
  return safeObject(load(StorageKeyBuilder.collapsedBlocks(), {}));
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

  save(StorageKeyBuilder.collapsedBlocks(), collapsedBlocks);
}

/* =========================
   SECTION STATE
========================= */

export function getSectionState(sectionKey, load) {
  return createTaskStateManager(sectionKey, { load }).getSectionState();
}

export function saveSectionValue(sectionKey, key, value, save) {
  createTaskStateManager(sectionKey, { save }).saveSectionValue(key, value);
}

export function resetSectionView(sectionKey, save) {
  createTaskStateManager(sectionKey, { save }).resetSectionView();
}
