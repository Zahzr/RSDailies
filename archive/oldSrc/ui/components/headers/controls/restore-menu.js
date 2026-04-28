import { HEADER_CONTROL_LABELS } from '../header.constants.js';
import { canRenderRestoreMenu } from '../header.logic.js';
import { closeRestoreMenu, openRestoreMenu } from './restore-menu.logic.js';

export function createRestoreMenu(restoreOptions = [], onRestoreSelect = null) {
  if (!canRenderRestoreMenu(restoreOptions, onRestoreSelect)) return null;

  const wrapper = document.createElement('div');
  wrapper.className = 'header_restore_wrapper';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'btn btn-secondary btn-sm mini-reset-btn primitive-btn';
  trigger.textContent = '\u21BA Restore';
  trigger.setAttribute('aria-label', HEADER_CONTROL_LABELS.restoreOpen);
  trigger.setAttribute('aria-expanded', 'false');

  const menu = document.createElement('div');
  menu.className = 'header_restore_menu';

  const select = document.createElement('select');
  select.className = 'form-select form-select-sm header_restore_select';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = HEADER_CONTROL_LABELS.restorePlaceholder;
  select.appendChild(placeholder);

  restoreOptions.forEach((entry) => {
    const option = document.createElement('option');
    option.value = entry.value;
    option.textContent = entry.label;
    select.appendChild(option);
  });

  const applyButton = document.createElement('button');
  applyButton.type = 'button';
  applyButton.className = 'btn btn-secondary btn-sm mini-reset-btn primitive-btn';
  applyButton.textContent = '\u21BA Restore item';
  applyButton.setAttribute('aria-label', HEADER_CONTROL_LABELS.restoreItem);
  applyButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!select.value) return;
    onRestoreSelect(select.value);
    closeRestoreMenu(menu, trigger);
  });

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (menu.style.display === 'flex') closeRestoreMenu(menu, trigger);
    else openRestoreMenu(menu, trigger);
  });

  menu.addEventListener('click', (event) => event.stopPropagation());
  document.addEventListener('click', (event) => {
    if (!wrapper.contains(event.target)) closeRestoreMenu(menu, trigger);
  });

  menu.append(select, applyButton);
  wrapper.append(trigger, menu);
  return wrapper;
}
