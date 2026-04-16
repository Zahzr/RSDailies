import { initializeCompositionRoot } from './composition-root.js';
import { startAppScheduler } from './scheduler.js';
import './legacy-app.js';

export function bootstrapApp() {
  initializeCompositionRoot();
  startAppScheduler();
}
