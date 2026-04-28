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
  assert.equal(storage.getItem('rsdailies:default:schemaVersion'), JSON.stringify(CURRENT_STORAGE_SCHEMA_VERSION));
});
