import test from 'node:test';
import assert from 'node:assert/strict';

import { buildSectionPanelHtml } from '../../../src/ui/app-shell/runtime/section-panel.js';

test('section panel renderer builds shell markup from registry metadata', () => {
  const html = buildSectionPanelHtml({
    id: 'rs3daily',
    label: 'Dailies',
    containerId: 'rs3daily-container',
    tableId: 'rs3daily-table',
    shell: {
      columns: ['activity_col_name', 'activity_col_notes', 'activity_col_status'],
      extraTableClasses: [],
      showAddButton: false,
      showResetButton: true,
      showCountdown: true,
      countdownId: 'countdown-rs3daily',
    },
  });

  assert.match(html, /id="rs3daily-container"/);
  assert.match(html, /id="rs3daily_reset_button"/);
  assert.match(html, /id="countdown-rs3daily"/);
  assert.match(html, /<tbody><\/tbody>/);
});
