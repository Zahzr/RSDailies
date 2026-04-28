function getSectionLabel(sectionKey) {
  const labels = {
    custom: 'Custom',
    rs3daily: 'Dailies',
    gathering: 'Gathering',
    rs3weekly: 'Weeklies',
    rs3monthly: 'Monthlies',
    rs3farming: 'Farming'
  };
  return labels[sectionKey] || sectionKey;
}

export function sortTopFive(items) {
  return [...items].sort((a, b) => {
    const ts = (b.pinTimestamp || 0) - (a.pinTimestamp || 0);
    if (ts !== 0) return ts;
    return String(a.task?.name || '').localeCompare(String(b.task?.name || ''));
  });
}

export function sortAlphabetical(items) {
  return [...items].sort((a, b) => String(a.task?.name || '').localeCompare(String(b.task?.name || '')));
}

export function buildOverviewCard(items, { createRow, context, compact = false }) {
  const wrapper = document.createElement('div');
  wrapper.className = compact ? 'overview-card overview-card-compact' : 'overview-card overview-card-full';

  const table = document.createElement('table');
  table.className = 'table table-dark table-hover rs3-table mb-0';
  const tbody = document.createElement('tbody');

  items.forEach(({ task, sectionKey, pinId }) => {
    const row = createRow(sectionKey, task, { context: { ...context, isOverviewPanel: true, overviewPinId: pinId } });
    if (!row) return;
    row.classList.add('overview-row');

    if (compact) {
      row.classList.add('overview-row-compact');
      const notesCell = row.querySelector('.activity_notes');
      const desc = row.querySelector('.activity_desc');
      const nameCell = row.querySelector('.activity_name');
      if (nameCell) {
        const badge = document.createElement('span');
        badge.className = 'overview-section-badge';
        badge.textContent = getSectionLabel(sectionKey);
        nameCell.appendChild(badge);
      }
      if (notesCell) notesCell.classList.add('overview-notes-compact');
      if (desc) desc.textContent = desc.textContent.trim();
    }
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}

export function buildPanelChrome() {
  const wrapper = document.createElement('div');
  wrapper.className = 'overview-shell';

  const note = document.createElement('div');
  note.className = 'overview-note';
  note.textContent = 'Will pin all in main page for visual. Only top 5 will preview on other pages.';

  const divider = document.createElement('div');
  divider.className = 'overview-divider';

  const content = document.createElement('div');
  wrapper.append(note, divider, content);
  return { wrapper, content };
}

export function buildEmptyMessage(text) {
  const empty = document.createElement('div');
  empty.className = 'overview-empty-message';
  empty.textContent = text;
  return empty;
}

export function buildSplitDivider(label = 'All pinned items') {
  const wrap = document.createElement('div');
  wrap.className = 'overview-split-divider';

  const text = document.createElement('span');
  text.className = 'overview-split-divider-label';
  text.textContent = label;

  wrap.appendChild(text);
  return wrap;
}
