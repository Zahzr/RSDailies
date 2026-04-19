/**
 * Orchestration for floating UI panels (Profiles, Settings, Views)
 */

let globalClickCloserBound = false;

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

    if (
      target.closest('#views-button') ||
      target.closest('#views-button-panel') ||
      target.closest('#views-control') ||
      target.closest('#profile-button') ||
      target.closest('#profile-control') ||
      target.closest('#settings-button') ||
      target.closest('#settings-control') ||
      target.closest('#token-button') ||
      target.closest('#token-modal') ||
      target.closest('#custom_add_button') ||
      target.closest('#custom-task-modal')
    ) {
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