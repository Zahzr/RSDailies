export function initApp({
  documentRef = document,
  migrateStorageShape = () => {},
  initProfileContext,
  syncStoredViewModeToPageMode,
  applySettingsToDom,
  checkAutoReset,
  updateCountdowns,
  startRunLoops,
  setupSectionBindings,
  setupProfileControl,
  setupSettingsControl,
  setupViewsControl,
  setupGlobalClickCloser,
  setupImportExport,
  setupCustomAdd,
  startPenguinSync,
  setupGameShell,
  renderApp,
}) {
  const run = () => {
    migrateStorageShape();
    initProfileContext();
    syncStoredViewModeToPageMode();
    applySettingsToDom();
    checkAutoReset();
    updateCountdowns();

    startRunLoops();

    setupSectionBindings();
    setupProfileControl();
    setupSettingsControl();
    setupViewsControl();
    setupGlobalClickCloser();
    setupImportExport();
    setupCustomAdd();
    setupGameShell?.(documentRef);

    renderApp();
    startPenguinSync?.();
  };

  if (documentRef.readyState === 'loading') {
    documentRef.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
}
