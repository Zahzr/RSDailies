import { loadContentPages, loadContentPagesByGame } from '../../core/domain/content/load-content.js';
import { getCanonicalSections, getContentPages } from '../../core/domain/content/catalog.js';

const CONTENT_PAGES = Object.freeze(loadContentPages());

function filterByGame(definitions, game) {
  return game ? definitions.filter((definition) => definition.game === game) : definitions;
}

function createAliasLookup(definitions) {
  const aliases = new Map();

  definitions.forEach((definition) => {
    [definition.id, ...(definition.aliases || [])].forEach((alias) => {
      if (!aliases.has(alias)) {
        aliases.set(alias, definition.id);
      }
    });
  });

  return aliases;
}

function buildTrackerSections() {
  return Object.freeze(
    getCanonicalSections({ pages: CONTENT_PAGES }).map((section) => ({
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
    getContentPages({ pages: CONTENT_PAGES }).map((page) => ({
      id: page.id,
      label: page.title,
      game: page.game,
      aliases: Array.isArray(page.aliases) && page.aliases.length > 0 ? page.aliases : [page.id],
      buttonLabel: page.buttonLabel || page.title,
      navLabel: page.navLabel || page.title,
      menuGroup: page.menuGroup || 'Views',
      includeInViewsPanel: page.includeInViewsPanel ?? false,
      includeInPrimaryNav: page.includeInPrimaryNav ?? false,
      primaryNavDropdownLabel: page.primaryNavDropdownLabel || '',
      primaryNavItemLabel: page.primaryNavItemLabel || '',
      displayOrder: page.displayOrder,
    }))
  );
}

const trackerSections = buildTrackerSections();
const trackerPageModes = buildTrackerPageModes();
const trackerSectionsById = new Map(trackerSections.map((section) => [section.id, section]));
const trackerPageModesById = new Map(trackerPageModes.map((mode) => [mode.id, mode]));
const trackerPagesById = new Map(CONTENT_PAGES.map((page) => [page.id, page]));
const trackerPageModesByAlias = createAliasLookup(trackerPageModes);
const trackerPageModesByAliasByGame = new Map(
  Array.from(new Set(trackerPageModes.map((mode) => mode.game))).map((game) => [
    game,
    createAliasLookup(filterByGame(trackerPageModes, game)),
  ])
);

export const TRACKER_SECTION_DEFINITIONS = trackerSections;
export const TRACKER_PAGE_MODE_DEFINITIONS = trackerPageModes;

export function getTrackerSections(game = null) {
  return filterByGame(TRACKER_SECTION_DEFINITIONS, game);
}

export function getTrackerSection(sectionId) {
  return trackerSectionsById.get(sectionId) || null;
}

export function getTrackerSectionIds(game = null) {
  return getTrackerSections(game).map((section) => section.id);
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

export function getTrackerViews(game = null) {
  return filterByGame(TRACKER_PAGE_MODE_DEFINITIONS, game).map((mode) => ({
    mode: mode.id,
    label: mode.label,
  }));
}

export function getTrackerViewsPanelGroups(game = null) {
  const groupedModes = filterByGame(TRACKER_PAGE_MODE_DEFINITIONS, game).filter((mode) => mode.includeInViewsPanel).reduce(
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

export function getTrackerPrimaryNavItems(game = null) {
  const dropdowns = new Map();
  const items = [];

  filterByGame(TRACKER_PAGE_MODE_DEFINITIONS, game)
    .filter((mode) => mode.includeInPrimaryNav)
    .forEach((mode) => {
      const dropdownLabel = String(mode.primaryNavDropdownLabel || '').trim();
      const itemLabel = String(mode.primaryNavItemLabel || mode.navLabel || mode.label).trim();

      if (!dropdownLabel) {
        items.push({ type: 'link', mode: mode.id, label: mode.navLabel || mode.label });
        return;
      }

      if (!dropdowns.has(dropdownLabel)) {
        dropdowns.set(dropdownLabel, { type: 'dropdown', label: dropdownLabel, items: [] });
        items.push(dropdowns.get(dropdownLabel));
      }

      dropdowns.get(dropdownLabel).items.push({ mode: mode.id, label: itemLabel });
    });

  return items;
}

export function getTrackerPageModes(game = null) {
  return filterByGame(TRACKER_PAGE_MODE_DEFINITIONS, game).map((mode) => mode.id);
}

export function getDefaultTrackerPageMode(game = null) {
  const definitions = filterByGame(TRACKER_PAGE_MODE_DEFINITIONS, game);
  const defaultMode = definitions.find((mode) => mode.includeInPrimaryNav) || definitions[0] || null;
  return defaultMode?.id || null;
}

export function getTrackerPageMode(modeId, game = null) {
  const mode = trackerPageModesById.get(modeId) || null;
  if (!mode) {
    return null;
  }

  return game && mode.game !== game ? null : mode;
}

export function isTrackerPageMode(modeId, game = null) {
  return !!getTrackerPageMode(modeId, game);
}

export function normalizeTrackerPageMode(modeId, fallback = null, game = null) {
  const aliasLookup = game ? trackerPageModesByAliasByGame.get(game) || new Map() : trackerPageModesByAlias;
  const resolvedFallback = fallback || getDefaultTrackerPageMode(game) || 'overview';

  if (typeof modeId !== 'string') {
    return resolvedFallback;
  }

  const canonicalMode = aliasLookup.get(modeId);
  return canonicalMode || resolvedFallback;
}

export function getCanonicalTrackerRegistry(game = null) {
  return {
    sections: getTrackerSections(game),
    pageModes: filterByGame(TRACKER_PAGE_MODE_DEFINITIONS, game),
    pages: getTrackerPages(game),
  };
}

export function getTrackerPages(game = null) {
  return game ? loadContentPagesByGame(game) : [...CONTENT_PAGES];
}

export function getTrackerPagesByGame(game) {
  return loadContentPagesByGame(game);
}

export function getTrackerPage(pageId, game = null) {
  const page = trackerPagesById.get(pageId) || null;
  if (!page) {
    return null;
  }

  return game && page.game !== game ? null : page;
}

export function getTrackerPageSectionIds(pageId, game = null) {
  const page = getTrackerPage(pageId, game);
  if (!page || !Array.isArray(page.sections)) {
    return [];
  }

  return page.sections.map((section) => section.id);
}
