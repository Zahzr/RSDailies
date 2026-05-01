import { HEADER_CLASSES, HEADER_CONTROL_TEXT } from './header.constants.js';
import { renderHeaderFrameHtml } from './header.frame.js';

function renderControlButton(id, className, text, variant = 'secondary') {
  return `<button id="${id}" type="button" class="btn btn-${variant} btn-sm active primitive-btn ${className}">${text}</button>`;
}

function renderHeaderControls(section) {
  const controls = [];
  const shell = section.shell || {};

  if (shell.countdownId) {
    controls.push(`<span id="${shell.countdownId}" class="${HEADER_CLASSES.status} section-panel-countdown">--:--:--</span>`);
  }

  if (shell.showAddButton) {
    controls.push(renderControlButton(`${section.id}_add_button`, 'section-panel-add-button', '+ Add', 'primary'));
  }

  if (shell.showResetButton) {
    controls.push(renderControlButton(`${section.id}_reset_button`, 'section-panel-reset-button', HEADER_CONTROL_TEXT.reset));
  }

  controls.push(renderControlButton(`${section.id}_hide_button`, 'hide_button section-panel-toggle-button', HEADER_CONTROL_TEXT.hide));
  controls.push(renderControlButton(`${section.id}_unhide_button`, 'unhide_button section-panel-toggle-button', HEADER_CONTROL_TEXT.show));

  return controls.join('');
}

export function renderSectionPanelHeader(section, colspan) {
  return renderHeaderFrameHtml({
    label: section.label,
    colspan,
    controlsHtml: renderHeaderControls(section),
    barClassName: 'section-panel-header',
    titleClassName: 'section-panel-title',
    controlsClassName: 'section-panel-controls'
  });
}
