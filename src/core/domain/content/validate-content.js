function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function assertString(value, fieldName, pageId) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid page field "${fieldName}" for "${pageId || 'unknown'}".`);
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

  if (section.items && !Array.isArray(section.items)) {
    throw new Error(`Section "${section.id}" in page "${pageId}" has invalid items.`);
  }

  if (section.groups && !Array.isArray(section.groups)) {
    throw new Error(`Section "${section.id}" in page "${pageId}" has invalid groups.`);
  }

  (section.items || []).forEach((task) => validateTaskItem(task, pageId, section.id));
}

export function validateContentPageDefinition(page) {
  if (!isObject(page)) {
    throw new Error('Invalid content page definition.');
  }

  assertString(page.id, 'id', page.id);
  assertString(page.title, 'title', page.id);
  assertString(page.game, 'game', page.id);
  assertString(page.layout, 'layout', page.id);

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
