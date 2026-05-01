import test from 'node:test';
import assert from 'node:assert/strict';

import { CURRENT_STORAGE_SCHEMA_VERSION, migrateStorageShape } from '../../../src/core/storage/migrations.js';
import { ACTIVE_PROFILE_KEY, GLOBAL_PROFILES_KEY } from '../../../src/core/storage/namespace.js';

function createMemoryStorage(initialState = {}) {
  const state = new Map(Object.entries(initialState));

  return {
    getItem(key) {
      return state.has(key) ? state.get(key) : null;
    },
    setItem(key, value) {
      state.set(key, String(value));
    },
    removeItem(key) {
      state.delete(key);
    },
    dump() {
      return Object.fromEntries(state.entries());
    },
  };
}

test('storage migration stamps schema version and preserves active profile', () => {
  const storage = createMemoryStorage({
    [GLOBAL_PROFILES_KEY]: JSON.stringify(['default']),
    [ACTIVE_PROFILE_KEY]: 'default',
  });

  const changed = migrateStorageShape(storage);

  assert.equal(changed, true);
  assert.equal(storage.getItem('rsdailies:default:schemaVersion'), JSON.stringify(CURRENT_STORAGE_SCHEMA_VERSION));
  assert.equal(storage.getItem(ACTIVE_PROFILE_KEY), 'default');
});

test('storage migration backfills pageMode from legacy viewMode', () => {
  const storage = createMemoryStorage({
    [GLOBAL_PROFILES_KEY]: JSON.stringify(['default']),
    [ACTIVE_PROFILE_KEY]: 'default',
    'rsdailies:default:viewMode': JSON.stringify('gathering'),
  });

  migrateStorageShape(storage);

  assert.equal(storage.getItem('rsdailies:default:pageMode'), JSON.stringify('gathering'));
  assert.equal(storage.getItem('rsdailies:default:pageMode:rs3'), JSON.stringify('gathering'));
  assert.equal(storage.getItem('rsdailies:default:schemaVersion'), JSON.stringify(CURRENT_STORAGE_SCHEMA_VERSION));
});

test('storage migration rewrites legacy farming timer state to timer-centric storage', () => {
  const storage = createMemoryStorage({
    [GLOBAL_PROFILES_KEY]: JSON.stringify(['default']),
    [ACTIVE_PROFILE_KEY]: 'default',
    'rsdailies:default:schemaVersion': JSON.stringify(2),
    'rsdailies:default:pageMode': JSON.stringify('rs3farming'),
    'rsdailies:default:pageMode:rs3': JSON.stringify('rs3farming'),
    'rsdailies:default:farmingTimers': JSON.stringify({ 'farm-herbs': { readyAt: 123 } }),
    'rsdailies:default:completed:rs3farming': JSON.stringify({ 'rs3farming::farm-herbs::herb-falador': true }),
    'rsdailies:default:hiddenRows:rs3farming': JSON.stringify({ 'rs3farming::farm-herbs::herb-falador': true }),
    'rsdailies:default:overviewPins': JSON.stringify({ 'rs3farming::farm-herbs': true }),
    'rsdailies:default:collapsedBlocks': JSON.stringify({ 'group-collapse-rs3farming-herbs-farm-herbs': true }),
  });

  migrateStorageShape(storage);

  assert.equal(storage.getItem('rsdailies:default:pageMode'), JSON.stringify('timers'));
  assert.equal(storage.getItem('rsdailies:default:pageMode:rs3'), JSON.stringify('timers'));
  assert.equal(storage.getItem('rsdailies:default:timers'), JSON.stringify({ 'farm-herbs': { readyAt: 123 } }));
  assert.equal(
    storage.getItem('rsdailies:default:completed:timers'),
    JSON.stringify({ 'timers::farm-herbs::herb-falador': true })
  );
  assert.equal(
    storage.getItem('rsdailies:default:hiddenRows:timers'),
    JSON.stringify({ 'timers::farm-herbs::herb-falador': true })
  );
  assert.equal(storage.getItem('rsdailies:default:overviewPins'), JSON.stringify({ 'timers::farm-herbs': true }));
  assert.equal(
    storage.getItem('rsdailies:default:collapsedBlocks'),
    JSON.stringify({ 'group-collapse-timers-herbs-farm-herbs': true })
  );
});
