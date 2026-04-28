import { validateContentPages } from './validate-content.js';

function toPageDefinition(moduleValue) {
  if (moduleValue?.default && typeof moduleValue.default === 'object') {
    return moduleValue.default;
  }

  const exportedValue = Object.values(moduleValue || {}).find(
    (value) => value && typeof value === 'object' && typeof value.id === 'string' && Array.isArray(value.sections)
  );

  return exportedValue || null;
}

export function loadContentPages() {
  const modules = import.meta.glob('../../../content/**/*.page.js', { eager: true });

  const pages = Object.values(modules)
    .map(toPageDefinition)
    .filter(Boolean)
    .sort((left, right) => String(left.id).localeCompare(String(right.id)));

  return validateContentPages(pages);
}

export function loadContentPagesByGame(game) {
  return loadContentPages().filter((page) => page.game === game);
}
