import test from 'node:test';
import assert from 'node:assert/strict';

import { bindFloatingPanelTrigger } from '../../src/core/dom/panel-controls.js';

function createButton() {
  const listeners = new Map();

  return {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    click() {
      listeners.get('click')?.({
        preventDefault() {},
        stopPropagation() {},
      });
    },
  };
}

function createPanel() {
  return {
    style: { display: 'none', visibility: 'hidden' },
    dataset: { display: 'closed' },
  };
}

test('panel trigger closes an open panel and opens a closed panel through the shared helper', () => {
  const button = createButton();
  const panel = createPanel();
  let closeCalls = 0;
  let openCalls = 0;

  bindFloatingPanelTrigger({
    button,
    panel,
    closePanels: () => { closeCalls += 1; },
    onOpen: () => {
      openCalls += 1;
      panel.dataset.display = 'open';
    },
  });

  button.click();
  assert.equal(closeCalls, 1);
  assert.equal(openCalls, 1);

  button.click();
  assert.equal(closeCalls, 1);
  assert.equal(openCalls, 1);
  assert.equal(panel.dataset.display, 'closed');
});
