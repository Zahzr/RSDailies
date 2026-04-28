export function setupFeatureControls({
  setupProfileControlBridge,
  setupProfileControlFeature,
  setupSettingsControlBridge,
  setupSettingsControlFeature,
  setupViewsControlBridge,
  setupViewsControlFeature,
  closeFloatingControlsBridge,
  closeFloatingControls,
  setupGlobalClickCloserBridge,
  setupImportExportFeature,
  buildExportToken,
  importProfileToken,
  setupCustomAddFeature,
  renderApp,
  getCustomTasks,
  saveCustomTasks,
  documentRef = document,
  windowRef = window
}) {
  const closeAll = () => closeFloatingControlsBridge({ closeFloatingControlsFeature: closeFloatingControls, documentRef });

  const setupProfile = () => setupProfileControlBridge({ setupProfileControlFeature, renderApp, closeFloatingControls: closeAll, documentRef, windowRef });
  const setupSettings = () => setupSettingsControlBridge({ setupSettingsControlFeature, renderApp, closeFloatingControls: closeAll, documentRef });
  const setupViews = () => setupViewsControlBridge({ setupViewsControlFeature, renderApp, closeFloatingControls: closeAll, documentRef, windowRef });
  const setupCloser = () => setupGlobalClickCloserBridge({ closeFloatingControls: closeAll, documentRef });
  const setupImportExport = () => {
    setupImportExportFeature({
      documentRef,
      navigatorRef: windowRef.navigator,
      buildExportToken,
      importProfileToken,
      onImport: () => windowRef.location.reload(),
      storage: windowRef.localStorage
    });
  };
  const setupCustomAdd = () => setupCustomAddFeature({ getCustomTasks, saveCustomTasks, renderApp, bootstrapRef: windowRef.bootstrap, documentRef });

  return { setupProfile, setupSettings, setupViews, setupCloser, setupImportExport, setupCustomAdd };
}
