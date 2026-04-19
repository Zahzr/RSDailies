import {
  initProfileContext,
  migrateLegacyViewModeToPageMode,
  applySettingsToDom,
  checkAutoReset,
  renderApp,
  setupGlobalClickCloser,
  setupViewsControl,
  setupProfileControl,
  setupSettingsControl,
  setupSectionBindings,
  setupImportExport,
  setupCustomAdd,
  updateCountdowns,
  cleanupReadyFarmingTimers,
  cleanupReadyCooldowns
} from './legacy-app.js';
import { initApp } from './init-app.js';
import { startAppLoops } from './run-loops.js';
import { createScheduler } from './scheduler.js';

export function createCompositionRoot({ rootElement } = {}) {
  const scheduler = createScheduler();

  return {
    start() {
      try {
        if (rootElement) {
          rootElement.dataset.app = 'rsdailies';
        }

        const documentRef = rootElement?.ownerDocument || document;

        initApp({
          documentRef,
          initProfileContext,
          migrateLegacyViewModeToPageMode,
          applySettingsToDom,
          checkAutoReset,
          updateCountdowns,
          renderApp,
          setupGlobalClickCloser,
          setupViewsControl,
          setupProfileControl,
          setupSettingsControl,
          setupSectionBindings,
          setupImportExport,
          setupCustomAdd,
          startRunLoops: () =>
            startAppLoops({
              updateCountdowns,
              checkAutoReset,
              cleanupReadyFarmingTimers,
              cleanupReadyCooldowns,
              renderApp,
              intervalRef: window.setInterval.bind(window),
            }),
        });
      } catch (err) {
        console.error('CRITICAL ERROR DURING START:', err);
        window.APP_START_ERROR = err;
      }
    },

    scheduler,
  };
}