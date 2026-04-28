import { HEADER_CLASSES } from '../header.constants.js';
import { createCollapseButton } from '../controls/collapse-button.js';
import { createResetButton } from '../controls/reset-button.js';
import { createRestoreMenu } from '../controls/restore-menu.js';

export function createTableSectionHeader(label, blockId, options = {}) {
  const {
    className = '',
    rightText = '',
    onRightClick = null,
    onResetClick = null,
    restoreOptions = [],
    onRestoreSelect = null,
    collapsible = true,
    context = {}
  } = options;

  const row = document.createElement('tr');
  row.className = [HEADER_CLASSES.row, className].filter(Boolean).join(' ');

  const cell = document.createElement('td');
  cell.colSpan = 3;
  cell.className = HEADER_CLASSES.cell;

  const bar = document.createElement('div');
  bar.className = HEADER_CLASSES.bar;

  const center = document.createElement('div');
  center.className = HEADER_CLASSES.title;
  center.innerHTML = `<span class="${HEADER_CLASSES.titleText}">${label}</span>`;

  const controls = document.createElement('div');
  controls.className = HEADER_CLASSES.controls;

  if (rightText) {
    const status = document.createElement('span');
    status.className = HEADER_CLASSES.status;
    status.textContent = rightText;
    controls.appendChild(status);
  }

  if (onResetClick) controls.appendChild(createResetButton(onResetClick));

  const restoreMenu = createRestoreMenu(restoreOptions, onRestoreSelect);
  if (restoreMenu) controls.appendChild(restoreMenu);

  const collapse = (collapsible && blockId) ? createCollapseButton(blockId, context) : null;
  if (collapse) controls.appendChild(collapse);

  bar.append(center, controls);
  cell.appendChild(bar);

  if (onRightClick) {
    controls.classList.add(HEADER_CLASSES.clickable);
    controls.addEventListener('click', (event) => {
      if (collapse && event.target.closest('.mini-collapse-btn')) return;
      if (event.target.closest('.mini-reset-btn, select')) return;
      onRightClick();
    });
  }

  row.appendChild(cell);
  return row;
}
