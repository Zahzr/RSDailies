import test from 'node:test';
import assert from 'node:assert/strict';

import { renderHeaderFrameHtml } from '../../../src/ui/components/headers/header.frame.js';

test('header frame renderer composes shared markup for shell headers', () => {
  const html = renderHeaderFrameHtml({
    label: 'Dailies',
    colspan: 3,
    controlsHtml: '<button id="demo">x</button>',
    barClassName: 'section-panel-header',
    titleClassName: 'section-panel-title',
    controlsClassName: 'section-panel-controls'
  });

  assert.match(html, /<tr>/);
  assert.match(html, /colspan="3"/);
  assert.match(html, /section-panel-header/);
  assert.match(html, /section-panel-title/);
  assert.match(html, /section-panel-controls/);
  assert.match(html, /<button id="demo">x<\/button>/);
  assert.match(html, /Dailies/);
});
