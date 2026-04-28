/**
 * Controls for individual sections (reset, visibility, sort, etc.)
 * Parent section headers should NOT inject inline restore UI.
 * Restore belongs only to subgroup header dropdowns in src/ui/components/headers/.
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

function removeSectionRestoreControls(sectionKey, { documentRef = document }) {
  const hideBtn = documentRef.getElementById(`${sectionKey}_hide_button`);
  if (!hideBtn) return;

  const controlsHost = hideBtn.parentElement;
  if (!controlsHost) return;

  controlsHost.querySelectorAll(`[data-restore-ui="${sectionKey}"]`).forEach((node) => node.remove());
}

export function bindSectionControls(sectionKey, opts = { sortable: false }, deps) {
  const {
    renderApp,
    getSectionState,
    saveSectionValue,
    resetSectionView,
    documentRef = document
  } = deps;

  removeSectionRestoreControls(sectionKey, { documentRef });

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
}