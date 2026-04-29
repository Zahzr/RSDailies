export function replaceInteractiveElement(element) {
  if (!element) {
    return null;
  }

  const replacement = element.cloneNode(true);
  element.replaceWith(replacement);
  return replacement;
}

export function setDisplayState(element, visible, { displayValue = 'block', stateValue = null } = {}) {
  if (!element) {
    return;
  }

  element.style.display = visible ? displayValue : 'none';
  element.style.visibility = visible ? 'visible' : 'hidden';
  if (stateValue) {
    element.dataset.display = visible ? stateValue.open : stateValue.closed;
  }
}

export function setPanelOpenState(element, open, displayValue = 'block') {
  setDisplayState(element, open, {
    displayValue,
    stateValue: { open: 'open', closed: 'closed' },
  });
}

export function isPanelOpen(element) {
  return element?.dataset?.display === 'open';
}
