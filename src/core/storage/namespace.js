export const STORAGE_ROOT = 'rsdailies';
export const GLOBAL_PROFILES_KEY = `${STORAGE_ROOT}:profiles`;
export const ACTIVE_PROFILE_KEY = `${STORAGE_ROOT}:active-profile`;

export function createProfilePrefix(profileName = 'default') {
  return `${STORAGE_ROOT}:${profileName || 'default'}:`;
}

export function createProfileKey(profilePrefix, key) {
  return `${profilePrefix}${key}`;
}
