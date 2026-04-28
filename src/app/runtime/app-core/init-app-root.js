export function runAppInitialization({ migrateStorageShape, initProfileContext, syncStoredViewModeToPageMode, applySettingsToDom, checkAutoReset, updateCountdowns, setupSectionBindings, controlEntries, renderApp }) {
  migrateStorageShape?.();
  initProfileContext();
  syncStoredViewModeToPageMode();
  applySettingsToDom();
  checkAutoReset();
  updateCountdowns();
  setupSectionBindings();
  controlEntries.setupProfile();
  controlEntries.setupSettings();
  controlEntries.setupViews();
  controlEntries.setupCloser();
  controlEntries.setupImportExport();
  controlEntries.setupCustomAdd();
  renderApp();
}
