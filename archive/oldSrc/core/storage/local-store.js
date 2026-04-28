export function loadJson(storageKey, fallback = null, storage = window.localStorage) {
  try {
    const raw = storage.getItem(storageKey);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(storageKey, value, storage = window.localStorage) {
  storage.setItem(storageKey, JSON.stringify(value));
}

export function removeStorageKey(storageKey, storage = window.localStorage) {
  storage.removeItem(storageKey);
}
