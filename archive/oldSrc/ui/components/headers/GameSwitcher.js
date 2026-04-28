import { GAMES, getSelectedGame, setSelectedGame } from '../../../core/state/GameContext.js';
export function setupGameSwitcher(documentRef = document) { documentRef.querySelectorAll('[data-game-choice]').forEach((button) => { button.setAttribute('aria-pressed', String(button.dataset.gameChoice === getSelectedGame())); button.addEventListener('click', () => setSelectedGame(button.dataset.gameChoice)); }); }
export { GAMES };
