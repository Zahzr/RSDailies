export function setDisplayState(element, visible) {
  if (!element) {
    return;
  }

  element.style.display = visible ? '' : 'none';
  element.style.visibility = visible ? 'visible' : 'hidden';
}
