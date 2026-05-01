import test from 'node:test';
import assert from 'node:assert/strict';

import { getSectionStorageKeys, StorageKeyBuilder } from '../../../src/core/storage/keys-builder.js';

test('storage key builder returns stable global keys', () => {
  assert.equal(StorageKeyBuilder.schemaVersion(), 'schemaVersion');
  assert.equal(StorageKeyBuilder.lastVisit(), 'lastVisit');
  assert.equal(StorageKeyBuilder.overviewPins(), 'overviewPins');
  assert.equal(StorageKeyBuilder.customTasks(), 'customTasks');
  assert.equal(StorageKeyBuilder.timers(), 'timers');
});

test('storage key builder returns stable section keys', () => {
  const keys = getSectionStorageKeys('gathering');
  assert.deepEqual(keys, {
    completion: 'completed:gathering',
    hiddenRows: 'hiddenRows:gathering',
    removedRows: 'removedRows:gathering',
    hidden: 'hideSection:gathering',
    showHidden: 'showHidden:gathering',
    sort: 'sort:gathering',
    order: 'order:gathering',
  });
});

test('storage key builder preserves child storage ids', () => {
  assert.equal(
    StorageKeyBuilder.childTaskStorageId('timers', 'farm-herbs', 'herb-falador'),
    'timers::farm-herbs::herb-falador'
  );
});
