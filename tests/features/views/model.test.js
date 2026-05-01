import test from 'node:test';
import assert from 'node:assert/strict';

function createMemoryStorage() {
  const state = new Map();

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
    clear() {
      state.clear();
    },
    dump() {
      return Object.fromEntries(state.entries());
    },
  };
}

const storage = createMemoryStorage();
globalThis.localStorage = storage;
globalThis.window = { localStorage: storage };
globalThis.document = {
  events: [],
  dispatchEvent(event) {
    this.events.push(event);
    return true;
  },
};
globalThis.CustomEvent = class CustomEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.detail = init.detail;
  }
};

const { GAMES, setSelectedGame } = await import('../../../src/core/state/GameContext.js');
const { getPageMode, setPageMode, syncStoredViewModeToPageMode } = await import('../../../src/features/views/domain/model.js');

test('view model stores page modes per game and preserves the rs3 migration path', () => {
  storage.clear();
  document.events.length = 0;

  storage.setItem('rsdailies:default:viewMode', JSON.stringify('gathering'));

  setSelectedGame(GAMES.RS3);
  assert.equal(syncStoredViewModeToPageMode(GAMES.RS3), 'gathering');
  assert.equal(getPageMode(GAMES.RS3), 'gathering');

  setSelectedGame(GAMES.OSRS);
  assert.equal(syncStoredViewModeToPageMode(GAMES.OSRS), 'osrsall');
  assert.equal(getPageMode(GAMES.OSRS), 'osrsall');

  assert.equal(setPageMode('weekly', GAMES.OSRS), 'osrsweekly');
  assert.equal(getPageMode(GAMES.OSRS), 'osrsweekly');
  assert.equal(getPageMode(GAMES.RS3), 'gathering');

  assert.equal(storage.getItem('rsdailies:default:pageMode:osrs'), JSON.stringify('osrsweekly'));
  assert.equal(storage.getItem('rsdailies:default:pageMode:rs3'), JSON.stringify('gathering'));
  assert.deepEqual(document.events.at(-1)?.detail, { mode: 'osrsweekly', game: 'osrs' });
});
