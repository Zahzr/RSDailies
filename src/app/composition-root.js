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
import { tasksConfig as TASKS_CONFIG } from '../config/tasks/index.js';
import { farmingConfig as FARMING_CONFIG } from '../config/farming/index.js';

export function createCompositionRoot({ rootElement }) {
  const scheduler = createScheduler();

  return {
    start() {
      console.log('Composition Root starting...');
      console.log('TASKS_CONFIG keys:', Object.keys(TASKS_CONFIG || {}));
      console.log('Dailies count in TASKS_CONFIG:', TASKS_CONFIG?.dailies?.length || 0);

      try {
        if (rootElement) {
          rootElement.dataset.app = 'rsdailies';
        }

        const documentRef = rootElement ? rootElement.ownerDocument : document;

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
        console.log('Composition Root successfully called initApp');
      } catch (err) {
        console.error('CRITICAL ERROR DURING START:', err);
        window.APP_START_ERROR = err;
      }
    },

    scheduler,
  };
}