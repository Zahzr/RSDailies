import { createScheduler } from './scheduler.js';
import { createLegacyApp } from './legacy-app.js';

export function createCompositionRoot({ rootElement }) {
  const scheduler = createScheduler();
  const legacyApp = createLegacyApp({
    rootElement,
    scheduler,
  });

  return {
    start() {
      legacyApp.start();
    },

    stop() {
      legacyApp.stop?.();
      scheduler.stop();
    },
  };
}