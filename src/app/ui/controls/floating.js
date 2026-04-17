/**
 * Orchestration for floating UI panels (Profiles, Settings, Views)
 */
export function setupProfileControl(deps) {
  const {
    setupProfileControlFeature,
    renderApp,
    closeFloatingControls,
    documentRef = document
  } = deps;

  setupProfileControlFeature({
    renderApp,
    closeFloatingControls,
    documentRef
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
    documentRef = document
  } = deps;

  setupViewsControlFeature({
    renderApp,
    closeAllFloatingControls: closeFloatingControls,
    documentRef
  });
}

export function closeFloatingControls(deps) {
  const { closeFloatingControlsFeature, documentRef = document } = deps;
  closeFloatingControlsFeature(documentRef);
}

export function setupGlobalClickCloser(deps) {
  const { closeFloatingControls, documentRef = document } = deps;

  documentRef.addEventListener('click', (e) => {
    const target = e.target;
    if (
      target.closest('#views-button') ||
      target.closest('#views-button-panel') ||
      target.closest('#views-control') ||
      target.closest('#profile-button') ||
      target.closest('#profile-control') ||
      target.closest('#settings-button') ||
      target.closest('#settings-control')
    ) {
      return;
    }

    closeFloatingControls();
  });
}

export function updateProfileHeader(deps) {
  const { updateProfileHeaderFeature, documentRef = document } = deps;
  const el = documentRef.getElementById('profile-name');
  if (el) {
    updateProfileHeaderFeature(el);
  }
}
