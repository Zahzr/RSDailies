import { HEADER_CLASSES } from '../header.constants.js';
import { createHeaderFrameRow } from '../header.frame.js';
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

  const controls = [];

  if (rightText) {
    const status = document.createElement('span');
    status.className = HEADER_CLASSES.status;
    status.textContent = rightText;
    controls.push(status);
  }

  if (onResetClick) controls.push(createResetButton(onResetClick));

  const restoreMenu = createRestoreMenu(restoreOptions, onRestoreSelect);
  if (restoreMenu) controls.push(restoreMenu);

  const collapse = (collapsible && blockId) ? createCollapseButton(blockId, context) : null;
  if (collapse) controls.push(collapse);

  const { row, controlsHost } = createHeaderFrameRow({
    label,
    controls,
    rowClassName: [HEADER_CLASSES.row, className].filter(Boolean).join(' '),
    titleIsHtml: true
  });

  if (onRightClick) {
    controlsHost.classList.add(HEADER_CLASSES.clickable);
    controlsHost.addEventListener('click', (event) => {
      if (collapse && event.target.closest('.mini-collapse-btn')) return;
      if (event.target.closest('.mini-reset-btn, select')) return;
      onRightClick();
    });
  }

  return row;
}
