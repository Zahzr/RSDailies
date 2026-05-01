import test from 'node:test';
import assert from 'node:assert/strict';

import { renderUnifiedSection } from '../../../src/ui/components/tracker/sections/renderers/section-engine.js';

function createClassList() {
  const values = new Set();
  return {
    add: (...tokens) => tokens.filter(Boolean).forEach((token) => values.add(token)),
    remove: (...tokens) => tokens.forEach((token) => values.delete(token)),
    contains: (token) => values.has(token)
  };
}

function createFakeRow(completed = 'false') {
  return {
    dataset: { completed },
    classList: createClassList()
  };
}

function createFakeBody() {
  return {
    children: [],
    appendChild(node) {
      this.children.push(node);
    }
  };
}

test('unified section applies attached subgroup headers and rounds the final visible subgroup row', () => {
  const tbody = createFakeBody();

  renderUnifiedSection(tbody, [
    { id: 'weekly-standard', kind: 'rows', tasks: [{ state: 'false' }] },
    {
      id: 'penguins',
      kind: 'subgroup',
      title: 'Penguins',
      headerMode: 'attached',
      tasks: [{ state: 'hide' }, { state: 'false' }]
    }
  ], {
    sectionKey: 'rs3weekly',
    isCollapsedBlock: () => false,
    createRow: (_sectionKey, task) => createFakeRow(task.state),
    createHeaderRow: () => createFakeRow('header'),
    context: {}
  });

  const [standardRow, headerRow, hiddenRow, visibleRow] = tbody.children;
  assert.equal(headerRow.classList.contains('subgroup-attached-header'), true);
  assert.equal(headerRow.classList.contains('subgroup-header-row'), true);
  assert.equal(standardRow.classList.contains('block-end-row'), false);
  assert.equal(hiddenRow.classList.contains('block-end-row'), false);
  assert.equal(visibleRow.classList.contains('block-end-row'), true);
});

test('unified section rounds the subgroup header when all subgroup rows are hidden', () => {
  const tbody = createFakeBody();

  renderUnifiedSection(tbody, [
    {
      id: 'gathering-general',
      kind: 'subgroup',
      title: 'General',
      headerMode: 'default',
      tasks: [{ state: 'hide' }, { state: 'hide' }]
    }
  ], {
    sectionKey: 'gathering',
    isCollapsedBlock: () => false,
    createRow: (_sectionKey, task) => createFakeRow(task.state),
    createHeaderRow: () => createFakeRow('header'),
    context: {}
  });

  const [headerRow, hiddenOne, hiddenTwo] = tbody.children;
  assert.equal(headerRow.classList.contains('block-end-row'), true);
  assert.equal(hiddenOne.classList.contains('block-end-row'), false);
  assert.equal(hiddenTwo.classList.contains('block-end-row'), false);
});
