import { GAMES, setSelectedGame } from '../../core/state/GameContext.js';
export function showSelectionPage() { const selection = document.getElementById('game-selection-page'); if (selection) selection.hidden = false; }
export function chooseRs3() { return setSelectedGame(GAMES.RS3); }
export function chooseOsrs() { return setSelectedGame(GAMES.OSRS); }
