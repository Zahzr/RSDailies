import { COLUMN_CLASS_NAMES } from './column.constants.js';
import { getGoldColumnValue } from './column.logic.js';

export function configureIconColumn(nameCell, task = {}) {
  if (!nameCell) return;
  if (task.icon) nameCell.dataset.icon = task.icon;
}

export function configureLabelColumn(nameLink, task = {}) {
  if (!nameLink) return;
  nameLink.textContent = task.name || '';
  if (task.wiki) nameLink.href = task.wiki;
}

export function createTimerColumn(text = '') {
  const cell = document.createElement('td');
  cell.className = `activity_notes ${COLUMN_CLASS_NAMES.CUSTOM_TIMER}`;
  cell.textContent = text || '';
  return cell;
}

export function renderGoldColumn(container, price, qty = 1) {
  if (!container) return 0;
  const { value, text } = getGoldColumnValue(price, qty);
  container.textContent = text;
  return value;
}

export function bindActionColumn(statusCell, toggleTask) {
  if (!statusCell || !toggleTask) return;
  statusCell.addEventListener('click', toggleTask);
}
