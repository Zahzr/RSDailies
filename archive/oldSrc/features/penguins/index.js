import { nextWeeklyBoundary } from '../../core/time/boundaries.js';

const PENGUIN_CACHE_KEY = 'penguinWeeklyData';
const PENGUIN_META_KEY = 'penguinWeeklyDataMeta';
const PENGUIN_REFRESH_MS = 3 * 60 * 60 * 1000;

let activePenguinSync = null;

function sanitizeText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildPenguinNote(entry) {
  const parts = [];

  if (entry.points) parts.push(`${entry.points}-point`);
  if (entry.disguise) parts.push(entry.disguise);
  if (entry.last_location) parts.push(`Last seen: ${sanitizeText(entry.last_location)}`);
  if (entry.confined_to) parts.push(`Area: ${sanitizeText(entry.confined_to)}`);
  if (entry.warning) parts.push(`Warning: ${sanitizeText(entry.warning)}`);
  if (entry.requirements) parts.push(`Req: ${sanitizeText(entry.requirements)}`);

  return parts.join(' | ');
}

function buildPolarBearNote(entry) {
  const parts = [];

  if (entry.name) parts.push(sanitizeText(entry.name));
  if (entry.location) parts.push(`Location: ${sanitizeText(entry.location)}`);

  return parts.join(' | ');
}

function getCurrentWeekKey(now = new Date()) {
  return nextWeeklyBoundary(now).toISOString();
}

function buildPenguinApiUrl() {
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl.replace(/\/?$/, '/')}api/penguins/actives`;
}

export function parsePenguinActives(payload) {
  const penguins = Array.isArray(payload?.Activepenguin) ? [...payload.Activepenguin] : [];
  const bear = Array.isArray(payload?.Bear) ? payload.Bear.find((entry) => String(entry?.active) === '1') : null;

  penguins.sort((left, right) => {
    const leftWeight = Number(left?.weight) || Number.MAX_SAFE_INTEGER;
    const rightWeight = Number(right?.weight) || Number.MAX_SAFE_INTEGER;
    return leftWeight - rightWeight;
  });

  const parsed = {};

  penguins.slice(0, 12).forEach((entry, index) => {
    parsed[`penguin-${index + 1}`] = {
      name: sanitizeText(entry?.name) || `Penguin ${index + 1}`,
      note: buildPenguinNote(entry)
    };
  });

  if (bear) {
    parsed['penguin-polar-bear'] = {
      name: 'Polar Bear',
      note: buildPolarBearNote(bear)
    };
  }

  return parsed;
}

function shouldSyncPenguins(load) {
  const meta = (load?.(PENGUIN_META_KEY, {})) || {};
  const weekKey = getCurrentWeekKey();
  const hasCurrentCache = Object.keys((load?.(PENGUIN_CACHE_KEY, {})) || {}).length > 0;

  if (meta.weekKey !== weekKey) return true;
  if (!hasCurrentCache) return true;
  if (!meta.syncedAt) return true;

  return (Date.now() - meta.syncedAt) >= PENGUIN_REFRESH_MS;
}

export async function syncPenguinWeeklyData({ load, save, renderApp, fetchImpl = window.fetch.bind(window) }) {
  if (activePenguinSync) return activePenguinSync;
  if (!shouldSyncPenguins(load)) return false;

  activePenguinSync = (async () => {
    const weekKey = getCurrentWeekKey();
    const meta = (load?.(PENGUIN_META_KEY, {})) || {};

    try {
      const response = await fetchImpl(buildPenguinApiUrl(), {
        headers: {
          Accept: 'application/json'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Penguin sync failed with status ${response.status}`);
      }

      const payload = await response.json();
      const parsed = parsePenguinActives(payload);
      if (Object.keys(parsed).length === 0) {
        throw new Error('Penguin sync returned no active rows');
      }

      save?.(PENGUIN_CACHE_KEY, parsed);
      save?.(PENGUIN_META_KEY, {
        ...meta,
        weekKey,
        syncedAt: Date.now(),
        lastAttemptAt: Date.now(),
        lastError: ''
      });
      renderApp?.();
      return true;
    } catch (error) {
      save?.(PENGUIN_META_KEY, {
        ...meta,
        weekKey,
        lastAttemptAt: Date.now(),
        lastError: String(error)
      });
      return false;
    } finally {
      activePenguinSync = null;
    }
  })();

  return activePenguinSync;
}
