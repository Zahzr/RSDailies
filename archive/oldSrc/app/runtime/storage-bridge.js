import {
  getSectionState as getSectionStateFeature,
  getCollapsedBlocks as getCollapsedBlocksFeature,
  setCollapsedBlock as setCollapsedBlockFeature,
  isCollapsedBlock as isCollapsedBlockFeature,
  getCustomTasks as getCustomTasksFeature,
  saveCustomTasks as saveCustomTasksFeature,
  getFarmingTimers as getFarmingTimersFeature,
  saveFarmingTimers as saveFarmingTimersFeature,
  getCooldowns as getCooldownsFeature,
  saveCooldowns as saveCooldownsFeature,
  getOverviewPins as getOverviewPinsFeature,
  saveOverviewPins as saveOverviewPinsFeature
} from '../../features/sections/domain/state.js';
import {
  loadProfileValue,
  saveProfileValue,
  removeProfileValue,
  saveSectionValue as saveSectionValueFeature
} from '../../features/profiles/domain/store.js';

/**
 * Storage Bridge
 * Decouples the UI logic from historical storage patterns.
 */

export function load(key, fallback = null) {
  return loadProfileValue(key, fallback);
}

export function save(key, value) {
  saveProfileValue(key, value);
}

export function removeKey(key) {
  removeProfileValue(key);
}

export function saveSectionValue(sectionKey, field, value) {
  saveSectionValueFeature(sectionKey, field, value);
}

export function getSectionState(sectionKey) {
  return getSectionStateFeature(sectionKey, load);
}

export function getCollapsedBlocks() {
  return getCollapsedBlocksFeature(load);
}

export function setCollapsedBlock(blockId, collapsed) {
  setCollapsedBlockFeature(blockId, collapsed, load, save);
}

export function isCollapsedBlock(blockId) {
  return isCollapsedBlockFeature(blockId, load);
}

export function getCustomTasks() {
  return getCustomTasksFeature(load);
}

export function saveCustomTasks(tasks) {
  saveCustomTasksFeature(tasks, save);
}

export function getFarmingTimers() {
  return getFarmingTimersFeature(load);
}

export function saveFarmingTimers(timers) {
  saveFarmingTimersFeature(timers, save);
}

export function getCooldowns() {
  return getCooldownsFeature(load);
}

export function saveCooldowns(data) {
  saveCooldownsFeature(data, save);
}

export function getOverviewPins() {
  return getOverviewPinsFeature(load);
}

export function saveOverviewPins(pins) {
  saveOverviewPinsFeature(pins, save);
}
