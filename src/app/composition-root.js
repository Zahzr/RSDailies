import { createScheduler } from './scheduler.js';
import './legacy-app.js';

export function createCompositionRoot({ rootElement }) {
  const scheduler = createScheduler();

  return {
    start() {
      if (rootElement) {
        rootElement.dataset.app = 'rsdailies';
      }
    },

    stop() {
      scheduler.stop();

      if (rootElement) {
        rootElement.removeAttribute('data-app');
      }
    },
  };
}