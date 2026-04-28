import { createCompositionRoot } from '../runtime/composition-root.js';

export function bootstrapApp() {
  const rootElement = document.querySelector('#app');

  if (!rootElement) {
    throw new Error('App root element "#app" was not found.');
  }

  const app = createCompositionRoot({ rootElement });
  app.start();

  return app;
}