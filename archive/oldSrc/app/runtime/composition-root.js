import {
  initProfileContext,
  syncStoredViewModeToPageMode,
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
  startPenguinSync,
  updateCountdowns,
  cleanupReadyFarmingTimers,
  cleanupReadyCooldowns
} from './app-core/runtime-api.js';
import { initApp } from '../boot/init-app.js';
import { startAppLoops } from '../boot/run-loops.js';
import { setupGameShell } from '../../ui/pages/GameShell.js';
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
          syncStoredViewModeToPageMode,
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
          startPenguinSync,
          setupGameShell,
          startRunLoops: () =>
            startAppLoops({
              updateCountdowns,
              checkAutoReset,
              cleanupReadyFarmingTimers,
              cleanupReadyCooldowns,
              startPenguinSync,
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
