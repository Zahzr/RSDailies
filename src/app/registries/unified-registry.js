import { loadContentPages, loadContentPagesByGame } from '../../core/domain/content/load-content.js';

const trackerSections = Object.freeze([
  {
    id: 'custom',
    label: 'Custom Tasks',
    shortLabel: 'Custom',
    game: 'rs3',
    displayOrder: 0,
    resetFrequency: 'never',
    renderVariant: 'standard',
    containerId: 'custom-container',
    tableId: 'custom-table',
    includedInAllMode: false,
    supportsTaskNotifications: true,
    shell: {
      columns: ['activity_col_name', 'activity_col_timer', 'activity_col_notes', 'activity_col_status'],
      extraTableClasses: ['custom-task-table'],
      showAddButton: true,
      showResetButton: false,
      showCountdown: false,
    },
  },
  {
    id: 'rs3farming',
    label: 'Farming',
    shortLabel: 'Farming',
    game: 'rs3',
    displayOrder: 1,
    resetFrequency: 'rolling',
    renderVariant: 'timer-groups',
    containerId: 'rs3farming-container',
    tableId: 'rs3farming-table',
    includedInAllMode: false,
    supportsTaskNotifications: false,
    shell: {
      columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
      extraTableClasses: [],
      showAddButton: false,
      showResetButton: true,
      showCountdown: false,
    },
  },
  {
    id: 'gathering',
    label: 'Gathering',
    shortLabel: 'Gathering',
    game: 'rs3',
    displayOrder: 2,
    resetFrequency: 'mixed',
    renderVariant: 'grouped-sections',
    containerId: 'gathering-container',
    tableId: 'gathering-table',
    includedInAllMode: false,
    supportsTaskNotifications: true,
    shell: {
      columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
      extraTableClasses: [],
      showAddButton: false,
      showResetButton: true,
      showCountdown: false,
    },
  },
  {
    id: 'rs3daily',
    label: 'Dailies',
    shortLabel: 'Dailies',
    game: 'rs3',
    displayOrder: 3,
    resetFrequency: 'daily',
    renderVariant: 'standard',
    containerId: 'rs3daily-container',
    tableId: 'rs3daily-table',
    includedInAllMode: true,
    supportsTaskNotifications: true,
    shell: {
      columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
      extraTableClasses: [],
      showAddButton: false,
      showResetButton: true,
      showCountdown: true,
      countdownId: 'countdown-rs3daily',
    },
  },
  {
    id: 'rs3weekly',
    label: 'Weeklies',
    shortLabel: 'Weeklies',
    game: 'rs3',
    displayOrder: 4,
    resetFrequency: 'weekly',
    renderVariant: 'parent-children',
    containerId: 'rs3weekly-container',
    tableId: 'rs3weekly-table',
    includedInAllMode: true,
    supportsTaskNotifications: true,
    shell: {
      columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
      extraTableClasses: [],
      showAddButton: false,
      showResetButton: true,
      showCountdown: true,
      countdownId: 'countdown-rs3weekly',
    },
  },
  {
    id: 'rs3monthly',
    label: 'Monthlies',
    shortLabel: 'Monthlies',
    game: 'rs3',
    displayOrder: 5,
    resetFrequency: 'monthly',
    renderVariant: 'standard',
    containerId: 'rs3monthly-container',
    tableId: 'rs3monthly-table',
    includedInAllMode: true,
    supportsTaskNotifications: true,
    shell: {
      columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
      extraTableClasses: [],
      showAddButton: false,
      showResetButton: true,
      showCountdown: true,
      countdownId: 'countdown-rs3monthly',
    },
  },
]);

const trackerPageModes = Object.freeze([
  {
    id: 'overview',
    label: 'Overview',
    aliases: ['overview'],
    buttonLabel: 'Overview',
    navLabel: 'Overview',
    menuGroup: 'Home',
    includeInViewsPanel: true,
    includeInPrimaryNav: false,
  },
  {
    id: 'all',
    label: 'All',
    aliases: ['all'],
    buttonLabel: 'Tasks',
    navLabel: 'Tasks',
    menuGroup: 'Tasks',
    includeInViewsPanel: true,
    includeInPrimaryNav: true,
  },
  {
    id: 'custom',
    label: 'Custom Tasks',
    aliases: ['custom'],
    buttonLabel: 'Overview',
    navLabel: 'Custom Tasks',
    menuGroup: 'Tasks',
    includeInViewsPanel: false,
    includeInPrimaryNav: false,
  },
  {
    id: 'rs3farming',
    label: 'Farming',
    aliases: ['farming', 'rs3farming'],
    buttonLabel: 'Timers',
    navLabel: 'Timers',
    menuGroup: 'Timers',
    includeInViewsPanel: true,
    includeInPrimaryNav: true,
  },
  {
    id: 'rs3daily',
    label: 'Dailies',
    aliases: ['daily', 'dailies', 'rs3daily'],
    buttonLabel: 'Tasks',
    navLabel: 'Dailies',
    menuGroup: 'Tasks',
    includeInViewsPanel: false,
    includeInPrimaryNav: false,
  },
  {
    id: 'gathering',
    label: 'Gathering',
    aliases: ['gathering'],
    buttonLabel: 'Gathering',
    navLabel: 'Gathering',
    menuGroup: 'Gathering',
    includeInViewsPanel: true,
    includeInPrimaryNav: true,
  },
  {
    id: 'rs3weekly',
    label: 'Weeklies',
    aliases: ['weekly', 'weeklies', 'rs3weekly'],
    buttonLabel: 'Tasks',
    navLabel: 'Weeklies',
    menuGroup: 'Tasks',
    includeInViewsPanel: false,
    includeInPrimaryNav: false,
  },
  {
    id: 'rs3monthly',
    label: 'Monthlies',
    aliases: ['monthly', 'monthlies', 'rs3monthly'],
    buttonLabel: 'Tasks',
    navLabel: 'Monthlies',
    menuGroup: 'Tasks',
    includeInViewsPanel: false,
    includeInPrimaryNav: false,
  },
]);

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
