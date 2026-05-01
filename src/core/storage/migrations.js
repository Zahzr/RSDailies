import { loadJson, saveJson } from './local-store.js';
import { ACTIVE_PROFILE_KEY, GLOBAL_PROFILES_KEY, createProfilePrefix } from './namespace.js';
import { StorageKeyBuilder } from './keys-builder.js';

export const CURRENT_STORAGE_SCHEMA_VERSION = 3;
export const CURRENT_EXPORT_SCHEMA_VERSION = 1;
const LEGACY_TIMER_SECTION_KEY = 'rs3farming';
const TIMER_SECTION_KEY = 'timers';

function renameValue(value, replacements) {
  if (typeof value !== 'string') {
    return value;
  }

  return replacements.reduce(
    (nextValue, [from, to]) => nextValue.split(from).join(to),
    value
  );
}

function renameObjectKeys(value, replacements) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }

  return Object.entries(value).reduce((nextValue, [key, entryValue]) => {
    nextValue[renameValue(key, replacements)] = entryValue;
    return nextValue;
  }, {});
}

function migrateLegacySectionValue(storage, profileName, sectionValueKey, transform = (value) => value) {
  const legacyKey = profileStorageKey(profileName, `${sectionValueKey}:${LEGACY_TIMER_SECTION_KEY}`);
  const nextKey = profileStorageKey(profileName, `${sectionValueKey}:${TIMER_SECTION_KEY}`);
  const legacyValue = loadJson(legacyKey, null, storage);
  const hasLegacyValue = storage.getItem(legacyKey) !== null;

  if (!hasLegacyValue || storage.getItem(nextKey) !== null) {
    return false;
  }

  saveJson(nextKey, transform(legacyValue), storage);
  storage.removeItem(legacyKey);
  return true;
}

function migrateLegacyPageMode(storage, profileName, key) {
  const storageKey = profileStorageKey(profileName, key);
  const storedValue = loadJson(storageKey, null, storage);
  const nextValue = renameValue(storedValue, [[LEGACY_TIMER_SECTION_KEY, TIMER_SECTION_KEY]]);

  if (nextValue === storedValue) {
    return false;
  }

  saveJson(storageKey, nextValue, storage);
  return true;
}

function migrateLegacyTimerStorage(storage, profileName) {
  const legacyKey = profileStorageKey(profileName, 'farmingTimers');
  const nextKey = profileStorageKey(profileName, StorageKeyBuilder.timers());
  const hasLegacyValue = storage.getItem(legacyKey) !== null;

  if (!hasLegacyValue || storage.getItem(nextKey) !== null) {
    return false;
  }

  const legacyValue = loadJson(legacyKey, {}, storage);
  saveJson(nextKey, legacyValue, storage);
  storage.removeItem(legacyKey);
  return true;
}

function migrateLegacyOverviewPins(storage, profileName) {
  const key = profileStorageKey(profileName, StorageKeyBuilder.overviewPins());
  const pins = loadJson(key, null, storage);
  const nextPins = renameObjectKeys(pins, [[`${LEGACY_TIMER_SECTION_KEY}::`, `${TIMER_SECTION_KEY}::`]]);

  if (!nextPins || JSON.stringify(nextPins) === JSON.stringify(pins)) {
    return false;
  }

  saveJson(key, nextPins, storage);
  return true;
}

function migrateLegacyCollapsedBlocks(storage, profileName) {
  const key = profileStorageKey(profileName, StorageKeyBuilder.collapsedBlocks());
  const collapsedBlocks = loadJson(key, null, storage);
  const nextBlocks = renameObjectKeys(collapsedBlocks, [[`group-collapse-${LEGACY_TIMER_SECTION_KEY}`, `group-collapse-${TIMER_SECTION_KEY}`]]);

  if (!nextBlocks || JSON.stringify(nextBlocks) === JSON.stringify(collapsedBlocks)) {
    return false;
  }

  saveJson(key, nextBlocks, storage);
  return true;
}

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

  if (storedSchemaVersion < 2) {
    const pageModeKey = profileStorageKey(profileName, 'pageMode');
    const rs3PageModeKey = profileStorageKey(profileName, 'pageMode:rs3');
    const existingRs3PageMode = storage.getItem(rs3PageModeKey);
    const storedPageMode = loadJson(pageModeKey, null, storage);
    const legacyViewMode = loadJson(profileStorageKey(profileName, 'viewMode'), null, storage);
    const nextRs3PageMode = typeof storedPageMode === 'string' && storedPageMode.trim() !== ''
      ? storedPageMode
      : typeof legacyViewMode === 'string' && legacyViewMode.trim() !== ''
        ? legacyViewMode
        : null;

    if (existingRs3PageMode === null && nextRs3PageMode) {
      saveJson(rs3PageModeKey, nextRs3PageMode, storage);
      changed = true;
    }
  }

  if (storedSchemaVersion < 3) {
    const timerChildPrefix = `${LEGACY_TIMER_SECTION_KEY}::`;
    const replacements = [[timerChildPrefix, `${TIMER_SECTION_KEY}::`]];

    changed = migrateLegacyPageMode(storage, profileName, 'pageMode') || changed;
    changed = migrateLegacyPageMode(storage, profileName, 'pageMode:rs3') || changed;
    changed = migrateLegacyTimerStorage(storage, profileName) || changed;
    changed = migrateLegacyOverviewPins(storage, profileName) || changed;
    changed = migrateLegacyCollapsedBlocks(storage, profileName) || changed;

    ['completed', 'hiddenRows', 'removedRows'].forEach((key) => {
      changed = migrateLegacySectionValue(storage, profileName, key, (value) => renameObjectKeys(value, replacements)) || changed;
    });

    ['order'].forEach((key) => {
      changed = migrateLegacySectionValue(storage, profileName, key, (value) => (
        Array.isArray(value) ? value.map((entry) => renameValue(entry, replacements)) : value
      )) || changed;
    });

    ['hideSection', 'showHidden', 'sort'].forEach((key) => {
      changed = migrateLegacySectionValue(storage, profileName, key) || changed;
    });
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
