import { byId } from '../../core/dom/query.js';
import { resolveDocument, resolveWindow } from '../runtime.js';

export function getTooltipEl(runtime = {}) {
  return byId('tooltip', resolveDocument(runtime));
}

function positionTooltip(tooltip, rect, runtime = {}) {
  const win = resolveWindow(runtime);
  if (!tooltip || !rect || !win) return;

  const margin = 12;
  const viewportPadding = 8;

  const tooltipWidth = tooltip.offsetWidth || 0;
  const tooltipHeight = tooltip.offsetHeight || 0;

  let left = rect.left + rect.width / 2 - tooltipWidth / 2;
  let top = rect.bottom + margin;

  if (left + tooltipWidth > win.innerWidth - viewportPadding) {
    left = win.innerWidth - viewportPadding - tooltipWidth;
  }

  if (left < viewportPadding) {
    left = viewportPadding;
  }

  if (top + tooltipHeight > win.innerHeight - viewportPadding) {
    top = rect.top - tooltipHeight - margin;
  }

  if (top < viewportPadding) {
    top = viewportPadding;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

export function showTooltip(text, rect, runtime = {}) {
  const tooltip = getTooltipEl(runtime);
  if (!tooltip || !text) return;

  tooltip.textContent = text;
  tooltip.style.display = 'block';
  tooltip.style.visibility = 'hidden';
  tooltip.style.position = 'fixed';
  tooltip.style.zIndex = '200';

  positionTooltip(tooltip, rect, runtime);
  tooltip.style.visibility = 'visible';
}

export function hideTooltip(runtime = {}) {
  const tooltip = getTooltipEl(runtime);
  if (!tooltip) return;

  tooltip.style.display = 'none';
  tooltip.style.visibility = 'hidden';
  tooltip.textContent = '';
}

export function buildTooltipText(task = {}) {
  const parts = [];
  if (task.name) parts.push(task.name);
  if (task.note) parts.push(task.note);
  return parts.join('\n');
}

export function attachTooltip(targetEl, task, runtime = {}) {
  const text = buildTooltipText(task);
  if (!targetEl || !text) return null;

  targetEl.dataset.tooltipText = text;

  const show = () => showTooltip(text, targetEl.getBoundingClientRect(), runtime);
  const hide = () => hideTooltip(runtime);

  targetEl.addEventListener('mouseenter', show);
  targetEl.addEventListener('mouseleave', hide);
  targetEl.addEventListener('mousemove', show);
  targetEl.addEventListener('focus', show);
  targetEl.addEventListener('blur', hide);

  return () => {
    targetEl.removeEventListener('mouseenter', show);
    targetEl.removeEventListener('mouseleave', hide);
    targetEl.removeEventListener('mousemove', show);
    targetEl.removeEventListener('focus', show);
    targetEl.removeEventListener('blur', hide);
  };
}
