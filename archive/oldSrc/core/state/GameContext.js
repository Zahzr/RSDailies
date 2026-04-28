import { readStorage, writeStorage } from '../storage/Storage.js';

export const GAMES = Object.freeze({ RS3: 'rs3', OSRS: 'osrs' });

const GAME_KEY = 'selectedGame';
const storedGame = readStorage(GAME_KEY, null);
let selectedGame = storedGame === GAMES.OSRS || storedGame === GAMES.RS3 ? storedGame : null;
const listeners = new Set();

export function getSelectedGame() {
  if (selectedGame === GAMES.OSRS) return GAMES.OSRS;
  if (selectedGame === GAMES.RS3) return GAMES.RS3;
  return null;
}

export function hasSelectedGame() {
  return getSelectedGame() !== null;
}

export function setSelectedGame(game) {
  selectedGame = game === GAMES.OSRS ? GAMES.OSRS : GAMES.RS3;
  writeStorage(GAME_KEY, selectedGame);
  listeners.forEach((listener) => listener(selectedGame));
  return selectedGame;
}

export function subscribeToGameChanges(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isRs3Selected() {
  return getSelectedGame() === GAMES.RS3;
}
