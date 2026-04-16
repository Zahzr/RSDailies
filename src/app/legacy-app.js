import * as taskConfig from '../config/tasks/index.js';
import * as farmingConfig from '../config/farming/index.js';
import * as settingsDefaults from '../config/settings-defaults.js';
import * as themeConfig from '../config/theme.js';

import * as profilesFeature from '../features/profiles/index.js';
import * as settingsFeature from '../features/settings/index.js';
import * as viewsFeature from '../features/views/index.js';
import * as tasksFeature from '../features/tasks/index.js';
import * as sectionsFeature from '../features/sections/index.js';
import * as farmingFeature from '../features/farming/index.js';
import * as cooldownsFeature from '../features/cooldowns/index.js';
import * as overviewFeature from '../features/overview/index.js';
import * as notificationsFeature from '../features/notifications/index.js';
import * as importExportFeature from '../features/import-export/index.js';
import * as customTasksFeature from '../features/custom-tasks/index.js';

import * as renderModule from '../ui/render-app.js';

const FEATURE_MODULES = {
  profiles: profilesFeature,
  settings: settingsFeature,
  views: viewsFeature,
  tasks: tasksFeature,
  sections: sectionsFeature,
  farming: farmingFeature,
  cooldowns: cooldownsFeature,
  overview: overviewFeature,
  notifications: notificationsFeature,
  importExport: importExportFeature,
  customTasks: customTasksFeature,
};

function resolveFirstFunction(moduleNamespace, names) {
  for (const name of names) {
    if (typeof moduleNamespace[name] === 'function') {
      return moduleNamespace[name];
    }
  }

  return null;
}

function createController(name, moduleNamespace, context) {
  const factory = resolveFirstFunction(moduleNamespace, [
    `create${capitalize(name)}Feature`,
    `create${capitalize(name)}Controller`,
    `create${capitalize(name)}Module`,
    'createFeature',
    'createController',
    'createModule',
    'init',
    'setup',
  ]);

  if (!factory) {
    return null;
  }

  try {
    const result = factory(context);
    return result ?? null;
  } catch (error) {
    console.error(`[legacy-app] Failed to initialize "${name}" feature.`, error);
    return null;
  }
}

function runLifecycle(target, methodNames, ...args) {
  if (!target) {
    return;
  }

  for (const methodName of methodNames) {
    if (typeof target[methodName] === 'function') {
      target[methodName](...args);
      return;
    }
  }
}

function capitalize(value) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeConfig() {
  return {
    tasks: taskConfig,
    farming: farmingConfig,
    settings: settingsDefaults,
    theme: themeConfig,
  };
}

function createRenderBridge(context) {
  const renderFactory = resolveFirstFunction(renderModule, [
    'createRenderApp',
    'createRenderer',
    'createAppRenderer',
  ]);

  if (renderFactory) {
    const renderer = renderFactory(context);

    return {
      render(nextContext = context) {
        runLifecycle(renderer, ['render', 'update', 'mount'], nextContext);
      },
      stop() {
        runLifecycle(renderer, ['destroy', 'dispose', 'unmount', 'stop']);
      },
    };
  }

  const renderFn = resolveFirstFunction(renderModule, [
    'renderApp',
    'render',
    'mountApp',
  ]);

  if (renderFn) {
    return {
      render(nextContext = context) {
        renderFn(nextContext);
      },
      stop() {},
    };
  }

  return {
    render() {
      context.rootElement.innerHTML = '';
      const message = document.createElement('div');
      message.className = 'app-error';
      message.textContent =
        'The application renderer is not available. Check src/ui/render-app.js exports.';
      context.rootElement.appendChild(message);
    },
    stop() {},
  };
}

function buildFeatureControllers(context) {
  const controllers = {};

  for (const [name, moduleNamespace] of Object.entries(FEATURE_MODULES)) {
    controllers[name] = createController(name, moduleNamespace, context);
  }

  return controllers;
}

function startFeatureControllers(controllers, context) {
  for (const controller of Object.values(controllers)) {
    runLifecycle(controller, ['start', 'mount', 'init', 'attach'], context);
  }
}

function stopFeatureControllers(controllers) {
  for (const controller of Object.values(controllers)) {
    runLifecycle(controller, ['destroy', 'dispose', 'detach', 'stop']);
  }
}

export function createLegacyApp({ rootElement, scheduler }) {
  let started = false;
  let renderBridge = null;
  let tickIntervalId = null;

  const context = {
    rootElement,
    scheduler,
    config: normalizeConfig(),
    state: {},
    controllers: {},
    services: {},
  };

  function render() {
    if (!renderBridge) {
      return;
    }

    renderBridge.render(context);
  }

  function start() {
    if (started) {
      return;
    }

    started = true;
    rootElement.dataset.app = 'rsdailies';

    context.controllers = buildFeatureControllers(context);
    renderBridge = createRenderBridge(context);

    startFeatureControllers(context.controllers, context);
    render();

    tickIntervalId = scheduler.every(() => {
      runLifecycle(context.controllers.cooldowns, ['tick', 'updateCountdowns'], context);
      runLifecycle(context.controllers.farming, ['tick', 'updateTimers'], context);
      render();
    }, 1000);
  }

  function stop() {
    if (!started) {
      return;
    }

    started = false;

    if (tickIntervalId !== null) {
      scheduler.cancelInterval(tickIntervalId);
      tickIntervalId = null;
    }

    stopFeatureControllers(context.controllers);
    renderBridge?.stop?.();

    context.controllers = {};
    rootElement.removeAttribute('data-app');
    rootElement.innerHTML = '';
  }

  return {
    start,
    stop,
    getContext() {
      return context;
    },
  };
}