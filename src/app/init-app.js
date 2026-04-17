export function initApp({
  documentRef = document,
  initProfileContext,
  migrateLegacyViewModeToPageMode,
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
  renderApp,
}) {
  const run = () => {
    initProfileContext();
    migrateLegacyViewModeToPageMode();
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

    renderApp();
  };

  if (documentRef.readyState === 'loading') {
    documentRef.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
}