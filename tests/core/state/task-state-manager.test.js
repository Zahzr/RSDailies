import test from 'node:test';
import assert from 'node:assert/strict';

import { createTaskStateManager } from '../../../src/core/state/task-state-manager.js';

function createMemoryStorage() {
  const state = new Map();

  return {
    load(key, fallback = null) {
      return state.has(key) ? state.get(key) : fallback;
    },
    save(key, value) {
      state.set(key, value);
    },
    removeKey(key) {
      state.delete(key);
    },
    dump() {
      return Object.fromEntries(state.entries());
    },
  };
}

test('task state manager reads and writes completion state', () => {
  const storage = createMemoryStorage();
  const manager = createTaskStateManager('rs3daily', storage);

  assert.equal(manager.isTaskCompleted('daily-challenge'), false);
  manager.setTaskCompleted('daily-challenge', true);
  assert.equal(manager.isTaskCompleted('daily-challenge'), true);
  manager.setTaskCompleted('daily-challenge', false);
  assert.equal(manager.isTaskCompleted('daily-challenge'), false);
});

test('task state manager resets section view state', () => {
  const storage = createMemoryStorage();
  const manager = createTaskStateManager('gathering', storage);

  manager.saveSectionValue('hideSection', true);
  manager.saveSectionValue('showHidden', true);
  manager.saveSectionValue('completed', { 'bert-sand-daily': true });
  manager.saveSectionValue('sort', 'alphabetical');
  manager.saveSectionValue('order', ['bert-sand-daily']);
  manager.saveSectionValue('hiddenRows', { 'bert-sand-daily': true });
  manager.saveSectionValue('removedRows', { 'bert-sand-daily': true });

  manager.resetSectionView();

  assert.deepEqual(storage.dump(), {
    'completed:gathering': {},
    'hideSection:gathering': false,
    'showHidden:gathering': false,
    'sort:gathering': 'default',
    'order:gathering': [],
    'hiddenRows:gathering': {},
    'removedRows:gathering': {},
  });
});
