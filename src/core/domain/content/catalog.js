import { loadContentPages } from './load-content.js';

function sortByDisplayOrder(left, right) {
  const leftOrder = Number.isFinite(left?.displayOrder) ? left.displayOrder : Number.MAX_SAFE_INTEGER;
  const rightOrder = Number.isFinite(right?.displayOrder) ? right.displayOrder : Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return String(left?.id || '').localeCompare(String(right?.id || ''));
}

export function getContentPages({ pages = loadContentPages(), game = null } = {}) {
  const filtered = game ? pages.filter((page) => page?.game === game) : pages;
  return [...filtered].sort(sortByDisplayOrder);
}

export function getCanonicalSectionsById({ pages = loadContentPages(), game = null } = {}) {
  const sections = new Map();

  getContentPages({ pages, game }).forEach((page) => {
    (page.sections || []).forEach((section) => {
      const current = sections.get(section.id);
      const score = page.id === section.id ? 2 : 1;

      if (!current || score > current.score) {
        sections.set(section.id, { score, section });
      }
    });
  });

  return new Map(
    Array.from(sections.entries()).map(([sectionId, entry]) => [sectionId, entry.section])
  );
}

export function getCanonicalSections({ pages = loadContentPages(), game = null } = {}) {
  return Array.from(getCanonicalSectionsById({ pages, game }).values()).sort(sortByDisplayOrder);
}
