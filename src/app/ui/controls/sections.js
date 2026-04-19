/**
 * Controls for individual sections (reset, visibility, restore, etc.)
 */

function rebindButton(documentRef, id, onClick) {
  const existing = documentRef.getElementById(id);
  if (!existing) return null;

  const replacement = existing.cloneNode(true);
  existing.replaceWith(replacement);

  replacement.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick(event);
  });

  return replacement;
}

function ensureRestoreControls(sectionKey, {
  renderApp,
  getSectionState,
  saveSectionValue,
  documentRef = document
}) {
  const hideBtn = documentRef.getElementById(`${sectionKey}_hide_button`);
  if (!hideBtn) return;

  const controlsHost = hideBtn.parentElement;
  if (!controlsHost) return;

  controlsHost.querySelectorAll(`[data-restore-ui="${sectionKey}"]`).forEach((node) => node.remove());

  const hiddenRows = getSectionState(sectionKey).hiddenRows || {};
  const entries = Object.entries(hiddenRows).filter(([, value]) => !!value);

  if (entries.length === 0) return;

  const select = documentRef.createElement('select');
  select.dataset.restoreUi = sectionKey;
  select.className = 'form-select form-select-sm';
  select.style.width = 'auto';
  select.style.maxWidth = '220px';
  select.style.display = 'inline-block';

  const placeholder = documentRef.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Restore removed...';
  select.appendChild(placeholder);

  entries.forEach(([taskId, label]) => {
    const option = documentRef.createElement('option');
    option.value = taskId;
    option.textContent = typeof label === 'string' ? label : taskId;
    select.appendChild(option);
  });

  const restoreBtn = documentRef.createElement('button');
  restoreBtn.type = 'button';
  restoreBtn.dataset.restoreUi = sectionKey;
  restoreBtn.className = 'btn btn-secondary btn-sm';
  restoreBtn.textContent = '↺ Restore';

  restoreBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const selected = select.value;
    if (!selected) return;

    const state = getSectionState(sectionKey);
    const nextHiddenRows = { ...(state.hiddenRows || {}) };
    delete nextHiddenRows[selected];

    saveSectionValue(sectionKey, 'hiddenRows', nextHiddenRows);
    renderApp();
  });

  controlsHost.insertBefore(restoreBtn, hideBtn);
  controlsHost.insertBefore(select, restoreBtn);
}

export function bindSectionControls(sectionKey, opts = { sortable: false }, deps) {
  const {
    renderApp,
    getSectionState,
    saveSectionValue,
    resetSectionView,
    documentRef = document
  } = deps;

  rebindButton(documentRef, `${sectionKey}_reset_button`, () => {
    resetSectionView(sectionKey);
    renderApp();
  });

  rebindButton(documentRef, `${sectionKey}_show_hidden_button`, () => {
    const next = !getSectionState(sectionKey).showHidden;
    saveSectionValue(sectionKey, 'showHidden', next);
    renderApp();
  });

  rebindButton(documentRef, `${sectionKey}_hide_button`, () => {
    saveSectionValue(sectionKey, 'hideSection', true);
    renderApp();
  });

  rebindButton(documentRef, `${sectionKey}_unhide_button`, () => {
    saveSectionValue(sectionKey, 'hideSection', false);
    renderApp();
  });

  if (opts.sortable) {
    rebindButton(documentRef, `${sectionKey}_sort_button`, () => {
      const current = getSectionState(sectionKey).sort;
      const next = current === 'default' ? 'alpha' : 'default';
      saveSectionValue(sectionKey, 'sort', next);
      renderApp();
    });
  }

  ensureRestoreControls(sectionKey, {
    renderApp,
    getSectionState,
    saveSectionValue,
    documentRef
  });
}