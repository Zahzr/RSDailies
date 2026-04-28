export function getTooltipElement(documentRef = document) {
  return documentRef.getElementById('tooltip');
}

export function showTooltip(text, anchorRect, { documentRef = document, windowRef = window } = {}) {
  const tooltip = getTooltipElement(documentRef);
  if (!tooltip || !text) return;

  tooltip.textContent = text;
  tooltip.style.position = 'fixed';
  tooltip.style.zIndex = '200';
  tooltip.style.display = 'block';
  tooltip.style.visibility = 'hidden';

  const pad = 10;
  const width = tooltip.offsetWidth;
  const height = tooltip.offsetHeight;

  let left = anchorRect.left + anchorRect.width / 2 - width / 2;
  let top = anchorRect.bottom + 8;

  const maxLeft = windowRef.innerWidth - width - pad;
  if (left > maxLeft) left = maxLeft;
  if (left < pad) left = pad;

  const maxTop = windowRef.innerHeight - height - pad;
  if (top > maxTop) {
    top = anchorRect.top - height - 8;
  }
  if (top < pad) top = pad;

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  tooltip.style.visibility = 'visible';
}

export function hideTooltip(documentRef = document) {
  const tooltip = getTooltipElement(documentRef);
  if (!tooltip) return;

  tooltip.style.display = 'none';
  tooltip.style.visibility = 'hidden';
  tooltip.textContent = '';
}

export function buildTooltipText(task) {
  if (!task) return '';

  const parts = [];

  if (task.name) parts.push(task.name);
  if (task.note && task.note !== task.name) parts.push(task.note);

  return parts.join('\n');
}

export function attachTooltip(targetElement, task, { documentRef = document, windowRef = window } = {}) {
  const text = buildTooltipText(task);
  if (!targetElement || !text) return;

  targetElement.dataset.tooltipText = text;

  const onEnter = () => showTooltip(text, targetElement.getBoundingClientRect(), { documentRef, windowRef });
  const onLeave = () => hideTooltip(documentRef);

  targetElement.addEventListener('mouseenter', onEnter);
  targetElement.addEventListener('mouseleave', onLeave);
  targetElement.addEventListener('focus', onEnter);
  targetElement.addEventListener('blur', onLeave);
}