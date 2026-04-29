function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function assertString(value, fieldName, pageId) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid page field "${fieldName}" for "${pageId || 'unknown'}".`);
  }
}

function assertOptionalString(value, fieldName, pageId) {
  if (value == null) return;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid optional field "${fieldName}" for "${pageId || 'unknown'}".`);
  }
}

function assertOptionalBoolean(value, fieldName, pageId) {
  if (value == null) return;
  if (typeof value !== 'boolean') {
    throw new Error(`Invalid optional field "${fieldName}" for "${pageId || 'unknown'}".`);
  }
}

function assertOptionalNumber(value, fieldName, pageId) {
  if (value == null) return;
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid optional field "${fieldName}" for "${pageId || 'unknown'}".`);
  }
}

function validateTaskItem(task, pageId, sectionId) {
  if (!isObject(task)) {
    throw new Error(`Invalid task entry in page "${pageId}" section "${sectionId}".`);
  }

  assertString(task.id, 'task.id', pageId);
  assertString(task.name, 'task.name', pageId);
}

function validateSectionDefinition(section, pageId) {
  if (!isObject(section)) {
    throw new Error(`Invalid section definition in page "${pageId}".`);
  }

  assertString(section.id, 'section.id', pageId);
  assertString(section.label, 'section.label', pageId);
  assertString(section.renderVariant, 'section.renderVariant', pageId);
  assertOptionalString(section.shortLabel, 'section.shortLabel', pageId);
  assertOptionalString(section.game, 'section.game', pageId);
  assertOptionalString(section.legacySectionId, 'section.legacySectionId', pageId);
  assertOptionalString(section.containerId, 'section.containerId', pageId);
  assertOptionalString(section.tableId, 'section.tableId', pageId);
  assertOptionalString(section.resetFrequency, 'section.resetFrequency', pageId);
  assertOptionalNumber(section.displayOrder, 'section.displayOrder', pageId);
  assertOptionalBoolean(section.includedInAllMode, 'section.includedInAllMode', pageId);
  assertOptionalBoolean(section.supportsTaskNotifications, 'section.supportsTaskNotifications', pageId);

  if (section.items && !Array.isArray(section.items)) {
    throw new Error(`Section "${section.id}" in page "${pageId}" has invalid items.`);
  }

  if (section.groups && !Array.isArray(section.groups)) {
    throw new Error(`Section "${section.id}" in page "${pageId}" has invalid groups.`);
  }

  (section.items || []).forEach((task) => validateTaskItem(task, pageId, section.id));

  if (section.shell != null && !isObject(section.shell)) {
    throw new Error(`Section "${section.id}" in page "${pageId}" has invalid shell metadata.`);
  }

  if (section.shell) {
    if (!Array.isArray(section.shell.columns) || section.shell.columns.length === 0) {
      throw new Error(`Section "${section.id}" in page "${pageId}" must define shell.columns.`);
    }
  }
}

export function validateContentPageDefinition(page) {
  if (!isObject(page)) {
    throw new Error('Invalid content page definition.');
  }

  assertString(page.id, 'id', page.id);
  assertString(page.title, 'title', page.id);
  assertString(page.game, 'game', page.id);
  assertString(page.layout, 'layout', page.id);
  assertOptionalString(page.route, 'route', page.id);
  assertOptionalString(page.legacyMode, 'legacyMode', page.id);
  assertOptionalString(page.buttonLabel, 'buttonLabel', page.id);
  assertOptionalString(page.navLabel, 'navLabel', page.id);
  assertOptionalString(page.menuGroup, 'menuGroup', page.id);
  assertOptionalNumber(page.displayOrder, 'displayOrder', page.id);
  assertOptionalBoolean(page.includeInViewsPanel, 'includeInViewsPanel', page.id);
  assertOptionalBoolean(page.includeInPrimaryNav, 'includeInPrimaryNav', page.id);

  if (page.aliases != null && (!Array.isArray(page.aliases) || page.aliases.some((alias) => typeof alias !== 'string' || alias.trim() === ''))) {
    throw new Error(`Page "${page.id}" has invalid aliases.`);
  }

  if (!Array.isArray(page.sections)) {
    throw new Error(`Page "${page.id}" must define sections as an array.`);
  }

  page.sections.forEach((section) => validateSectionDefinition(section, page.id));
  return page;
}

export function validateContentPages(pages) {
  if (!Array.isArray(pages)) {
    throw new Error('Content pages payload must be an array.');
  }

  return pages.map(validateContentPageDefinition);
}
