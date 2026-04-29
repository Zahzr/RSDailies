/**
 * Orchestration for floating UI panels (Profiles, Settings, Views)
 */
import { setPanelOpenState } from '../../core/dom/controls.js';

let globalClickCloserBound = false;

const FLOATING_CONTROL_SELECTORS = [
  '#views-button-panel',
  '#views-control',
  '#profile-button',
  '#profile-control',
  '#settings-button',
  '#settings-control',
  '#token-button',
  '#token-modal',
  '#custom_add_button',
  '#custom-task-modal',
];

export function setupProfileControl(deps) {
  const {
    setupProfileControlFeature,
    renderApp,
    closeFloatingControls,
    documentRef = document,
    windowRef = window
  } = deps;

  setupProfileControlFeature({
    renderApp,
    closeFloatingControls,
    documentRef,
    windowRef
  });
}

export function setupSettingsControl(deps) {
  const {
    setupSettingsControlFeature,
    renderApp,
    closeFloatingControls,
    documentRef = document
  } = deps;

  setupSettingsControlFeature({
    renderApp,
    closeFloatingControls,
    documentRef
  });
}

export function setupViewsControl(deps) {
  const {
    setupViewsControlFeature,
    renderApp,
    closeFloatingControls,
    documentRef = document,
    windowRef = window
  } = deps;

  setupViewsControlFeature({
    renderApp,
    closeAllFloatingControls: closeFloatingControls,
    documentRef,
    windowRef
  });
}

export function closeFloatingControls(deps) {
  const { closeFloatingControlsFeature, documentRef = document } = deps;
  closeFloatingControlsFeature(documentRef);
}

export function setupGlobalClickCloser(deps) {
  const { closeFloatingControls, documentRef = document } = deps;

  if (globalClickCloserBound) return;
  globalClickCloserBound = true;

  documentRef.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (FLOATING_CONTROL_SELECTORS.some((selector) => target.closest(selector))) {
      return;
    }

    closeFloatingControls();
  });
}

export function updateProfileHeader(deps) {
  const { updateProfileHeaderFeature, documentRef = document } = deps;
  const element = documentRef.getElementById('profile-name');
  if (element) {
    updateProfileHeaderFeature(element);
  }
}
