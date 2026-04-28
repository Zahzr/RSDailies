import { createPrimaryButton } from './PrimaryBtn.js';
export function createToggleButton(label, pressed = false) { const button = createPrimaryButton(label, { bootstrapVariant: pressed ? 'primary' : 'secondary' }); button.setAttribute('aria-pressed', String(pressed)); button.classList.add('primitive-toggle-btn'); return button; }
