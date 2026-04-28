import test from 'node:test';
import assert from 'node:assert/strict';

import { validateContentPageDefinition } from '../../../../src/core/domain/content/validate-content.js';

test('content validator accepts a valid page definition', () => {
  const page = validateContentPageDefinition({
    id: 'gathering',
    title: 'Gathering',
    game: 'rs3',
    layout: 'tracker',
    sections: [
      {
        id: 'gathering',
        label: 'Gathering',
        renderVariant: 'grouped-sections',
        items: [
          {
            id: 'miscellania',
            name: 'Miscellania',
          },
        ],
      },
    ],
  });

  assert.equal(page.id, 'gathering');
});

test('content validator rejects a page without sections', () => {
  assert.throws(() => {
    validateContentPageDefinition({
      id: 'broken',
      title: 'Broken',
      game: 'rs3',
      layout: 'tracker',
    });
  }, /sections/);
});
