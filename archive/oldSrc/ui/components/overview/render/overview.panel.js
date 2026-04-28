import { buildEmptyMessage, buildOverviewCard, buildPanelChrome, buildSplitDivider, sortAlphabetical, sortTopFive } from './overview.dom.js';

export function formatOverviewCountdown(kind, targetMs, { formatDurationMs }) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return 'READY';
  return `${kind} in ${formatDurationMs(diff)}`;
}

export function applyPageModeVisibility(mode) {
  const overview = document.getElementById('overview-wrapper');
  if (!overview) return;
  overview.style.display = mode === 'overview' ? '' : 'none';
}

export function renderOverviewPanel(sections, deps) {
  const { getPageMode, getOverviewPins, load, ensureOverviewLayout, collectOverviewItems, createRow, context } = deps;
  const host = ensureOverviewLayout?.();
  if (!host) return;

  host.innerHTML = '';

  const items = collectOverviewItems(sections, { getOverviewPins, load });
  const chrome = buildPanelChrome();
  const compact = getPageMode() !== 'overview';

  if (items.length === 0) {
    chrome.content.appendChild(buildEmptyMessage('Pin any task with the star icon to surface it here.'));
    host.appendChild(chrome.wrapper);
    return;
  }

  const topFive = sortTopFive(items).slice(0, 5);
  const allItems = sortAlphabetical(items);

  chrome.content.appendChild(
    buildOverviewCard(compact ? topFive : allItems, { createRow, context, compact })
  );

  if (!compact && allItems.length > 5) {
    chrome.content.appendChild(buildSplitDivider());
    chrome.content.appendChild(buildOverviewCard(allItems, { createRow, context, compact: false }));
  }

  host.appendChild(chrome.wrapper);
}