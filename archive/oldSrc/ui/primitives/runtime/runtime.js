export function resolveDocument(runtime = {}) {
  return runtime.document || globalThis.document;
}

export function resolveWindow(runtime = {}) {
  return runtime.window || globalThis.window;
}

export function resolveCallback(runtime = {}, name, fallback = null) {
  if (runtime && typeof runtime[name] === 'function') {
    return runtime[name];
  }

  if (typeof globalThis !== 'undefined' && typeof globalThis[name] === 'function') {
    return globalThis[name];
  }

  return fallback;
}

export function resolveValue(runtime = {}, name, fallback = undefined) {
  if (runtime && name in runtime) {
    return runtime[name];
  }

  if (typeof globalThis !== 'undefined' && name in globalThis) {
    return globalThis[name];
  }

  return fallback;
}
