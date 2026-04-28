import { SECTION_CONTAINER_IDS, SECTION_TABLE_IDS } from '../../../core/ids/section-ids.js';

export function getSectionElements(sectionKey) {
  const container = document.getElementById(SECTION_CONTAINER_IDS[sectionKey]);
  const table = document.getElementById(SECTION_TABLE_IDS[sectionKey]);
  const tbody = table?.querySelector('tbody') || null;
  return { container, table, tbody };
}

export function reorderDashboardSections(sectionKeys) {
  const dashboard = document.getElementById('dashboard-container');
  if (!dashboard) return;
  sectionKeys.forEach((sectionKey) => {
    const container = document.getElementById(SECTION_CONTAINER_IDS[sectionKey]);
    if (container) dashboard.appendChild(container);
  });
}

export function setSectionHiddenState(sectionKey, hidden, showHidden = false) {
  const { container, tbody } = getSectionElements(sectionKey);
  if (!container || !tbody) return;
  container.dataset.hide = hidden ? 'hide' : 'show';
  container.dataset.showHidden = showHidden ? 'true' : 'false';
  container.classList.toggle('section-hidden', hidden);
  tbody.style.display = hidden ? 'none' : '';

  const hideBtn = document.getElementById(`${sectionKey}_hide_button`);
  const unhideBtn = document.getElementById(`${sectionKey}_unhide_button`);
  if (hideBtn) hideBtn.style.display = hidden ? 'none' : '';
  if (unhideBtn) unhideBtn.style.display = hidden ? '' : 'none';
}

export function setSectionModeVisibility(sectionKey, mode) {
  const { container } = getSectionElements(sectionKey);
  if (!container) return false;

  let shouldShow = false;
  if (mode === 'overview') shouldShow = sectionKey === 'custom';
  else if (mode === 'all') shouldShow = ['rs3daily', 'rs3weekly', 'rs3monthly'].includes(sectionKey);
  else if (mode === 'custom') shouldShow = sectionKey === 'custom';
  else if (mode === 'rs3farming') shouldShow = sectionKey === 'rs3farming';
  else shouldShow = sectionKey === mode;

  container.style.display = shouldShow ? '' : 'none';
  return shouldShow;
}

export function clearAllSectionBodies(sectionKeys) {
  sectionKeys.forEach((key) => {
    const { tbody } = getSectionElements(key);
    if (tbody) tbody.innerHTML = '';
  });
}

function clearSectionEdgeMarkers(sectionKeys) {
  sectionKeys.forEach((key) => {
    const { container } = getSectionElements(key);
    if (!container) return;
    container.classList.remove('last-visible-section', 'visible-open-section', 'visible-hidden-section');
  });
}

export function markVisibleSectionEdges(sectionKeys) {
  clearSectionEdgeMarkers(sectionKeys);
  const visibleContainers = sectionKeys
    .map((key) => getSectionElements(key).container)
    .filter((container) => container && container.style.display !== 'none');

  if (visibleContainers.length === 0) return;
  visibleContainers.forEach((container) => {
    const isHidden = container.dataset.hide === 'hide';
    container.classList.add(isHidden ? 'visible-hidden-section' : 'visible-open-section');
  });
  visibleContainers[visibleContainers.length - 1].classList.add('last-visible-section');
}
