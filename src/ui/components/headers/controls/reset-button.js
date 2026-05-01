import { HEADER_CONTROL_LABELS, HEADER_CONTROL_TEXT } from '../header.constants.js';

export function createResetButton(onResetClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-secondary btn-sm mini-reset-btn primitive-btn';
  button.textContent = HEADER_CONTROL_TEXT.reset;
  button.setAttribute('aria-label', HEADER_CONTROL_LABELS.reset);
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    onResetClick?.();
  });
  return button;
}
