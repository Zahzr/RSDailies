import { loadJson, saveJson } from './local-store.js';
import { ACTIVE_PROFILE_KEY, GLOBAL_PROFILES_KEY, createProfilePrefix } from './namespace.js';
import { StorageKeyBuilder } from './keys-builder.js';

export const CURRENT_STORAGE_SCHEMA_VERSION = 1;
export const CURRENT_EXPORT_SCHEMA_VERSION = 1;

function profileStorageKey(profileName, key) {
  return `${createProfilePrefix(profileName)}${key}`;
}

function getProfiles(storage) {
  const profiles = loadJson(GLOBAL_PROFILES_KEY, ['default'], storage);
  return Array.isArray(profiles) && profiles.length > 0 ? profiles : ['default'];
}

function ensureActiveProfile(profiles, storage) {
  const activeProfile = storage.getItem(ACTIVE_PROFILE_KEY) || 'default';
  if (profiles.includes(activeProfile)) {
    return activeProfile;
  }

  const fallbackProfile = profiles[0] || 'default';
  storage.setItem(ACTIVE_PROFILE_KEY, fallbackProfile);
  return fallbackProfile;
}

function migrateProfileStorage(profileName, storage) {
  const schemaVersionKey = profileStorageKey(profileName, StorageKeyBuilder.schemaVersion());
  const storedSchemaVersion = Number(loadJson(schemaVersionKey, 0, storage) || 0);
  let changed = false;

  if (storedSchemaVersion < 1) {
    const pageModeKey = profileStorageKey(profileName, 'pageMode');
    const viewModeKey = profileStorageKey(profileName, 'viewMode');
    const hasPageMode = storage.getItem(pageModeKey) !== null;
    const legacyViewMode = loadJson(viewModeKey, null, storage);

    if (!hasPageMode && typeof legacyViewMode === 'string' && legacyViewMode.trim() !== '') {
      saveJson(pageModeKey, legacyViewMode, storage);
      changed = true;
    }
  }

  if (storedSchemaVersion !== CURRENT_STORAGE_SCHEMA_VERSION) {
    saveJson(schemaVersionKey, CURRENT_STORAGE_SCHEMA_VERSION, storage);
    changed = true;
  }

  return changed;
}

export function migrateStorageShape(storage = window.localStorage) {
  const profiles = getProfiles(storage);
  let changed = false;

  if (storage.getItem(GLOBAL_PROFILES_KEY) === null) {
    saveJson(GLOBAL_PROFILES_KEY, profiles, storage);
    changed = true;
  }

  ensureActiveProfile(profiles, storage);

  profiles.forEach((profileName) => {
    if (migrateProfileStorage(profileName, storage)) {
      changed = true;
    }
  });

  return changed;
}
