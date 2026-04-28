import {
  ACTIVE_PROFILE_KEY,
  GLOBAL_PROFILES_KEY,
  STORAGE_ROOT,
  createProfileKey,
  createProfilePrefix
} from '../../../core/storage/namespace.js';
import { loadJson, removeStorageKey, saveJson } from '../../../core/storage/local-store.js';

let currentProfile = 'default';
let profilePrefix = createProfilePrefix('default');

export function getCurrentProfile() {
  return currentProfile;
}

export function getProfilePrefix() {
  return profilePrefix;
}

export function setProfile(name) {
  currentProfile = name || 'default';
  profilePrefix = createProfilePrefix(currentProfile);
  window.localStorage.setItem(ACTIVE_PROFILE_KEY, currentProfile);
}

export function initProfileContext() {
  setProfile(window.localStorage.getItem(ACTIVE_PROFILE_KEY) || 'default');
}

export function loadProfiles() {
  const profiles = loadJson(GLOBAL_PROFILES_KEY, ['default']);
  return Array.isArray(profiles) && profiles.length ? profiles : ['default'];
}

export function saveProfiles(profiles) {
  saveJson(GLOBAL_PROFILES_KEY, profiles);
}

export function profileKey(key) {
  return createProfileKey(profilePrefix, key);
}

export function loadProfileValue(key, fallback = null) {
  return loadJson(profileKey(key), fallback);
}

export function saveProfileValue(key, value) {
  saveJson(profileKey(key), value);
}

export function removeProfileValue(key) {
  removeStorageKey(profileKey(key));
}

export function saveSectionValue(sectionKey, field, value) {
  saveProfileValue(`${field}:${sectionKey}`, value);
}

export function removeProfileStorage(profileName, storage = window.localStorage) {
  for (let i = storage.length - 1; i >= 0; i--) {
    const key = storage.key(i);
    if (key && key.startsWith(`${STORAGE_ROOT}:${profileName}:`)) {
      storage.removeItem(key);
    }
  }
}
