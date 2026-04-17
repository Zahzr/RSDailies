/**
 * Controls for individual sections (reset, visibility, sort, etc.)
 */
export function bindSectionControls(sectionKey, opts = { sortable: false }, deps) {
  const {
    renderApp,
    getSectionState,
    saveSectionValue,
    resetSectionView,
    documentRef = document
  } = deps;

  const resetBtn = documentRef.getElementById(`${sectionKey}_reset_button`);
  const showHiddenBtn = documentRef.getElementById(`${sectionKey}_show_hidden_button`);
  const hideBtn = documentRef.getElementById(`${sectionKey}_hide_button`);
  const unhideBtn = documentRef.getElementById(`${sectionKey}_unhide_button`);
  const sortBtn = documentRef.getElementById(`${sectionKey}_sort_button`);

  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetSectionView(sectionKey);
      renderApp();
    });
  }

  if (showHiddenBtn) {
    showHiddenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const next = !getSectionState(sectionKey).showHidden;
      saveSectionValue(sectionKey, 'showHidden', next);
      renderApp();
    });
  }

  if (hideBtn) {
    hideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      saveSectionValue(sectionKey, 'hideSection', true);
      renderApp();
    });
  }

  if (unhideBtn) {
    unhideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      saveSectionValue(sectionKey, 'hideSection', false);
      renderApp();
    });
  }

  if (sortBtn && opts.sortable) {
    sortBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = getSectionState(sectionKey).sort;
      const next = current === 'default' ? 'alpha' : 'default';
      saveSectionValue(sectionKey, 'sort', next);
      renderApp();
    });
  }
}
