import { getCurrentProfile, getProfilePrefix, loadProfiles, saveProfiles, setProfile } from './store.js';

export function isActiveProfile(name, currentProfile = getCurrentProfile()) {
  return name === currentProfile;
}

export function getProfileLabel(name, currentProfile = getCurrentProfile()) {
  return isActiveProfile(name, currentProfile) ? `${name} (active)` : name;
}

export function buildExportToken(storage = window.localStorage) {
  const profile = getCurrentProfile();
  const profilePrefix = getProfilePrefix();

  const payload = {
    profile,
    globals: {
      profiles: loadProfiles(),
      activeProfile: profile
    },
    profileData: {}
  };

  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && key.startsWith(profilePrefix)) {
      payload.profileData[key] = storage.getItem(key);
    }
  }

  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

export function importProfileToken(rawToken, storage = window.localStorage) {
  const decoded = decodeURIComponent(escape(atob(rawToken)));
  const data = JSON.parse(decoded);

  if (Array.isArray(data?.globals?.profiles)) {
    saveProfiles(data.globals.profiles);
  }

  if (data?.profileData && typeof data.profileData === 'object') {
    Object.entries(data.profileData).forEach(([key, value]) => {
      storage.setItem(key, value);
    });
  }

  if (data?.profile) setProfile(data.profile);
}
