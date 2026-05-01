import test from 'node:test';
import assert from 'node:assert/strict';

import { TRACKER_SECTION_RENDERERS } from '../../../src/ui/renderers/tracker-section-renderer.js';

test('tracker section renderer exposes the canonical render-variant map', () => {
  assert.equal(typeof TRACKER_SECTION_RENDERERS.standard, 'function');
  assert.equal(typeof TRACKER_SECTION_RENDERERS['grouped-sections'], 'function');
  assert.equal(typeof TRACKER_SECTION_RENDERERS['parent-children'], 'function');
  assert.equal(typeof TRACKER_SECTION_RENDERERS['timer-groups'], 'function');
});
