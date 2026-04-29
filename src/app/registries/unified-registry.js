import { loadContentPages, loadContentPagesByGame } from '../../core/domain/content/load-content.js';
import { getCanonicalSections, getContentPages } from '../../core/domain/content/catalog.js';

function buildTrackerSections() {
  return Object.freeze(
    getCanonicalSections({ game: 'rs3' }).map((section) => ({
      id: section.id,
      label: section.label,
      shortLabel: section.shortLabel || section.label,
      game: section.game || 'rs3',
      displayOrder: section.displayOrder,
      resetFrequency: section.resetFrequency,
      renderVariant: section.renderVariant,
      containerId: section.containerId,
      tableId: section.tableId,
      includedInAllMode: section.includedInAllMode ?? false,
      supportsTaskNotifications: section.supportsTaskNotifications ?? false,
      shell: section.shell,
    }))
  );
}

function buildTrackerPageModes() {
  return Object.freeze(
    getContentPages({ game: 'rs3' }).map((page) => ({
      id: page.id,
      label: page.title,
      aliases: Array.isArray(page.aliases) && page.aliases.length > 0 ? page.aliases : [page.id],
      buttonLabel: page.buttonLabel || page.title,
      navLabel: page.navLabel || page.title,
      menuGroup: page.menuGroup || 'Views',
      includeInViewsPanel: page.includeInViewsPanel ?? false,
      includeInPrimaryNav: page.includeInPrimaryNav ?? false,
      displayOrder: page.displayOrder,
    }))
  );
}

const trackerSections = buildTrackerSections();
const trackerPageModes = buildTrackerPageModes();
const trackerSectionsById = new Map(trackerSections.map((section) => [section.id, section]));
const trackerPageModesById = new Map(trackerPageModes.map((mode) => [mode.id, mode]));
const trackerPageModesByAlias = new Map(
  trackerPageModes.flatMap((mode) => mode.aliases.map((alias) => [alias, mode.id]))
);

export const TRACKER_SECTION_DEFINITIONS = trackerSections;
export const TRACKER_PAGE_MODE_DEFINITIONS = trackerPageModes;

export function getTrackerSections() {
  return TRACKER_SECTION_DEFINITIONS;
}

export function getTrackerSection(sectionId) {
  return trackerSectionsById.get(sectionId) || null;
}

export function getTrackerSectionIds() {
  return TRACKER_SECTION_DEFINITIONS.map((section) => section.id);
}

export function getTrackerSectionIdMaps() {
  return TRACKER_SECTION_DEFINITIONS.reduce(
    (maps, section) => {
      maps.containerIds[section.id] = section.containerId;
      maps.tableIds[section.id] = section.tableId;
      return maps;
    },
    { containerIds: {}, tableIds: {} }
  );
}

export function getTrackerViews() {
  return TRACKER_PAGE_MODE_DEFINITIONS.map((mode) => ({ mode: mode.id, label: mode.label }));
}

export function getTrackerViewsPanelGroups() {
  const groupedModes = TRACKER_PAGE_MODE_DEFINITIONS.filter((mode) => mode.includeInViewsPanel).reduce(
    (groups, mode) => {
      const heading = mode.menuGroup || 'Views';
      if (!groups.has(heading)) {
        groups.set(heading, []);
      }

      groups.get(heading).push({ mode: mode.id, label: mode.navLabel || mode.label });
      return groups;
    },
    new Map()
  );

  return Array.from(groupedModes.entries()).map(([heading, items]) => ({ heading, items }));
}

export function getTrackerPrimaryNavItems() {
  return TRACKER_PAGE_MODE_DEFINITIONS
    .filter((mode) => mode.includeInPrimaryNav)
    .map((mode) => ({ mode: mode.id, label: mode.navLabel || mode.label }));
}

export function getTrackerPageModes() {
  return TRACKER_PAGE_MODE_DEFINITIONS.map((mode) => mode.id);
}

export function getTrackerPageMode(modeId) {
  return trackerPageModesById.get(modeId) || null;
}

export function isTrackerPageMode(modeId) {
  return trackerPageModesById.has(modeId);
}

export function normalizeTrackerPageMode(modeId, fallback = 'all') {
  if (typeof modeId !== 'string') {
    return fallback;
  }

  const canonicalMode = trackerPageModesByAlias.get(modeId);
  return canonicalMode || fallback;
}

export function getCanonicalTrackerRegistry() {
  return {
    sections: TRACKER_SECTION_DEFINITIONS,
    pageModes: TRACKER_PAGE_MODE_DEFINITIONS,
    pages: loadContentPages(),
  };
}

export function getTrackerPages() {
  return loadContentPages();
}

export function getTrackerPagesByGame(game) {
  return loadContentPagesByGame(game);
}

export function getTrackerPage(pageId) {
  return loadContentPages().find((page) => page.id === pageId) || null;
}

export function getTrackerPageSectionIds(pageId) {
  const page = getTrackerPage(pageId);
  if (!page || !Array.isArray(page.sections)) {
    return [];
  }

  return page.sections.map((section) => section.id);
}
