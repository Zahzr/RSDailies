import { HEADER_CONTROL_LABELS, HEADER_CONTROL_TEXT } from '../header.constants.js';
import { getCollapseState, resolveHeaderContext } from '../header.logic.js';

export function createCollapseButton(blockId, context = {}) {
  const { isCollapsedBlock, setCollapsedBlock, renderApp } = resolveHeaderContext(context);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-secondary btn-sm mini-collapse-btn primitive-btn';

  const collapsed = getCollapseState(blockId, { isCollapsedBlock });
  button.textContent = collapsed ? HEADER_CONTROL_TEXT.show : HEADER_CONTROL_TEXT.hide;
  button.setAttribute('aria-label', collapsed ? HEADER_CONTROL_LABELS.expand : HEADER_CONTROL_LABELS.collapse);

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setCollapsedBlock(blockId, !isCollapsedBlock(blockId));
    renderApp();
  });

  return button;
}
